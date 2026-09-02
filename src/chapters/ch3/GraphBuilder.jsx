import React, { useMemo, useState } from 'react';
import { Panel, Verdict } from '../../components/UI';
import TTSButton from '../../components/TTSButton';
import Mascot from '../../components/Mascot';
import useGameStore from '../../store/useGameStore';
import { HEATWAVE, FORMULAS } from '../../data/datasets';
import sfx from '../../lib/sound';

/**
 * 미니게임 1 — 그래프 빌더 (워크북 3-4 인천 폭염일수)
 * 저학년: 막대를 직접 세워 값을 맞추고 "가장 더운 시대" 고르기
 * 고학년: 평균·증가율 계산 + 축을 자른 그래프와 정직한 그래프 비교(데이터 리터러시 핵심)
 */
const MAX_DAYS = 20;

export default function GraphBuilder({ chapterId }) {
  const isLow = useGameStore((s) => s.isLow());
  return isLow ? <LowGraphBuilder chapterId={chapterId} /> : <HighGraphBuilder chapterId={chapterId} />;
}

/* ── 저학년: 막대 세우기 + 비교 ─────────────────────────────────────── */
function LowGraphBuilder({ chapterId }) {
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const soundOn = useGameStore((s) => s.soundOn);
  const [values, setValues] = useState([0, 0, 0]);
  const [pick, setPick] = useState(null);

  const done = values.every((v, i) => Math.abs(v - HEATWAVE[i].days) <= 0.6);
  const hottest = HEATWAVE.reduce((a, b, i) => (b.days > HEATWAVE[a].days ? i : a), 0);

  const setVal = (i, v) => {
    setValues((prev) => {
      const n = [...prev];
      n[i] = v;
      return n;
    });
    logTrial(chapterId, 'graph_builder');
  };

  return (
    <div className="grid gap-4">
      <Panel
        title="📊 실험 1. 폭염일수 막대그래프 만들기"
        tone="data"
        right={<TTSButton text="아래 숫자와 같아지도록 막대를 세워 보세요." />}
      >
        <p className="mb-4 font-bold leading-relaxed">
          인천의 폭염일수(하루 최고기온이 33℃ 이상인 날)를 시대별로 비교해 봅시다. 아래 숫자와
          같아지도록 손잡이를 움직여 막대를 세워 보세요.
        </p>

        <div className="flex items-end justify-around gap-3 rounded-xl border-3 border-mulgomi-line bg-white p-4">
          {HEATWAVE.map((h, i) => (
            <div key={h.decade} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-lg font-black tabular-nums">{values[i].toFixed(1)}일</span>
              <div className="relative flex h-52 w-full max-w-[80px] items-end justify-center rounded-lg border-2 border-dashed border-mulgomi-line bg-[#F7FBFF]">
                <div
                  className="w-full rounded-t-md border-3 border-mulgomi-line transition-[height] duration-200"
                  style={{
                    height: `${(values[i] / MAX_DAYS) * 100}%`,
                    background: Math.abs(values[i] - h.days) <= 0.6 ? '#7D5BA6' : '#C5DCF3',
                  }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={MAX_DAYS}
                step={0.1}
                value={values[i]}
                onChange={(e) => setVal(i, Number(e.target.value))}
                aria-label={`${h.decade} 막대 높이`}
                className="max-w-[110px]"
              />
              <span className="text-center text-sm font-black leading-tight">{h.decade}</span>
              <span className="chip">목표 {h.note}</span>
            </div>
          ))}
        </div>

        {done && (
          <div className="mt-3 flex items-center gap-2 font-black text-ok">
            <Mascot mood="happy" size="xs" /> 그래프를 완성했어요!
          </div>
        )}
      </Panel>

      {done && (
        <Panel title="결과 해석하기">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-lg font-black">어느 시대가 가장 더웠을까요?</p>
            <TTSButton text="어느 시대가 가장 더웠을까요?" />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {HEATWAVE.map((h, i) => (
              <button
                key={h.decade}
                type="button"
                className={`btn h-auto flex-col p-4 ${pick === i ? 'bg-mulgomi-ear' : 'bg-white'}`}
                onClick={() => {
                  setPick(i);
                  if (soundOn) (i === hottest ? sfx.correct : sfx.wrong)();
                }}
              >
                <span className="font-black">{h.decade}</span>
                <span className="text-sm">{h.note}</span>
              </button>
            ))}
          </div>
          {pick !== null && (
            <Verdict correct={pick === hottest || HEATWAVE[pick].days === HEATWAVE[hottest].days}>
              1970년대 약 6.5일에서 2010년대 약 16.9일로, 폭염일수가 2배가 넘게 늘었어요. 2020년대는
              그보다도 더 많습니다.
            </Verdict>
          )}
        </Panel>
      )}
    </div>
  );
}

/* ── 고학년: 평균·증가율 계산 + 축 왜곡 비교 ─────────────────────────── */
function HighGraphBuilder({ chapterId }) {
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const awardBadge = useGameStore((s) => s.awardBadge);
  const soundOn = useGameStore((s) => s.soundOn);

  const [avgInput, setAvgInput] = useState('');
  const [avgRes, setAvgRes] = useState(null);
  const [rateInput, setRateInput] = useState('');
  const [rateRes, setRateRes] = useState(null);
  const [axisStart, setAxisStart] = useState(0);
  const [axisPick, setAxisPick] = useState(null);

  const avg = useMemo(() => HEATWAVE.reduce((s, h) => s + h.days, 0) / HEATWAVE.length, []);
  const rate = ((HEATWAVE[1].days - HEATWAVE[0].days) / HEATWAVE[0].days) * 100;

  const checkAvg = () => {
    const v = parseFloat(avgInput);
    const ok = Number.isFinite(v) && Math.abs(v - avg) <= 0.2;
    setAvgRes(ok);
    logTrial(chapterId, 'graph_builder');
    if (soundOn) (ok ? sfx.correct : sfx.wrong)();
  };
  const checkRate = () => {
    const v = parseFloat(rateInput);
    const ok = Number.isFinite(v) && Math.abs(v - rate) <= 1;
    setRateRes(ok);
    logTrial(chapterId, 'graph_builder');
    if (soundOn) (ok ? sfx.correct : sfx.wrong)();
  };

  return (
    <div className="grid gap-4">
      <Panel title="📊 실험 1. 폭염일수 데이터 분석" tone="data">
        <p className="mb-3 font-bold leading-relaxed">
          인천의 시대별 폭염일수입니다. 표를 보고 평균과 증가율을 직접 계산해 봅시다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[360px] border-collapse text-center">
            <thead>
              <tr className="bg-mulgomi-body">
                {HEATWAVE.map((h) => (
                  <th key={h.decade} className="border-2 border-mulgomi-line px-2 py-2">
                    {h.decade}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {HEATWAVE.map((h) => (
                  <td key={h.decade} className="border-2 border-mulgomi-line px-2 py-3 text-xl font-black">
                    {h.note}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="🧮 계산 1. 세 시대의 평균">
        <p className="inline-block rounded-lg bg-data-light px-3 py-1.5 font-bold">{FORMULAS.average}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            className="field max-w-[180px]"
            inputMode="decimal"
            value={avgInput}
            onChange={(e) => setAvgInput(e.target.value)}
            placeholder="예) 13.4"
            aria-label="평균 입력"
          />
          <span className="text-xl font-black">일</span>
          <button type="button" className="btn-primary" onClick={checkAvg} disabled={!avgInput.trim()}>
            검산하기
          </button>
          <TTSButton text="6.5일, 16.9일, 16.9일의 평균은 몇 일인가요?" />
        </div>
        {avgRes !== null && (
          <Verdict correct={avgRes}>
            (6.5 + 16.9 + 16.9) ÷ 3 = <b>{avg.toFixed(2)}</b>일, 약 {avg.toFixed(1)}일입니다.
          </Verdict>
        )}
      </Panel>

      <Panel title="🧮 계산 2. 1970년대 → 2010년대 증가율">
        <p className="inline-block rounded-lg bg-data-light px-3 py-1.5 font-bold">{FORMULAS.growthRate}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            className="field max-w-[180px]"
            inputMode="decimal"
            value={rateInput}
            onChange={(e) => setRateInput(e.target.value)}
            placeholder="예) 160"
            aria-label="증가율 입력"
          />
          <span className="text-xl font-black">%</span>
          <button type="button" className="btn-primary" onClick={checkRate} disabled={!rateInput.trim()}>
            검산하기
          </button>
        </div>
        {rateRes !== null && (
          <Verdict correct={rateRes}>
            (16.9 − 6.5) ÷ 6.5 × 100 = <b>{rate.toFixed(1)}%</b>. 40년 사이에 폭염일수가 약 160%
            늘었습니다.
          </Verdict>
        )}
      </Panel>

      <Panel title="🔍 같은 데이터, 다른 그래프" tone="white">
        <p className="mb-3 font-bold leading-relaxed">
          똑같은 데이터인데 세로축의 시작 눈금만 바꿨습니다. 두 그래프를 비교해 보세요.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <MiniBars start={0} title="세로축 0부터" />
          <MiniBars start={10} title="세로축 10부터" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="font-bold" htmlFor="axis-range">
            세로축 시작값 직접 바꿔보기: <b className="tabular-nums">{axisStart}</b>
          </label>
        </div>
        <input
          id="axis-range"
          type="range"
          min={0}
          max={15}
          step={1}
          value={axisStart}
          onChange={(e) => setAxisStart(Number(e.target.value))}
          className="mt-2"
        />
        <div className="mt-3 max-w-sm">
          <MiniBars start={axisStart} title={`세로축 ${axisStart}부터`} />
        </div>

        <div className="mt-4">
          <p className="text-lg font-black">축을 자르면 그래프는 어떻게 보이나요?</p>
          <div className="mt-2 grid gap-2">
            {[
              '차이가 실제보다 훨씬 커 보인다',
              '차이가 실제보다 작아 보인다',
              '아무 변화도 없다',
            ].map((t, i) => (
              <button
                key={t}
                type="button"
                className={`btn h-auto justify-start p-3 text-left ${axisPick === i ? 'bg-mulgomi-ear' : 'bg-white'}`}
                onClick={() => {
                  setAxisPick(i);
                  if (soundOn) (i === 0 ? sfx.correct : sfx.wrong)();
                  if (i === 0) awardBadge(chapterId, 'honest_graph');
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {axisPick !== null && (
            <Verdict correct={axisPick === 0}>
              축을 자르면 막대의 아랫부분이 사라져 차이가 과장돼 보입니다. 뉴스나 광고의 그래프를
              볼 때 <b>세로축이 어디서 시작하는지</b> 꼭 확인하세요. 이것이 데이터 리터러시의
              첫걸음입니다.
            </Verdict>
          )}
        </div>
      </Panel>
    </div>
  );
}

function MiniBars({ start, title }) {
  const top = MAX_DAYS;
  const span = Math.max(1, top - start);
  return (
    <figure className="card-pop bg-white p-3">
      <figcaption className="mb-2 text-center text-sm font-black">{title}</figcaption>
      <div className="flex h-40 items-end justify-around gap-2 border-b-3 border-l-3 border-mulgomi-line pl-1">
        {HEATWAVE.map((h) => {
          const clipped = Math.max(0, h.days - start);
          return (
            <div key={h.decade} className="flex h-full flex-1 flex-col justify-end">
              <div
                className="rounded-t border-2 border-mulgomi-line bg-data"
                style={{ height: `${(clipped / span) * 100}%` }}
                title={`${h.decade} ${h.days}일`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-around text-[11px] font-bold">
        {HEATWAVE.map((h) => (
          <span key={h.decade} className="flex-1 text-center leading-tight">
            {h.decade}
          </span>
        ))}
      </div>
    </figure>
  );
}
