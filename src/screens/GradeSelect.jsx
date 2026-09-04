import React from 'react';
import Mascot, { MascotSpeech } from '../components/Mascot';
import useGameStore from '../store/useGameStore';
import { modeLabel } from '../config';

/**
 * 난이도 모드 선택(기획서 4.2) — 이후 모든 챕터·문항·실험 UI가 이 값을 참조해 분기한다.
 * 내부 값은 'low' | 'high'이고, 표기만 연령대로 나타낸다.
 */
export default function GradeSelect() {
  const go = useGameStore((s) => s.go);
  const setDraft = useGameStore((s) => s.setDraft);

  const pick = (gradeMode) => {
    setDraft({ gradeMode });
    go('naming');
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col justify-center px-4 py-10">
      <MascotSpeech mood="idle" size="lg">
        <p className="text-xl font-black">누가 플레이하나요?</p>
        <p className="mt-1 font-bold">고른 모드에 맞춰 문제와 실험이 달라져요. 나중에 바꿀 수도 있어요.</p>
      </MascotSpeech>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="btn h-auto flex-col bg-white p-6"
          onClick={() => pick('low')}
        >
          <span className="text-5xl" aria-hidden="true">
            🌱
          </span>
          <span className="mt-2 text-2xl font-black">{modeLabel('low')}</span>
          <span className="mt-1 text-center text-sm font-bold leading-snug">
            큰 버튼과 쉬운 문장으로
            <br />
            비교하고 골라보는 활동 중심
          </span>
        </button>
        <button
          type="button"
          className="btn h-auto flex-col bg-white p-6"
          onClick={() => pick('high')}
        >
          <span className="text-5xl" aria-hidden="true">
            🚀
          </span>
          <span className="mt-2 text-2xl font-black">{modeLabel('high')}</span>
          <span className="mt-1 text-center text-sm font-bold leading-snug">
            슬라이더와 계산식으로
            <br />
            직접 실험하고 예측하는 활동 중심
          </span>
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <button type="button" className="btn-soft" onClick={() => go('start')}>
          ← 처음으로
        </button>
      </div>
    </div>
  );
}
