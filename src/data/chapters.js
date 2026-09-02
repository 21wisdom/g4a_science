// 기획서 5.2 / 6장 — 챕터 메타데이터. 인천 지도 허브의 거점 좌표(%)도 함께 관리한다.
export const CHAPTERS = [
  {
    id: 'ch1_bluecarbon',
    no: 1,
    title: '갯벌의 비밀',
    subtitle: '블루카본 히어로',
    place: '강화도 갯벌',
    sdgs: [11, 12, 13, 14],
    theme: 'tidal',
    emoji: '🦀',
    // 인천 지도 허브 위 거점 위치(좌상단 기준 %)
    map: { x: 24, y: 22 },
    minutes: '10~15분',
    summary: '갯벌 흙 속에 숨은 탄소(블루카본)를 실험으로 찾아내고, 미세플라스틱을 분류한다.',
  },
  {
    id: 'ch2_ocean',
    no: 2,
    title: '바다 탐험대',
    subtitle: '인천 해양공간 판별사',
    place: '인천 앞바다',
    sdgs: [13, 14],
    theme: 'sea',
    emoji: '🚢',
    map: { x: 20, y: 58 },
    minutes: '8~12분',
    summary: '하구·갯벌·연안·섬주변해역·풀등·먼바다 6개 해양공간을 근거를 들어 판별한다.',
  },
  {
    id: 'ch3_data',
    no: 3,
    title: '데이터 탐정단',
    subtitle: '인천을 숫자로 읽다',
    place: '기상관측소',
    sdgs: [4],
    theme: 'data',
    emoji: '📊',
    map: { x: 55, y: 30 },
    minutes: '10~15분',
    summary: '인천 폭염일수·인구·해수면 데이터를 그래프로 만들고 미래를 예측한다.',
  },
  {
    id: 'ch4_energy',
    no: 4,
    title: '에너지 연구소',
    subtitle: '재생에너지 엔지니어',
    place: '영흥도',
    sdgs: [7, 9],
    theme: 'energy',
    emoji: '💨',
    map: { x: 44, y: 76 },
    minutes: '10~15분',
    summary: '풍속과 태양광 각도를 직접 조절하며 발전량이 어떻게 달라지는지 실험한다.',
  },
  {
    id: 'ch5_town',
    no: 5,
    title: '우리동네 프로젝트',
    subtitle: '인천 시민과학자 되기',
    place: '우리학교',
    sdgs: [11, 4, 13, 14, 17],
    theme: 'town',
    emoji: '🔍',
    map: { x: 74, y: 55 },
    minutes: '10~15분',
    summary: '문제 발견부터 정책 제안까지, 나만의 시민과학 프로젝트를 직접 설계한다.',
  },
];

export const getChapter = (id) => CHAPTERS.find((c) => c.id === id) || null;

// 챕터별 배지 정의(기획서 8장)
export const BADGES = {
  blue_carbon_master: { id: 'blue_carbon_master', label: '블루카본 히어로', emoji: '🌱' },
  soil_scientist: { id: 'soil_scientist', label: '갯벌 흙 분석가', emoji: '⚖️' },
  plastic_hunter: { id: 'plastic_hunter', label: '미세플라스틱 헌터', emoji: '🔬' },
  ocean_ranger: { id: 'ocean_ranger', label: '해양공간 판별사', emoji: '🧭' },
  evidence_master: { id: 'evidence_master', label: '근거의 달인', emoji: '🗂️' },
  data_detective: { id: 'data_detective', label: '데이터 탐정', emoji: '🕵️' },
  honest_graph: { id: 'honest_graph', label: '정직한 그래프 지킴이', emoji: '📐' },
  future_forecaster: { id: 'future_forecaster', label: '미래 예측가', emoji: '📈' },
  energy_engineer: { id: 'energy_engineer', label: '재생에너지 엔지니어', emoji: '⚙️' },
  wind_master: { id: 'wind_master', label: '풍속 세제곱 발견자', emoji: '🌪️' },
  solar_ace: { id: 'solar_ace', label: '태양광 명중왕', emoji: '☀️' },
  citizen_scientist: { id: 'citizen_scientist', label: '우리동네 시민과학자', emoji: '🏘️' },
  project_designer: { id: 'project_designer', label: '프로젝트 설계자', emoji: '📝' },
  sdgs_master: { id: 'sdgs_master', label: 'SDGs 마스터', emoji: '🏅' },
};

// 챕터 완료 시 자동 지급되는 대표 배지
export const CHAPTER_MAIN_BADGE = {
  ch1_bluecarbon: 'blue_carbon_master',
  ch2_ocean: 'ocean_ranger',
  ch3_data: 'data_detective',
  ch4_energy: 'energy_engineer',
  ch5_town: 'citizen_scientist',
};

export default CHAPTERS;
