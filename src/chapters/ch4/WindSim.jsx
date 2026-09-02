import React, { useState } from 'react';
import ExperimentShell from '../../components/ExperimentShell';
import { Panel, Gauge, Verdict } from '../../components/UI';
import TTSButton from '../../components/TTSButton';
import useGameStore from '../../store/useGameStore';
import { FORMULAS, INCHEON } from '../../data/datasets';
import sfx from '../../lib/sound';

/**
 * 미니게임 1 — 풍력발전 시뮬레이터 (워크북 4-4)
 * 내부 계산은 실제 원리 그대로 발전량 ∝ 풍속³ 으로 구현한다.
 * 저학년: 약풍/중풍/강풍 3버튼 / 고학년: 0~20m/s 연속 슬라이더
 */
const V_MAX = 20;
const K = 100 / V_MAX ** 3; // 풍속 20m/s에서 100%가 되도록 정규화

// 날개 수에 따른 효율 계수: 3개가 안정성·효율의 균형점(워크북 4-4 결과해석)
const BLADE_FACTOR = { 2: 0.94, 3: 1.0, 4: 1.01 };

export const windPower = (v, blades = 3) => K * v ** 3 * (BLADE_FACTOR[blades] ?? 1);

const PRESETS = [
  { id: 'low', label: '약풍', v: 4, emoji: '🍃' },
  { id: 'mid', label: '중풍', v: 8, emoji: '💨' },
  { id: 'high', label: '강풍', v: 16, emoji: '🌪️' },
];

export default function WindSim({ chapterId }) {
  const isLow = useGameStore((s) => s.isLow());
  const [v, setV] = useState(isLow ? 4 : 6);
  const [blades, setBlades] = useState(3);

  const power = windPower(v, blades);
  const spinSec = v <= 0.2 ? 0 : Math.max(0.18, 3.2 / v);

  const controls = (
    <>
      <Panel title="1️⃣ 바람의 세기 정하기" tone="energy">
        {isLow ? (
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setV(p.v)}
                className={`btn h-auto flex-col p-3 ${v === p.v ? 'bg-mulgomi-ear' : 'bg-white'}`}
              >
                <span className="text-3xl" aria-hidden="true">
                  {p.emoji}
                </span>
                <span className="font-black">{p.label}</span>
                <span className="text-sm">{p.v}m/s</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <label className="font-bold" htmlFor="wind-range">
              풍속: <b className="text-xl tabular-nums">{v.toFixed(1)}</b> m/s
            </label>
            <input
              id="wind-range"
              type="range"
              min={0}
              max={V_MAX}
              step={0.5}
              value={v}
              onChange={(e) => setV(Number(e.target.value))}
              className="mt-2"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {[2, 4, 8, 12, 16].map((p) => (
                <button key={p} type="button" className="btn-soft !px-3 !py-1 text-sm" onClick={() => setV(p)}>
                  {p}m/s
                </button>
              ))}
            </div>
          </>
        )}
      </Panel>

      <Panel title="2️⃣ 날개 개수 바꿔보기">
        <div className="grid grid-cols-3 gap-2">
          {[2, 3, 4].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBlades(b)}
              className={`btn h-auto flex-col p-3 ${blades === b ? 'bg-mulgomi-ear' : 'bg-white'}`}
            >
              <span className="text-2xl font-black">{b}개</span>
              <span className="text-xs">{b === 3 ? '표준' : b === 2 ? '가볍다' : '무겁다'}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-mulgomi-body p-2 text-sm font-bold">
          날개를 4개로 늘려도 발전량은 아주 조금밖에 늘지 않아요. 대신 무게·재료비·공기저항이 함께
          늘어나기 때문에, 실제 풍력발전기는 <b>3개</b>를 표준으로 씁니다.
        </p>
      </Panel>
    </>
  );

  const visual = (
    <>
      <Panel title="🌬️ 풍력발전기">
        <div className="flex flex-col items-center py-2">
          <svg viewBox="0 0 200 200" className="h-52 w-52" role="img" aria-label="풍력발전기">
            <rect x="0" y="0" width="200" height="200" fill="#EAF4FB" rx="12" />
            <rect x="94" y="80" width="12" height="100" fill="#FFFFFF" stroke="#453527" strokeWidth="5" />
            <ellipse cx="100" cy="182" rx="42" ry="8" fill="#BAC5CA" />
            <g style={{ transformOrigin: '100px 80px', animation: spinSec ? `spinblade ${spinSec}s linear infinite` : 'none' }}>
              {Array.from({ length: blades }, (_, i) => (
                <rect
                  key={i}
                  x="96"
                  y="16"
                  width="8"
                  height="64"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#453527"
                  strokeWidth="5"
                  style={{ transformOrigin: '100px 80px', transform: `rotate(${(360 / blades) * i}deg)` }}
                />
              ))}
              <circle cx="100" cy="80" r="10" fill="#F4EC8E" stroke="#453527" strokeWidth="5" />
            </g>
            {v > 0.5 && (
              <g stroke="#7FB2D6" strokeWidth="4" strokeLinecap="round" opacity={Math.min(1, v / 12)}>
                <path d="M12 60 h30" />
                <path d="M8 96 h40" />
                <path d="M16 130 h26" />
              </g>
            )}
          </svg>
          <div className="w-full">
            <Gauge value={power} max={110} label="발전량" unit="%" color="#E9A80B" />
          </div>
          <p className="mt-2 text-center text-sm font-bold">
            {FORMULAS.windPower} · 계산값 = {(K * v ** 3).toFixed(1)}% × 날개계수{' '}
            {BLADE_FACTOR[blades]}
          </p>
        </div>
      </Panel>

      <Panel title="⚡ 인천의 바람" tone="energy">
        <p className="font-bold leading-relaxed">
          인천은 2030년까지 해상풍력 <b>{INCHEON.offshoreWindTarget2030GW}GW</b> 확보를 목표로 하고
          있어요. 바다에는 육지보다 강하고 일정한 바람이 불기 때문에, 같은 발전기라도 훨씬 많은
          전기를 만들 수 있습니다.
        </p>
      </Panel>
    </>
  );

  return (
    <ExperimentShell
      chapterId={chapterId}
      experimentId="wind_sim"
      title="💨 실험 1. 풍력발전 시뮬레이터"
      intro="바람의 세기를 바꾸면 발전량이 어떻게 달라질까요? 여러 번 바꿔보며 규칙을 찾아보세요."
      tone="energy"
      controls={controls}
      visual={visual}
      columns={[
        { key: 'wind', label: '풍속(m/s)' },
        { key: 'blades', label: '날개 수', digits: 0 },
        { key: 'power', label: '발전량(%)' },
      ]}
      makeRecord={() => ({ wind: v, blades, power })}
      chart={{ xKey: 'wind', yKey: 'power', xLabel: '풍속(m/s)', yLabel: '발전량(%)' }}
      interpretation={isLow ? <LowWindQ /> : <HighWindQ />}
    />
  );
}

function LowWindQ() {
  const soundOn = useGameStore((s) => s.soundOn);
  const [pick, setPick] = useState(null);
  const q = '바람이 세지면 발전량은 어떻게 되나요?';
  const options = ['아주 많이 늘어난다', '조금 줄어든다', '변하지 않는다'];
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-lg font-black">{q}</p>
        <TTSButton text={q} />
      </div>
      <div className="grid gap-2">
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            className={`btn h-auto justify-start p-3 text-left ${pick === i ? 'bg-mulgomi-ear' : 'bg-white'}`}
            onClick={() => {
              setPick(i);
              if (soundOn) (i === 0 ? sfx.correct : sfx.wrong)();
            }}
          >
            {o}
          </button>
        ))}
      </div>
      {pick !== null && (
        <Verdict correct={pick === 0}>
          약풍(4m/s)일 때와 강풍(16m/s)일 때의 게이지를 비교해 보세요. 바람이 4배 세지면 발전량은
          훨씬 더 크게 늘어납니다.
        </Verdict>
      )}
    </div>
  );
}

function HighWindQ() {
  const awardBadge = useGameStore((s) => s.awardBadge);
  const soundOn = useGameStore((s) => s.soundOn);
  const [val, setVal] = useState('');
  const [res, setRes] = useState(null);

  const check = () => {
    const v = parseFloat(val);
    const ok = Number.isFinite(v) && Math.abs(v - 8) <= 0.01;
    setRes(ok);
    if (ok) awardBadge('ch4_energy', 'wind_master');
    if (soundOn) (ok ? sfx.correct : sfx.wrong)();
  };

  return (
    <div>
      <p className="text-lg font-black">
        직접 확인해 보세요. 풍속을 5m/s → 10m/s로 두 배 올리면 발전량은 몇 배가 될까요?
      </p>
      <p className="mt-2 inline-block rounded-lg bg-data-light px-3 py-1.5 font-bold">
        {FORMULAS.windPower}
      </p>
      <p className="mt-2 font-bold">
        기록표에 5m/s와 10m/s를 각각 기록해 두 값을 나눠 보면 확인할 수 있어요. (
        {windPower(5).toFixed(1)}% → {windPower(10).toFixed(1)}%)
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className="field max-w-[160px]"
          inputMode="decimal"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="예) 4"
          aria-label="배수 입력"
        />
        <span className="text-xl font-black">배</span>
        <button type="button" className="btn-primary" onClick={check} disabled={!val.trim()}>
          확인하기
        </button>
      </div>
      {res !== null && (
        <Verdict correct={res}>
          발전량은 풍속의 <b>세제곱</b>에 비례하므로 2³ = <b>8배</b>가 됩니다. 바람이 조금만 더
          세져도 발전량이 크게 늘어나기 때문에, 바람이 강한 바다에 발전기를 세우는 거예요.
        </Verdict>
      )}
    </div>
  );
}
