import React from 'react';
import Mascot from '../components/Mascot';
import useGameStore from '../store/useGameStore';
import CONFIG from '../config';
import { CHAPTERS } from '../data/chapters';

/** 시작 화면 — 로그인 없이 바로 시작(기획서 1.3) */
export default function StartScreen() {
  const go = useGameStore((s) => s.go);
  const profiles = useGameStore((s) => s.profiles);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg text-center">
        <Mascot mood="idle" size="xl" className="mx-auto" />
        <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">{CONFIG.appName}</h1>
        <p className="mt-2 font-bold text-mulgomi-line/70">{CONFIG.appSubtitle}</p>
        <p className="mt-4 rounded-2xl border-3 border-mulgomi-line bg-white p-4 font-bold leading-relaxed shadow-pop">
          인천 바다와 도시 곳곳을 탐험하며, <b>실제 데이터로 실험하고 예측하는</b> SDGs 과학 탐정
          게임이에요. 초등 3~6학년 누구나 할 수 있어요.
        </p>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            className="btn-primary w-full !py-4 text-xl"
            onClick={() => go('grade')}
          >
            🚀 새로 시작하기
          </button>
          {profiles.length > 0 && (
            <button type="button" className="btn-soft w-full !py-3" onClick={() => go('profiles')}>
              📁 이어서 하기 ({profiles.length}명 저장됨)
            </button>
          )}
        </div>

        <div className="mt-8 grid grid-cols-5 gap-1.5">
          {CHAPTERS.map((c) => (
            <div key={c.id} className="card-pop bg-white p-2 text-center">
              <p className="text-xl" aria-hidden="true">
                {c.emoji}
              </p>
              <p className="text-[11px] font-black leading-tight">{c.title}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs font-bold leading-relaxed text-mulgomi-line/60">
          이름과 학년 외 어떤 개인정보도 수집하지 않아요. 기록은 이 기기 안에만 저장됩니다.
          <br />
          {CONFIG.organizer} · 마스코트 물곰이
        </p>
      </div>
    </div>
  );
}
