import React from 'react';

const langs = [
  { key: 'zh-CN', name: '简体中文' },
  { key: 'en', name: 'English' },
];

export default function Popup() {
  const [lang, setLang] = React.useState('zh-CN');

  React.useEffect(() => {
    chrome.storage.sync.get(['targetLang'], (r) => setLang(r.targetLang || 'zh-CN'));
  }, []);

  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
    chrome.storage.sync.set({ targetLang: e.target.value });
  };

  return (
    <div style={{ width: 160, padding: 12 }}>
      <label>翻译到：</label>
      <select value={lang} onChange={change}>
        {langs.map(l => <option key={l.key} value={l.key}>{l.name}</option>)}
      </select>
    </div>
  );
}