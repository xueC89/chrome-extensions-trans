import React from 'react';
import { createRoot } from 'react-dom/client';
import ContentScript from './ContentScript';
import { setupGlobalErrorHandler } from '@/utils/errorHandler';

// 设置全局错误处理
setupGlobalErrorHandler();

// 创建内容脚本容器
const createContentContainer = (): HTMLElement => {
  const container = document.createElement('div');
  container.id = 'chrome-extension-content';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    pointer-events: none;
  `;
  document.body.appendChild(container);
  return container;
};

// 初始化内容脚本
const initializeContentScript = () => {
  try {
    // 检查是否已经存在容器
    let container = document.getElementById('chrome-extension-content');
    if (!container) {
      container = createContentContainer();
    }

    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ContentScript />
      </React.StrictMode>
    );

    console.log('Chrome Extension Content Script 已初始化');
  } catch (error) {
    console.error('初始化内容脚本失败:', error);
  }
};

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
  initializeContentScript();
} 