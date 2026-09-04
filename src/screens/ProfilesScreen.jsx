import React from 'react';
import Mascot from '../components/Mascot';
import { Panel } from '../components/UI';
import useGameStore from '../store/useGameStore';
import { CHAPTERS } from '../data/chapters';
import { modeLabel } from '../config';

/** 프로필 슬롯 선택(기획서 10.2 — 교실에서 한 기기를 여러 학생이 사용) */
export default function ProfilesScreen() {
  const profiles = useGameStore((s) => s.profiles);
  const go = useGameStore((s) => s.go);
  const selectProfile = useGameStore((s) => s.selectProfile);
  const deleteProfile = useGameStore((s) => s.deleteProfile);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-4 flex items-center gap-3">
        <button type="button" className="btn-soft !px-3" onClick={() => go('start')}>
          ←
        </button>
        <h1 className="text-2xl font-black">이어서 하기</h1>
      </header>

      <Panel title="누구의 기록을 이어서 할까요?">
        {profiles.length === 0 ? (
          <p className="font-bold">저장된 기록이 없어요.</p>
        ) : (
          <div className="grid gap-2">
            {profiles.map((p) => {
              const doneCount = CHAPTERS.filter((c) => p.progress?.[c.id]?.completed).length;
              return (
                <div key={p.profileId} className="card-pop flex items-center gap-3 bg-white p-3">
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-3 text-left"
                    onClick={() => {
                      selectProfile(p.profileId);
                      go('hub');
                    }}
                  >
                    <span className="text-3xl" aria-hidden="true">
                      {p.avatar}
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-black">{p.displayName}</span>
                      <span className="block text-sm font-bold text-mulgomi-line/70">
                        {modeLabel(p.gradeMode, 'short')} · 챕터 {doneCount}/
                        {CHAPTERS.length} 완료
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn-soft !min-w-[44px] !px-3"
                    aria-label={`${p.displayName} 기록 지우기`}
                    onClick={() => {
                      if (confirm(`${p.displayName}의 기록을 지울까요? 되돌릴 수 없어요.`))
                        deleteProfile(p.profileId);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4 flex items-center gap-3">
          <Mascot mood="idle" size="sm" />
          <button type="button" className="btn-primary flex-1" onClick={() => go('grade')}>
            ➕ 새 탐험대원으로 시작하기
          </button>
        </div>
      </Panel>
    </div>
  );
}
