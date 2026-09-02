import React, { useState } from 'react';
import { Panel } from './UI';
import TTSButton from './TTSButton';
import Mascot from './Mascot';
import useGameStore from '../store/useGameStore';

/**
 * 토론형 선택지(기획서 5.3 5단계 / 6장).
 * 워크북의 "생각해봅시다" 질문을 찬반 카드 또는 입장 슬라이더로 변환한다.
 * 정답 채점은 하지 않으며, 답변은 탐구 저널에 저장돼 자기 성찰 자료로 쓰인다.
 */
export default function DiscussionPanel({ chapterId, config, onSaved }) {
  const isLow = useGameStore((s) => s.isLow());
  const addJournal = useGameStore((s) => s.addJournal);

  const [choice, setChoice] = useState(null);
  const [slider, setSlider] = useState(50);
  const [emoji, setEmoji] = useState(null);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  if (!config) return null;
  const isSlider = config.mode === 'slider';
  const canSave = isSlider ? true : choice !== null;

  const save = () => {
    const answerParts = [];
    if (isSlider) {
      const label =
        slider < 40 ? config.leftLabel : slider > 60 ? config.rightLabel : '두 가지 모두 중요';
      answerParts.push(`내 입장: ${label} (${slider}/100)`);
    } else {
      const card = config.cards.find((c) => c.id === choice);
      answerParts.push(`내 선택: ${card?.label}`);
    }
    if (isLow && emoji) answerParts.push(`내 마음: ${emoji}`);
    if (!isLow && text.trim()) answerParts.push(`이유: ${text.trim()}`);

    addJournal({
      chapterId,
      key: config.key,
      question: config.question,
      answer: answerParts.join(' / '),
    });
    setSaved(true);
    onSaved?.();
  };

  return (
    <Panel
      title="생각해봅시다"
      right={<TTSButton text={`${config.question} ${config.context}`} />}
      tone="white"
    >
      <p className="text-lg font-black leading-snug">{config.question}</p>
      <p className="mt-2 rounded-xl bg-sea-light p-3 text-sm font-bold leading-relaxed">
        {config.context}
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm font-bold text-mulgomi-line/70">
        <span aria-hidden="true">💬</span> 정해진 정답은 없어요. 내 생각과 이유가 중요해요.
      </p>

      {isSlider ? (
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-sm font-black">
            <span>← {config.leftLabel}</span>
            <span>{config.rightLabel} →</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            aria-label="내 입장 위치"
            disabled={saved}
          />
          <p className="mt-2 text-center text-lg font-black">
            {slider < 40 ? config.leftLabel : slider > 60 ? config.rightLabel : '두 가지 모두 중요해요'}
            <span className="ml-2 text-sm">({slider}/100)</span>
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {config.cards.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={saved}
              onClick={() => setChoice(c.id)}
              className={`btn h-auto flex-col items-start p-4 text-left ${
                choice === c.id ? 'bg-mulgomi-ear' : 'bg-white'
              }`}
            >
              <span className="text-3xl" aria-hidden="true">
                {c.emoji}
              </span>
              <span className="mt-1 text-base font-black">{c.label}</span>
              <span className="text-sm font-medium leading-snug">{c.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* 저학년: 이모지로 마음 표현 / 고학년: 1~2문장 서술 */}
      <div className="mt-4">
        <p className="mb-2 font-bold">{isLow ? config.lowPrompt : config.highPrompt}</p>
        {isLow ? (
          <div className="flex flex-wrap gap-2">
            {(config.emojis || ['😃', '🤔', '😥']).map((e) => (
              <button
                key={e}
                type="button"
                disabled={saved}
                onClick={() => setEmoji(e)}
                className={`btn h-14 w-14 text-2xl ${emoji === e ? 'bg-mulgomi-ear' : 'bg-white'}`}
                aria-label={`이모지 ${e} 선택`}
              >
                <span aria-hidden="true">{e}</span>
              </button>
            ))}
          </div>
        ) : (
          <textarea
            className="field min-h-[92px] resize-y text-base font-medium"
            value={text}
            disabled={saved}
            maxLength={200}
            onChange={(e) => setText(e.target.value)}
            placeholder="예) 갯벌은 한 번 사라지면 되돌리기 어렵기 때문에…"
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!saved ? (
          <button type="button" className="btn-primary" onClick={save} disabled={!canSave}>
            내 생각 저장하기
          </button>
        ) : (
          <div className="flex items-center gap-2 font-black text-ok">
            <Mascot mood="happy" size="xs" />내 생각을 탐구 저널에 저장했어요!
          </div>
        )}
      </div>
    </Panel>
  );
}
