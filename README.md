# React Chrome Extension Template

一个使用 React 和 TypeScript 开发的 Chrome 插件工程模板。

## 特性

- 🚀 使用 React 18 和 TypeScript
- 📦 Webpack 5 构建配置
- 🎨 现代化的 UI 设计
- 🔧 完整的开发工具链
- 📱 响应式设计
- 🛡️ 完善的错误处理
- 📝 ESLint 代码规范

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Button.tsx
│   └── Button.css
├── content/            # 内容脚本
│   ├── index.tsx
│   ├── ContentScript.tsx
│   └── ContentScript.css
├── background/         # 后台脚本
│   └── index.ts
├── popup/             # 弹窗页面
│   ├── index.tsx
│   ├── Popup.tsx
│   ├── Popup.css
│   └── popup.html
├── options/           # 选项页面
│   ├── index.tsx
│   ├── Options.tsx
│   ├── Options.css
│   └── options.html
├── types/             # TypeScript 类型定义
│   └── index.ts
└── utils/             # 工具函数
    ├── chrome.ts
    └── errorHandler.ts
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
npm run type-check
```

## 安装到 Chrome

1. 运行 `npm run build` 构建项目
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录

## 开发指南

### 添加新功能

1. 在相应的目录下创建组件
2. 更新 `manifest.json` 配置权限
3. 在后台脚本中处理新功能
4. 更新类型定义

### 自定义样式

- 组件样式使用 CSS 模块化
- 全局样式在 HTML 模板中定义
- 支持响应式设计

### 错误处理

- 使用 `handleAsyncError` 包装异步操作
- 全局错误处理器自动捕获未处理的错误
- 错误日志记录到控制台

## 配置说明

### manifest.json

- `manifest_version`: 使用 Manifest V3
- `permissions`: 扩展权限配置
- `host_permissions`: 主机权限
- `action`: 扩展图标点击行为
- `background`: 后台脚本配置
- `content_scripts`: 内容脚本配置

### webpack.config.js

- 多入口配置支持不同页面
- TypeScript 和 CSS 加载器
- 开发和生产环境优化
- 自动复制静态资源

## 脚本说明

- `dev`: 开发模式，支持热重载
- `build`: 生产构建
- `clean`: 清理构建目录
- `type-check`: TypeScript 类型检查
- `lint`: ESLint 代码检查

## 注意事项

1. 确保 Chrome 版本支持 Manifest V3
2. 开发时需要在扩展管理页面重新加载
3. 内容脚本只在匹配的页面上运行
4. 后台脚本使用 Service Worker

## 许可证

MIT License 