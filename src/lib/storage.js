import CONFIG from '../config';

// 기획서 10.2절 — 교실에서 한 대의 기기를 여러 학생이 쓰는 상황을 고려한
// "프로필 슬롯" 방식. 이름(닉네임)과 아바타만 저장하며 개인정보는 수집하지 않는다.
const KEY = CONFIG.storageKey;

const EMPTY = { profiles: [], currentProfileId: null };

export function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.profiles)) return { ...EMPTY };
    return { profiles: parsed.profiles, currentProfileId: parsed.currentProfileId ?? null };
  } catch {
    // 저장소가 막혀 있거나 값이 깨져도 게임은 계속 플레이 가능해야 한다.
    return { ...EMPTY };
  }
}

export function saveAll(state) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ profiles: state.profiles, currentProfileId: state.currentProfileId }),
    );
    return true;
  } catch {
    return false;
  }
}

export function newProfile({ displayName, avatar, gradeMode }) {
  return {
    profileId: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    displayName: (displayName || '탐험대원').slice(0, 12),
    avatar: avatar || '🐻',
    gradeMode: gradeMode || 'low',
    createdAt: new Date().toISOString(),
    lastPlayedAt: new Date().toISOString(),
    // { [chapterId]: { completed, quizScore, quizTotal, badges:[], selfCheck:[], experimentTrials:{} } }
    progress: {},
    // 기획서 8장 "탐구 저널" — 챕터에서 남긴 서술형/선택형 답변 누적
    journal: [],
    finalQuiz: null, // { score, total, completedAt }
    certificateIssuedAt: null,
  };
}
