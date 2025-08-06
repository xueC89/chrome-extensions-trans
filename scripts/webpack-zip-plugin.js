const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const crypto = require('crypto');

/**
 * Webpack 插件：自动创建ZIP压缩包
 */
class WebpackZipPlugin {
  constructor(options = {}) {
    this.options = {
      filename: 'chrome-extension',
      outputPath: 'packages',
      password: null, // 如果提供密码则创建加密压缩包
      generatePassword: false, // 是否自动生成密码
      includeChecksums: true,
      compressionLevel: 9,
      ...options
    };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('WebpackZipPlugin', (compilation, callback) => {
      if (compiler.options.mode === 'production') {
        this.createZipPackage(compilation.outputOptions.path)
          .then(() => callback())
          .catch((err) => {
            compilation.errors.push(err);
            callback();
          });
      } else {
        callback();
      }
    });
  }

  async createZipPackage(buildPath) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const outputDir = path.resolve(this.options.outputPath);

      // 确保输出目录存在
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      console.log('\n🚀 WebpackZipPlugin: 开始创建压缩包...');

      // 创建普通压缩包
      const zipPath = path.join(outputDir, `${this.options.filename}-${timestamp}.zip`);
      await this.createZip(buildPath, zipPath);
      console.log(`✅ 创建普通压缩包: ${path.basename(zipPath)}`);

      // 创建加密压缩包（如果需要）
      if (this.options.password) {
        const password = this.options.password;
        const encryptedZipPath = path.join(outputDir, `${this.options.filename}-encrypted-${timestamp}.zip`);
        
        await this.createEncryptedZip(buildPath, encryptedZipPath, password);
        console.log(`🔐 创建加密压缩包: ${path.basename(encryptedZipPath)}`);
        console.log(`🔑 解压密码: ${password}`);

        // 保存密码
        const passwordFile = path.join(outputDir, `password-${timestamp}.txt`);
        fs.writeFileSync(passwordFile, `解压密码: ${password}\n创建时间: ${new Date().toLocaleString()}`);

        // 生成校验信息
        if (this.options.includeChecksums) {
          await this.generateChecksums(outputDir, timestamp, [
            { path: zipPath, name: path.basename(zipPath) },
            { path: encryptedZipPath, name: path.basename(encryptedZipPath) }
          ]);
        }
      } else if (this.options.includeChecksums) {
        await this.generateChecksums(outputDir, timestamp, [
          { path: zipPath, name: path.basename(zipPath) }
        ]);
      }

      console.log('🎉 WebpackZipPlugin: 打包完成！\n');
    } catch (error) {
      console.error('❌ WebpackZipPlugin: 打包失败:', error);
      throw error;
    }
  }

  createZip(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', {
        zlib: { level: this.options.compressionLevel }
      });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  createEncryptedZip(sourceDir, outputPath, password) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', {
        zlib: { level: this.options.compressionLevel },
        encryptionMethod: 'aes256',
        password: password
      });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  generatePassword(length = 12) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async generateChecksums(outputDir, timestamp, files) {
    const checksumFile = path.join(outputDir, `checksums-${timestamp}.txt`);
    const checksums = [];

    for (const file of files) {
      const hash = await this.calculateFileHash(file.path);
      checksums.push(`${file.name}: ${hash}`);
    }

    const content = [
      `文件校验信息 (SHA256)`,
      `创建时间: ${new Date().toLocaleString()}`,
      ``,
      ...checksums
    ].join('\n');

    fs.writeFileSync(checksumFile, content);
    console.log(`🔍 校验文件: ${path.basename(checksumFile)}`);
  }

  calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }
}

module.exports = WebpackZipPlugin;