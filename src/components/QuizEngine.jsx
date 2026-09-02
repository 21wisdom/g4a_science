import React, { useMemo, useState } from 'react';
import TTSButton from './TTSButton';
import { Panel, Verdict } from './UI';
import Mascot from './Mascot';
import sfx from '../lib/sound';
import useGameStore from '../store/useGameStore';

/**
 * 공통 퀴즈 엔진(기획서 7.1)
 * - 문항 타입: multiple_choice / ox / numeric_input / multi_select
 * - 정답 공개 전 "왜 그런지 확인해보기" 힌트 1회 제공
 * - 오답 시 감점 대신 재도전(정서적 안전감). 점수는 "한 번에 맞힌 문항 수"로 집계한다.
 */
export default function QuizEngine({ questions, onComplete, title = '판단 퀴즈' }) {
  const soundOn = useGameStore((s) => s.soundOn);
  const [idx, setIdx] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [multi, setMulti] = useState([]);
  const [numText, setNumText] = useState('');
  const [result, setResult] = useState(null); // null | true | false

  const q = questions[idx];
  const total = questions.length;

  const readAloud = useMemo(() => {
    if (!q) return '';
    const opts =
      q.type === 'ox'
        ? ' 맞으면 O, 틀리면 X를 고르세요.'
        : Array.isArray(q.options)
          ? ' 보기. ' + q.options.map((o, i) => `${i + 1}번, ${o}.`).join(' ')
          : '';
    return q.prompt + opts;
  }, [q]);

  if (!q) return null;

  const reset = () => {
    setSelected(null);
    setMulti([]);
    setNumText('');
    setResult(null);
    setHintUsed(false);
    setAttempts(0);
  };

  const isAnswered = result === true;

  const check = () => {
    let ok = false;
    if (q.type === 'multiple_choice') ok = selected === q.answer;
    else if (q.type === 'ox') ok = selected === q.answer;
    else if (q.type === 'multi_select') {
      const a = [...q.answer].sort().join(',');
      const b = [...multi].sort().join(',');
      ok = a === b && multi.length > 0;
    } else if (q.type === 'numeric_input') {
      const v = parseFloat(String(numText).replace(/[^0-9.\-]/g, ''));
      ok = Number.isFinite(v) && Math.abs(v - q.answer) <= (q.tolerance ?? 0.5);
    }

    if (ok && attempts === 0) setFirstTryCorrect((c) => c + 1);
    if (!ok) setAttempts((a) => a + 1);
    setResult(ok);
    if (soundOn) (ok ? sfx.correct : sfx.wrong)();
  };

  const next = () => {
    if (idx + 1 >= total) {
      onComplete({ score: firstTryCorrect, total });
      return;
    }
    setIdx(idx + 1);
    reset();
  };

  const canSubmit =
    q.type === 'multi_select'
      ? multi.length > 0
      : q.type === 'numeric_input'
        ? numText.trim() !== ''
        : selected !== null;

  return (
    <Panel
      title={`${title} (${idx + 1}/${total})`}
      right={<TTSButton text={readAloud} />}
      tone="white"
    >
      <div className="mb-4 h-3 w-full overflow-hidden rounded-full border-2 border-mulgomi-line bg-white">
        <div
          className="h-full bg-sea transition-[width] duration-300"
          style={{ width: `${((idx + (isAnswered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <p className="text-lg font-black leading-snug sm:text-xl">{q.prompt}</p>
      {q.formulaHint && (
        <p className="mt-2 inline-block rounded-lg bg-data-light px-3 py-1.5 font-bold">
          {q.formulaHint}
        </p>
      )}

      {/* ── 보기 ───────────────────────────────────────────── */}
      <div className="mt-4 grid gap-2.5">
        {q.type === 'multiple_choice' &&
          q.options.map((opt, i) => (
            <Choice
              key={i}
              active={selected === i}
              locked={isAnswered}
              onClick={() => !isAnswered && setSelected(i)}
              marker={`${i + 1}`}
            >
              {opt}
            </Choice>
          ))}

        {q.type === 'ox' && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: true, label: '맞아요', mark: '⭕' },
              { v: false, label: '아니에요', mark: '❌' },
            ].map((o) => (
              <button
                key={String(o.v)}
                type="button"
                disabled={isAnswered}
                onClick={() => setSelected(o.v)}
                className={`btn h-24 flex-col text-lg ${
                  selected === o.v ? 'bg-mulgomi-ear' : 'bg-white'
                }`}
              >
                <span className="text-3xl" aria-hidden="true">
                  {o.mark}
                </span>
                {o.label}
              </button>
            ))}
          </div>
        )}

        {q.type === 'multi_select' && (
          <>
            <p className="text-sm font-bold text-mulgomi-line/70">여러 개를 고를 수 있어요.</p>
            {q.options.map((opt, i) => (
              <Choice
                key={i}
                active={multi.includes(i)}
                locked={isAnswered}
                onClick={() =>
                  !isAnswered &&
                  setMulti((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]))
                }
                marker={multi.includes(i) ? '✓' : '□'}
              >
                {opt}
              </Choice>
            ))}
          </>
        )}

        {q.type === 'numeric_input' && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              className="field max-w-[220px]"
              value={numText}
              disabled={isAnswered}
              onChange={(e) => setNumText(e.target.value)}
              placeholder="숫자를 입력하세요"
              aria-label="답 입력"
            />
            <span className="text-xl font-black">{q.unit}</span>
          </div>
        )}
      </div>

      {/* ── 힌트 / 채점 ─────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!isAnswered && (
          <button type="button" className="btn-primary" onClick={check} disabled={!canSubmit}>
            확인하기
          </button>
        )}
        {!hintUsed && !isAnswered && (
          <button type="button" className="btn-soft" onClick={() => setHintUsed(true)}>
            💡 왜 그런지 확인해보기
          </button>
        )}
        {isAnswered && (
          <button type="button" className="btn-accent" onClick={next}>
            {idx + 1 >= total ? '퀴즈 끝내기 →' : '다음 문제 →'}
          </button>
        )}
      </div>

      {hintUsed && !isAnswered && (
        <div className="card-pop mt-3 flex items-start gap-3 bg-energy-light p-3">
          <Mascot mood="think" size="xs" />
          <p className="flex-1 font-bold">{q.hint}</p>
        </div>
      )}

      {result !== null && (
        <Verdict correct={result}>
          {result ? (
            <p>{q.explain}</p>
          ) : (
            <p>괜찮아요. 힌트를 보고 다시 골라 보세요. 틀려도 점수가 깎이지 않아요.</p>
          )}
        </Verdict>
      )}

      {result === false && (
        <button type="button" className="btn-soft mt-3" onClick={() => setResult(null)}>
          🔁 다시 도전하기
        </button>
      )}
    </Panel>
  );
}

function Choice({ active, locked, onClick, marker, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border-3 border-mulgomi-line px-4 py-3 text-left font-bold shadow-popsm transition-transform active:translate-y-[3px] active:shadow-none disabled:opacity-70 ${
        active ? 'bg-mulgomi-ear' : 'bg-white'
      }`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-mulgomi-line bg-white text-sm">
        {marker}
      </span>
      <span className="flex-1">{children}</span>
    </button>
  );
}
