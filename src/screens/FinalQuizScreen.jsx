import React, { useMemo, useState } from 'react';
import QuizEngine from '../components/QuizEngine';
import Mascot from '../components/Mascot';
import { Panel } from '../components/UI';
import useGameStore from '../store/useGameStore';
import { FINAL_QUIZ } from '../data/quizzes';
import { SDGS } from '../data/sdgs';

/** 최종 통합 퀴즈(워크북 5-6 SDGs 연계표 기반) → 통과 시 인증서 화면으로 */
export default function FinalQuizScreen() {
  const gradeMode = useGameStore((s) => s.gradeMode());
  const go = useGameStore((s) => s.go);
  const backToHub = useGameStore((s) => s.backToHub);
  const saveFinalQuiz = useGameStore((s) => s.saveFinalQuiz);
  const awardBadge = useGameStore((s) => s.awardBadge);

  const [started, setStarted] = useState(false);
  const questions = useMemo(() => FINAL_QUIZ[gradeMode] || FINAL_QUIZ.low, [gradeMode]);

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-20 pt-4 sm:px-5">
      <header className="mb-4 flex items-center gap-3">
        <button type="button" className="btn-soft !px-3" onClick={backToHub}>
          ← 지도로
        </button>
        <h1 className="text-xl font-black sm:text-2xl">🏆 최종 통합 퀴즈</h1>
      </header>

      {!started ? (
        <Panel tone="energy">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <Mascot mood="happy" size="xl" />
            <h2 className="text-2xl font-black">5개 챕터를 모두 마쳤어요!</h2>
            <p className="max-w-xl font-bold leading-relaxed">
              마지막으로 지금까지 배운 내용을 모아 확인해 봅시다. 갯벌·바다·데이터·에너지·시민과학이
              각각 어떤 SDGs 목표와 연결되는지 떠올려 보세요.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[4, 7, 9, 11, 12, 13, 14, 17].map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-1 rounded-lg border-2 border-mulgomi-line px-2 py-1 text-sm font-black text-white"
                  style={{ background: SDGS[n].color }}
                >
                  <span aria-hidden="true">{SDGS[n].emoji}</span> {n}
                </span>
              ))}
            </div>
            <button type="button" className="btn-primary !py-4 text-lg" onClick={() => setStarted(true)}>
              도전하기 ({questions.length}문항)
            </button>
          </div>
        </Panel>
      ) : (
        <QuizEngine
          title="최종 통합 퀴즈"
          questions={questions}
          onComplete={({ score, total }) => {
            saveFinalQuiz({ score, total });
            awardBadge('final', 'sdgs_master');
            go('certificate');
          }}
        />
      )}
    </div>
  );
}
