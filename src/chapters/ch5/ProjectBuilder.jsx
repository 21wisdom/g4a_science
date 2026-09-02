import React, { useMemo, useState } from 'react';
import { Panel, StepDots } from '../../components/UI';
import TTSButton from '../../components/TTSButton';
import Mascot from '../../components/Mascot';
import useGameStore from '../../store/useGameStore';
import {
  PROBLEM_TOPICS,
  RESEARCH_QUESTIONS,
  PLACES,
  TARGETS,
  RECORD_ITEMS,
  FREQUENCIES,
  POLICY_PROPOSALS,
} from '../../data/ch5Options';
import { drawProjectCard, downloadDataUrl } from '../../lib/canvasArt';
import { josa } from '../../lib/korean';
import sfx from '../../lib/sound';

/**
 * 미니게임 — 프로젝트 빌더 (워크북 5-4 시민과학 프로젝트 기획서 4단계 위저드)
 *   1) 문제 발견 → 2) 조사 질문 만들기 → 3) 모니터링 설계 → 4) 정책 제안
 * 완성하면 Canvas API로 "나만의 프로젝트 카드"를 PNG로 만들어 내려받을 수 있다.
 * (교실에서 인쇄해 발표 자료·학급 게시물로 재활용 가능)
 */
const WIZARD_STEPS = [
  { key: 'p1', label: '문제 발견', emoji: '🔍' },
  { key: 'p2', label: '조사 질문', emoji: '❓' },
  { key: 'p3', label: '모니터링 설계', emoji: '📋' },
  { key: 'p4', label: '정책 제안', emoji: '📣' },
  { key: 'p5', label: '카드 완성', emoji: '🖼️' },
];

export default function ProjectBuilder({ chapterId }) {
  const isLow = useGameStore((s) => s.isLow());
  const profile = useGameStore((s) => s.current());
  const addJournal = useGameStore((s) => s.addJournal);
  const awardBadge = useGameStore((s) => s.awardBadge);
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const soundOn = useGameStore((s) => s.soundOn);

  const [step, setStep] = useState(0);
  const [topicId, setTopicId] = useState(null);
  const [freeTopic, setFreeTopic] = useState('');
  const [questionPick, setQuestionPick] = useState(null);
  const [blankA, setBlankA] = useState('');
  const [blankB, setBlankB] = useState('');
  const [place, setPlace] = useState('');
  const [target, setTarget] = useState('');
  const [freq, setFreq] = useState(FREQUENCIES[1]);
  const [records, setRecords] = useState([0, 1, 2]);
  const [proposalId, setProposalId] = useState(null);
  const [proposalNote, setProposalNote] = useState('');
  const [cardUrl, setCardUrl] = useState(null);
  const [busy, setBusy] = useState(false);

  const topic = PROBLEM_TOPICS.find((t) => t.id === topicId);
  const qset = topicId ? RESEARCH_QUESTIONS[topicId] : null;

  const problemText = isLow ? topic?.label || '' : freeTopic.trim() || topic?.label || '';
  const questionText = isLow
    ? (qset?.options[questionPick]?.text ?? '')
    : blankA && blankB
      ? `어떤 ${blankA}${josa(blankA, '이', '가')} ${blankB}에서 가장 많이 발견될까?`
      : '';
  const monitoringText = [
    place && `장소: ${place}`,
    target && `기록 대상: ${target}`,
    freq && `주기: ${freq}`,
    records.length ? `기록 항목: ${records.map((i) => RECORD_ITEMS[i]).join(', ')}` : '',
  ]
    .filter(Boolean)
    .join(' / ');
  const proposalText = [POLICY_PROPOSALS.find((p) => p.id === proposalId)?.label, proposalNote.trim()]
    .filter(Boolean)
    .join(' — ');

  const canNext = [
    Boolean(problemText),
    Boolean(questionText),
    Boolean(place && target),
    Boolean(proposalId),
    true,
  ][step];

  const makeCard = async () => {
    setBusy(true);
    try {
      const url = await drawProjectCard({
        name: profile?.displayName || '탐험대원',
        problem: problemText,
        question: questionText,
        monitoring: monitoringText,
        proposal: proposalText,
        date: new Date().toLocaleDateString('ko-KR'),
      });
      setCardUrl(url);
      awardBadge(chapterId, 'project_designer');
      addJournal({
        chapterId,
        key: 'ch5_project',
        question: '나의 시민과학 프로젝트 기획서',
        answer: `① ${problemText} / ② ${questionText} / ③ ${monitoringText} / ④ ${proposalText}`,
      });
      if (soundOn) sfx.reward();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4">
      <Panel
        title="📝 프로젝트 빌더"
        tone="town"
        right={<TTSButton text="네 단계를 차례로 채우면 나만의 시민과학 프로젝트 카드가 완성돼요." />}
      >
        <p className="mb-3 font-bold leading-relaxed">
          지금까지 배운 것을 모아 <b>나만의 시민과학 프로젝트</b>를 설계해 봅시다. 네 단계를 차례로
          채우면 프로젝트 카드가 완성돼요.
        </p>
        <StepDots steps={WIZARD_STEPS} current={step} />
      </Panel>

      {/* 1단계 */}
      {step === 0 && (
        <Panel title="1️⃣ 어떤 문제가 눈에 띄었나요?">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEM_TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTopicId(t.id);
                  setQuestionPick(null);
                  logTrial(chapterId, 'project_builder');
                }}
                className={`btn h-auto flex-col p-4 ${topicId === t.id ? 'bg-mulgomi-ear' : 'bg-white'}`}
              >
                <span className="text-3xl" aria-hidden="true">
                  {t.emoji}
                </span>
                <span className="font-black">{t.label}</span>
                <span className="text-xs">SDG {t.sdgs.join('·')}</span>
              </button>
            ))}
          </div>
          {!isLow && (
            <div className="mt-4">
              <label className="font-bold" htmlFor="free-topic">
                직접 쓰고 싶다면 여기에 적어 보세요(선택)
              </label>
              <input
                id="free-topic"
                className="field mt-2"
                maxLength={40}
                value={freeTopic}
                onChange={(e) => setFreeTopic(e.target.value)}
                placeholder="예) 등굣길에 자전거와 사람이 뒤엉킨다"
              />
            </div>
          )}
        </Panel>
      )}

      {/* 2단계 */}
      {step === 1 && (
        <Panel title="2️⃣ 조사할 수 있는 질문으로 바꿔볼까요?">
          <p className="mb-3 rounded-xl bg-sea-light p-3 font-bold">
            좋은 조사 질문은 <b>관찰하거나 측정해서 답을 확인할 수 있는</b> 질문이에요.
          </p>
          {isLow ? (
            <div className="grid gap-2">
              {qset?.options.map((o, i) => (
                <button
                  key={o.text}
                  type="button"
                  onClick={() => {
                    setQuestionPick(i);
                    if (soundOn) (o.good ? sfx.correct : sfx.wrong)();
                  }}
                  className={`btn h-auto justify-start p-3 text-left ${
                    questionPick === i ? 'bg-mulgomi-ear' : 'bg-white'
                  }`}
                >
                  {o.text}
                </button>
              ))}
              {questionPick !== null && (
                <p
                  className={`card-pop p-3 font-bold ${
                    qset.options[questionPick].good ? 'bg-[#E7F6EC]' : 'bg-[#FDECEA]'
                  }`}
                >
                  {qset.options[questionPick].good
                    ? '⭕ 좋아요! 직접 세어보고 답을 찾을 수 있는 질문이에요.'
                    : '❌ 이 질문은 관찰해서 답을 확인하기 어려워요. 다른 질문을 골라 보세요.'}
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              <p className="text-lg font-black">
                어떤 <span className="rounded bg-mulgomi-ear px-2">___</span>가{' '}
                <span className="rounded bg-mulgomi-ear px-2">___</span>에서 가장 많이 발견될까?
              </p>
              <label className="font-bold">
                첫 번째 빈칸 — {qset?.blanks.a}
                <input
                  className="field mt-1"
                  maxLength={30}
                  value={blankA}
                  onChange={(e) => setBlankA(e.target.value)}
                />
              </label>
              <label className="font-bold">
                두 번째 빈칸 — {qset?.blanks.b}
                <input
                  className="field mt-1"
                  maxLength={30}
                  value={blankB}
                  onChange={(e) => setBlankB(e.target.value)}
                />
              </label>
              {questionText && (
                <p className="card-pop bg-town-light p-3 font-black">완성된 질문: {questionText}</p>
              )}
            </div>
          )}
        </Panel>
      )}

      {/* 3단계 */}
      {step === 2 && (
        <Panel title="3️⃣ 어떻게 조사할지 계획을 세워요">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="font-bold">
              조사 장소
              <select className="field mt-1" value={place} onChange={(e) => setPlace(e.target.value)}>
                <option value="">고르세요</option>
                {PLACES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="font-bold">
              기록할 대상
              <select className="field mt-1" value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="">고르세요</option>
                {TARGETS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="font-bold sm:col-span-2">
              조사 주기
              <select className="field mt-1" value={freq} onChange={(e) => setFreq(e.target.value)}>
                {FREQUENCIES.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-4 font-bold">기록할 항목(여러 개 고를 수 있어요)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {RECORD_ITEMS.map((r, i) => (
              <button
                key={r}
                type="button"
                onClick={() =>
                  setRecords((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
                }
                className={`btn ${records.includes(i) ? 'bg-mulgomi-ear' : 'bg-white'}`}
              >
                {records.includes(i) ? '✓' : '□'} {r}
              </button>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-sea-light p-3 font-bold">
            장소·시간·기록 항목을 미리 정해 두어야 친구들의 자료와 모아서 비교할 수 있어요. 이것이
            시민과학의 힘이에요(SDG 17).
          </p>
        </Panel>
      )}

      {/* 4단계 */}
      {step === 3 && (
        <Panel title="4️⃣ 데이터가 모이면 무엇을 제안할까요?">
          <div className="grid gap-2 sm:grid-cols-2">
            {POLICY_PROPOSALS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProposalId(p.id)}
                className={`btn h-auto justify-start p-3 text-left ${
                  proposalId === p.id ? 'bg-mulgomi-ear' : 'bg-white'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {p.emoji}
                </span>
                <span className="flex-1">{p.label}</span>
              </button>
            ))}
          </div>
          {!isLow && (
            <div className="mt-4">
              <label className="font-bold" htmlFor="proposal-note">
                제안에 덧붙이고 싶은 말(선택)
              </label>
              <textarea
                id="proposal-note"
                className="field mt-2 min-h-[80px] resize-y text-base font-medium"
                maxLength={120}
                value={proposalNote}
                onChange={(e) => setProposalNote(e.target.value)}
                placeholder="예) 조사한 쓰레기 개수 자료를 함께 제출하겠습니다."
              />
            </div>
          )}
        </Panel>
      )}

      {/* 5단계 — 카드 완성 */}
      {step === 4 && (
        <Panel title="🖼️ 나만의 프로젝트 카드">
          <Summary
            rows={[
              ['① 문제 발견', problemText],
              ['② 조사 질문', questionText],
              ['③ 모니터링 설계', monitoringText],
              ['④ 정책 제안', proposalText],
            ]}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={makeCard} disabled={busy}>
              {busy ? '만드는 중…' : '🖼️ 프로젝트 카드 만들기'}
            </button>
            {cardUrl && (
              <button
                type="button"
                className="btn-accent"
                onClick={() =>
                  downloadDataUrl(cardUrl, `시민과학프로젝트_${profile?.displayName || '탐험대원'}.png`)
                }
              >
                ⬇️ PNG로 저장하기
              </button>
            )}
          </div>

          {cardUrl && (
            <div className="mt-4">
              <img
                src={cardUrl}
                alt="완성된 시민과학 프로젝트 카드"
                className="mx-auto w-full max-w-md rounded-xl border-3 border-mulgomi-line"
              />
              <p className="mt-2 flex items-center justify-center gap-2 font-bold text-ok">
                <Mascot mood="happy" size="xs" /> 인쇄해서 교실에 붙이거나 발표 자료로 써도 좋아요!
              </p>
            </div>
          )}
        </Panel>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          className="btn-soft"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          ← 이전 단계
        </button>
        {step < WIZARD_STEPS.length - 1 && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
          >
            다음 단계 →
          </button>
        )}
      </div>
    </div>
  );
}

function Summary({ rows }) {
  return (
    <div className="grid gap-2">
      {rows.map(([k, v]) => (
        <div key={k} className="card-pop bg-white p-3">
          <p className="text-sm font-black text-mulgomi-line/70">{k}</p>
          <p className="font-bold">{v || '아직 비어 있어요'}</p>
        </div>
      ))}
    </div>
  );
}
