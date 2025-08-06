import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { getStorage, setStorage, sendMessage } from '@/utils/chrome';
import { handleAsyncError } from '@/utils/errorHandler';
import './Popup.css';

const Popup: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePopup();
  }, []);

  const initializePopup = async () => {
    try {
      setLoading(true);
      
      // 获取存储的设置
      const settings = await getStorage('isEnabled');
      setIsEnabled(settings.isEnabled || false);

      // 获取当前标签页URL
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    } catch (error) {
      console.error('初始化弹窗失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExtension = async () => {
    await handleAsyncError(async () => {
      const newState = !isEnabled;
      await setStorage({ isEnabled: newState });
      setIsEnabled(newState);
      
      // 通知其他组件状态变化
      await sendMessage({
        type: 'EXTENSION_TOGGLED',
        data: { isEnabled: newState }
      });
    }, '切换扩展状态失败');
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  if (loading) {
    return (
      <div className="popup">
        <div className="popup__loading">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popup">
      <header className="popup__header">
        <h1 className="popup__title">React Chrome Extension</h1>
        <div className={`popup__status ${isEnabled ? 'popup__status--enabled' : 'popup__status--disabled'}`}>
          {isEnabled ? '已启用' : '已禁用'}
        </div>
      </header>

      <main className="popup__content">
        <div className="popup__section">
          <h3>当前页面</h3>
          <p className="popup__url">{currentUrl}</p>
        </div>

        <div className="popup__section">
          <h3>操作</h3>
          <div className="popup__actions">
            <Button
              onClick={toggleExtension}
              variant={isEnabled ? 'danger' : 'primary'}
              size="medium"
            >
              {isEnabled ? '禁用扩展' : '启用扩展'}
            </Button>
            
            <Button
              onClick={openOptions}
              variant="secondary"
              size="medium"
            >
              设置
            </Button>
          </div>
        </div>
      </main>

      <footer className="popup__footer">
        <p>版本 1.0.0</p>
      </footer>
    </div>
  );
};

export default Popup; 