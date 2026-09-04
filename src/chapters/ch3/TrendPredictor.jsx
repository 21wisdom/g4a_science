import React, { useMemo, useRef, useState } from 'react';
import { Panel, Verdict } from '../../components/UI';
import TTSButton from '../../components/TTSButton';
import Mascot from '../../components/Mascot';
import useGameStore from '../../store/useGameStore';
import { POPULATION, POPULATION_ANCHORS, INCHEON, NATIONAL_PEAK_YEAR } from '../../data/datasets';
import sfx from '../../lib/sound';

/**
 * 미니게임 2 — 미래예측 시뮬레이터 (워크북 3-5 인구·해수면)
 * 청소년·성인 모드: 추세선을 직접 끌어 2030년 인구를 예측하고 실제 추세와 오차 비교
 * 어린이 모드: 늘어날지 줄어들지 방향만 예측
 * + 해수면 상승 비교(인천 4.0cm vs 지구 평균 3.6cm)
 */

// 최소제곱법으로 구한 실제 추세선 (워크북 제시 수치 기반)
function linearFit(points) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.year, 0);
  const sy = points.reduce((s, p) => s + p.value, 0);
  const sxy = points.reduce((s, p) => s + p.year * p.value, 0);
  const sxx = points.reduce((s, p) => s + p.year * p.year, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept, at: (x) => slope * x + intercept };
}

const FIT = linearFit(POPULATION);
const TRUE_2030 = FIT.at(2030);

export default function TrendPredictor({ chapterId }) {
  const isLow = useGameStore((s) => s.isLow());
  return (
    <div className="grid gap-4">
      {isLow ? <LowPredictor chapterId={chapterId} /> : <HighPredictor chapterId={chapterId} />}
      <SeaLevelCompare chapterId={chapterId} />
    </div>
  );
}

/* ── 공통 SVG 차트 ─────────────────────────────────────────────────── */
const W = 560;
const H = 300;
const PAD = { l: 52, r: 18, t: 18, b: 40 };
const X_MIN = 2016;
const X_MAX = 2030;
const Y_MIN = 292;
const Y_MAX = 310;

const sx = (year) => PAD.l + ((year - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.l - PAD.r);
const sy = (val) => H - PAD.b - ((val - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b);
const invY = (py) => Y_MIN + ((H - PAD.b - py) / (H - PAD.t - PAD.b)) * (Y_MAX - Y_MIN);

function ChartFrame({ children }) {
  const yTicks = [292, 296, 300, 304, 308];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-none select-none" role="img">
      <rect x="0" y="0" width={W} height={H} fill="#FFFFFF" />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={sy(t)} y2={sy(t)} stroke="#BAC5CA" strokeDasharray="4 4" />
          <text x={PAD.l - 8} y={sy(t) + 4} textAnchor="end" fontSize="12" fontWeight="700" fill="#453527">
            {t}
          </text>
        </g>
      ))}
      {POPULATION.filter((p) => p.year % 2 === 0).map((p) => (
        <text
          key={p.year}
          x={sx(p.year)}
          y={H - PAD.b + 18}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#453527"
        >
          {p.year}
        </text>
      ))}
      <text x={sx(2030)} y={H - PAD.b + 18} textAnchor="middle" fontSize="11" fontWeight="900" fill="#7D5BA6">
        2030
      </text>
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} stroke="#453527" strokeWidth="3" />
      <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="#453527" strokeWidth="3" />
      <text x={PAD.l - 40} y={PAD.t + 4} fontSize="11" fontWeight="700" fill="#453527">
        만 명
      </text>
      {/* 예측 구간 표시 */}
      <line
        x1={sx(POPULATION[POPULATION.length - 1].year)}
        x2={sx(POPULATION[POPULATION.length - 1].year)}
        y1={PAD.t}
        y2={H - PAD.b}
        stroke="#7D5BA6"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      {children}
      {POPULATION.map((p) => (
        <circle
          key={p.year}
          cx={sx(p.year)}
          cy={sy(p.value)}
          r={p.citedInWorkbook ? 8 : 5}
          fill={p.citedInWorkbook ? '#F4EC8E' : '#FFFFFF'}
          stroke="#453527"
          strokeWidth="3"
        />
      ))}
      <polyline
        points={POPULATION.map((p) => `${sx(p.year)},${sy(p.value)}`).join(' ')}
        fill="none"
        stroke="#453527"
        strokeWidth="3"
      />
    </svg>
  );
}

/* ── 청소년·성인 모드: 추세선 직접 그리기 ────────────────────────────────────── */
function HighPredictor({ chapterId }) {
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const awardBadge = useGameStore((s) => s.awardBadge);
  const soundOn = useGameStore((s) => s.soundOn);
  const svgWrap = useRef(null);

  const [left, setLeft] = useState(297); // 2019년 쪽 손잡이 값
  const [right, setRight] = useState(305); // 2030년 쪽 손잡이 값
  const [checked, setChecked] = useState(false);

  const myAt2030 = right;
  const error = Math.abs(myAt2030 - TRUE_2030);

  const drag = (which) => (e) => {
    e.preventDefault();
    const move = (ev) => {
      const rect = svgWrap.current?.getBoundingClientRect();
      if (!rect) return;
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const py = ((clientY - rect.top) / rect.height) * H;
      const v = Math.max(Y_MIN, Math.min(Y_MAX, invY(py)));
      which === 'l' ? setLeft(v) : setRight(v);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
      logTrial(chapterId, 'trend_predictor');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
  };

  return (
    <Panel
      title="📈 실험 2. 미래예측 시뮬레이터 — 2030년 인천 인구는?"
      tone="data"
      right={<TTSButton text="추세선의 양쪽 손잡이를 움직여 2030년 인천 인구를 예측해 보세요." />}
    >
      <p className="mb-3 font-bold leading-relaxed">
        {POPULATION[0].year}~{POPULATION[POPULATION.length - 1].year}년 인천의 실제 인구입니다
        (주민등록인구). 노란 점은 워크북에 나온 두 해예요. 보라색 선(추세선)을 끌어 2030년을
        예측해 보세요.
      </p>
      <p className="mb-3 rounded-xl bg-white p-3 text-sm font-bold">
        잘 보면 {NATIONAL_PEAK_YEAR + 1}년에 인구가 한 번 <b>줄었다가</b> 다시 늘어납니다. 실제
        데이터는 이렇게 오르내리기 때문에, 추세선은 그 흐름을 하나의 직선으로 요약한 것일 뿐이에요.
      </p>

      <div ref={svgWrap} className="card-pop bg-white p-2">
        <ChartFrame>
          {/* 내가 그은 추세선 */}
          <line
            x1={sx(X_MIN)}
            y1={sy(left)}
            x2={sx(X_MAX)}
            y2={sy(right)}
            stroke="#7D5BA6"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {checked && (
            <line
              x1={sx(X_MIN)}
              y1={sy(FIT.at(X_MIN))}
              x2={sx(X_MAX)}
              y2={sy(FIT.at(X_MAX))}
              stroke="#1F8A4C"
              strokeWidth="4"
              strokeDasharray="8 5"
              strokeLinecap="round"
            />
          )}
          {/* 드래그 손잡이 */}
          <circle
            cx={sx(X_MIN)}
            cy={sy(left)}
            r="14"
            fill="#F4EC8E"
            stroke="#453527"
            strokeWidth="4"
            style={{ cursor: 'ns-resize' }}
            onMouseDown={drag('l')}
            onTouchStart={drag('l')}
          />
          <circle
            cx={sx(X_MAX)}
            cy={sy(right)}
            r="14"
            fill="#F4EC8E"
            stroke="#453527"
            strokeWidth="4"
            style={{ cursor: 'ns-resize' }}
            onMouseDown={drag('r')}
            onTouchStart={drag('r')}
          />
          <text x={sx(X_MAX) - 10} y={sy(right) - 22} textAnchor="end" fontSize="14" fontWeight="900" fill="#7D5BA6">
            내 예측 {right.toFixed(1)}만
          </text>
        </ChartFrame>
      </div>

      {/* 터치가 어려운 환경을 위한 대체 입력 */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="font-bold">
          왼쪽 끝({X_MIN}년): <b className="tabular-nums">{left.toFixed(1)}</b>만 명
          <input type="range" min={Y_MIN} max={Y_MAX} step={0.1} value={left} onChange={(e) => setLeft(Number(e.target.value))} />
        </label>
        <label className="font-bold">
          오른쪽 끝({X_MAX}년): <b className="tabular-nums">{right.toFixed(1)}</b>만 명
          <input type="range" min={Y_MIN} max={Y_MAX} step={0.1} value={right} onChange={(e) => setRight(Number(e.target.value))} />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setChecked(true);
            logTrial(chapterId, 'trend_predictor');
            const close = Math.abs(right - TRUE_2030) <= 1.5;
            if (soundOn) (close ? sfx.correct : sfx.wrong)();
            if (close) awardBadge(chapterId, 'future_forecaster');
          }}
        >
          실제 추세와 비교하기
        </button>
        {checked && (
          <button type="button" className="btn-soft" onClick={() => setChecked(false)}>
            🔁 다시 예측하기
          </button>
        )}
      </div>

      {checked && (
        <Verdict correct={error <= 1.5}>
          <p>
            데이터의 추세선으로 계산한 2030년 값은 <b>약 {TRUE_2030.toFixed(1)}만 명</b>입니다. 내
            예측은 {myAt2030.toFixed(1)}만 명이므로 오차는 <b>{error.toFixed(1)}만 명</b>이에요.
          </p>
          <p className="mt-2">
            단, 이 값은 <b>“지금까지의 흐름이 그대로 이어진다면”</b>이라는 가정 위의 추정입니다.
            실제로 {NATIONAL_PEAK_YEAR + 1}년에는 인구가 줄기도 했어요. 정책이나 사회 변화가 생기면
            결과는 달라질 수 있습니다.
          </p>
        </Verdict>
      )}
    </Panel>
  );
}

/* ── 어린이 모드: 방향만 예측 ───────────────────────────────────────────── */
function LowPredictor({ chapterId }) {
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const soundOn = useGameStore((s) => s.soundOn);
  const [pick, setPick] = useState(null);
  const up = POPULATION_ANCHORS.end.value > POPULATION_ANCHORS.start.value;

  return (
    <Panel
      title="📈 실험 2. 인천 인구는 앞으로 어떻게 될까?"
      tone="data"
      right={<TTSButton text="인천의 인구가 앞으로 늘어날까요, 줄어들까요?" />}
    >
      <p className="mb-3 font-bold leading-relaxed">
        인천에 사는 사람 수를 해마다 세어 점으로 찍었어요. {POPULATION_ANCHORS.start.year}년에는 약{' '}
        {POPULATION_ANCHORS.start.value}만 명, {POPULATION_ANCHORS.end.year}년에는 약{' '}
        {POPULATION_ANCHORS.end.value}만 명이에요.
      </p>
      <div className="card-pop bg-white p-2">
        <ChartFrame>
          {pick !== null && (
            <line
              x1={sx(X_MIN)}
              y1={sy(FIT.at(X_MIN))}
              x2={sx(X_MAX)}
              y2={sy(FIT.at(X_MAX))}
              stroke="#1F8A4C"
              strokeWidth="4"
              strokeDasharray="8 5"
            />
          )}
        </ChartFrame>
      </div>

      <p className="mt-4 text-lg font-black">점들이 어느 쪽으로 가고 있나요?</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {[
          { id: 'up', label: '점점 늘어나요', emoji: '📈' },
          { id: 'down', label: '점점 줄어들어요', emoji: '📉' },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            className={`btn h-auto flex-col p-4 ${pick === o.id ? 'bg-mulgomi-ear' : 'bg-white'}`}
            onClick={() => {
              setPick(o.id);
              logTrial(chapterId, 'trend_predictor');
              if (soundOn) ((o.id === 'up') === up ? sfx.correct : sfx.wrong)();
            }}
          >
            <span className="text-3xl" aria-hidden="true">
              {o.emoji}
            </span>
            <span className="font-black">{o.label}</span>
          </button>
        ))}
      </div>
      {pick && (
        <Verdict correct={(pick === 'up') === up}>
          점들이 오른쪽 위로 올라가고 있어요. 중간에 한 번 줄어든 해도 있지만, 전체적으로는 늘어나는
          흐름이에요. 초록 점선처럼 이 흐름이 이어진다면 2030년에는 지금보다 더 많아질 거예요.
        </Verdict>
      )}
    </Panel>
  );
}

/* ── 해수면 상승 비교 ──────────────────────────────────────────────── */
function SeaLevelCompare({ chapterId }) {
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const soundOn = useGameStore((s) => s.soundOn);
  const [pick, setPick] = useState(null);
  const { incheon, globalAvg, unit } = INCHEON.seaLevelRise2050;
  const max = Math.max(incheon, globalAvg) * 1.25;

  const options = useMemo(
    () => [
      '해안 저지대와 매립지에 사람과 시설이 몰려 있기 때문',
      '인천에 높은 산이 많기 때문',
      '인천은 바다와 멀리 떨어져 있기 때문',
    ],
    [],
  );

  return (
    <Panel title="🌊 2050년 해수면 상승 예측 비교" tone="sea">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-pop bg-white p-4">
          {[
            { label: '인천', v: incheon, color: '#C0392B' },
            { label: '지구 평균', v: globalAvg, color: '#2E86C1' },
          ].map((b) => (
            <div key={b.label} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between font-black">
                <span>{b.label}</span>
                <span className="tabular-nums">
                  {b.v}
                  {unit}
                </span>
              </div>
              <div className="h-8 w-full overflow-hidden rounded-lg border-3 border-mulgomi-line bg-white">
                <div className="h-full" style={{ width: `${(b.v / max) * 100}%`, background: b.color }} />
              </div>
            </div>
          ))}
          <p className="mt-2 text-sm font-bold text-mulgomi-line/70">
            차이는 {(incheon - globalAvg).toFixed(1)}
            {unit}이지만, 해안 도시에서는 이 차이가 큰 피해로 이어질 수 있어요.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-lg font-black">왜 인천이 더 위험할까요?</p>
            <TTSButton text="왜 인천이 더 위험할까요?" />
          </div>
          <div className="grid gap-2">
            {options.map((o, i) => (
              <button
                key={o}
                type="button"
                className={`btn h-auto justify-start p-3 text-left ${pick === i ? 'bg-mulgomi-ear' : 'bg-white'}`}
                onClick={() => {
                  setPick(i);
                  logTrial(chapterId, 'sea_level');
                  if (soundOn) (i === 0 ? sfx.correct : sfx.wrong)();
                }}
              >
                {o}
              </button>
            ))}
          </div>
          {pick !== null && (
            <Verdict correct={pick === 0}>
              <div className="flex items-start gap-2">
                <Mascot mood={pick === 0 ? 'happy' : 'think'} size="xs" />
                <p>
                  인천은 해안 저지대와 매립지에 도시 기능이 집중돼 있어, 같은 상승폭이라도 피해가 더
                  클 수 있습니다.
                </p>
              </div>
            </Verdict>
          )}
        </div>
      </div>
    </Panel>
  );
}
