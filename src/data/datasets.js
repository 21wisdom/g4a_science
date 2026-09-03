// ─────────────────────────────────────────────────────────────────────────────
// 원본 워크북(인천 SDGs 과학문화 리터러시 워크북 통합본 v2)에 제시된 수치만 사용한다.
// 워크북에 없는 통계는 새로 만들지 않는다(기획서 2장 원칙).
// ─────────────────────────────────────────────────────────────────────────────

export const INCHEON = {
  tidalFlatAreaKm2: 200, // 인천 갯벌 약 200㎢
  carbonAbsorbVsForest: 50, // 육상 산림 대비 최대 50배
  seaLevelRise2050: { incheon: 4.0, globalAvg: 3.6, unit: 'cm' }, // 2050년 예측
  offshoreWindTarget2030GW: 7, // 2030년 해상풍력 7GW 목표
};

// 워크북 3-4 — 인천 폭염일수(연평균, 일)
export const HEATWAVE = [
  { decade: '1970년대', days: 6.5, note: '약 6.5일' },
  { decade: '2010년대', days: 16.9, note: '약 16.9일' },
  { decade: '2020년대', days: 16.9, note: '16.9일 이상' },
];

// 워크북 3-5 — 인천 인구 변화(2019년 약 295만 → 2025년 약 303만)
// 워크북에 제시된 값은 양 끝 2개 연도뿐이므로, 그 사이 연도는 학습용으로
// 선형 보간한 값임을 화면에 명시한다(없는 통계를 지어내지 않기 위함).
export const POPULATION_ANCHORS = { start: { year: 2019, value: 295 }, end: { year: 2025, value: 303 } };

export const POPULATION = (() => {
  const { start, end } = POPULATION_ANCHORS;
  const span = end.year - start.year;
  const step = (end.value - start.value) / span;
  return Array.from({ length: span + 1 }, (_, i) => {
    const year = start.year + i;
    const measured = i === 0 || i === span;
    return {
      year,
      value: Number((start.value + step * i).toFixed(1)), // 단위: 만 명
      measured, // true = 워크북 제시 수치, false = 학습용 선형 보간값
    };
  });
})();

// 워크북 1-5 — 강열감량법 3개 지점(조상대/조간대/조하대)
// W1: 젖은 흙, W2: 건조 후, W3: 태운 후 / 유기물 함량(%) = (W2-W3)/W2*100
//
// organicRange는 검수 과정에서 확정한 지점별 유기물 함량 범위다(2026-09 검수).
// 갯벌 위쪽으로 갈수록 고운 펄이 쌓이고 염생식물이 자라 유기물 함량이 높고,
// 아래쪽은 조류가 세서 모래질이 우세해 함량이 낮다.
// 매 시행마다 이 범위 안에서 값을 생성하므로 수치는 달라져도 지점별 경향은 같다.
//
// 수분 함량은 학습 목표가 아니므로 세 지점 모두 같은 범위를 쓰고,
// 화면에서도 지점별 차이를 주장하지 않는다.
export const BLUE_CARBON_SITES = [
  {
    id: 'upper',
    name: '조상대',
    desc: '바닷물이 가장 적게 닿는 갯벌 위쪽. 고운 펄이 쌓이고 염생식물이 자란다',
    emoji: '🌾',
    organicRange: [1.5, 3.5],
    waterRatioRange: [0.3, 0.4],
  },
  {
    id: 'middle',
    name: '조간대',
    desc: '밀물 때 잠기고 썰물 때 드러나는 갯벌 가운데',
    emoji: '🦀',
    organicRange: [0.5, 2.0],
    waterRatioRange: [0.3, 0.4],
  },
  {
    id: 'lower',
    name: '조하대',
    desc: '거의 항상 바닷물에 잠겨 있는 갯벌 아래쪽. 조류가 세고 모래질이 많다',
    emoji: '🌊',
    organicRange: [0.2, 1.0],
    waterRatioRange: [0.3, 0.4],
  },
];

// 유기물 함량 비교 그래프의 세로축 최댓값(%)
export const ORGANIC_CHART_MAX = 4;

// 워크북 1-6 — 미세플라스틱 형태 분류 4종
export const MICROPLASTIC_TYPES = [
  { id: 'film', name: '비닐형', emoji: '🟦', hint: '얇고 납작한 조각 (비닐봉지·포장재)', lowTier: true },
  { id: 'fiber', name: '섬유형', emoji: '🧵', hint: '실처럼 가늘고 긴 조각 (옷·그물)', lowTier: true },
  { id: 'bead', name: '알갱이형', emoji: '🟠', hint: '동글동글한 알갱이 (세안제·화장품)', lowTier: false },
  { id: 'fragment', name: '파편형', emoji: '🔺', hint: '단단한 플라스틱이 깨진 조각', lowTier: false },
];

// 워크북 2-3 — 인천 해양공간 6개 유형
export const OCEAN_SPACE_TYPES = [
  {
    id: 'estuary',
    name: '하구지역',
    emoji: '🏞️',
    short: '강물과 바닷물이 만나는 곳',
    detail: '민물과 짠물이 섞여 소금기가 중간쯤인 기수역이 만들어진다.',
  },
  {
    id: 'tidalflat',
    name: '갯벌',
    emoji: '🦀',
    short: '썰물 때 드러나는 진흙 벌판',
    detail: '게구멍·조개 자국이 많고 흙이 곱고 질다.',
  },
  {
    id: 'coast',
    name: '연안지역',
    emoji: '⚓',
    short: '사람이 많이 쓰는 바닷가',
    detail: '항구·방파제·해수욕장처럼 사람의 이용 흔적이 뚜렷하다.',
  },
  {
    id: 'island',
    name: '섬주변해역',
    emoji: '🏝️',
    short: '섬을 둘러싼 바다',
    detail: '바위 해안과 모래 해변이 함께 나타나기도 한다.',
  },
  {
    id: 'pooldeung',
    name: '풀등',
    emoji: '🏜️',
    short: '바다 한가운데 나타나는 모래섬',
    detail: '썰물 때만 드러났다가 밀물 때 사라지는 거대한 모래톱이다.',
  },
  {
    id: 'openocean',
    name: '먼바다',
    emoji: '🌊',
    short: '육지에서 멀리 떨어진 깊은 바다',
    detail: '수심이 깊고 파도가 크며, 해상풍력 발전기가 세워지기도 한다.',
  },
];

// 워크북 4-4 / 4-5 — 실험 공식
export const FORMULAS = {
  organicMatter: '유기물 함량(%) = (W₂ − W₃) ÷ W₂ × 100',
  windPower: '발전량 ∝ 풍속³',
  solarPower: '발전량 ∝ cos(입사각)',
  average: '평균 = 값을 모두 더한 수 ÷ 값의 개수',
  growthRate: '증가율(%) = (나중 값 − 처음 값) ÷ 처음 값 × 100',
};

// 워크북 4-9 — 태양광 최적 각도(위도 기반 남향 30~35°)
export const SOLAR_OPTIMAL = { min: 30, max: 35 };

export default { INCHEON, HEATWAVE, POPULATION, BLUE_CARBON_SITES, FORMULAS };
