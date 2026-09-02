import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Panel } from './UI';
import TTSButton from './TTSButton';
import useGameStore from '../store/useGameStore';
import sfx from '../lib/sound';

/**
 * 공통 실험 시뮬레이션 셸(기획서 7.2)
 *
 *   파라미터(조작값) → 계산함수 → 실시간 시각화 → 기록표 누적 → 해석 질문
 *
 * 풍력·태양광·블루카본 실험이 모두 이 셸을 공유하고, 조작 UI와 계산 함수만 교체한다.
 * 기록표는 워크북의 "기록표" 역할을 그대로 계승하며, 누적된 시도는 그래프로도 보여준다.
 */
export default function ExperimentShell({
  chapterId,
  experimentId,
  title,
  intro,
  tone = 'white',
  controls, // 파라미터 조작 UI (ReactNode)
  visual, // 실시간 시각화 (ReactNode)
  columns = [], // 기록표 컬럼 [{ key, label, digits }]
  makeRecord, // () => ({ ...row }) 현재 파라미터로 기록 1행 생성
  chart, // { xKey, yKey, yLabel, xLabel } — 누적 기록 그래프
  interpretation, // 해석 질문 영역 (ReactNode)
  footer,
}) {
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const soundOn = useGameStore((s) => s.soundOn);
  const [records, setRecords] = useState([]);

  const record = () => {
    if (!makeRecord) return;
    const row = makeRecord();
    if (!row) return;
    setRecords((r) => [...r, { ...row, _n: r.length + 1 }]);
    logTrial(chapterId, experimentId);
    if (soundOn) sfx.tap();
  };

  const chartData = chart
    ? [...records].sort((a, b) => Number(a[chart.xKey]) - Number(b[chart.xKey]))
    : [];

  return (
    <div className="grid gap-4">
      <Panel title={title} right={intro ? <TTSButton text={intro} /> : null} tone={tone}>
        {intro && <p className="mb-4 font-bold leading-relaxed">{intro}</p>}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid content-start gap-4">{controls}</div>
          <div className="grid content-start gap-4">{visual}</div>
        </div>

        {makeRecord && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" className="btn-accent" onClick={record}>
              📋 지금 결과를 기록표에 적기
            </button>
            {records.length > 0 && (
              <>
                <span className="chip">기록 {records.length}회</span>
                <button
                  type="button"
                  className="btn-soft !px-3 !py-1 text-sm"
                  onClick={() => setRecords([])}
                >
                  기록 지우기
                </button>
              </>
            )}
          </div>
        )}
      </Panel>

      {records.length > 0 && (
        <Panel title="나의 실험 기록표" tone="white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="bg-mulgomi-body">
                  <th className="border-2 border-mulgomi-line px-2 py-2">회차</th>
                  {columns.map((c) => (
                    <th key={c.key} className="border-2 border-mulgomi-line px-2 py-2">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._n} className="odd:bg-white even:bg-[#F7FBFF]">
                    <td className="border-2 border-mulgomi-line px-2 py-1.5 text-center font-bold">
                      {r._n}
                    </td>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className="border-2 border-mulgomi-line px-2 py-1.5 text-center tabular-nums"
                      >
                        {typeof r[c.key] === 'number'
                          ? r[c.key].toFixed(c.digits ?? 1)
                          : (r[c.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {chart && records.length >= 2 && (
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#BAC5CA" />
                  <XAxis
                    dataKey={chart.xKey}
                    stroke="#453527"
                    tick={{ fontSize: 12, fontWeight: 700 }}
                    label={{ value: chart.xLabel, position: 'insideBottom', offset: -12, fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#453527"
                    tick={{ fontSize: 12, fontWeight: 700 }}
                    label={{ value: chart.yLabel, angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={chart.yKey}
                    stroke="#2E86C1"
                    strokeWidth={4}
                    dot={{ r: 5, fill: '#F4EC8E', stroke: '#453527', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>
      )}

      {interpretation && <Panel title="결과 해석하기">{interpretation}</Panel>}
      {footer}
    </div>
  );
}
