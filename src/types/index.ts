// Chrome Extension API 类型扩展
export interface ChromeMessage {
  type: string;
  data?: any;
}

export interface StorageData {
  [key: string]: any;
}

// 组件Props类型
export interface PopupProps {
  // 弹窗组件属性
}

export interface OptionsProps {
  // 选项页面属性
}

// 错误处理类型
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
} 
