import React, { useEffect, useMemo, useState } from 'react';
import { Panel, StepDots, SdgBadge } from './UI';
import Mascot, { MascotSpeech } from './Mascot';
import TTSButton from './TTSButton';
import QuizEngine from './QuizEngine';
import DiscussionPanel from './DiscussionPanel';
import useGameStore from '../store/useGameStore';
import { getQuiz } from '../data/quizzes';
import { DISCUSSIONS, SELF_CHECKS } from '../data/discussions';
import { BADGES, CHAPTER_MAIN_BADGE } from '../data/chapters';
import { sdgList } from '../data/sdgs';
import { chapterImage } from '../lib/illustrations';
import sfx from '../lib/sound';

const STEPS = [
  { key: 'story', label: '이야기', emoji: '📖' },
  { key: 'brief', label: '개념', emoji: '💡' },
  { key: 'lab', label: '실험', emoji: '🧪' },
  { key: 'quiz', label: '퀴즈', emoji: '❓' },
  { key: 'wrap', label: '정리', emoji: '🏅' },
];

/**
 * 챕터 공통 흐름(기획서 5.3)
 * 스토리 인트로 → 개념 브리핑 → 실험 시뮬레이션 → 판단 퀴즈 → 토론·정리
 * 모든 챕터가 이 레이아웃을 공유하고 내용만 주입한다.
 */
export default function ChapterLayout({ chapter, story, briefing, experiments = [] }) {
  const isLow = useGameStore((s) => s.isLow());
  const gradeMode = useGameStore((s) => s.gradeMode());
  const backToHub = useGameStore((s) => s.backToHub);
  const completeChapter = useGameStore((s) => s.completeChapter);
  const awardBadge = useGameStore((s) => s.awardBadge);
  const progress = useGameStore((s) => s.getChapterProgress(chapter.id));
  const soundOn = useGameStore((s) => s.soundOn);

  const [step, setStep] = useState(0);
  const [labIdx, setLabIdx] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [checks, setChecks] = useState([]);
  const [done, setDone] = useState(false);

  const questions = useMemo(() => getQuiz(chapter.id, gradeMode), [chapter.id, gradeMode]);
  const discussion = DISCUSSIONS[chapter.id];
  const selfChecks = SELF_CHECKS[chapter.id] || [];
  const earnedBadges = progress?.badges || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, labIdx]);

  const finish = () => {
    completeChapter(chapter.id, {
      quizScore: quizResult?.score ?? 0,
      quizTotal: quizResult?.total ?? questions.length,
      selfCheck: checks,
    });
    const main = CHAPTER_MAIN_BADGE[chapter.id];
    if (main) awardBadge(chapter.id, main);
    if (soundOn) sfx.reward();
    setDone(true);
  };

  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-24 pt-4 sm:px-5">
      {/* 헤더 */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" className="btn-soft !px-3" onClick={backToHub}>
            ← 지도로
          </button>
          <div>
            <h1 className="text-xl font-black leading-tight sm:text-2xl">
              <span aria-hidden="true">{chapter.emoji}</span> Chapter {chapter.no}. {chapter.title}
            </h1>
            <p className="text-sm font-bold text-mulgomi-line/70">
              {chapter.subtitle} · {chapter.place}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {sdgList(chapter.sdgs).map((s) => (
            <SdgBadge key={s.no} sdg={s} />
          ))}
          <span className="chip">{isLow ? '3~4학년' : '5~6학년'}</span>
        </div>
      </header>

      <div className="mb-4">
        <StepDots steps={STEPS} current={step} />
      </div>

      {/* ── 1단계: 스토리 인트로 ────────────────────────────── */}
      {step === 0 && <StoryIntro story={story} chapter={chapter} onNext={goNext} />}

      {/* ── 2단계: 개념 브리핑 ─────────────────────────────── */}
      {step === 1 && (
        <div className="grid gap-4">
          {briefing}
          <NextBar onNext={goNext} label="실험하러 가기 →" />
        </div>
      )}

      {/* ── 3단계: 실험 시뮬레이션 ─────────────────────────── */}
      {step === 2 && (
        <div className="grid gap-4">
          {experiments.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {experiments.map((e, i) => (
                <button
                  key={e.key}
                  type="button"
                  onClick={() => setLabIdx(i)}
                  className={`btn ${labIdx === i ? 'bg-mulgomi-ear' : 'bg-white'}`}
                >
                  <span aria-hidden="true">{e.emoji}</span> 실험 {i + 1}. {e.label}
                </button>
              ))}
            </div>
          )}
          {experiments[labIdx]?.element}
          <NextBar
            onNext={
              labIdx < experiments.length - 1 ? () => setLabIdx(labIdx + 1) : goNext
            }
            label={labIdx < experiments.length - 1 ? '다음 실험으로 →' : '퀴즈 풀러 가기 →'}
          />
        </div>
      )}

      {/* ── 4단계: 판단 퀴즈 ───────────────────────────────── */}
      {step === 3 && (
        <QuizEngine
          questions={questions}
          onComplete={(r) => {
            setQuizResult(r);
            goNext();
          }}
        />
      )}

      {/* ── 5단계: 토론 + 정리 ─────────────────────────────── */}
      {step === 4 && (
        <div className="grid gap-4">
          {quizResult && (
            <Panel tone="sea">
              <div className="flex flex-wrap items-center gap-4">
                <Mascot mood="happy" size="sm" />
                <div className="flex-1">
                  <p className="text-lg font-black">
                    퀴즈 {quizResult.total}문제 중 {quizResult.score}문제를 한 번에 맞혔어요!
                  </p>
                  <p className="text-sm font-bold">
                    틀린 문제도 다시 풀어서 모두 해결했어요. 다시 도전한 것도 훌륭한 탐구예요.
                  </p>
                </div>
              </div>
            </Panel>
          )}

          <DiscussionPanel chapterId={chapter.id} config={discussion} />

          <Panel title="자가진단 체크리스트">
            <p className="mb-3 text-sm font-bold text-mulgomi-line/70">
              스스로 확인해 보세요. 체크하지 않아도 다음으로 넘어갈 수 있어요.
            </p>
            <div className="grid gap-2">
              {selfChecks.map((item, i) => (
                <label
                  key={i}
                  className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border-3 border-mulgomi-line px-4 py-2 font-bold ${
                    checks.includes(i) ? 'bg-town-light' : 'bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-6 w-6 accent-[#34A853]"
                    checked={checks.includes(i)}
                    onChange={() =>
                      setChecks((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))
                    }
                  />
                  <span className="flex-1">{item}</span>
                </label>
              ))}
            </div>
          </Panel>

          {!done ? (
            <button type="button" className="btn-primary w-full !py-4 text-lg" onClick={finish}>
              🏅 챕터 완료하고 배지 받기
            </button>
          ) : (
            <Panel tone="energy">
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <Mascot mood="happy" size="lg" />
                <h2 className="text-2xl font-black">챕터 완료!</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {earnedBadges.map((b) => (
                    <span key={b} className="chip bg-mulgomi-ear text-base">
                      <span aria-hidden="true">{BADGES[b]?.emoji}</span> {BADGES[b]?.label}
                    </span>
                  ))}
                </div>
                <p className="font-bold">인천 지도에 {chapter.place}가 되살아났어요!</p>
                <button type="button" className="btn-primary !py-3" onClick={backToHub}>
                  인천 지도로 돌아가기 →
                </button>
              </div>
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}

function StoryIntro({ story, chapter, onNext }) {
  const [i, setI] = useState(0);
  const lines = story?.lines || [];
  const last = i >= lines.length - 1;
  // 챕터 대표 삽화가 준비돼 있으면 배너로 보여준다(없으면 생략)
  const hero = chapterImage(chapter.id);

  return (
    <div className="grid gap-4">
      {hero && (
        <figure className="overflow-hidden rounded-2xl border-3 border-mulgomi-line shadow-pop">
          <img
            src={hero}
            alt={`${chapter.title} — ${chapter.place}`}
            className="aspect-[5/2] w-full object-cover"
            draggable="false"
          />
          <figcaption className="border-t-3 border-mulgomi-line bg-white px-3 py-1.5 text-sm font-bold">
            {chapter.place}
          </figcaption>
        </figure>
      )}
      <Panel tone="sea" right={<TTSButton text={lines[i]} />}>
        <MascotSpeech mood={i % 2 === 0 ? 'idle' : 'talk'} size="lg">
          <p className="text-lg font-bold leading-relaxed sm:text-xl">{lines[i]}</p>
          <p className="mt-3 text-sm font-bold text-mulgomi-line/60">
            {i + 1} / {lines.length}
          </p>
        </MascotSpeech>
      </Panel>
      <div className="flex justify-end gap-2">
        {i > 0 && (
          <button type="button" className="btn-soft" onClick={() => setI(i - 1)}>
            ← 이전
          </button>
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={() => (last ? onNext() : setI(i + 1))}
        >
          {last ? '개념 알아보기 →' : '다음 →'}
        </button>
      </div>
    </div>
  );
}

function NextBar({ onNext, label }) {
  return (
    <div className="flex justify-end">
      <button type="button" className="btn-primary !py-3 text-lg" onClick={onNext}>
        {label}
      </button>
    </div>
  );
}
