import { create } from 'zustand';
import { loadAll, saveAll, newProfile } from '../lib/storage';
import track from '../lib/analytics';

const initial = loadAll();

function persist(get) {
  const { profiles, currentProfileId } = get();
  saveAll({ profiles, currentProfileId });
}

function patchCurrent(set, get, updater) {
  const { profiles, currentProfileId } = get();
  if (!currentProfileId) return;
  const next = profiles.map((p) => (p.profileId === currentProfileId ? updater(p) : p));
  set({ profiles: next });
  persist(get);
}

export const useGameStore = create((set, get) => ({
  // ── 화면 라우팅(별도 라우터 없이 전역 상태로 관리) ────────────────
  screen: 'start', // start | profiles | grade | naming | hub | chapter | journal | final | certificate | settings | teacher
  activeChapterId: null,
  // 학년 설정 잠금(기획서 4.2절 — 교사가 잠글 수 있음)
  gradeLocked: false,
  soundOn: true,

  profiles: initial.profiles,
  currentProfileId: initial.currentProfileId,

  // 프로필 생성 중 임시 보관값
  draft: { gradeMode: null, displayName: '', avatar: '🐻' },

  // ── 셀렉터 ────────────────────────────────────────────────────
  current: () => {
    const { profiles, currentProfileId } = get();
    return profiles.find((p) => p.profileId === currentProfileId) || null;
  },
  gradeMode: () => get().current()?.gradeMode || 'low',
  isLow: () => (get().current()?.gradeMode || 'low') === 'low',

  // ── 네비게이션 ────────────────────────────────────────────────
  go: (screen, payload = {}) => set({ screen, ...payload }),
  openChapter: (chapterId) => {
    const p = get().current();
    track.chapterStart(chapterId, p?.gradeMode || 'low');
    set({ screen: 'chapter', activeChapterId: chapterId });
  },
  backToHub: () => set({ screen: 'hub', activeChapterId: null }),

  // ── 프로필 ────────────────────────────────────────────────────
  setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),

  createProfileFromDraft: () => {
    const { draft, profiles } = get();
    const p = newProfile(draft);
    set({ profiles: [...profiles, p], currentProfileId: p.profileId });
    persist(get);
    track.gameStart(p.gradeMode);
    return p;
  },

  selectProfile: (profileId) => {
    const { profiles } = get();
    const next = profiles.map((p) =>
      p.profileId === profileId ? { ...p, lastPlayedAt: new Date().toISOString() } : p,
    );
    set({ profiles: next, currentProfileId: profileId });
    persist(get);
    const p = next.find((x) => x.profileId === profileId);
    track.gameStart(p?.gradeMode || 'low');
  },

  deleteProfile: (profileId) => {
    const { profiles, currentProfileId } = get();
    const next = profiles.filter((p) => p.profileId !== profileId);
    set({
      profiles: next,
      currentProfileId: currentProfileId === profileId ? null : currentProfileId,
    });
    persist(get);
  },

  setGradeMode: (gradeMode) => {
    if (get().gradeLocked) return;
    patchCurrent(set, get, (p) => ({ ...p, gradeMode }));
  },
  setGradeLocked: (locked) => set({ gradeLocked: locked }),
  toggleSound: () => set({ soundOn: !get().soundOn }),

  // ── 진행 상태 ─────────────────────────────────────────────────
  getChapterProgress: (chapterId) => get().current()?.progress?.[chapterId] || null,

  // 실험 재시도 횟수 기록(기획서 15장 탐구 몰입도 지표)
  logExperimentTrial: (chapterId, experimentId) => {
    patchCurrent(set, get, (p) => {
      const prev = p.progress[chapterId] || {};
      const trials = { ...(prev.experimentTrials || {}) };
      trials[experimentId] = (trials[experimentId] || 0) + 1;
      return {
        ...p,
        progress: { ...p.progress, [chapterId]: { ...prev, experimentTrials: trials } },
      };
    });
    const p = get().current();
    const count = p?.progress?.[chapterId]?.experimentTrials?.[experimentId] || 1;
    // 과도한 이벤트 전송을 피하기 위해 5회 단위로만 집계 전송
    if (count % 5 === 0) track.experimentTrial(experimentId, p?.gradeMode || 'low', count);
  },

  // 미니 도전과제 배지(기획서 8장)
  awardBadge: (chapterId, badgeId) => {
    patchCurrent(set, get, (p) => {
      const prev = p.progress[chapterId] || {};
      const badges = prev.badges || [];
      if (badges.includes(badgeId)) return p;
      return {
        ...p,
        progress: {
          ...p.progress,
          [chapterId]: { ...prev, badges: [...badges, badgeId] },
        },
      };
    });
  },

  completeChapter: (chapterId, { quizScore, quizTotal, selfCheck = [] }) => {
    patchCurrent(set, get, (p) => {
      const prev = p.progress[chapterId] || {};
      return {
        ...p,
        lastPlayedAt: new Date().toISOString(),
        progress: {
          ...p.progress,
          [chapterId]: {
            ...prev,
            completed: true,
            quizScore,
            quizTotal,
            selfCheck,
            completedAt: new Date().toISOString(),
          },
        },
      };
    });
    const p = get().current();
    track.chapterComplete(chapterId, p?.gradeMode || 'low', quizScore, quizTotal);
  },

  // 탐구 저널 기록 추가/갱신(같은 chapterId+key는 덮어쓴다)
  addJournal: (entry) => {
    patchCurrent(set, get, (p) => {
      const rest = p.journal.filter(
        (j) => !(j.chapterId === entry.chapterId && j.key === entry.key),
      );
      return {
        ...p,
        journal: [...rest, { ...entry, savedAt: new Date().toISOString() }],
      };
    });
  },

  saveFinalQuiz: ({ score, total }) => {
    patchCurrent(set, get, (p) => ({
      ...p,
      finalQuiz: { score, total, completedAt: new Date().toISOString() },
    }));
  },

  markCertificateIssued: () => {
    patchCurrent(set, get, (p) => ({
      ...p,
      certificateIssuedAt: p.certificateIssuedAt || new Date().toISOString(),
    }));
    track.certificateIssued(get().current()?.gradeMode || 'low');
  },

  resetCurrentProgress: () => {
    patchCurrent(set, get, (p) => ({
      ...p,
      progress: {},
      journal: [],
      finalQuiz: null,
      certificateIssuedAt: null,
    }));
  },
}));

export default useGameStore;
