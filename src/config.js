// 기획서 17장: 설문 URL·GA4 측정 ID는 이 파일 한 곳에서만 관리한다.
export const CONFIG = {
  appName: '인천 SDGs, 사이언스 탐험대',
  appSubtitle: '인천 SDGs 과학문화 리터러시 게임',
  organizer: '인천과학문화거점센터',
  version: '1.0.0',

  // 기획서 17.1절 — 최종 인증서 화면 하단 설문 버튼 링크
  surveyUrl: 'https://forms.gle/CtQAkTU2ByFSzn7y8',

  // 기획서 17.3절 — GA4 측정 ID (index.html gtag 스니펫과 동일해야 함)
  ga4MeasurementId: 'G-8XTNBN16KG',

  // localStorage 키
  storageKey: 'incheon-sdgs-expedition-v1',

  certificateTitle: '인천 SDGs 과학문화 리터러시 마스터',
};

export default CONFIG;
