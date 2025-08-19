export async function googleTranslate(
  text: string,
  targetLang: string = 'zh-CN'
) {
  const url =
    'https://translate.googleapis.com/translate_a/single' +
    `?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url);
  const data = await res.json();
  return data[0].map((item: any[]) => item[0]).join('');
}