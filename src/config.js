// 기획서 17장: 설문 URL·GA4 측정 ID는 이 파일 한 곳에서만 관리한다.
export const CONFIG = {
  appName: '인천 SDGs, 사이언스 탐험대',
  appSubtitle: '인천 SDGs 과학문화 리터러시 게임',
  // 개발·운영 주체 — 인증서 발급기관으로 표기된다
  developer: '모두의거버넌스',
  // 사업 주관 기관 (마스코트 물곰이 사용 허가처)
  organizer: '인천과학문화거점센터',
  // 화면 하단 크레딧에 함께 표기하는 문구
  credits: '모두의거버넌스 · 인천과학문화거점센터',
  version: '1.0.0',

  // 기획서 17.1절 — 최종 인증서 화면 하단 설문 버튼 링크
  surveyUrl: 'https://forms.gle/CtQAkTU2ByFSzn7y8',

  // 기획서 17.3절 — GA4 측정 ID (index.html gtag 스니펫과 동일해야 함)
  ga4MeasurementId: 'G-8XTNBN16KG',

  // localStorage 키
  storageKey: 'incheon-sdgs-expedition-v1',

  certificateTitle: '인천 SDGs 과학문화 리터러시 마스터',
};

/**
 * 난이도 모드 표기.
 *
 * 내부 값은 'low' | 'high' 그대로 둔다. 이미 저장된 프로필과 GA4 이벤트 파라미터가
 * 이 값을 쓰고 있어서, 표기만 바꾸고 값은 건드리지 않는다.
 * 난이도 자체(문항 tier, 조작 UI)는 종전과 같고 대상 표기만 학년에서 연령대로 바꿨다.
 */
export const MODE_LABELS = {
  low: { name: '어린이', short: '어린이', emoji: '🌱' },
  high: { name: '청소년 및 성인', short: '청소년·성인', emoji: '🚀' },
};

export const modeLabel = (mode, key = 'name') => (MODE_LABELS[mode] || MODE_LABELS.low)[key];

export default CONFIG;
