import React from 'react';
import { CHAPTERS } from '../data/chapters';
import { DISTRICTS, MAP_VIEWBOX } from '../data/incheonDistricts';

/**
 * 인천 지도 일러스트 (허브 월드, 기획서 5.2)
 *
 * 인천광역시 「2026.07.01 인천광역시 행정구역」 도면에서 추출한 실제 경계 경로를 사용하고,
 * 물곰이 스타일 가이드(굵은 다크브라운 외곽선 + 파스텔 플랫컬러)에 맞춰 채색했다.
 * 챕터를 완료하면 해당 구·군이 회색에서 고유 색으로 "복원"되고 장식이 나타난다.
 */

const LINE = '#453527';
const UNDONE = '#DCE1E3'; // 아직 탐험하지 않은 지역

// 행정구역 → 챕터. 챕터 주제와 지역 성격을 맞춰 묶었다.
// 한 구·군이 두 색으로 갈리지 않도록 행정구역 단위 그대로 배정한다.
const DISTRICT_CHAPTER = {
  ganghwa: 'ch1_bluecarbon', // 강화 갯벌
  yeongjong: 'ch2_ocean', // 영종·용유·무의도와 그 연안
  geomdan: 'ch3_data', // 내륙 북부 — 기상·인구 데이터
  seohae: 'ch3_data',
  gyeyang: 'ch3_data',
  bupyeong: 'ch3_data',
  ongjin_w: 'ch4_energy', // 옹진군 — 영흥도 소재
  ongjin_e: 'ch4_energy',
  jemulpo: 'ch5_town', // 도심 남부 — 우리 동네
  michuhol: 'ch5_town',
  namdong: 'ch5_town',
  yeonsu: 'ch5_town',
};

const CHAPTER_COLOR = {
  ch1_bluecarbon: '#DCC49B', // 갯벌 어스톤
  ch2_ocean: '#A6DBC6', // 바다 민트
  ch3_data: '#D8CDEE', // 데이터 보라
  ch4_energy: '#F7E2A4', // 에너지 옐로
  ch5_town: '#C9E6BC', // 우리동네 초록
};

export default function IncheonMap({ doneIds = [], onOpen }) {
  const isDone = (id) => doneIds.includes(id);
  const fillOf = (districtId) => {
    const ch = DISTRICT_CHAPTER[districtId];
    return ch && isDone(ch) ? CHAPTER_COLOR[ch] : UNDONE;
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: '1190 / 1165' }}>
      <svg
        viewBox={MAP_VIEWBOX}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="인천광역시 지도. 강화군, 옹진군, 영종구를 비롯한 11개 구·군이 그려져 있습니다."
      >
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DCEFFA" />
            <stop offset="100%" stopColor="#B7DAEE" />
          </linearGradient>
        </defs>

        {/* 바다 */}
        <rect x="45" y="34" width="1190" height="1165" fill="url(#sea)" rx="24" />
        {[110, 250, 390, 530, 670, 810, 950, 1090].map((y, i) => (
          <path
            key={y}
            d={`M${20 + (i % 2) * 60} ${y} q 70 -26 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0 t 140 0`}
            stroke="#9FCDE6"
            strokeWidth="6"
            fill="none"
            opacity="0.4"
          />
        ))}

        {/* 행정구역 — 옹진군 도서는 폭이 얇아 외곽선을 가늘게 그려야 색이 보인다 */}
        <g stroke={LINE} strokeLinejoin="round" strokeLinecap="round">
          {DISTRICTS.map((d) => (
            <path
              key={d.id}
              d={d.d}
              fill={fillOf(d.id)}
              fillRule="evenodd"
              strokeWidth={d.id.startsWith('ongjin') ? 3.5 : 7}
            />
          ))}
        </g>

        {/* 완료 시 나타나는 장식 */}
        <g fontSize="46" textAnchor="middle">
          {isDone('ch1_bluecarbon') && (
            <>
              <text x="392" y="330">🦀</text>
              <text x="470" y="180">🌾</text>
            </>
          )}
          {isDone('ch2_ocean') && (
            <>
              <text x="300" y="830">🐟</text>
              <text x="560" y="890">🐦</text>
            </>
          )}
          {isDone('ch3_data') && <text x="905" y="450">📡</text>}
          {isDone('ch4_energy') && (
            <>
              <text x="300" y="520">💨</text>
              <text x="150" y="600">⛵</text>
            </>
          )}
          {isDone('ch5_town') && <text x="950" y="950">🌳</text>}
        </g>

        {/* 인천국제공항(영종구) — 상시 랜드마크 */}
        <text x="185" y="700" fontSize="40" textAnchor="middle">
          ✈️
        </text>

        {/* 행정구역 이름 */}
        <g
          fill={LINE}
          fontWeight="800"
          fontSize="30"
          textAnchor="middle"
          stroke="#FFFFFF"
          strokeWidth="7"
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {DISTRICTS.filter((d) => d.label).map((d) => (
            <text key={d.id} x={d.label[0]} y={d.label[1]}>
              {d.name}
            </text>
          ))}
        </g>
      </svg>

      {/* 챕터 거점 마커 (HTML 오버레이 — 터치 영역 44px 이상) */}
      {CHAPTERS.map((c) => {
        const done = isDone(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onOpen(c.id)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${c.map.x}%`, top: `${c.map.y}%` }}
            aria-label={`Chapter ${c.no} ${c.title} 시작하기`}
          >
            <span
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border-3 border-mulgomi-line text-xl shadow-popsm ${
                done ? 'bg-mulgomi-ear' : 'animate-idlebounce bg-white'
              }`}
            >
              <span aria-hidden="true">{done ? '✓' : c.emoji}</span>
              {/* 좁은 화면에서는 이름표 대신 챕터 번호만 표시해 마커끼리 겹치지 않게 한다 */}
              <span
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-mulgomi-line bg-white text-[10px] font-black sm:hidden"
                aria-hidden="true"
              >
                {c.no}
              </span>
            </span>
            <span className="mt-1 hidden whitespace-nowrap rounded-md border-2 border-mulgomi-line bg-white px-1.5 text-xs font-black sm:inline">
              Ch{c.no} {c.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
