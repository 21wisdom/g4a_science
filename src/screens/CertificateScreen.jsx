import React, { useEffect, useState } from 'react';
import Mascot from '../components/Mascot';
import { Panel } from '../components/UI';
import useGameStore from '../store/useGameStore';
import { drawCertificate, downloadDataUrl } from '../lib/canvasArt';
import { BADGES, CHAPTERS } from '../data/chapters';
import CONFIG, { modeLabel } from '../config';
import track from '../lib/analytics';

/** 최종 인증서 발급 + 설문 안내(기획서 6장 Ch5 / 17.1절) */
export default function CertificateScreen() {
  const profile = useGameStore((s) => s.current());
  const backToHub = useGameStore((s) => s.backToHub);
  const markIssued = useGameStore((s) => s.markCertificateIssued);
  const isLow = useGameStore((s) => s.isLow());

  const [name, setName] = useState(profile?.displayName || '');
  const [url, setUrl] = useState(null);
  const [busy, setBusy] = useState(false);

  const badges = Object.values(profile?.progress || {}).flatMap((p) => p.badges || []);
  const badgeLabels = badges.map((b) => BADGES[b]?.label).filter(Boolean);
  const final = profile?.finalQuiz;

  useEffect(() => {
    markIssued();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const make = async () => {
    setBusy(true);
    try {
      const dataUrl = await drawCertificate({
        name: name.trim() || '탐험대원',
        modeLabel: modeLabel(profile?.gradeMode),
        date: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        score: final?.score ?? 0,
        total: final?.total ?? 0,
        badges: badgeLabels,
      });
      setUrl(dataUrl);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-20 pt-4 sm:px-5">
      <header className="mb-4 flex items-center gap-3">
        <button type="button" className="btn-soft !px-3" onClick={backToHub}>
          ← 지도로
        </button>
        <h1 className="text-xl font-black sm:text-2xl">🎓 인증서 발급</h1>
      </header>

      <Panel tone="sea">
        <div className="flex flex-col items-center gap-3 text-center">
          <Mascot mood="happy" size="lg" />
          <h2 className="text-2xl font-black">축하해요, {profile?.displayName} 대원!</h2>
          <p className="font-bold leading-relaxed">
            5개 챕터와 최종 통합 퀴즈를 모두 마쳤어요.
            {final ? ` 최종 퀴즈 ${final.total}문제 중 ${final.score}문제를 한 번에 맞혔어요.` : ''}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {badgeLabels.map((b, i) => (
              <span key={`${b}-${i}`} className="chip bg-mulgomi-ear">
                {b}
              </span>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="인증서에 넣을 이름" className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="field max-w-xs"
            maxLength={12}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="인증서 이름"
          />
          <button type="button" className="btn-primary" onClick={make} disabled={busy}>
            {busy ? '만드는 중…' : '🎓 인증서 만들기'}
          </button>
          {url && (
            <button
              type="button"
              className="btn-accent"
              onClick={() => downloadDataUrl(url, `${CONFIG.certificateTitle}_${name || '탐험대원'}.png`)}
            >
              ⬇️ PNG로 저장하기
            </button>
          )}
        </div>
        {url && (
          <img
            src={url}
            alt="발급된 인증서"
            className="mt-4 w-full rounded-xl border-3 border-mulgomi-line"
          />
        )}
      </Panel>

      {/* 기획서 17.1 — 인증서 화면 하단 설문 카드 */}
      <Panel tone="energy" className="mt-4">
        <div className="flex flex-wrap items-center gap-4">
          <Mascot mood="idle" size="sm" />
          <div className="flex-1 min-w-[220px]">
            <p className="text-lg font-black">게임은 어땠나요? 설문에 참여해 주세요 🐻</p>
            <p className="text-sm font-bold leading-snug">
              여러분의 답이 다음 게임을 더 좋게 만들어요. 이름이나 연락처는 묻지 않아요.
            </p>
          </div>
          <a
            className="btn-primary"
            href={CONFIG.surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track.surveyClick()}
          >
            설문 참여하기 →
          </a>
        </div>
      </Panel>

      <Panel title="다시 탐험하기" className="mt-4">
        <div className="flex flex-wrap gap-2">
          {CHAPTERS.map((c) => (
            <ChapterLink key={c.id} chapter={c} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ChapterLink({ chapter }) {
  const openChapter = useGameStore((s) => s.openChapter);
  return (
    <button type="button" className="btn-soft" onClick={() => openChapter(chapter.id)}>
      <span aria-hidden="true">{chapter.emoji}</span> Ch{chapter.no}. {chapter.title}
    </button>
  );
}
