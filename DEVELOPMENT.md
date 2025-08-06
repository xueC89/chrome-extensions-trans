# 开发指南

## 环境准备

### 必需软件

- Node.js (版本 16 或更高)
- npm 或 yarn
- Chrome 浏览器 (版本 88 或更高)

### 安装依赖

```bash
npm install
```

## 开发流程

### 1. 启动开发模式

```bash
npm run dev
```

这将启动 Webpack 开发服务器，监听文件变化并自动重新构建。

### 2. 在 Chrome 中加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录

### 3. 开发调试

- **弹窗调试**：点击扩展图标打开弹窗
- **内容脚本调试**：在网页上右键 -> 检查元素
- **后台脚本调试**：在扩展管理页面点击"检查视图"

## 代码规范

### TypeScript

- 使用严格的类型检查
- 为所有函数和变量添加类型注解
- 使用接口定义数据结构

### React 组件

- 使用函数组件和 Hooks
- 遵循组件命名规范 (PascalCase)
- 使用 CSS 模块化样式

### 错误处理

```typescript
// 使用 handleAsyncError 包装异步操作
const handleOperation = async () => {
  await handleAsyncError(async () => {
    // 异步操作
  }, '操作失败');
};
```

## 文件结构说明

### 组件开发

```
src/components/
├── ComponentName/
│   ├── index.tsx          # 组件入口
│   ├── ComponentName.tsx   # 主组件
│   ├── ComponentName.css   # 样式文件
│   └── types.ts           # 类型定义
```

### 页面开发

```
src/popup/ (或 options/, content/)
├── index.tsx              # 入口文件
├── PageName.tsx           # 页面组件
├── PageName.css           # 样式文件
└── page.html              # HTML 模板
```

## 常用工具函数

### Chrome API 封装

```typescript
import { sendMessage, getStorage, setStorage } from '@/utils/chrome';

// 发送消息
await sendMessage({ type: 'MESSAGE_TYPE', data: {} });

// 获取存储数据
const data = await getStorage('key');

// 设置存储数据
await setStorage({ key: 'value' });
```

### 错误处理

```typescript
import { handleAsyncError, logError } from '@/utils/errorHandler';

// 包装异步操作
await handleAsyncError(async () => {
  // 异步代码
}, '错误消息');

// 记录错误
logError(error, '上下文信息');
```

## 构建和部署

### 开发构建

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# TypeScript 类型检查
npm run type-check
```

## 调试技巧

### 1. 控制台日志

```typescript
console.log('调试信息');
console.error('错误信息');
console.warn('警告信息');
```

### 2. Chrome DevTools

- **Elements**: 检查 DOM 结构
- **Console**: 查看日志和错误
- **Network**: 监控网络请求
- **Sources**: 调试 JavaScript 代码

### 3. 扩展调试

- **Background**: 在扩展管理页面调试后台脚本
- **Content Scripts**: 在网页控制台调试内容脚本
- **Popup**: 右键扩展图标 -> 检查弹出内容

## 常见问题

### 1. 扩展不工作

- 检查 manifest.json 配置
- 确认权限设置正确
- 查看控制台错误信息

### 2. 内容脚本不注入

- 检查 manifest.json 中的 matches 配置
- 确认页面 URL 匹配规则
- 查看扩展管理页面的错误信息

### 3. 消息传递失败

- 确认消息类型正确
- 检查发送方和接收方配置
- 查看控制台错误信息

### 4. 样式不生效

- 检查 CSS 文件是否正确导入
- 确认选择器优先级
- 查看浏览器开发者工具

## 性能优化

### 1. 代码分割

- 使用动态导入
- 分离公共代码
- 优化包大小

### 2. 资源优化

- 压缩图片
- 使用 CDN
- 缓存静态资源

### 3. 运行时优化

- 避免不必要的重渲染
- 使用 React.memo
- 优化事件处理

## 测试

### 1. 手动测试

- 测试所有功能点
- 检查不同页面类型
- 验证错误处理

### 2. 自动化测试

```bash
# 运行测试
npm test

# 生成测试报告
npm run test:coverage
```

## 发布

### 1. 准备发布

- 更新版本号
- 完善文档
- 测试所有功能

### 2. 打包扩展

```bash
npm run build
```

### 3. 提交到 Chrome Web Store

- 创建开发者账号
- 上传扩展包
- 填写详细信息
- 等待审核

## 维护

### 1. 版本管理

- 使用语义化版本号
- 记录更新日志
- 维护兼容性

### 2. 用户反馈

- 收集用户反馈
- 及时修复问题
- 持续改进功能

### 3. 安全更新

- 定期更新依赖
- 修复安全漏洞
- 监控安全公告 