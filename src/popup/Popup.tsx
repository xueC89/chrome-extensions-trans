import React from 'react';

const langs = [
  { key: 'zh-CN', name: '简体中文' },
  { key: 'zh-TW', name: '繁體中文' },
  { key: 'en', name: 'English' },
  { key: 'ja', name: '日本語' },
  { key: 'ko', name: '한국어' },
  { key: 'fr', name: 'Français' },
  { key: 'de', name: 'Deutsch' },
  { key: 'es', name: 'Español' },
  { key: 'pt', name: 'Português' },
  { key: 'it', name: 'Italiano' },
  { key: 'ru', name: 'Русский' },
  { key: 'ar', name: 'العربية' },
  { key: 'hi', name: 'हिन्दी' },
  { key: 'th', name: 'ไทย' },
  { key: 'vi', name: 'Tiếng Việt' },
];

export default function Popup() {
  const [lang, setLang] = React.useState('zh-CN');
  const [isEnabled, setIsEnabled] = React.useState(true);

  React.useEffect(() => {
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

  const toggleTranslation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
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
    <div style={{ width: 220, padding: 16 }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#333', textAlign: 'center' }}>
        🌍 翻译设置
      </h3>
      
      {/* 翻译功能开关 */}
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>
            {isEnabled ? '🟢 翻译功能' : '🔴 翻译功能'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={toggleTranslation}
              style={{
                width: '40px',
                height: '20px',
                appearance: 'none',
                backgroundColor: isEnabled ? '#4CAF50' : '#ccc',
                borderRadius: '10px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '2px',
              left: isEnabled ? '22px' : '2px',
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: 'left 0.3s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
          {isEnabled ? '选中文字即可翻译' : '翻译功能已关闭'}
        </div>
      </div>
      
      {/* 语言选择 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#666' }}>
          目标语言：
        </label>
        <select 
          value={lang} 
          onChange={changeLang}
          disabled={!isEnabled}
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: isEnabled ? 'white' : '#f5f5f5',
            color: isEnabled ? '#333' : '#999',
            cursor: isEnabled ? 'pointer' : 'not-allowed'
          }}
        >
          {langs.map(l => (
            <option key={l.key} value={l.key}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* 状态提示 */}
      <div id="status" style={{
        display: 'none',
        fontSize: '11px',
        color: '#4CAF50',
        textAlign: 'center',
        padding: '6px',
        backgroundColor: '#E8F5E8',
        borderRadius: '4px',
        marginBottom: '12px'
      }}>
        设置已保存
      </div>
      
      {/* 使用说明 */}
      <div style={{ 
        fontSize: '10px', 
        color: '#999', 
        textAlign: 'center',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ marginBottom: '4px' }}>💡 使用说明</div>
        <div>1. 开启翻译功能</div>
        <div>2. 选择目标语言</div>
        <div>3. 选中网页文字即可翻译</div>
      </div>
    </div>
  );
}