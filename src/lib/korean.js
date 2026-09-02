// 한국어 조사 자동 선택(받침 유무 판단). 학생이 입력한 낱말에 조사를 붙일 때 사용한다.
export function hasFinalConsonant(word) {
  const s = String(word || '').trim();
  if (!s) return false;
  const ch = s[s.length - 1];
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false; // 한글 음절이 아니면 판단 불가
  return (code - 0xac00) % 28 !== 0;
}

/** 예: josa('플라스틱 병', '이', '가') → '이' */
export function josa(word, withFinal, withoutFinal) {
  return hasFinalConsonant(word) ? withFinal : withoutFinal;
}
