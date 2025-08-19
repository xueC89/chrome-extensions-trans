import React from 'react';
import { createRoot } from 'react-dom/client';
import { googleTranslate } from '../lib/translate';
import './content.css';

let root: any = null;
let popupDiv: HTMLDivElement | null = null;

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
  
  // 添加到页面
  document.body.appendChild(popupDiv);
  
  // 创建 React root 并渲染
  root = createRoot(popupDiv);
  root.render(<Popup text={text} />);
}

const Popup: React.FC<{ text: string }> = ({ text }) => {
  const [res, setRes] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setRes('');
    setLoading(true);
    setError(false);
    
    googleTranslate(text)
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
    </div>
  );
};

// 清理函数
window.addEventListener('beforeunload', () => {
  removePopup();
  clearTimeout(selectionTimeout);
});