import React, { useState } from 'react';
import { MascotSpeech } from '../components/Mascot';
import useGameStore from '../store/useGameStore';

const AVATARS = ['🐻', '🦀', '🐟', '🐦', '🐙', '🦭', '🐢', '⭐'];

/** 닉네임·아바타 입력(개인정보 아님 — 기획서 14장 개인정보 최소 수집 원칙) */
export default function NamingScreen() {
  const go = useGameStore((s) => s.go);
  const draft = useGameStore((s) => s.draft);
  const setDraft = useGameStore((s) => s.setDraft);
  const createProfile = useGameStore((s) => s.createProfileFromDraft);

  const [name, setName] = useState(draft.displayName || '');
  const [avatar, setAvatar] = useState(draft.avatar || '🐻');

  const start = () => {
    setDraft({ displayName: name.trim() || '탐험대원', avatar });
    // setDraft는 비동기 반영이므로 값을 직접 넘겨 생성한다
    useGameStore.setState({
      draft: { ...draft, displayName: name.trim() || '탐험대원', avatar },
    });
    createProfile();
    go('hub');
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col justify-center px-4 py-10">
      <MascotSpeech mood="idle" size="lg">
        <p className="text-xl font-black">탐험대원 이름을 정해줘!</p>
        <p className="mt-1 font-bold">
          별명이어도 좋아요. 실제 이름을 쓰지 않아도 괜찮아요.
        </p>
      </MascotSpeech>

      <div className="mt-6 grid gap-4">
        <label className="font-bold" htmlFor="nickname">
          이름(별명)
          <input
            id="nickname"
            className="field mt-2"
            maxLength={12}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 바다탐험가"
          />
        </label>

        <div>
          <p className="font-bold">내 아바타 고르기</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                className={`btn h-14 w-14 text-2xl ${avatar === a ? 'bg-mulgomi-ear' : 'bg-white'}`}
                aria-label={`아바타 ${a}`}
                aria-pressed={avatar === a}
              >
                <span aria-hidden="true">{a}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="btn-primary !py-4 text-xl" onClick={start}>
          탐험 시작하기 →
        </button>
        <button type="button" className="btn-soft" onClick={() => go('grade')}>
          ← 학년 다시 고르기
        </button>
      </div>
    </div>
  );
}
