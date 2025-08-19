// import { ChromeMessage } from '@/types';
// import { onMessage, getStorage, setStorage } from '@/utils/chrome';

// // 初始化后台脚本
// console.log('Chrome Extension Background Script 已启动');

// // 监听来自其他部分的消息
// onMessage(async (message: ChromeMessage, sender) => {
//   try {
//     console.log('收到消息:', message, '来自:', sender);

//     switch (message.type) {
//       case 'EXTENSION_TOGGLED':
//         await handleExtensionToggle(message.data);
//         break;
      
//       case 'GET_STORAGE_DATA':
//         const data = await getStorage(message.data?.keys);
//         return { success: true, data };
      
//       case 'SET_STORAGE_DATA':
//         await setStorage(message.data);
//         return { success: true };
      
//       default:
//         console.warn('未知消息类型:', message.type);
//         return { success: false, error: '未知消息类型' };
//     }
//   } catch (error) {
//     console.error('处理消息时出错:', error);
//     return { success: false, error: error || '未知错误' };
//   }
// });

// // 处理扩展开关状态变化
// const handleExtensionToggle = async (data: { isEnabled: boolean }) => {
//   console.log('扩展状态变化:', data.isEnabled);
  
//   // 这里可以添加状态变化时的逻辑
//   // 例如通知所有标签页、更新图标等
  
//   // 通知所有标签页状态变化
//   const tabs = await chrome.tabs.query({});
//   for (const tab of tabs) {
//     if (tab.id) {
//       try {
//         await chrome.tabs.sendMessage(tab.id, {
//           type: 'EXTENSION_STATE_CHANGED',
//           data: { isEnabled: data.isEnabled }
//         });
//       } catch (error) {
//         // 忽略无法发送消息的标签页（例如chrome://页面）
//         console.debug('无法发送消息到标签页:', tab.id, error);
//       }
//     }
//   }
// };

// // 监听扩展安装事件
// chrome.runtime.onInstalled.addListener((details) => {
//   console.log('扩展已安装:', details);
  
//   // 初始化默认设置
//   initializeDefaultSettings();
// });

// // 监听扩展更新事件
// chrome.runtime.onUpdateAvailable.addListener(() => {
//   console.log('扩展更新可用');
//   chrome.runtime.reload();
// });

// // 初始化默认设置
// const initializeDefaultSettings = async () => {
//   try {
//     const settings = await getStorage();
    
//     // 设置默认值
//     const defaultSettings = {
//       isEnabled: false,
//       theme: 'light',
//       autoSave: true,
//       ...settings
//     };
    
//     await setStorage(defaultSettings);
//     console.log('默认设置已初始化');
//   } catch (error) {
//     console.error('初始化默认设置失败:', error);
//   }
// };

// // 监听标签页更新事件
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url) {
//     console.log('标签页已加载完成:', tab.url);
    
//     // 这里可以添加页面加载完成后的逻辑
//     // 例如注入内容脚本、检查页面状态等
//   }
// });

// // 监听标签页激活事件
// chrome.tabs.onActivated.addListener(async (activeInfo) => {
//   try {
//     const tab = await chrome.tabs.get(activeInfo.tabId);
//     console.log('标签页已激活:', tab.url);
    
//     // 这里可以添加标签页激活时的逻辑
//   } catch (error) {
//     console.error('获取激活标签页信息失败:', error);
//   }
// }); 