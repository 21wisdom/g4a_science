import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Panel, Verdict } from '../../components/UI';
import Mascot from '../../components/Mascot';
import TTSButton from '../../components/TTSButton';
import useGameStore from '../../store/useGameStore';
import { MICROPLASTIC_TYPES } from '../../data/datasets';
import sfx from '../../lib/sound';

/**
 * 미니게임 2 — 미세플라스틱 헌터 (워크북 1-6 검출·분류 실험)
 *  1) 현미경 화면에서 제한 시간 안에 조각 찾아 탭
 *  2) 찾은 조각을 형태별 바구니로 분류 (저학년 2종 / 고학년 4종)
 *  3) 우리 식탁까지 오는 과정 순서 배열 퍼즐
 * 태블릿 오조작을 막기 위해 드래그가 아닌 "탭 → 바구니 탭" 방식을 기본으로 하고,
 * 마우스 환경에서는 드래그 앤 드롭도 함께 지원한다.
 */
const HUNT_SECONDS = 45;

function spawnPieces(types, count) {
  return Array.from({ length: count }, (_, i) => {
    const t = types[i % types.length];
    return {
      id: `p${i}`,
      typeId: t.id,
      emoji: t.emoji,
      x: 8 + Math.random() * 78, // %
      y: 8 + Math.random() * 78,
      rot: Math.random() * 360,
      scale: 0.85 + Math.random() * 0.5,
      found: false,
    };
  });
}

export default function MicroplasticHunter({ chapterId }) {
  const isLow = useGameStore((s) => s.isLow());
  const awardBadge = useGameStore((s) => s.awardBadge);
  const logTrial = useGameStore((s) => s.logExperimentTrial);
  const soundOn = useGameStore((s) => s.soundOn);

  const types = useMemo(
    () => (isLow ? MICROPLASTIC_TYPES.filter((t) => t.lowTier) : MICROPLASTIC_TYPES),
    [isLow],
  );
  const target = isLow ? 6 : 10;

  const [stage, setStage] = useState('ready'); // ready | hunt | sort | sequence
  const [pieces, setPieces] = useState([]);
  const [time, setTime] = useState(HUNT_SECONDS);
  const [baskets, setBaskets] = useState({});
  const [selected, setSelected] = useState(null);
  const [sortMsg, setSortMsg] = useState(null);
  const tick = useRef(null);

  const foundCount = pieces.filter((p) => p.found).length;
  const remaining = pieces.filter((p) => p.found && !isSorted(p.id, baskets));

  useEffect(() => () => clearInterval(tick.current), []);

  const start = () => {
    setPieces(spawnPieces(types, target));
    setBaskets({});
    setTime(HUNT_SECONDS);
    setStage('hunt');
    logTrial(chapterId, 'microplastic_hunter');
    clearInterval(tick.current);
    tick.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(tick.current);
          setStage('sort');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const findPiece = (id) => {
    setPieces((ps) => {
      const next = ps.map((p) => (p.id === id ? { ...p, found: true } : p));
      if (next.every((p) => p.found)) {
        clearInterval(tick.current);
        awardBadge(chapterId, 'plastic_hunter');
        setTimeout(() => setStage('sort'), 500);
      }
      return next;
    });
    if (soundOn) sfx.tap();
  };

  const putInBasket = (pieceId, typeId) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;
    const ok = piece.typeId === typeId;
    if (ok) {
      setBaskets((b) => ({ ...b, [pieceId]: typeId }));
      setSortMsg({ ok: true, text: '잘 분류했어요!' });
      if (soundOn) sfx.correct();
    } else {
      const t = MICROPLASTIC_TYPES.find((x) => x.id === piece.typeId);
      setSortMsg({ ok: false, text: `다시 살펴볼까요? 힌트: ${t?.hint}` });
      if (soundOn) sfx.wrong();
    }
    setSelected(null);
  };

  const sortedAll = pieces.length > 0 && pieces.filter((p) => p.found).every((p) => isSorted(p.id, baskets));

  return (
    <div className="grid gap-4">
      {stage === 'ready' && (
        <Panel tone="sea">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <Mascot mood="idle" size="lg" />
            <h2 className="text-xl font-black">🔬 실험 2. 미세플라스틱 헌터</h2>
            <p className="max-w-lg font-bold leading-relaxed">
              갯벌 흙을 걸러 현미경으로 관찰합니다. {HUNT_SECONDS}초 안에 미세플라스틱 조각{' '}
              <b>{target}개</b>를 모두 찾아 탭하세요. 다 찾으면 형태별로 분류합니다.
            </p>
            <TTSButton
              text={`${HUNT_SECONDS}초 안에 미세플라스틱 조각 ${target}개를 모두 찾아 누르세요.`}
            />
            <button type="button" className="btn-primary !py-3 text-lg" onClick={start}>
              현미경 켜기 🔬
            </button>
          </div>
        </Panel>
      )}

      {stage === 'hunt' && (
        <Panel
          title="🔬 현미경 관찰"
          right={
            <div className="flex items-center gap-2">
              <span className="chip">찾은 조각 {foundCount}/{pieces.length}</span>
              <span className={`chip ${time <= 10 ? 'bg-[#FDECEA]' : ''}`}>⏱ {time}초</span>
            </div>
          }
        >
          <div
            className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-full border-[10px] border-mulgomi-line"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #F3FAFF 0%, #DCEEF7 45%, #B9D6E6 100%)',
            }}
          >
            {/* 배경 갯벌 입자 (방해 요소) */}
            {BG_SPECKS.map((s, i) => (
              <span
                key={i}
                className="pointer-events-none absolute rounded-full bg-[#A9743F]/30"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r }}
                aria-hidden="true"
              />
            ))}
            {pieces.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => !p.found && findPiece(p.id)}
                className={`absolute flex h-11 w-11 items-center justify-center rounded-full text-2xl transition ${
                  p.found ? 'scale-110 bg-ok/20 ring-4 ring-ok' : 'hover:scale-110'
                }`}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: `rotate(${p.rot}deg) scale(${p.scale})`,
                }}
                aria-label={p.found ? '찾은 조각' : '미세플라스틱으로 보이는 조각'}
              >
                <span aria-hidden="true">{p.emoji}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-center font-bold">
            {foundCount === pieces.length
              ? '모두 찾았어요! 이제 분류해 봅시다.'
              : '조각을 찾아 탭하세요.'}
          </p>
          <div className="mt-2 flex justify-center">
            <button type="button" className="btn-soft" onClick={() => { clearInterval(tick.current); setStage('sort'); }}>
              분류 단계로 넘어가기 →
            </button>
          </div>
        </Panel>
      )}

      {stage === 'sort' && (
        <Panel
          title="🧺 형태별로 분류하기"
          right={<TTSButton text="찾은 조각을 눌러 고른 다음, 알맞은 바구니를 누르세요." />}
        >
          <p className="mb-3 font-bold">
            조각을 하나 고른 뒤, 알맞은 바구니를 누르세요. (마우스에서는 끌어다 놓아도 돼요)
          </p>

          <div className="mb-4 flex min-h-[76px] flex-wrap gap-2 rounded-xl border-3 border-dashed border-mulgomi-line bg-white p-3">
            {remaining.length === 0 ? (
              <span className="font-bold text-mulgomi-line/60">
                {foundCount === 0 ? '찾은 조각이 없어요.' : '모든 조각을 분류했어요!'}
              </span>
            ) : (
              remaining.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', p.id)}
                  onClick={() => setSelected(selected === p.id ? null : p.id)}
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border-3 border-mulgomi-line text-2xl ${
                    selected === p.id ? 'bg-mulgomi-ear' : 'bg-white'
                  }`}
                  aria-pressed={selected === p.id}
                  aria-label="찾은 조각"
                >
                  <span aria-hidden="true">{p.emoji}</span>
                </button>
              ))
            )}
          </div>

          <div className={`grid gap-3 ${isLow ? 'sm:grid-cols-2' : 'sm:grid-cols-4'}`}>
            {types.map((t) => {
              const count = Object.values(baskets).filter((v) => v === t.id).length;
              return (
                <div
                  key={t.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData('text/plain');
                    if (id) putInBasket(id, t.id);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => selected && putInBasket(selected, t.id)}
                    className="btn h-auto w-full flex-col bg-white p-3"
                  >
                    <span className="text-3xl" aria-hidden="true">
                      {t.emoji}
                    </span>
                    <span className="font-black">{t.name}</span>
                    <span className="text-xs font-medium leading-tight">{t.hint}</span>
                    <span className="chip mt-1">{count}개</span>
                  </button>
                </div>
              );
            })}
          </div>

          {sortMsg && <Verdict correct={sortMsg.ok}>{sortMsg.text}</Verdict>}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStage('sequence')}
              disabled={foundCount > 0 && !sortedAll}
            >
              다음: 우리 식탁까지 오는 길 →
            </button>
          </div>
        </Panel>
      )}

      {stage === 'sequence' && <SequencePuzzle onRestart={start} />}
    </div>
  );
}

function isSorted(pieceId, baskets) {
  return Object.prototype.hasOwnProperty.call(baskets, pieceId);
}

const BG_SPECKS = Array.from({ length: 26 }, () => ({
  x: Math.random() * 92,
  y: Math.random() * 92,
  r: 4 + Math.random() * 9,
}));

/** 미세플라스틱이 우리 식탁까지 오는 과정 순서 배열 퍼즐 */
const SEQUENCE = [
  { id: 's1', label: '바다·갯벌에 버려진 플라스틱', emoji: '🥤' },
  { id: 's2', label: '잘게 부서져 미세플라스틱이 됨', emoji: '🔬' },
  { id: 's3', label: '갯벌 생물이 먹음', emoji: '🦪' },
  { id: 's4', label: '물고기가 그 생물을 먹음', emoji: '🐟' },
  { id: 's5', label: '사람의 식탁에 오름', emoji: '🍽️' },
];

function SequencePuzzle({ onRestart }) {
  const soundOn = useGameStore((s) => s.soundOn);
  const [pool, setPool] = useState(() => shuffle(SEQUENCE));
  const [slots, setSlots] = useState([]);
  const [checked, setChecked] = useState(null);

  const place = (item) => {
    setPool((p) => p.filter((x) => x.id !== item.id));
    setSlots((s) => [...s, item]);
    setChecked(null);
  };
  const takeBack = (item) => {
    setSlots((s) => s.filter((x) => x.id !== item.id));
    setPool((p) => [...p, item]);
    setChecked(null);
  };
  const check = () => {
    const ok = slots.map((s) => s.id).join(',') === SEQUENCE.map((s) => s.id).join(',');
    setChecked(ok);
    if (soundOn) (ok ? sfx.correct : sfx.wrong)();
  };

  return (
    <Panel
      title="🍽️ 우리 식탁까지 오는 길"
      right={<TTSButton text="미세플라스틱이 우리 식탁까지 오는 순서대로 카드를 놓아 보세요." />}
    >
      <p className="mb-3 font-bold">순서대로 카드를 눌러 배열해 보세요.</p>

      <div className="mb-3 grid gap-2">
        {SEQUENCE.map((_, i) => {
          const item = slots[i];
          return (
            <div
              key={i}
              className={`flex min-h-[56px] items-center gap-3 rounded-xl border-3 px-3 py-2 ${
                item ? 'border-mulgomi-line bg-mulgomi-ear' : 'border-dashed border-mulgomi-line bg-white'
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-mulgomi-line bg-white font-black">
                {i + 1}
              </span>
              {item ? (
                <button
                  type="button"
                  className="flex flex-1 items-center gap-2 text-left font-bold"
                  onClick={() => takeBack(item)}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {item.emoji}
                  </span>
                  {item.label}
                  <span className="ml-auto text-sm text-mulgomi-line/60">되돌리기 ↩</span>
                </button>
              ) : (
                <span className="font-bold text-mulgomi-line/50">여기에 카드를 놓으세요</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {pool.map((item) => (
          <button key={item.id} type="button" className="btn bg-white" onClick={() => place(item)}>
            <span className="text-xl" aria-hidden="true">
              {item.emoji}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={check} disabled={slots.length !== SEQUENCE.length}>
          순서 확인하기
        </button>
        <button
          type="button"
          className="btn-soft"
          onClick={() => {
            setPool(shuffle(SEQUENCE));
            setSlots([]);
            setChecked(null);
          }}
        >
          🔁 다시 배열하기
        </button>
        <button type="button" className="btn-soft" onClick={onRestart}>
          🔬 조각 찾기 다시 하기
        </button>
      </div>

      {checked !== null && (
        <Verdict correct={checked}>
          {checked
            ? '맞아요! 우리가 버린 플라스틱은 잘게 부서져 갯벌 생물 → 물고기 → 사람으로 돌아옵니다.'
            : '다시 생각해 보세요. 가장 작은 생물이 먼저 먹어요.'}
        </Verdict>
      )}
    </Panel>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
