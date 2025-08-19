import React, { useEffect } from 'react';
import { langs } from './const';
import styles from './Popup.module.scss';
import { Switch } from 'antd';

export default function Popup() {
  const [lang, setLang] = React.useState('zh-CN');
  const [isEnabled, setIsEnabled] = React.useState(true);

  useEffect(() => {
    // 获取存储的设置
    chrome.storage.sync.get(['targetLang', 'translationEnabled'], (r) => {
      setLang(r.targetLang || 'zh-CN');
      setIsEnabled(r.translationEnabled !== false); // 默认开启
    });
  }, []);

  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLang(newLang);
    chrome.storage.sync.set({ targetLang: newLang });

    // 显示设置成功提示
    showStatus('语言设置已保存');
  };

  const toggleTranslation = (e: boolean) => {
    const enabled = e;
    setIsEnabled(enabled);
    chrome.storage.sync.set({ translationEnabled: enabled });

    // 显示设置成功提示
    showStatus(enabled ? '翻译功能已开启' : '翻译功能已关闭');

    // 通知 content script 更新状态
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'TRANSLATION_TOGGLED',
          enabled: enabled
        });
      }
    });
  };

  const showStatus = (message: string) => {
    const status = document.getElementById('status');
    if (status) {
      status.textContent = message;
      status.style.display = 'block';
      setTimeout(() => {
        status.style.display = 'none';
      }, 2000);
    }
  };

  return (
    <div className={styles.popupContainer}>
      <h3 className={styles.popupTitle}>🌍 翻译设置</h3>

      <div className={styles.popupCard}>
        <div className={styles.popupCardHeader}>
          <label className={styles.popupCardLabel}>
            {isEnabled ? '🟢 翻译功能' : '🔴 翻译功能'}
          </label>
          <div className={styles.toggleWrap}>
            <Switch
              checked={isEnabled}
              onChange={toggleTranslation}
            />
          </div>
        </div>
        <div className={styles.popupCardDesc}>
          {isEnabled ? '选中文字即可翻译' : '翻译功能已关闭'}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>目标语言：</label>
        <select
          className={styles.formSelect}
          value={lang}
          onChange={changeLang}
          disabled={!isEnabled}
        >
          {langs.map(l => (
            <option key={l.key} value={l.key}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <div id="status" className={styles.status}>设置已保存</div>

      <div className={styles.helpBox}>
        <div className={styles.helpBoxTitle}>💡 使用说明</div>
        <div>1. 开启翻译功能</div>
        <div>2. 选择目标语言</div>
        <div>3. 选中网页文字即可翻译</div>
      </div>
    </div>
  );
}