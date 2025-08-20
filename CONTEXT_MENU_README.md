# 🖱️ 右键菜单功能说明

## 功能概述

MiniTrans 扩展现在支持右键菜单功能，用户可以在任何网页上通过右键菜单快速控制翻译功能的开启/关闭，无需打开扩展弹窗。

## 🎯 主要特性

- **快速访问**：在任何页面右键即可访问翻译控制
- **状态同步**：右键菜单与 popup 设置实时同步
- **智能状态**：菜单项显示当前翻译功能状态
- **即时生效**：通过右键菜单切换立即生效
- **跨标签页**：设置在所有标签页中同步
- **状态持久化**：设置保存到 Chrome 存储中

## 📋 菜单结构

```
🌍 MiniTrans 翻译
├── 翻译功能
│   ├── ✅ 开启翻译 (当前状态)
│   └── ❌ 关闭翻译
├── ──────────────── (分隔线)
└── ⚙️ 打开设置
```

## 🔧 使用方法

### 方法一：右键菜单（推荐）

1. 在页面任意位置右键
2. 选择 "🌍 MiniTrans 翻译" → "翻译功能"
3. 选择 "开启翻译" 或 "关闭翻译"

### 方法二：扩展 Popup

1. 点击浏览器工具栏中的扩展图标
2. 在弹窗中使用开关控制翻译功能
3. 设置会自动同步到右键菜单

## 📁 相关文件

- `public/manifest.json` - 添加了 `contextMenus` 权限
- `src/background/index.ts` - 右键菜单创建和管理逻辑
- `src/popup/Popup.tsx` - 与右键菜单的状态同步
- `src/content/index.tsx` - 响应右键菜单状态变化
- `test-context-menu.html` - 右键菜单功能测试页面

## 🚀 技术实现

### 权限配置

```json
{
  "permissions": [
    "storage",
    "activeTab",
    "contextMenus"  // 新增权限
  ]
}
```

### 菜单创建

```typescript
// 在 background script 中创建右键菜单
function createContextMenus() {
  chrome.contextMenus.create({
    id: 'minitrans-main',
    title: '🌍 MiniTrans 翻译',
    contexts: ['all']
  });
  // ... 更多菜单项
}
```

### 状态同步

```typescript
// popup 中通知 background script 更新菜单状态
chrome.runtime.sendMessage({
  type: 'UPDATE_CONTEXT_MENU',
  enabled: enabled
});

// background script 中更新菜单显示
function updateContextMenuState(isEnabled: boolean) {
  chrome.contextMenus.update('minitrans-enable', {
    title: isEnabled ? '✅ 开启翻译 (当前状态)' : '✅ 开启翻译'
  });
}
```

## 🧪 测试方法

1. 重新加载扩展（确保 manifest.json 权限生效）
2. 打开 `test-context-menu.html` 测试页面
3. 在页面任意位置右键，查看 MiniTrans 翻译菜单
4. 测试开启/关闭翻译功能
5. 验证 popup 与右键菜单的状态同步

## 🔄 工作流程

1. **扩展安装/更新**：自动创建右键菜单
2. **用户右键**：显示翻译控制菜单
3. **菜单点击**：更新存储设置并通知相关组件
4. **状态同步**：popup、content script、右键菜单状态保持一致
5. **即时生效**：翻译功能状态立即改变

## 💡 扩展建议

- 可以添加更多右键菜单选项（如快速切换目标语言）
- 支持自定义快捷键
- 添加菜单项图标
- 支持不同页面类型的上下文菜单

## 🐛 故障排除

### 右键菜单不显示
- 检查扩展权限是否包含 `contextMenus`
- 确认 background script 正常运行
- 查看浏览器控制台是否有错误信息

### 状态不同步
- 检查 Chrome 存储权限
- 确认消息传递机制正常工作
- 验证 background script 的消息监听器

### 菜单项更新失败
- 检查菜单 ID 是否正确
- 确认 `chrome.contextMenus.update` 调用成功
- 查看是否有权限错误

## 📝 更新日志

- **v1.0.0** - 初始版本，支持基本的右键菜单功能
- 支持翻译功能开启/关闭
- 支持设置页面快速访问
- 实现状态同步机制
