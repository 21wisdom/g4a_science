import React from 'react';
import Mascot from '../components/Mascot';
import { Panel } from '../components/UI';
import useGameStore from '../store/useGameStore';
import { CHAPTERS, BADGES, getChapter } from '../data/chapters';

/** 탐구 저널(기획서 8장) — 실험 기록·서술형 답변을 모아 자기 성장을 확인 */
export default function JournalScreen() {
  const profile = useGameStore((s) => s.current());
  const backToHub = useGameStore((s) => s.backToHub);

  const journal = profile?.journal || [];
  const progress = profile?.progress || {};
  const badges = Object.values(progress).flatMap((p) => p.badges || []);

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-20 pt-4 sm:px-5">
      <header className="mb-4 flex items-center gap-3">
        <button type="button" className="btn-soft !px-3" onClick={backToHub}>
          ← 지도로
        </button>
        <h1 className="text-xl font-black sm:text-2xl">📔 {profile?.displayName}의 탐구 저널</h1>
      </header>

      <Panel title="🏅 모은 배지" tone="energy">
        {badges.length === 0 ? (
          <p className="font-bold">아직 배지가 없어요. 챕터를 완료하면 배지를 받을 수 있어요.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <span key={`${b}-${i}`} className="chip bg-white text-base">
                <span aria-hidden="true">{BADGES[b]?.emoji}</span> {BADGES[b]?.label}
              </span>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="📊 챕터별 기록" className="mt-4">
        <div className="grid gap-2">
          {CHAPTERS.map((c) => {
            const p = progress[c.id];
            const trials = Object.values(p?.experimentTrials || {}).reduce((a, b) => a + b, 0);
            return (
              <div key={c.id} className="card-pop flex flex-wrap items-center gap-2 bg-white p-3">
                <span className="text-2xl" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="flex-1 font-black">
                  Ch{c.no}. {c.title}
                </span>
                {p?.completed ? (
                  <>
                    <span className="chip bg-ok text-white">완료</span>
                    <span className="chip">
                      퀴즈 {p.quizScore}/{p.quizTotal}
                    </span>
                    <span className="chip">실험 {trials}회 시도</span>
                    <span className="chip">
                      자가진단 {(p.selfCheck || []).length}개 체크
                    </span>
                  </>
                ) : (
                  <span className="chip">아직 안 했어요</span>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="✍️ 내가 남긴 생각" className="mt-4">
        {journal.length === 0 ? (
          <div className="flex items-center gap-3">
            <Mascot mood="think" size="sm" />
            <p className="font-bold">
              아직 저장된 답변이 없어요. 챕터의 "생각해봅시다"에서 내 생각을 저장해 보세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {journal
              .slice()
              .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)))
              .map((j, i) => (
                <div key={`${j.chapterId}-${j.key}-${i}`} className="card-pop bg-white p-3">
                  <p className="text-sm font-black text-mulgomi-line/70">
                    {getChapter(j.chapterId)?.title || j.chapterId} ·{' '}
                    {new Date(j.savedAt).toLocaleDateString('ko-KR')}
                  </p>
                  <p className="mt-1 font-black">{j.question}</p>
                  <p className="mt-1 font-medium leading-relaxed">{j.answer}</p>
                </div>
              ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
