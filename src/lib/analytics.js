import CONFIG from '../config';

// 기획서 17.3절 추적 이벤트: game_start / chapter_start / chapter_complete /
// certificate_issued / survey_click
// GA4가 차단되거나 오프라인이어도 게임 로직에는 영향이 없도록 안전하게 감싼다.
function send(name, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
    if (import.meta.env.DEV) console.debug('[GA4]', name, params);
  } catch {
    /* 분석 실패는 무시 — 수업 중 게임이 멈추지 않도록 */
  }
}

export const track = {
  gameStart: (gradeMode) => send('game_start', { grade_mode: gradeMode }),
  chapterStart: (chapterId, gradeMode) =>
    send('chapter_start', { chapter_id: chapterId, grade_mode: gradeMode }),
  chapterComplete: (chapterId, gradeMode, score, total) =>
    send('chapter_complete', {
      chapter_id: chapterId,
      grade_mode: gradeMode,
      quiz_score: score,
      quiz_total: total,
    }),
  certificateIssued: (gradeMode) => send('certificate_issued', { grade_mode: gradeMode }),
  surveyClick: () => send('survey_click', { survey_url: CONFIG.surveyUrl }),
  // 기획서 15장 — 실험 재시도 횟수(탐구 몰입도 간접 지표)
  experimentTrial: (experimentId, gradeMode, trialCount) =>
    send('experiment_trial', {
      experiment_id: experimentId,
      grade_mode: gradeMode,
      trial_count: trialCount,
    }),
};

export default track;
