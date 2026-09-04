// Web Speech API 기반 읽어주기(기획서 9장 접근성 / 11장 무료 리소스).
// 브라우저 미지원 시에도 예외 없이 조용히 비활성화된다(Chrome 권장).
let voicesCache = null;

export function ttsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickKoreanVoice() {
  if (!ttsSupported()) return null;
  if (!voicesCache || voicesCache.length === 0) {
    voicesCache = window.speechSynthesis.getVoices();
  }
  if (!voicesCache) return null;
  return (
    voicesCache.find((v) => v.lang === 'ko-KR') ||
    voicesCache.find((v) => (v.lang || '').toLowerCase().startsWith('ko')) ||
    null
  );
}

if (ttsSupported()) {
  // 일부 브라우저는 voices를 비동기로 채운다.
  window.speechSynthesis.onvoiceschanged = () => {
    voicesCache = window.speechSynthesis.getVoices();
  };
}

export function speak(text, { rate = 0.95 } = {}) {
  if (!ttsSupported() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = 'ko-KR';
    u.rate = rate; // 어린이 모드 대상: 기본 속도보다 약간 느리게
    const v = pickKoreanVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch {
    /* 무시 */
  }
}

export function stopSpeaking() {
  if (!ttsSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* 무시 */
  }
}
