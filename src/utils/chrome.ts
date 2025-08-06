import { ChromeMessage, StorageData } from '@/types';

/**
 * 发送消息到Chrome扩展的其他部分
 */
export const sendMessage = async (message: ChromeMessage): Promise<any> => {
  try {
    return await chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error('发送消息失败:', error);
    throw new Error(`发送消息失败: ${error}`);
  }
};

/**
 * 监听来自Chrome扩展其他部分的消息
 */
export const onMessage = (callback: (message: ChromeMessage, sender: chrome.runtime.MessageSender) => void): void => {
  chrome.runtime.onMessage.addListener(callback);
};

/**
 * 获取存储数据
 */
export const getStorage = async (keys?: string | string[] | object): Promise<StorageData> => {
  try {
    return await chrome.storage.local.get(keys);
  } catch (error) {
    console.error('获取存储数据失败:', error);
    throw new Error(`获取存储数据失败: ${error}`);
  }
};

/**
 * 设置存储数据
 */
export const setStorage = async (items: StorageData): Promise<void> => {
  try {
    await chrome.storage.local.set(items);
  } catch (error) {
    console.error('设置存储数据失败:', error);
    throw new Error(`设置存储数据失败: ${error}`);
  }
};

/**
 * 清除存储数据
 */
export const clearStorage = async (keys?: string | string[]): Promise<void> => {
  try {
    if (keys) {
      await chrome.storage.local.remove(keys);
    } else {
      await chrome.storage.local.clear();
    }
  } catch (error) {
    console.error('清除存储数据失败:', error);
    throw new Error(`清除存储数据失败: ${error}`);
  }
};

/**
 * 获取当前活动标签页
 */
export const getActiveTab = async (): Promise<chrome.tabs.Tab> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      throw new Error('未找到活动标签页');
    }
    return tab;
  } catch (error) {
    console.error('获取活动标签页失败:', error);
    throw new Error(`获取活动标签页失败: ${error}`);
  }
};

/**
 * 执行内容脚本
 */
export const executeScript = async (tabId: number, func: () => void): Promise<any> => {
  try {
    return await chrome.scripting.executeScript({
      target: { tabId },
      func
    });
  } catch (error) {
    console.error('执行脚本失败:', error);
    throw new Error(`执行脚本失败: ${error}`);
  }
}; 