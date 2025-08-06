import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import { setupGlobalErrorHandler } from '@/utils/errorHandler';

// 设置全局错误处理
setupGlobalErrorHandler();

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
} 