import React, { useState } from 'react';
import ExperimentShell from '../../components/ExperimentShell';
import { Panel, Gauge, Verdict } from '../../components/UI';
import TTSButton from '../../components/TTSButton';
import Mascot from '../../components/Mascot';
import useGameStore from '../../store/useGameStore';
import { conceptImage, illustCaption } from '../../lib/illustrations';
import { FORMULAS, SOLAR_OPTIMAL } from '../../data/datasets';
import sfx from '../../lib/sound';

/**
 * 미니게임 2 — 태양광 패널 각도 실험 (워크북 4-5)
 * 발전량 ∝ cos(입사각). 입사각 = |패널 각도 − 최적각|
 * 최적각은 위도 기반 남향 30~35°(워크북 4-9)의 중앙값으로 둔다.
 * 빛 조건 3종(직사/산란/차광)은 워크북 4-5 기록표 ②를 반영.
 */
const OPTIMAL = (SOLAR_OPTIMAL.min + SOLAR_OPTIMAL.max) / 2; // 32.5°
const MAX_VOLT = 5.0; // 미니 태양광 패널 기준 전압(V)

const LIGHT = [
  { id: 'direct', label: '직사광', factor: 1.0, emoji: '☀️' },
  { id: 'diffuse', label: '산란광(흐림)', factor: 0.55, emoji: '⛅' },
  { id: 'shade', label: '차광(그늘)', factor: 0.2, emoji: '🌥️' },
];

export const solarVoltage = (angle, factor) =>
  MAX_VOLT * Math.max(0, Math.cos(((angle - OPTIMAL) * Math.PI) / 180)) * factor;

export default function SolarSim({ chapterId }) {
  const isLow = useGameStore((s) => s.isLow());
  const awardBadge = useGameStore((s) => s.awardBadge);
  const soundOn = useGameStore((s) => s.soundOn);

  const [angle, setAngle] = useState(isLow ? 0 : 10);
  const [lightId, setLightId] = useState('direct');
  const [found, setFound] = useState(false);

  const light = LIGHT.find((l) => l.id === lightId);
  const volt = solarVoltage(angle, light.factor);
  const incidence = Math.abs(angle - OPTIMAL);

  const checkOptimal = () => {
    const ok = angle >= SOLAR_OPTIMAL.min && angle <= SOLAR_OPTIMAL.max;
    setFound(ok);
    if (soundOn) (ok ? sfx.correct : sfx.wrong)();
    if (ok) awardBadge(chapterId, 'solar_ace');
  };

  const controls = (
    <>
      <Panel title="1️⃣ 패널 각도 정하기" tone="energy">
        {isLow ? (
          <div className="grid grid-cols-3 gap-2">
            {[0, 30, 60].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAngle(a)}
                className={`btn h-auto flex-col p-3 ${angle === a ? 'bg-mulgomi-ear' : 'bg-white'}`}
              >
                <span className="text-2xl font-black">{a}°</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <label className="font-bold" htmlFor="angle-range">
              패널 각도: <b className="text-xl tabular-nums">{angle}</b>°
              <span className="ml-2 text-sm">(빛 입사각 {incidence.toFixed(1)}°)</span>
            </label>
            <input
              id="angle-range"
              type="range"
              min={0}
              max={90}
              step={1}
              value={angle}
              onChange={(e) => {
                setAngle(Number(e.target.value));
                setFound(false);
              }}
              className="mt-2"
            />
            <button type="button" className="btn-primary mt-3" onClick={checkOptimal}>
              🎯 지금 각도가 최적각인지 확인하기
            </button>
            {found && (
              <p className="mt-2 flex items-center gap-2 font-black text-ok">
                <Mascot mood="happy" size="xs" /> 최적각을 찾았어요!
              </p>
            )}
          </>
        )}
      </Panel>

      <Panel title="2️⃣ 빛 조건 바꾸기">
        <div className="grid grid-cols-3 gap-2">
          {LIGHT.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLightId(l.id)}
              className={`btn h-auto flex-col p-3 ${lightId === l.id ? 'bg-mulgomi-ear' : 'bg-white'}`}
            >
              <span className="text-2xl" aria-hidden="true">
                {l.emoji}
              </span>
              <span className="text-sm font-black leading-tight">{l.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-mulgomi-body p-2 text-sm font-bold">
          같은 각도라도 구름이 끼거나 그늘이 지면 발전량이 크게 떨어져요.
        </p>
      </Panel>
    </>
  );

  const visual = (
    <>
      <Panel title="🔆 태양광 패널">
        <div className="flex flex-col items-center py-2">
          <svg viewBox="0 0 220 180" className="h-48 w-full max-w-[280px]" role="img" aria-label="태양광 패널 실험">
            <rect x="0" y="0" width="220" height="180" rx="12" fill="#FDF6E0" />
            {/* 태양: 최적각 방향에서 비추는 빛 */}
            <circle cx="46" cy="34" r="18" fill="#F4EC8E" stroke="#453527" strokeWidth="4" opacity={light.factor} />
            {[0, 1, 2].map((i) => (
              <line
                key={i}
                x1={62 + i * 6}
                y1={46 + i * 10}
                x2={132 + i * 6}
                y2={104 + i * 10}
                stroke="#E9A80B"
                strokeWidth="4"
                strokeLinecap="round"
                opacity={light.factor}
                strokeDasharray="10 6"
              />
            ))}
            {/* 지면 */}
            <line x1="20" y1="150" x2="200" y2="150" stroke="#453527" strokeWidth="5" />
            {/* 패널 */}
            <g style={{ transformOrigin: '150px 150px', transform: `rotate(${-angle}deg)` }}>
              <rect x="108" y="140" width="84" height="12" rx="3" fill="#2E86C1" stroke="#453527" strokeWidth="5" />
            </g>
            <text x="150" y="172" textAnchor="middle" fontSize="14" fontWeight="900" fill="#453527">
              {angle}°
            </text>
          </svg>

          <div className="w-full">
            <Gauge value={volt} max={MAX_VOLT} label="발전 전압" unit="V" color="#E9A80B" />
          </div>
          <p className="mt-2 text-center text-sm font-bold">
            {FORMULAS.solarPower} · 입사각 {incidence.toFixed(1)}° · 빛 {light.label}
          </p>
          {conceptImage('solar') && (
            <figure className="mt-3 w-full">
              <img
                src={conceptImage('solar')}
                alt="학교 옥상에 넓게 설치된 태양광 패널"
                className="aspect-[16/9] w-full rounded-xl border-3 border-mulgomi-line object-cover"
                draggable="false"
              />
              <figcaption className="mt-1 text-center text-xs font-bold text-mulgomi-line/70">
                {illustCaption('concept-solar')}
              </figcaption>
            </figure>
          )}
        </div>
      </Panel>
    </>
  );

  return (
    <ExperimentShell
      chapterId={chapterId}
      experimentId="solar_sim"
      title="☀️ 실험 2. 태양광 패널 각도 실험"
      intro={
        isLow
          ? '패널 각도를 바꿔가며 전기가 가장 많이 나오는 각도를 찾아보세요.'
          : '패널 각도를 1°씩 바꿔가며 발전 전압이 가장 커지는 각도를 직접 찾아보세요. 빛 조건도 함께 바꿔 기록해 봅시다.'
      }
      tone="energy"
      controls={controls}
      visual={visual}
      columns={[
        { key: 'angle', label: '각도(°)', digits: 0 },
        { key: 'lightLabel', label: '빛 조건' },
        { key: 'volt', label: '전압(V)', digits: 2 },
      ]}
      makeRecord={() => ({ angle, lightLabel: light.label, volt })}
      chart={{ xKey: 'angle', yKey: 'volt', xLabel: '패널 각도(°)', yLabel: '전압(V)' }}
      interpretation={isLow ? <LowSolarQ angle={angle} /> : <HighSolarQ found={found} />}
    />
  );
}

function LowSolarQ({ angle }) {
  const soundOn = useGameStore((s) => s.soundOn);
  const [pick, setPick] = useState(null);
  const best = 30; // 어린이 모드 선택지 0/30/60 중 최적각에 가장 가까운 값
  const q = '세 각도 중 전기가 가장 많이 나오는 각도는 몇 도였나요?';
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-lg font-black">{q}</p>
        <TTSButton text={q} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 30, 60].map((a) => (
          <button
            key={a}
            type="button"
            className={`btn h-auto flex-col p-4 ${pick === a ? 'bg-mulgomi-ear' : 'bg-white'}`}
            onClick={() => {
              setPick(a);
              if (soundOn) (a === best ? sfx.correct : sfx.wrong)();
            }}
          >
            <span className="text-2xl font-black">{a}°</span>
            <span className="text-xs">{solarVoltage(a, 1).toFixed(2)}V</span>
          </button>
        ))}
      </div>
      {pick !== null && (
        <Verdict correct={pick === best}>
          30°일 때 전압이 가장 높았어요. 빛이 패널에 똑바로(수직에 가깝게) 닿을수록 전기가 많이
          만들어집니다. 지금 각도는 {angle}°예요.
        </Verdict>
      )}
    </div>
  );
}

function HighSolarQ({ found }) {
  const soundOn = useGameStore((s) => s.soundOn);
  const [val, setVal] = useState('');
  const [res, setRes] = useState(null);

  const check = () => {
    const v = parseFloat(val);
    const ok = Number.isFinite(v) && v >= SOLAR_OPTIMAL.min && v <= SOLAR_OPTIMAL.max;
    setRes(ok);
    if (soundOn) (ok ? sfx.correct : sfx.wrong)();
  };

  return (
    <div>
      <p className="text-lg font-black">실험으로 찾은 최적 각도는 몇 도인가요?</p>
      <p className="mt-2 font-bold">
        슬라이더를 움직이며 전압이 가장 높아지는 지점을 찾아 기록표에 적어 보세요.
        {found && ' (이미 최적각 구간을 찾았네요!)'}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className="field max-w-[160px]"
          inputMode="decimal"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="예) 32"
          aria-label="최적각 입력"
        />
        <span className="text-xl font-black">°</span>
        <button type="button" className="btn-primary" onClick={check} disabled={!val.trim()}>
          확인하기
        </button>
      </div>
      {res !== null && (
        <Verdict correct={res}>
          우리나라(인천)의 위도를 고려하면 고정형 태양광 패널의 최적 각도는{' '}
          <b>
            남향 {SOLAR_OPTIMAL.min}~{SOLAR_OPTIMAL.max}°
          </b>
          입니다. 빛이 패널 면에 수직으로 닿을 때 발전량이 최대가 되기 때문이에요.
        </Verdict>
      )}
    </div>
  );
}
