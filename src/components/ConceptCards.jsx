import React, { useState } from 'react';
import { Panel } from './UI';
import TTSButton from './TTSButton';
import Mascot from './Mascot';

/**
 * 개념 브리핑용 인터랙티브 카드(기획서 5.3 2단계).
 * 텍스트와 시각 요소를 가까이 배치하고 장식 요소를 줄여 인지 부하를 낮춘다
 * (Mayer의 멀티미디어 학습 원칙, 기획서 3장).
 */
export default function ConceptCards({ title = '개념 브리핑', cards = [], tone = 'white', facts = [] }) {
  const [open, setOpen] = useState(0);

  return (
    <Panel title={title} tone={tone}>
      {/* 개념 설명 구간에서는 선생님 포즈 물곰이가 안내한다 */}
      <div className="mb-3 flex items-center gap-3">
        <Mascot mood="teach" size="sm" />
        <p className="flex-1 font-bold leading-snug">
          카드를 눌러 하나씩 확인해 보세요. 🔊 버튼을 누르면 읽어줍니다.
        </p>
      </div>

      <div className="grid gap-2.5">
        {cards.map((c, i) => {
          const isOpen = open === i;
          return (
            <div key={c.title} className="card-pop overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-3xl" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="flex-1 text-lg font-black">{c.title}</span>
                <span className="text-xl" aria-hidden="true">
                  {isOpen ? '▲' : '▼'}
                </span>
              </button>
              {isOpen && (
                <div className="animate-popin border-t-3 border-mulgomi-line bg-[#F7FBFF] px-4 py-3">
                  <div className="mb-2 flex justify-end">
                    <TTSButton text={c.body} />
                  </div>
                  <p className="font-bold leading-relaxed">{c.body}</p>
                  {c.highlight && (
                    <p className="mt-3 rounded-xl border-2 border-mulgomi-line bg-mulgomi-ear px-3 py-2 font-black">
                      {c.highlight}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {facts.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="card-pop bg-white p-3 text-center">
              <p className="text-2xl" aria-hidden="true">
                {f.emoji}
              </p>
              <p className="text-2xl font-black tabular-nums">{f.value}</p>
              <p className="text-sm font-bold leading-tight">{f.label}</p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
