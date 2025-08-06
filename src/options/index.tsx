import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from './Options';
import { setupGlobalErrorHandler } from '@/utils/errorHandler';

// 设置全局错误处理
setupGlobalErrorHandler();

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>
  );
} 