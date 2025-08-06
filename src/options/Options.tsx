import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { getStorage, setStorage } from '@/utils/chrome';
import { handleAsyncError } from '@/utils/errorHandler';
import './Options.css';

interface Settings {
  isEnabled: boolean;
  theme: 'light' | 'dark';
  autoSave: boolean;
  notifications: boolean;
  customSetting: string;
}

const Options: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    isEnabled: false,
    theme: 'light',
    autoSave: true,
    notifications: true,
    customSetting: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    await handleAsyncError(async () => {
      const storedSettings = await getStorage();
      setSettings(prev => ({
        ...prev,
        ...storedSettings
      }));
    }, '加载设置失败');
    setLoading(false);
  };

  const saveSettings = async () => {
    await handleAsyncError(async () => {
      setSaving(true);
      await setStorage(settings);
      setMessage('设置已保存');
      setTimeout(() => setMessage(''), 3000);
    }, '保存设置失败');
    setSaving(false);
  };

  const resetSettings = async () => {
    await handleAsyncError(async () => {
      const defaultSettings = {
        isEnabled: false,
        theme: 'light',
        autoSave: true,
        notifications: true,
        customSetting: ''
      };
      setSettings(defaultSettings as Settings);
      await setStorage(defaultSettings);
      setMessage('设置已重置');
      setTimeout(() => setMessage(''), 3000);
    }, '重置设置失败');
  };

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="options">
        <div className="options__loading">
          <div className="spinner"></div>
          <p>加载设置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="options">
      <header className="options__header">
        <h1>React Chrome Extension 设置</h1>
        <p>自定义您的扩展体验</p>
      </header>

      <main className="options__content">
        {message && (
          <div className="options__message">
            {message}
          </div>
        )}

        <section className="options__section">
          <h2>基本设置</h2>
          
          <div className="options__setting">
            <label className="options__label">
              <input
                type="checkbox"
                checked={settings.isEnabled}
                onChange={(e) => handleSettingChange('isEnabled', e.target.checked)}
              />
              <span>启用扩展</span>
            </label>
            <p className="options__description">
              启用或禁用扩展功能
            </p>
          </div>

          <div className="options__setting">
            <label className="options__label">
              <span>主题</span>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </select>
            </label>
            <p className="options__description">
              选择您喜欢的界面主题
            </p>
          </div>
        </section>

        <section className="options__section">
          <h2>功能设置</h2>
          
          <div className="options__setting">
            <label className="options__label">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              <span>自动保存</span>
            </label>
            <p className="options__description">
              自动保存您的设置和数据
            </p>
          </div>

          <div className="options__setting">
            <label className="options__label">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
              <span>显示通知</span>
            </label>
            <p className="options__description">
              显示扩展操作的通知消息
            </p>
          </div>

          <div className="options__setting">
            <label className="options__label">
              <span>自定义设置</span>
              <input
                type="text"
                value={settings.customSetting}
                onChange={(e) => handleSettingChange('customSetting', e.target.value)}
                placeholder="输入自定义设置"
              />
            </label>
            <p className="options__description">
              输入您的自定义配置
            </p>
          </div>
        </section>

        <section className="options__section">
          <h2>操作</h2>
          <div className="options__actions">
            <Button
              onClick={saveSettings}
              disabled={saving}
              size="large"
            >
              {saving ? '保存中...' : '保存设置'}
            </Button>
            
            <Button
              onClick={resetSettings}
              variant="secondary"
              size="large"
            >
              重置设置
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Options; 