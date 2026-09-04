// Ch2 공간 판별 카드 소팅용 데이터(워크북 2-3 활동).
// answers 배열에 정답이 2개 이상인 카드가 있는 이유: 워크북 원문처럼 "하나의 정답이 아니어도 됨"을
// 반영해, 두 유형이 공존 가능한 장면은 두 답 모두 정답으로 처리한다(기획서 6장 Ch2).
// visual: SVG 장면 파라미터(하늘/물/땅 색 + 배치 요소) — 실제 삽화가 없을 때 쓰이는 대체 이미지
// scene: src/assets/illustrations/ocean-<scene>.webp 가 있으면 SVG 대신 그 삽화를 쓴다

export const EVIDENCE_TAGS = [
  { id: 'soil', label: '흙의 성질', emoji: '🟤' },
  { id: 'water', label: '물길·물의 모습', emoji: '💧' },
  { id: 'life', label: '생물의 흔적', emoji: '🐚' },
  { id: 'plant', label: '식물', emoji: '🌿' },
  { id: 'human', label: '사람 이용 흔적', emoji: '⚓' },
];

export const CH2_CARDS = [
  {
    id: 'c1',
    title: '갈대밭 사이로 흐르는 물길',
    clue: '민물과 바닷물이 만나 갈대가 넓게 자라고 있어요.',
    answers: ['estuary'],
    evidence: ['plant', 'water'],
    lowTier: true,
    scene: 'estuary',
    visual: { sky: '#CFE7F7', water: '#7FB2D6', ground: '#B8A66B', items: ['🌾', '🌾', '💧'] },
  },
  {
    id: 'c2',
    title: '썰물에 드러난 넓은 진흙 벌판',
    clue: '물이 빠지자 부드러운 흙바닥이 드러났고, 도요새들이 먹이를 찾고 있어요.',
    answers: ['tidalflat'],
    evidence: ['soil', 'life'],
    lowTier: true,
    scene: 'tidalflat',
    visual: { sky: '#D9EEF8', water: '#9CC7DE', ground: '#8B6B47', items: ['🦀', '🐚', '🦆'] },
  },
  {
    id: 'c3',
    title: '배가 드나드는 여객선 부두',
    clue: '여객선과 부두 시설이 길게 늘어서 있고, 사람들이 배를 타고 내려요.',
    answers: ['coast'],
    evidence: ['human'],
    lowTier: true,
    scene: 'coast',
    visual: { sky: '#CDE6F5', water: '#4E8FBB', ground: '#9AA5AB', items: ['⚓', '🚤', '🗑️'] },
  },
  {
    id: 'c4',
    title: '바다 한가운데 드러난 넓은 모래벌판',
    clue: '주변은 온통 바다인데, 썰물이 되자 거대한 모래섬이 나타났어요.',
    answers: ['pooldeung'],
    evidence: ['soil', 'water'],
    lowTier: true,
    scene: 'pooldeung',
    visual: { sky: '#D6EDF9', water: '#5FA4CC', ground: '#E7D8A8', items: ['🏜️', '🐦'] },
  },
  {
    id: 'c5',
    title: '바다 한가운데 숲이 우거진 섬',
    clue: '섬 둘레로 모래 해변과 바위가 이어지고, 멀리 다른 섬들도 보여요.',
    answers: ['island'],
    evidence: ['soil', 'life'],
    lowTier: false,
    scene: 'island',
    visual: { sky: '#CFE8F6', water: '#3F87B5', ground: '#A79E8E', items: ['🏝️', '🪨', '🐟'] },
  },
  {
    id: 'c6',
    title: '육지가 보이지 않는 넓은 바다',
    clue: '사방이 물뿐이고 물빛이 짙어요. 저 멀리 배 한 척만 지나갑니다.',
    answers: ['openocean'],
    evidence: ['water'],
    lowTier: false,
    scene: 'openocean',
    visual: { sky: '#BFDFF2', water: '#1F6FA5', ground: '#1F6FA5', items: ['🌊', '💨', '🛥️'] },
  },
  {
    id: 'c7',
    scene: 'estuary-tidalflat',
    title: '강물이 바다로 흘러드는 곳의 진흙 벌판',
    clue: '강물이 굽이쳐 바다로 흘러가고, 그 옆에 고운 흙이 넓게 쌓였어요. 염생식물이 자라고 물새가 먹이를 찾고 있습니다.',
    // 하구이면서 갯벌이기도 한 장면 → 두 답 모두 정답
    answers: ['estuary', 'tidalflat'],
    evidence: ['soil', 'water', 'life'],
    lowTier: false,
    visual: { sky: '#D3EAF6', water: '#79B0D3', ground: '#7E6446', items: ['🌾', '🦀', '💧'] },
  },
  {
    id: 'c8',
    scene: 'coast-beach',
    title: '사람들이 물놀이하는 모래 해변',
    clue: '넓은 모래사장에서 사람들이 놀고 있고, 바다에는 안전 부표가 떠 있어요. 뒤로는 건물과 도로가 보입니다.',
    answers: ['coast'],
    evidence: ['human', 'soil'],
    lowTier: false,
    visual: { sky: '#CDE9F7', water: '#57A0C9', ground: '#E8D5A6', items: ['⛱️', '🚶', '🏖️'] },
  },
  {
    id: 'c9',
    scene: 'island-farm',
    title: '섬 앞 얕은 바다의 김 양식장',
    clue: '섬 앞 얕은 바다에 김을 기르는 그물이 끝없이 줄지어 있어요. 사람이 바다를 이용해 먹을거리를 기르는 곳입니다.',
    // 섬주변해역이면서 사람이 이용하는 연안이기도 하다
    answers: ['island', 'coast'],
    evidence: ['human', 'water'],
    lowTier: false,
    visual: { sky: '#CFE7F5', water: '#4A93C0', ground: '#8FA9B5', items: ['🏝️', '🪣', '🌊'] },
  },
  {
    id: 'c10',
    scene: 'pooldeung-tide',
    title: '바다 한가운데 길게 뻗은 모래톱',
    clue: '섬에서 떨어진 바다 한가운데에 모래벌판이 길게 드러나 있어요. 밀물이 들어오면 이 모래벌판은 물에 잠깁니다.',
    answers: ['pooldeung'],
    evidence: ['water', 'soil'],
    lowTier: false,
    visual: { sky: '#C9E4F4', water: '#4F97C4', ground: '#DCCB9C', items: ['🌊', '🏜️'] },
  },
];

export const lowTierCards = () => CH2_CARDS.filter((c) => c.lowTier);
export default CH2_CARDS;
