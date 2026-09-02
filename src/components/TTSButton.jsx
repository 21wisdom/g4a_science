import React, { useState } from 'react';
import { speak, stopSpeaking, ttsSupported } from '../lib/tts';

/**
 * 문항 읽어주기 버튼 (기획서 9장 접근성 — 전 문항 배치, 저학년 기본 제공).
 * Web Speech API 미지원 브라우저에서는 렌더링하지 않는다.
 */
export default function TTSButton({ text, label = '읽어주기', className = '' }) {
  const [playing, setPlaying] = useState(false);
  if (!ttsSupported()) return null;

  const onClick = () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    speak(text);
    setPlaying(true);
    // 대략적인 재생 시간 후 상태 복구(정확한 종료 이벤트 대신 단순 처리)
    const ms = Math.min(20000, Math.max(2500, String(text).length * 180));
    setTimeout(() => setPlaying(false), ms);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-soft !px-3 !py-1 text-sm ${className}`}
      aria-label={playing ? '읽기 멈추기' : `${label}: ${String(text).slice(0, 30)}`}
      title={playing ? '읽기 멈추기' : label}
    >
      <span aria-hidden="true">{playing ? '⏹️' : '🔊'}</span>
      <span className="hidden sm:inline">{playing ? '멈춤' : label}</span>
    </button>
  );
}
