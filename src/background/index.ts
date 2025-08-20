// 初始化后台脚本
console.log('Chrome Extension Background Script 已启动');

// 创建右键菜单
function createContextMenus() {
  // 移除现有菜单
  chrome.contextMenus.removeAll(() => {
    // 创建主菜单
    chrome.contextMenus.create({
      id: 'minitrans-main',
      title: '🌍 MiniTrans 翻译',
      contexts: ['all']
    });

    // 创建翻译开关子菜单
    chrome.contextMenus.create({
      id: 'minitrans-toggle',
      parentId: 'minitrans-main',
      title: '翻译功能',
      contexts: ['all']
    });

    // 创建开启翻译选项
    chrome.contextMenus.create({
      id: 'minitrans-enable',
      parentId: 'minitrans-toggle',
      title: '✅ 开启翻译',
      contexts: ['all']
    });

    // 创建关闭翻译选项
    chrome.contextMenus.create({
      id: 'minitrans-disable',
      parentId: 'minitrans-toggle',
      title: '❌ 关闭翻译',
      contexts: ['all']
    });

    // 创建分隔线
    chrome.contextMenus.create({
      id: 'minitrans-separator',
      parentId: 'minitrans-main',
      type: 'separator',
      contexts: ['all']
    });

    // 创建设置选项
    chrome.contextMenus.create({
      id: 'minitrans-settings',
      parentId: 'minitrans-main',
      title: '⚙️ 打开设置',
      contexts: ['all']
    });

    console.log('右键菜单已创建');
  });
}

// 处理右键菜单点击事件
function handleContextMenuClick(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {
  console.log('右键菜单点击:', info.menuItemId);

  switch (info.menuItemId) {
    case 'minitrans-enable':
      enableTranslation(tab);
      break;
    case 'minitrans-disable':
      disableTranslation(tab);
      break;
    case 'minitrans-settings':
      openSettings();
      break;
    default:
      console.log('未知菜单项:', info.menuItemId);
  }
}

// 开启翻译功能
async function enableTranslation(tab?: chrome.tabs.Tab) {
  try {
    // 保存设置到存储
    await chrome.storage.sync.set({ translationEnabled: true });
    console.log('翻译功能已开启');

    // 通知当前标签页
    if (tab?.id) {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'TRANSLATION_TOGGLED',
        enabled: true
      });
    }

    // 更新菜单状态
    updateContextMenuState(true);
  } catch (error) {
    console.error('开启翻译功能失败:', error);
  }
}

// 关闭翻译功能
async function disableTranslation(tab?: chrome.tabs.Tab) {
  try {
    // 保存设置到存储
    await chrome.storage.sync.set({ translationEnabled: false });
    console.log('翻译功能已关闭');

    // 通知当前标签页
    if (tab?.id) {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'TRANSLATION_TOGGLED',
        enabled: false
      });
    }

    // 更新菜单状态
    updateContextMenuState(false);
  } catch (error) {
    console.error('关闭翻译功能失败:', error);
  }
}

// 打开设置页面
function openSettings() {
  // 打开 popup 或设置页面
  chrome.action.openPopup();
}

// 更新右键菜单状态
async function updateContextMenuState(isEnabled: boolean) {
  try {
    // 更新开启/关闭菜单项的标题
    chrome.contextMenus.update('minitrans-enable', {
      title: isEnabled ? '✅ 开启翻译 (当前状态)' : '✅ 开启翻译'
    });

    chrome.contextMenus.update('minitrans-disable', {
      title: isEnabled ? '❌ 关闭翻译' : '❌ 关闭翻译 (当前状态)'
    });
  } catch (error) {
    console.error('更新右键菜单状态失败:', error);
  }
}

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  console.log('扩展已安装:', details);
  
  // 创建右键菜单
  createContextMenus();
  
  // 初始化默认设置
  initializeDefaultSettings();
});

// 监听扩展更新事件
chrome.runtime.onUpdateAvailable.addListener(() => {
  console.log('扩展更新可用');
  chrome.runtime.reload();
});

// 初始化默认设置
async function initializeDefaultSettings() {
  try {
    const result = await chrome.storage.sync.get(['translationEnabled', 'targetLang']);
    
    // 设置默认值
    const defaultSettings = {
      translationEnabled: true, // 默认开启翻译
      targetLang: 'zh-CN',     // 默认目标语言
      ...result
    };
    
    await chrome.storage.sync.set(defaultSettings);
    console.log('默认设置已初始化:', defaultSettings);
    
    // 更新菜单状态
    updateContextMenuState(defaultSettings.translationEnabled);
  } catch (error) {
    console.error('初始化默认设置失败:', error);
  }
}

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.translationEnabled) {
    const isEnabled = changes.translationEnabled.newValue !== false;
    console.log('翻译功能状态变化:', isEnabled);
    
    // 更新菜单状态
    updateContextMenuState(isEnabled);
  }
});

// 监听来自 popup 或 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message, '来自:', sender);
  
  switch (message.type) {
    case 'GET_TRANSLATION_STATE':
      // 获取翻译功能状态
      chrome.storage.sync.get(['translationEnabled'], (result) => {
        sendResponse({ 
          success: true, 
          enabled: result.translationEnabled !== false 
        });
      });
      return true; // 保持消息通道开放
      
    case 'UPDATE_CONTEXT_MENU':
      // 更新右键菜单状态
      updateContextMenuState(message.enabled);
      sendResponse({ success: true });
      break;
      
    default:
      console.log('未知消息类型:', message.type);
      sendResponse({ success: false, error: '未知消息类型' });
  }
}); 