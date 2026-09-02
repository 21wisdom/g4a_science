import React, { useMemo, useState } from 'react';
import { Panel, Verdict } from '../../components/UI';
import TTSButton from '../../components/TTSButton';
import Mascot from '../../components/Mascot';
import useGameStore from '../../store/useGameStore';
import { OCEAN_SPACE_TYPES } from '../../data/datasets';
import { CH2_CARDS, EVIDENCE_TAGS } from '../../data/ch2Cards';
import sfx from '../../lib/sound';

/**
 * 미니게임 — 해양공간 판별 카드 소팅 (워크북 2-3)
 * 저학년: 4장, 유형 설명 1줄 / 고학년: 10장, 근거 태그 복수 선택 + 짧은 서술
 * 두 유형이 공존 가능한 카드는 두 답 모두 정답 처리(워크북 "하나의 정답이 아니어도 됨" 반영)
 */
export default function SpaceSorting({ chapterId }) {
  const isLow = useGameStore((s) => s.isLow());
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const awardBadge = useGameStore((s) => s.awardBadge);
  const addJournal = useGameStore((s) => s.addJournal);
  const soundOn = useGameStore((s) => s.soundOn);

  const cards = useMemo(() => (isLow ? CH2_CARDS.filter((c) => c.lowTier) : CH2_CARDS), [isLow]);

  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [result, setResult] = useState(null);
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [savedTags, setSavedTags] = useState(false);

  const card = cards[idx];
  const finished = idx >= cards.length;

  if (finished) {
    return (
      <Panel tone="sea">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Mascot mood="happy" size="lg" />
          <h2 className="text-2xl font-black">판별 완료!</h2>
          <p className="text-lg font-bold">
            카드 {cards.length}장 중 <b>{correctCount}장</b>을 한 번에 맞혔어요.
          </p>
          <p className="max-w-lg font-bold">
            중요한 건 정답을 맞히는 것보다 <b>“왜 그렇게 판단했는지”</b> 근거를 대는 일이에요. 여러분이
            고른 근거는 탐구 저널에 저장했어요.
          </p>
          <button
            type="button"
            className="btn-soft"
            onClick={() => {
              setIdx(0);
              setCorrectCount(0);
              setPick(null);
              setResult(null);
            }}
          >
            🔁 다시 도전하기
          </button>
        </div>
      </Panel>
    );
  }

  const check = () => {
    const ok = card.answers.includes(pick);
    setResult(ok);
    logTrial(chapterId, 'space_sorting');
    if (ok) setCorrectCount((c) => c + 1);
    if (soundOn) (ok ? sfx.correct : sfx.wrong)();
  };

  const next = () => {
    if (!isLow && (tags.length > 0 || note.trim())) {
      addJournal({
        chapterId,
        key: `ch2_evidence_${card.id}`,
        question: `${card.title} — 왜 그렇게 판단했나요?`,
        answer: [
          tags.map((t) => EVIDENCE_TAGS.find((x) => x.id === t)?.label).filter(Boolean).join(', '),
          note.trim(),
        ]
          .filter(Boolean)
          .join(' / '),
      });
    }
    if (tags.length >= 2) awardBadge(chapterId, 'evidence_master');
    setIdx(idx + 1);
    setPick(null);
    setResult(null);
    setTags([]);
    setNote('');
    setSavedTags(false);
  };

  return (
    <div className="grid gap-4">
      <Panel
        title={`🧭 카드 ${idx + 1} / ${cards.length}`}
        tone="sea"
        right={<TTSButton text={`${card.title}. ${card.clue}`} />}
      >
        <SceneCard card={card} />
        <p className="mt-3 text-lg font-black">{card.title}</p>
        <p className="font-bold">{card.clue}</p>
      </Panel>

      <Panel title="이 장면은 어떤 해양공간일까요?">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {OCEAN_SPACE_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={result === true}
              onClick={() => setPick(t.id)}
              className={`btn h-auto flex-col items-start p-3 text-left ${
                pick === t.id ? 'bg-mulgomi-ear' : 'bg-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  {t.emoji}
                </span>
                <span className="font-black">{t.name}</span>
              </span>
              <span className="text-sm font-medium leading-snug">
                {isLow ? t.short : t.detail}
              </span>
            </button>
          ))}
        </div>

        {result !== true && (
          <button type="button" className="btn-primary mt-4" onClick={check} disabled={!pick}>
            판별하기
          </button>
        )}

        {result !== null && (
          <Verdict correct={result}>
            {result ? (
              <p>
                맞아요!{' '}
                {card.answers.length > 1 && (
                  <>
                    이 장면은{' '}
                    <b>
                      {card.answers
                        .map((a) => OCEAN_SPACE_TYPES.find((t) => t.id === a)?.name)
                        .join('와 ')}
                    </b>{' '}
                    두 가지로 볼 수 있어요. 두 답 모두 정답이에요.
                  </>
                )}
              </p>
            ) : (
              <p>단서를 다시 읽어 보세요. 흙, 물, 생물, 사람의 흔적 중 어떤 것이 보이나요?</p>
            )}
          </Verdict>
        )}

        {result === false && (
          <button type="button" className="btn-soft mt-3" onClick={() => setResult(null)}>
            🔁 다시 고르기
          </button>
        )}
      </Panel>

      {result === true && (
        <Panel title="왜 그렇게 판단했나요?">
          <p className="mb-3 font-bold">
            {isLow ? '가장 큰 힌트가 된 것을 하나 골라 보세요.' : '근거를 모두 고르고, 한 문장으로 정리해 보세요.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {EVIDENCE_TAGS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  setTags((prev) =>
                    isLow
                      ? [t.id]
                      : prev.includes(t.id)
                        ? prev.filter((x) => x !== t.id)
                        : [...prev, t.id],
                  )
                }
                className={`btn ${tags.includes(t.id) ? 'bg-mulgomi-ear' : 'bg-white'}`}
              >
                <span aria-hidden="true">{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>

          {tags.length > 0 && (
            <p className="mt-3 rounded-xl bg-town-light p-3 font-bold">
              좋아요! 이 장면의 대표적인 근거는{' '}
              <b>{card.evidence.map((e) => EVIDENCE_TAGS.find((x) => x.id === e)?.label).join(', ')}</b>
              예요. 여러분이 고른 근거도 타당하다면 훌륭한 판단이에요.
            </p>
          )}

          {!isLow && (
            <textarea
              className="field mt-3 min-h-[80px] resize-y text-base font-medium"
              maxLength={150}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setSavedTags(false);
              }}
              placeholder="예) 흙이 곱고 게구멍이 보여서 갯벌이라고 판단했다."
            />
          )}

          <button type="button" className="btn-primary mt-4" onClick={next}>
            {idx + 1 >= cards.length ? '판별 끝내기 →' : '다음 카드 →'}
          </button>
          {savedTags && <span className="ml-2 font-bold text-ok">저장했어요</span>}
        </Panel>
      )}
    </div>
  );
}

/** 사진 대신 사용하는 SVG 장면 카드(저작권 확인이 필요한 원본 사진을 쓰지 않기 위함) */
function SceneCard({ card }) {
  const { sky, water, ground, items } = card.visual;
  return (
    <div
      className="relative h-44 w-full overflow-hidden rounded-xl border-3 border-mulgomi-line sm:h-56"
      role="img"
      aria-label={card.title}
    >
      <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: sky }} />
      <div className="absolute inset-x-0 top-[42%] h-[30%]" style={{ background: water }} />
      <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: ground }} />
      <svg viewBox="0 0 100 20" className="absolute inset-x-0 top-[40%] h-6 w-full" preserveAspectRatio="none">
        <path d="M0 12 Q 10 4 20 12 T 40 12 T 60 12 T 80 12 T 100 12 V20 H0Z" fill={water} opacity="0.85" />
      </svg>
      <div className="absolute inset-x-0 bottom-2 flex items-end justify-center gap-6 text-4xl sm:text-5xl">
        {items.map((it, i) => (
          <span key={i} aria-hidden="true" style={{ transform: `translateY(${i % 2 ? -8 : 0}px)` }}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
