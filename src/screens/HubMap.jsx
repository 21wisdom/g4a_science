import React from 'react';
import Mascot from '../components/Mascot';
import { Panel, SdgBadge } from '../components/UI';
import useGameStore from '../store/useGameStore';
import IncheonMap from '../components/IncheonMap';
import { CHAPTERS, BADGES } from '../data/chapters';
import { sdgList } from '../data/sdgs';
import CONFIG from '../config';

/**
 * 인천 지도 기반 허브 월드(기획서 5.2)
 * - 챕터는 자유 순서로 플레이 가능(교실 모둠별 동시 진행 고려)
 * - 챕터 완료 시 해당 지역이 회색에서 컬러로 "복원"된다(SDGs 메시지의 시각적 은유)
 */
export default function HubMap() {
  const profile = useGameStore((s) => s.current());
  const openChapter = useGameStore((s) => s.openChapter);
  const go = useGameStore((s) => s.go);
  const isLow = useGameStore((s) => s.isLow());

  const progress = profile?.progress || {};
  const doneIds = CHAPTERS.filter((c) => progress[c.id]?.completed).map((c) => c.id);
  const allDone = doneIds.length === CHAPTERS.length;
  const badgeCount = Object.values(progress).reduce((n, p) => n + (p.badges?.length || 0), 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-16 pt-4 sm:px-5">
      {/* 상단바 */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Mascot mood="idle" size="sm" />
          <div>
            <p className="text-lg font-black leading-tight">
              {profile?.avatar} {profile?.displayName} 대원
            </p>
            <p className="text-sm font-bold text-mulgomi-line/70">
              {isLow ? '3~4학년 모드' : '5~6학년 모드'} · 배지 {badgeCount}개
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-soft !px-3 !py-2 text-sm" onClick={() => go('journal')}>
            📔 탐구 저널
          </button>
          <button type="button" className="btn-soft !px-3 !py-2 text-sm" onClick={() => go('settings')}>
            ⚙️ 설정
          </button>
        </div>
      </header>

      {/* 진행률 */}
      <div className="mb-4 card-pop bg-white p-3">
        <div className="mb-2 flex items-center justify-between font-black">
          <span>탐험 진행도</span>
          <span>
            {doneIds.length} / {CHAPTERS.length} 챕터
          </span>
        </div>
        <div className="h-5 w-full overflow-hidden rounded-full border-3 border-mulgomi-line bg-white">
          <div
            className="h-full bg-town transition-[width] duration-500"
            style={{ width: `${(doneIds.length / CHAPTERS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 인천 지도 */}
      <div className="relative mx-auto mb-5 w-full max-w-[620px] overflow-hidden rounded-2xl border-3 border-mulgomi-line shadow-pop">
        <IncheonMap doneIds={doneIds} onOpen={openChapter} />
      </div>

      {/* 챕터 카드 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((c) => {
          const p = progress[c.id];
          const done = p?.completed;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => openChapter(c.id)}
              className={`card-pop p-4 text-left transition-transform hover:-translate-y-0.5 ${
                done ? 'bg-town-light' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl" aria-hidden="true">
                  {c.emoji}
                </span>
                <div className="flex flex-wrap justify-end gap-1">
                  {sdgList(c.sdgs).map((s) => (
                    <SdgBadge key={s.no} sdg={s} />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-lg font-black leading-tight">
                Ch{c.no}. {c.title}
              </p>
              <p className="text-sm font-bold text-mulgomi-line/70">
                {c.subtitle} · {c.place}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug">{c.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {done ? (
                  <>
                    <span className="chip bg-ok text-white">✓ 완료</span>
                    {p.quizTotal ? (
                      <span className="chip">
                        퀴즈 {p.quizScore}/{p.quizTotal}
                      </span>
                    ) : null}
                    {(p.badges || []).map((b) => (
                      <span key={b} className="chip bg-mulgomi-ear">
                        {BADGES[b]?.emoji} {BADGES[b]?.label}
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="chip">⏱ {c.minutes}</span>
                )}
              </div>
            </button>
          );
        })}

        {/* 최종 통합 퀴즈 */}
        <button
          type="button"
          onClick={() => go('final')}
          disabled={!allDone}
          className={`card-pop p-4 text-left ${allDone ? 'bg-energy-light' : 'bg-white opacity-60'}`}
        >
          <span className="text-3xl" aria-hidden="true">
            🏆
          </span>
          <p className="mt-2 text-lg font-black leading-tight">최종 통합 퀴즈 & 인증서</p>
          <p className="mt-1 text-sm font-medium leading-snug">
            {allDone
              ? '5개 챕터를 모두 마쳤어요! 마지막 관문에 도전하고 인증서를 받으세요.'
              : `5개 챕터를 모두 완료하면 열려요. (${doneIds.length}/${CHAPTERS.length})`}
          </p>
        </button>
      </div>

      <p className="mt-6 text-center text-xs font-bold text-mulgomi-line/60">
        {CONFIG.organizer} · 마스코트 물곰이 · 진행 기록은 이 기기에만 저장됩니다
      </p>
    </div>
  );
}
