import { AppError } from '@/types';

/**
 * 创建应用错误对象
 */
export const createError = (message: string, code?: string, details?: any): AppError => {
  return {
    message,
    code,
    details
  };
};

/**
 * 处理异步操作的错误
 */
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  errorMessage: string = '操作失败'
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error(errorMessage, error);
    throw createError(errorMessage, 'ASYNC_ERROR', error);
  }
};

/**
 * 错误日志记录
 */
export const logError = (error: AppError | Error, context?: string): void => {
  const errorInfo = {
    message: error.message,
    code: 'code' in error ? error.code : undefined,
    details: 'details' in error ? error.details : undefined,
    stack: error || '',
    context,
    timestamp: new Date().toISOString()
  };

  console.error('应用错误:', errorInfo);
  
  // 这里可以添加错误上报逻辑
  // 例如发送到错误监控服务
};

/**
 * 全局错误处理器
 */
export const setupGlobalErrorHandler = (): void => {
  window.addEventListener('error', (event) => {
    logError(event.error || new Error(event.message), 'GLOBAL_ERROR');
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason), 'UNHANDLED_REJECTION');
  });
}; 