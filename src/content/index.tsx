import React from 'react';
import { createRoot } from 'react-dom/client';
import { googleTranslate } from '../lib/translate';
import './content.css';

let root: any = null;
let popupDiv: HTMLDivElement | null = null;
let targetLang = 'zh-CN'; // 默认语言
let translationEnabled = true; // 默认开启翻译功能

// 获取存储的目标语言
async function getTargetLanguage(): Promise<string> {
  try {
    const result = await chrome.storage.sync.get(['targetLang']);
    return result.targetLang || 'zh-CN';
  } catch (error) {
    console.error('Failed to get target language:', error);
    return 'zh-CN';
  }
}

// 获取翻译功能开关状态
async function getTranslationEnabled(): Promise<boolean> {
  try {
    const result = await chrome.storage.sync.get(['translationEnabled']);
    return result.translationEnabled !== false; // 默认开启
  } catch (error) {
    console.error('Failed to get translation enabled status:', error);
    return true;
  }
}

// 监听存储变化，实时更新设置
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.targetLang) {
      targetLang = changes.targetLang.newValue || 'zh-CN';
      console.log('Target language updated to:', targetLang);
    }
    if (changes.translationEnabled) {
      translationEnabled = changes.translationEnabled.newValue !== false;
      console.log('Translation enabled:', translationEnabled);
      
      // 如果关闭翻译功能，移除现有弹窗
      if (!translationEnabled && popupDiv) {
        removePopup();
      }
    }
  }
});

// 监听来自 popup 的消息， 监听来自 background script 的右键菜单消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRANSLATION_TOGGLED') {
    translationEnabled = message.enabled;
    
    // 如果关闭翻译功能，移除现有弹窗
    if (!translationEnabled && popupDiv) {
      removePopup();
    }
  }
});

// 初始化时获取设置
async function initializeSettings() {
  try {
    [targetLang, translationEnabled] = await Promise.all([
      getTargetLanguage(),
      getTranslationEnabled()
    ]);
    console.log('Initial settings - Language:', targetLang, 'Enabled:', translationEnabled);
  } catch (error) {
    console.error('Failed to initialize settings:', error);
  }
}

initializeSettings();

function removePopup() {
  if (popupDiv) {
    if (root) {
      root.unmount();
      root = null;
    }
    popupDiv.remove();
    popupDiv = null;
  }
}

// 监听选中事件
function handleSelection(e: MouseEvent) {
  // 如果翻译功能关闭，直接返回
  if (!translationEnabled) {
    return;
  }
  
  const sel = window.getSelection()?.toString().trim();
  if (!sel) {
    removePopup();
    return;
  }
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  if (!rect) return;
  
  showPopup(rect, sel);
}

// 防抖处理
let selectionTimeout: NodeJS.Timeout;
function debouncedHandleSelection(e: MouseEvent) {
  clearTimeout(selectionTimeout);
  selectionTimeout = setTimeout(() => handleSelection(e), 100);
}

document.addEventListener('mouseup', debouncedHandleSelection);
document.addEventListener('mousedown', (e) => {
  // 点击弹窗外关闭
  if (popupDiv && !popupDiv.contains(e.target as Node)) {
    removePopup();
  }
});

function showPopup(rect: DOMRect, text: string) {
  // 如果翻译功能关闭，不显示弹窗
  if (!translationEnabled) {
    return;
  }
  
  // 如果已存在弹窗，先移除
  if (popupDiv) {
    removePopup();
  }
  
  // 创建新的弹窗容器
  popupDiv = document.createElement('div');
  popupDiv.className = 'mini-trans-popup';
  popupDiv.id = 'mini-trans-popup';
  
  // 设置样式
  popupDiv.style.position = 'absolute';
  popupDiv.style.zIndex = '999999';
  popupDiv.style.left = `${rect.left + window.scrollX}px`;
  popupDiv.style.top = `${rect.bottom + window.scrollY + 6}px`;
  
  /** 添加到页面 */
  document.body.appendChild(popupDiv);
  
  /** 创建 React root 并渲染 */ 
  root = createRoot(popupDiv);
  root.render(<Popup text={text} />);
}

const Popup: React.FC<{ text: string }> = ({ text }) => {
  const [res, setRes] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState(targetLang);

  React.useEffect(() => {
    setRes('');
    setLoading(true);
    setError(false);
    
    /** 获取最新的目标语言 */
    getTargetLanguage().then(lang => {
      setCurrentLang(lang);
      return googleTranslate(text, lang);
    })
    .then((result) => {
      setRes(result);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Translation error:', err);
      setError(true);
      setLoading(false);
    });
  }, [text]);

  return (
    <div className="bubble">
      <div style={{ minWidth: 80, minHeight: 20 }}>
        {loading ? '翻译中...' : error ? '翻译失败' : res}
      </div>
      <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
        目标语言: {currentLang}
      </div>
    </div>
  );
};

/** 清理函数 */
window.addEventListener('beforeunload', () => {
  removePopup();
  clearTimeout(selectionTimeout);
});