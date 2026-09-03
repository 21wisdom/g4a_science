/**
 * 수치입력 문항 채점 규칙 (2026-09 검수 결정 01)
 *
 * 정답 조건은 둘 중 하나만 만족하면 된다.
 *   1. 정답과의 차이가 허용오차 이내
 *   2. 반올림한 정수가 정답의 반올림한 정수와 같음
 *
 * 2번 조건 덕분에 소수 계산이 익숙하지 않은 학생도 정수로 답하면 정답 처리되고,
 * 1번 조건은 그대로 두었기 때문에 허용오차를 넓히지 않아도 된다.
 * 정확한 값은 해설에서 소수까지 제시한다.
 */
export function isNumericAnswerCorrect(value, answer, tolerance = 0.5) {
  if (!Number.isFinite(value)) return false;
  if (Math.abs(value - answer) <= tolerance) return true;
  return Math.round(value) === Math.round(answer);
}

export default isNumericAnswerCorrect;
