import React, { useState, useEffect } from 'react';
import { onMessage, getStorage } from '@/utils/chrome';
import { handleAsyncError } from '@/utils/errorHandler';
import './ContentScript.css';

const ContentScript: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    title: '',
    url: '',
    domain: ''
  });

  useEffect(() => {
    initializeContentScript();
    setupMessageListener();
  }, []);

  const initializeContentScript = async () => {
    await handleAsyncError(async () => {
      // 获取扩展设置
      const settings = await getStorage('isEnabled');
      setIsEnabled(settings.isEnabled || false);

      // 获取页面信息
      const pageData = {
        title: document.title,
        url: window.location.href,
        domain: window.location.hostname
      };
      setPageInfo(pageData);

      // 如果扩展已启用，显示内容
      if (settings.isEnabled) {
        setIsVisible(true);
      }
    }, '初始化内容脚本失败');
  };

  const setupMessageListener = () => {
    onMessage((message) => {
      if (message.type === 'EXTENSION_STATE_CHANGED') {
        const { isEnabled: newState } = message.data;
        setIsEnabled(newState);
        setIsVisible(newState);
        
        if (newState) {
          console.log('内容脚本已启用');
        } else {
          console.log('内容脚本已禁用');
        }
      }
    });
  };

  const handlePageAction = () => {
    // 这里可以添加页面操作逻辑
    console.log('执行页面操作');
    
    // 示例：高亮页面上的所有链接
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      if (index < 5) { // 只高亮前5个链接作为示例
        link.style.backgroundColor = '#ffff00';
        link.style.color = '#000000';
      }
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="content-script">
      <div className="content-script__header">
        <span className="content-script__title">React Extension</span>
        <button 
          className="content-script__close"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>
      
      <div className="content-script__body">
        <div className="content-script__info">
          <p><strong>页面标题:</strong> {pageInfo.title}</p>
          <p><strong>域名:</strong> {pageInfo.domain}</p>
        </div>
        
        <button 
          className="content-script__action"
          onClick={handlePageAction}
        >
          执行操作
        </button>
      </div>
    </div>
  );
};

export default ContentScript; 