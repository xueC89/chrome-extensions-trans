const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const crypto = require('crypto');

// 注册 zip-encrypted 格式
archiver.registerFormat('zip-encrypted', require('archiver-zip-encrypted'));

// 配置
const BUILD_DIR = path.join(__dirname, '../dist');
const OUTPUT_DIR = path.join(__dirname, '../packages');
const PACKAGE_NAME = 'react-chrome-extension';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 删除 OUTPUT_DIR 下所有 .zip 文件
async function cleanOldZips() {
  try {
    const files = await fs.promises.readdir(OUTPUT_DIR);
    const zipFiles = files.filter(file => file.endsWith('.zip'));
    for (const file of zipFiles) {
      const filePath = path.join(OUTPUT_DIR, file);
      await fs.promises.unlink(filePath);
      console.log(`🗑️ 已删除旧文件: ${file}`);
    }
  } catch (err) {
    // 目录不存在时忽略
    if (err.code !== 'ENOENT') {
      console.error('❌ 删除旧 zip 文件时出错:', err);
      throw err;
    }
  }
}

// 创建压缩包
async function createZipPackage() {
  try {
    await cleanOldZips();
    console.log('🚀 开始创建压缩包...');
    // 加密压缩包
    const encryptedZipPath = path.join(OUTPUT_DIR, `${PACKAGE_NAME}.zip`);
    const password = 'ChromeExt2024!'; // 固定密码
    await createEncryptedZip(BUILD_DIR, encryptedZipPath, password);
    console.log(`🔐 创建加密压缩包: ${path.basename(encryptedZipPath)}`);
    console.log(`🔑 解压密码: ${password}`);
    console.log('🎉 打包完成！');
  } catch (error) {
    console.error('❌ 打包失败:', error);
    process.exit(1);
  }
}

// 创建加密压缩包
function createEncryptedZip(sourceDir, outputPath, password) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    // 用 zip-encrypted 格式
    const archive = archiver('zip-encrypted', {
      zlib: { level: 9 },
      encryptionMethod: 'aes256',
      password: password
    });

    output.on('close', () => {
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

// 检查构建目录是否存在
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ 构建目录不存在，请先运行 npm run build');
  process.exit(1);
}

// 执行打包
createZipPackage();