// 외부 음원 파일 없이 WebAudio로 만드는 짧은 효과음(기획서 9장 즉시 청각 피드백).
// 별도 라이선스 확인이 필요 없고, 오프라인에서도 동작한다.
let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, startAt, dur, gainPeak = 0.12, type = 'sine') {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, c.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(gainPeak, c.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + startAt + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + startAt);
  osc.stop(c.currentTime + startAt + dur + 0.02);
}

export const sfx = {
  correct() {
    try {
      tone(659.25, 0, 0.14);
      tone(987.77, 0.1, 0.22);
    } catch {}
  },
  wrong() {
    try {
      tone(311.13, 0, 0.18, 0.1, 'triangle');
    } catch {}
  },
  tap() {
    try {
      tone(880, 0, 0.06, 0.06, 'square');
    } catch {}
  },
  reward() {
    try {
      tone(523.25, 0, 0.12);
      tone(659.25, 0.1, 0.12);
      tone(783.99, 0.2, 0.12);
      tone(1046.5, 0.3, 0.3);
    } catch {}
  },
};

export default sfx;
