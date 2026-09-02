// Ch5 프로젝트 빌더(워크북 5-4 시민과학 프로젝트 기획서 양식) 4단계 선택지

export const PROBLEM_TOPICS = [
  { id: 'beach_trash', label: '바닷가 쓰레기', emoji: '🗑️', sdgs: [14, 12] },
  { id: 'school_heat', label: '학교 주변 폭염', emoji: '🥵', sdgs: [11, 13] },
  { id: 'single_use', label: '일회용품 사용', emoji: '🥤', sdgs: [12] },
  { id: 'walking', label: '보행환경 안전', emoji: '🚸', sdgs: [11] },
  { id: 'energy_save', label: '학교 에너지 낭비', emoji: '💡', sdgs: [7, 13] },
  { id: 'bio_watch', label: '동네 생물 관찰', emoji: '🐦', sdgs: [14, 13] },
];

// 2단계: 조사 질문 만들기
// low = 알맞은 질문 고르기 / high = 빈칸 채우기 ("어떤 ___가 ___에서 가장 많이 발견될까?")
export const RESEARCH_QUESTIONS = {
  beach_trash: {
    options: [
      { text: '어떤 종류의 쓰레기가 해변 어느 구역에서 가장 많이 나올까?', good: true },
      { text: '쓰레기는 나쁜 것일까?', good: false },
      { text: '바다는 왜 파랄까?', good: false },
    ],
    blanks: { a: '쓰레기(예: 플라스틱 병)', b: '장소(예: 해변 입구 쪽)' },
  },
  school_heat: {
    options: [
      { text: '학교 주변 어느 지점의 낮 기온이 가장 높을까?', good: true },
      { text: '여름은 언제 끝날까?', good: false },
      { text: '더위를 싫어하는 사람은 몇 명일까?', good: false },
    ],
    blanks: { a: '측정값(예: 기온)', b: '장소(예: 그늘 없는 운동장)' },
  },
  single_use: {
    options: [
      { text: '우리 반에서 하루에 나오는 일회용품은 어떤 종류가 가장 많을까?', good: true },
      { text: '일회용품은 편리할까?', good: false },
      { text: '플라스틱은 누가 발명했을까?', good: false },
    ],
    blanks: { a: '일회용품(예: 종이컵)', b: '장소·시간(예: 급식 시간 교실)' },
  },
  walking: {
    options: [
      { text: '등굣길 어느 지점에서 위험한 상황이 가장 자주 생길까?', good: true },
      { text: '자동차는 왜 빠를까?', good: false },
      { text: '길은 넓어야 좋을까?', good: false },
    ],
    blanks: { a: '관찰 대상(예: 위험 상황)', b: '장소(예: 학교 앞 횡단보도)' },
  },
  energy_save: {
    options: [
      { text: '학교에서 아무도 없는데 켜져 있는 전등이 어느 시간대에 가장 많을까?', good: true },
      { text: '전기는 소중할까?', good: false },
      { text: '전구는 누가 만들었을까?', good: false },
    ],
    blanks: { a: '관찰 대상(예: 켜져 있는 전등)', b: '시간·장소(예: 점심시간 복도)' },
  },
  bio_watch: {
    options: [
      { text: '우리 동네 공원에서 어떤 새가 어느 계절에 가장 많이 보일까?', good: true },
      { text: '새는 예쁠까?', good: false },
      { text: '동물은 몇 종류일까?', good: false },
    ],
    blanks: { a: '생물(예: 참새)', b: '장소·시간(예: 아침 공원)' },
  },
};

export const PLACES = [
  '학교 운동장',
  '학교 앞 횡단보도',
  '동네 공원',
  '집 근처 골목',
  '바닷가·갯벌',
  '급식실·교실',
];

export const TARGETS = [
  '쓰레기 개수와 종류',
  '기온(℃)',
  '지나가는 사람 수',
  '일회용품 개수',
  '켜져 있는 전등 수',
  '보이는 생물의 종류와 수',
];

export const RECORD_ITEMS = [
  '날짜와 시간',
  '장소(사진 또는 지도 표시)',
  '측정값(숫자)',
  '날씨',
  '느낀 점 한 줄',
];

export const FREQUENCIES = ['하루에 한 번', '일주일에 두 번', '일주일에 한 번', '한 달에 한 번'];

export const POLICY_PROPOSALS = [
  { id: 'bin', label: '쓰레기 수거함 설치·확대', emoji: '🗑️' },
  { id: 'shade', label: '그늘막·나무 그늘 설치', emoji: '⛱️' },
  { id: 'campaign', label: '우리 학교 캠페인 열기', emoji: '📣' },
  { id: 'signal', label: '횡단보도 안전시설 개선 요청', emoji: '🚦' },
  { id: 'sensor', label: '자동 소등 스위치 설치 제안', emoji: '💡' },
  { id: 'report', label: '조사 결과를 구청·학교에 제안서로 제출', emoji: '📄' },
];

export default PROBLEM_TOPICS;
