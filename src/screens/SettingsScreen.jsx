import React from 'react';
import { Panel } from '../components/UI';
import useGameStore from '../store/useGameStore';
import { CHAPTERS } from '../data/chapters';
import { ttsSupported } from '../lib/tts';
import CONFIG, { modeLabel, MODE_LABELS } from '../config';
import track from '../lib/analytics';

/**
 * 설정 + 교사용 안내.
 * 기획서 14장에 따라 외부 링크는 게임 플레이 화면에 노출하지 않고 이 섹션으로 분리한다.
 */
export default function SettingsScreen() {
  const profile = useGameStore((s) => s.current());
  const backToHub = useGameStore((s) => s.backToHub);
  const go = useGameStore((s) => s.go);
  const setGradeMode = useGameStore((s) => s.setGradeMode);
  const gradeLocked = useGameStore((s) => s.gradeLocked);
  const setGradeLocked = useGameStore((s) => s.setGradeLocked);
  const soundOn = useGameStore((s) => s.soundOn);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const resetProgress = useGameStore((s) => s.resetCurrentProgress);
  const profiles = useGameStore((s) => s.profiles);

  const exportCsv = () => {
    // 기획서 15장 — 개인 식별 없이 집계용 학습 데이터를 CSV로 내보낸다.
    const rows = [['프로필', '모드', '챕터', '완료여부', '퀴즈점수', '퀴즈문항수', '실험시도횟수', '자가진단체크']];
    profiles.forEach((p) => {
      CHAPTERS.forEach((c) => {
        const pr = p.progress?.[c.id];
        const trials = Object.values(pr?.experimentTrials || {}).reduce((a, b) => a + b, 0);
        rows.push([
          p.displayName,
          modeLabel(p.gradeMode),
          c.title,
          pr?.completed ? 'Y' : 'N',
          pr?.quizScore ?? '',
          pr?.quizTotal ?? '',
          trials,
          (pr?.selfCheck || []).length,
        ]);
      });
    });
    const csv = '﻿' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `사이언스탐험대_학습기록_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-20 pt-4 sm:px-5">
      <header className="mb-4 flex items-center gap-3">
        <button type="button" className="btn-soft !px-3" onClick={backToHub}>
          ← 지도로
        </button>
        <h1 className="text-xl font-black sm:text-2xl">⚙️ 설정</h1>
      </header>

      <Panel title="난이도 모드">
        <p className="mb-3 font-bold">
          현재: <b>{modeLabel(profile?.gradeMode)}</b> 모드
          {gradeLocked && ' (잠김)'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn ${profile?.gradeMode === 'low' ? 'bg-mulgomi-ear' : 'bg-white'}`}
            onClick={() => setGradeMode('low')}
            disabled={gradeLocked}
          >
            {MODE_LABELS.low.emoji} {MODE_LABELS.low.name}
          </button>
          <button
            type="button"
            className={`btn ${profile?.gradeMode === 'high' ? 'bg-mulgomi-ear' : 'bg-white'}`}
            onClick={() => setGradeMode('high')}
            disabled={gradeLocked}
          >
            {MODE_LABELS.high.emoji} {MODE_LABELS.high.name}
          </button>
          <button type="button" className="btn-soft" onClick={() => setGradeLocked(!gradeLocked)}>
            {gradeLocked ? '🔓 잠금 풀기' : '🔒 모드 잠그기(교사용)'}
          </button>
        </div>
        <p className="mt-3 text-sm font-bold text-mulgomi-line/70">
          같은 챕터를 두 모드로 비교해 보며 학습할 수도 있어요. 두 모드는 다루는 내용이 같고 표현과 조작 난이도만 다릅니다.
        </p>
      </Panel>

      <Panel title="소리와 읽어주기" className="mt-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-soft" onClick={toggleSound}>
            {soundOn ? '🔔 효과음 켜짐' : '🔕 효과음 꺼짐'}
          </button>
        </div>
        <p className="mt-3 text-sm font-bold text-mulgomi-line/70">
          {ttsSupported()
            ? '문항의 🔊 버튼을 누르면 읽어줍니다. 한국어 음성 품질은 Chrome 브라우저에서 가장 좋습니다.'
            : '이 브라우저는 읽어주기(TTS)를 지원하지 않아요. Chrome 브라우저를 권장합니다.'}
        </p>
      </Panel>

      <Panel title="기록 관리" className="mt-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-soft" onClick={() => go('profiles')}>
            👥 다른 탐험대원으로 바꾸기
          </button>
          <button
            type="button"
            className="btn-soft"
            onClick={() => {
              if (confirm('이 탐험대원의 진행 기록을 모두 지울까요? 되돌릴 수 없어요.')) {
                resetProgress();
                backToHub();
              }
            }}
          >
            🗑️ 내 진행 기록 초기화
          </button>
        </div>
      </Panel>

      <Panel title="👩‍🏫 교사·보호자용 안내" className="mt-4" tone="town">
        <ul className="grid list-disc gap-2 pl-5 font-bold leading-relaxed">
          <li>
            수업 활용: 챕터는 자유 순서로 진행할 수 있어 모둠별로 다른 챕터를 동시에 운영할 수
            있습니다. 챕터당 소요 시간은 어린이 모드 5~8분, 청소년·성인 모드 10~15분입니다.
          </li>
          <li>
            개인정보: 이름(별명) 외 어떤 정보도 수집하지 않으며, 모든 기록은 이 기기의
            브라우저 저장소에만 남습니다. 기기를 공유할 때는 프로필 슬롯을 나눠 쓰세요.
          </li>
          <li>
            데이터 출처: 게임에 쓰인 수치는 「인천 SDGs 과학문화 리터러시 워크북」에 제시된 값을
            기본으로 합니다. 인천 인구만은 워크북의 두 해(2019·2025) 대신 KOSIS「행정구역별 인구수」
            (행정안전부 주민등록인구)의 2016~2025년 실측값을 사용합니다.
          </li>
          <li>학습 데이터: 아래 버튼으로 학급 단위 집계용 CSV를 내려받아 형성평가 자료로 쓸 수 있습니다.</li>
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={exportCsv}>
            📥 학습 기록 CSV 내려받기
          </button>
          <a
            className="btn-soft"
            href={CONFIG.surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track.surveyClick()}
          >
            📝 만족도·학습효과 설문 열기
          </a>
        </div>
      </Panel>

      <p className="mt-6 text-center text-xs font-bold text-mulgomi-line/60">
        {CONFIG.appName} v{CONFIG.version} · {CONFIG.credits}
      </p>
    </div>
  );
}
