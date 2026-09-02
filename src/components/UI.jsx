import React from 'react';

export function Panel({ title, right, children, className = '', tone = 'white' }) {
  const tones = {
    white: 'bg-white',
    sea: 'bg-sea-light',
    tidal: 'bg-tidal-light',
    data: 'bg-data-light',
    energy: 'bg-energy-light',
    town: 'bg-town-light',
  };
  return (
    <section className={`card-pop ${tones[tone] || tones.white} p-4 sm:p-5 ${className}`}>
      {(title || right) && (
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-lg font-black sm:text-xl">{title}</h2>}
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

/** 챕터 5단계 진행 표시(기획서 5.3) */
export function StepDots({ steps, current }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="챕터 진행 단계">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'now' : 'todo';
        return (
          <li key={s.key} className="flex items-center gap-1.5">
            <span
              className={[
                'flex h-8 items-center gap-1 rounded-full border-2 border-mulgomi-line px-2.5 text-xs font-bold',
                state === 'done' && 'bg-ok text-white',
                state === 'now' && 'bg-mulgomi-ear',
                state === 'todo' && 'bg-white/70 opacity-70',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={state === 'now' ? 'step' : undefined}
            >
              <span aria-hidden="true">{state === 'done' ? '✓' : s.emoji}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Gauge({ value, max = 100, label, unit = '', color = '#2E86C1' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-bold">{label}</span>
        <span className="text-xl font-black tabular-nums">
          {Number(value).toFixed(1)}
          <span className="ml-0.5 text-sm font-bold">{unit}</span>
        </span>
      </div>
      <div className="h-6 w-full overflow-hidden rounded-full border-3 border-mulgomi-line bg-white">
        <div
          className="h-full rounded-r-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}

/** 정답/오답 피드백 — 색상만이 아니라 아이콘으로도 구분(기획서 9장 색약 고려) */
export function Verdict({ correct, children }) {
  return (
    <div
      className={`card-pop mt-3 flex items-start gap-3 p-3 ${correct ? 'bg-[#E7F6EC]' : 'bg-[#FDECEA]'}`}
      role="status"
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        {correct ? '⭕' : '❌'}
      </span>
      <div className="flex-1">
        <p className="font-black">{correct ? '정답이에요!' : '다시 한 번 생각해 볼까요?'}</p>
        {children && <div className="mt-1 text-sm">{children}</div>}
      </div>
    </div>
  );
}

export function SdgBadge({ sdg }) {
  if (!sdg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg border-2 border-mulgomi-line px-2 py-0.5 text-xs font-bold text-white"
      style={{ background: sdg.color }}
      title={`SDG ${sdg.no}. ${sdg.title}`}
    >
      <span aria-hidden="true">{sdg.emoji}</span>
      {sdg.no}
    </span>
  );
}
