import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import ExperimentShell from '../../components/ExperimentShell';
import { Panel, Verdict } from '../../components/UI';
import TTSButton from '../../components/TTSButton';
import Mascot from '../../components/Mascot';
import useGameStore from '../../store/useGameStore';
import { BLUE_CARBON_SITES, FORMULAS, ORGANIC_CHART_MAX } from '../../data/datasets';
import sfx from '../../lib/sound';
import { isNumericAnswerCorrect } from '../../lib/grading';

/**
 * 미니게임 1 — 블루카본 실험실 (워크북 1-5 강열감량법)
 *   채취(W₁ 젖은 흙) → 건조(W₂) → 연소(W₃)
 *   유기물 함량(%) = (W₂ − W₃) ÷ W₂ × 100
 * 어린이 모드: 결과를 막대로 비교만 / 청소년·성인 모드: 공식을 직접 계산해 입력
 */
export const organicMatter = (w2, w3) => ((w2 - w3) / w2) * 100;

const rand = (min, max) => min + Math.random() * (max - min);

function sampleSite(site) {
  const w1 = rand(95, 105); // 젖은 흙 질량(g)
  const water = rand(...site.waterRatioRange);
  const w2 = w1 * (1 - water); // 건조 후
  const organic = rand(...site.organicRange); // 유기물 함량(%)
  const w3 = w2 * (1 - organic / 100); // 연소 후
  return {
    siteId: site.id,
    site: site.name,
    organic,
    w1: Number(w1.toFixed(1)),
    w2: Number(w2.toFixed(1)),
    w3: Number(w3.toFixed(1)),
  };
}

/**
 * 세 지점의 시료를 한 번에 생성한다.
 *
 * 지점별 범위가 서로 겹치기 때문에(조상대 1.5~3.5%, 조간대 0.5~2.0%) 각각 독립적으로 뽑으면
 * 드물게 조간대가 조상대보다 높게 나온다. 그러면 "위쪽일수록 유기물이 많다"는 이 실험의
 * 학습 목표와 화면 해설이 실제 결과와 어긋난다. 그래서 조상대 > 조간대 > 조하대 순서가
 * 성립할 때까지 다시 뽑는다. 값 자체는 매번 달라지지만 경향은 항상 같다.
 */
function makeBatch() {
  for (let i = 0; i < 100; i++) {
    const batch = Object.fromEntries(BLUE_CARBON_SITES.map((s) => [s.id, sampleSite(s)]));
    const [a, b, c] = BLUE_CARBON_SITES.map((s) => organicMatter(batch[s.id].w2, batch[s.id].w3));
    if (a > b && b > c) return batch;
  }
  // 여기까지 오면 범위 설정이 잘못된 것이므로 마지막 시료를 그대로 쓴다
  return Object.fromEntries(BLUE_CARBON_SITES.map((s) => [s.id, sampleSite(s)]));
}

export default function BlueCarbonLab({ chapterId }) {
  const isLow = useGameStore((s) => s.isLow());
  const awardBadge = useGameStore((s) => s.awardBadge);
  const soundOn = useGameStore((s) => s.soundOn);

  const [siteId, setSiteId] = useState(BLUE_CARBON_SITES[0].id);
  // 세 지점 시료를 한 번에 만들어 두고, 채취할 때마다 해당 지점 값을 꺼내 쓴다
  const [batch] = useState(makeBatch);
  const [sample, setSample] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | drying | dried | burning | burned
  const [display, setDisplay] = useState(0); // 저울에 표시되는 현재 질량
  const [results, setResults] = useState({}); // { siteId: {..., organic} }
  const timer = useRef(null);

  const site = BLUE_CARBON_SITES.find((s) => s.id === siteId);
  const doneCount = Object.keys(results).length;

  useEffect(() => () => clearInterval(timer.current), []);

  useEffect(() => {
    if (doneCount === 3) awardBadge(chapterId, 'soil_scientist');
  }, [doneCount, awardBadge, chapterId]);

  const animateTo = (from, to, next) => {
    clearInterval(timer.current);
    const steps = 28;
    let i = 0;
    setDisplay(from);
    timer.current = setInterval(() => {
      i += 1;
      setDisplay(from + ((to - from) * i) / steps);
      if (i >= steps) {
        clearInterval(timer.current);
        setDisplay(to);
        next?.();
      }
    }, 45);
  };

  const collect = () => {
    const s = batch[site.id];
    setSample(s);
    setPhase('idle');
    setDisplay(s.w1);
    if (soundOn) sfx.tap();
  };

  const dry = () => {
    if (!sample) return;
    setPhase('drying');
    animateTo(sample.w1, sample.w2, () => setPhase('dried'));
  };

  const burn = () => {
    if (!sample) return;
    setPhase('burning');
    animateTo(sample.w2, sample.w3, () => {
      setPhase('burned');
      if (soundOn) sfx.correct();
      setResults((r) => ({
        ...r,
        [sample.siteId]: { ...sample, organic: organicMatter(sample.w2, sample.w3) },
      }));
    });
  };

  const chartData = BLUE_CARBON_SITES.map((s) => ({
    name: s.name,
    organic: results[s.id] ? Number(results[s.id].organic.toFixed(2)) : 0,
    measured: Boolean(results[s.id]),
  }));

  const controls = (
    <>
      <Panel title="1️⃣ 흙을 채취할 지점 고르기" tone="tidal">
        <div className="grid gap-2">
          {BLUE_CARBON_SITES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSiteId(s.id);
                setSample(null);
                setPhase('idle');
                setDisplay(0);
              }}
              className={`btn h-auto justify-start p-3 text-left ${
                siteId === s.id ? 'bg-mulgomi-ear' : 'bg-white'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {s.emoji}
              </span>
              <span className="flex-1">
                <span className="block font-black">
                  {s.name} {results[s.id] && <span className="text-ok">✓ 측정 완료</span>}
                </span>
                <span className="block text-sm font-medium">{s.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="2️⃣ 실험 순서대로 진행하기">
        <div className="grid gap-2">
          <button type="button" className="btn-primary" onClick={collect}>
            🥄 흙 채취하기 (W₁ 재기)
          </button>
          <button
            type="button"
            className="btn-soft"
            onClick={dry}
            disabled={!sample || phase !== 'idle'}
          >
            ☀️ 건조하기 (W₂ 재기)
          </button>
          <button
            type="button"
            className="btn-soft"
            onClick={burn}
            disabled={phase !== 'dried'}
          >
            🔥 태우기 (W₃ 재기)
          </button>
        </div>
        <p className="mt-3 rounded-lg bg-mulgomi-body p-2 text-sm font-bold">
          건조할 때 줄어드는 것은 <b>물</b>, 태울 때 줄어드는 것은 <b>유기물(탄소)</b>이에요.
        </p>
      </Panel>
    </>
  );

  const visual = (
    <>
      <Panel title="🔬 전자저울" tone="white">
        <div className="flex flex-col items-center gap-2 py-2">
          <div
            className={`text-5xl transition-transform ${
              phase === 'drying' ? 'animate-idlebounce' : phase === 'burning' ? 'animate-shakeh' : ''
            }`}
            aria-hidden="true"
          >
            {phase === 'burning' ? '🔥' : phase === 'drying' ? '☀️' : '🪣'}
          </div>
          <div className="w-full rounded-xl border-3 border-mulgomi-line bg-[#1B2B22] px-4 py-3 text-center">
            <span className="font-mono text-4xl font-black text-[#8CFF9E] tabular-nums">
              {display.toFixed(1)}
            </span>
            <span className="ml-1 font-mono text-xl font-black text-[#8CFF9E]">g</span>
          </div>
          <p className="text-sm font-bold" role="status">
            {phase === 'idle' && sample && '채취 완료! 이제 건조해 보세요.'}
            {phase === 'drying' && '건조 중… 물이 날아가고 있어요.'}
            {phase === 'dried' && '건조 끝! 이제 태워 볼까요?'}
            {phase === 'burning' && '연소 중… 유기물이 타고 있어요.'}
            {phase === 'burned' && '측정 완료! 기록표에 적어 보세요.'}
            {!sample && '먼저 흙을 채취하세요.'}
          </p>

          {sample && (
            <div className="mt-1 grid w-full grid-cols-3 gap-2 text-center">
              <Cellv label="W₁ 젖은 흙" v={sample.w1} on />
              <Cellv label="W₂ 건조 후" v={sample.w2} on={phase === 'dried' || phase === 'burning' || phase === 'burned'} />
              <Cellv label="W₃ 연소 후" v={sample.w3} on={phase === 'burned'} />
            </div>
          )}
        </div>
      </Panel>

      <Panel title="📊 지점별 유기물 함량 비교">
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: -18 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#BAC5CA" />
              <XAxis dataKey="name" stroke="#453527" tick={{ fontSize: 12, fontWeight: 700 }} />
              <YAxis
                stroke="#453527"
                tick={{ fontSize: 12, fontWeight: 700 }}
                domain={[0, ORGANIC_CHART_MAX]}
                label={{ value: '%', position: 'insideTopLeft', fontSize: 12 }}
              />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="organic" radius={[6, 6, 0, 0]} stroke="#453527" strokeWidth={3}>
                {chartData.map((d) => (
                  <Cell key={d.name} fill={d.measured ? '#A9743F' : '#E8E8E8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm font-bold text-mulgomi-line/70">
          측정한 지점 {doneCount} / 3
        </p>
      </Panel>
    </>
  );

  return (
    <ExperimentShell
      chapterId={chapterId}
      experimentId="blue_carbon_lab"
      title="🧪 실험 1. 블루카본 실험실"
      intro="갯벌 흙을 채취해 건조하고 태우면, 사라진 무게만큼이 흙 속에 저장돼 있던 유기물, 곧 탄소예요. 세 지점의 흙을 모두 측정해 어디에 탄소가 가장 많이 저장돼 있는지 알아봅시다."
      tone="tidal"
      controls={controls}
      visual={visual}
      columns={[
        { key: 'site', label: '지점' },
        { key: 'w1', label: 'W₁(g)' },
        { key: 'w2', label: 'W₂(g)' },
        { key: 'w3', label: 'W₃(g)' },
        { key: 'organic', label: '유기물 함량(%)', digits: 2 },
      ]}
      makeRecord={
        phase === 'burned' && sample
          ? () => ({ ...sample, organic: organicMatter(sample.w2, sample.w3) })
          : undefined
      }
      interpretation={
        isLow ? (
          <LowInterpretation results={results} />
        ) : (
          <HighInterpretation sample={sample} phase={phase} />
        )
      }
    />
  );
}

function Cellv({ label, v, on }) {
  return (
    <div
      className={`rounded-lg border-2 border-mulgomi-line p-2 ${on ? 'bg-mulgomi-ear' : 'bg-white opacity-50'}`}
    >
      <p className="text-xs font-bold">{label}</p>
      <p className="font-black tabular-nums">{on ? `${v}g` : '—'}</p>
    </div>
  );
}

/** 어린이 모드: 계산 없이 비교·선택 */
function LowInterpretation({ results }) {
  const [pick, setPick] = useState(null);
  const all = Object.keys(results).length === 3;
  const best = all
    ? Object.values(results).reduce((a, b) => (a.organic > b.organic ? a : b)).siteId
    : null;
  const q = '어느 지점의 흙이 탄소를 가장 많이 품고 있을까요?';

  if (!all) {
    return (
      <p className="font-bold">
        세 지점을 모두 측정하면 문제가 나타나요. 지금까지 {Object.keys(results).length}개 측정했어요.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-lg font-black">{q}</p>
        <TTSButton text={q} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {BLUE_CARBON_SITES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`btn h-auto flex-col p-4 ${pick === s.id ? 'bg-mulgomi-ear' : 'bg-white'}`}
            onClick={() => setPick(s.id)}
          >
            <span className="text-3xl" aria-hidden="true">
              {s.emoji}
            </span>
            <span className="font-black">{s.name}</span>
            <span className="text-sm">{results[s.id].organic.toFixed(2)}%</span>
          </button>
        ))}
      </div>
      {pick && (
        <Verdict correct={pick === best}>
          {pick === best ? (
            <p>
              맞아요! 갯벌 위쪽(조상대)은 고운 펄이 쌓이고 염생식물이 자라서 유기물이 많이
              모여요. 아래쪽(조하대)은 물살이 세서 모래가 많고 가벼운 유기물은 씻겨 나가요.
            </p>
          ) : (
            <p>막대그래프에서 가장 높은 막대를 다시 찾아보세요.</p>
          )}
        </Verdict>
      )}
    </div>
  );
}

/** 청소년·성인 모드: 공식을 직접 적용해 계산 */
function HighInterpretation({ sample, phase }) {
  const [val, setVal] = useState('');
  const [res, setRes] = useState(null);
  const ready = phase === 'burned' && sample;

  useEffect(() => {
    setVal('');
    setRes(null);
  }, [sample?.siteId, phase]);

  if (!ready) {
    return <p className="font-bold">한 지점의 측정(채취 → 건조 → 연소)을 끝내면 계산 문제가 나타나요.</p>;
  }

  const answer = organicMatter(sample.w2, sample.w3);
  const check = () => {
    const v = parseFloat(String(val).replace(/[^0-9.\-]/g, ''));
    setRes(Number.isFinite(v) && isNumericAnswerCorrect(v, answer, 0.1));
  };

  return (
    <div>
      <p className="text-lg font-black">
        {sample.site}의 유기물 함량(%)을 계산해 입력하세요.
      </p>
      <p className="mt-2 inline-block rounded-lg bg-data-light px-3 py-1.5 font-bold">
        {FORMULAS.organicMatter}
      </p>
      <p className="mt-2 font-bold">
        W₂ = {sample.w2}g, W₃ = {sample.w3}g
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className="field max-w-[200px]"
          inputMode="decimal"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="예) 12.3"
          aria-label="유기물 함량 입력"
        />
        <span className="text-xl font-black">%</span>
        <button type="button" className="btn-primary" onClick={check} disabled={!val.trim()}>
          채점하기
        </button>
      </div>
      {res !== null && (
        <Verdict correct={res}>
          <p>
            정답은 ({sample.w2} − {sample.w3}) ÷ {sample.w2} × 100 ={' '}
            <b>{answer.toFixed(2)}%</b> 입니다. 반올림한 정수 <b>{Math.round(answer)}</b>도 정답으로
            처리했어요.
          </p>
        </Verdict>
      )}
      {res === false && (
        <div className="mt-3 flex items-center gap-2">
          <Mascot mood="think" size="xs" />
          <p className="font-bold">먼저 (W₂ − W₃)을 구하고, 그 값을 W₂로 나눈 뒤 100을 곱하세요. 정수로 반올림한 값도 정답이에요.</p>
        </div>
      )}
    </div>
  );
}
