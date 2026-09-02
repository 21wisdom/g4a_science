import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import WindSim from './WindSim';
import SolarSim from './SolarSim';
import { getChapter } from '../../data/chapters';
import { INCHEON, SOLAR_OPTIMAL } from '../../data/datasets';

const chapter = getChapter('ch4_energy');

// 워크북 PART 4 도입부(제주도 여행에서 풍력발전기를 처음 본 훈이)를 각색
const story = {
  lines: [
    '지난 여름, 훈이는 제주도 바닷가에서 커다란 하얀 바람개비를 처음 봤어. "저게 뭐예요?"',
    '"풍력발전기란다. 바람으로 전기를 만들지." 아빠가 말했어.',
    '"그럼 우리 인천에도 있어요?" 훈이가 물었지.',
    '있고말고! 인천은 영흥도에 큰 화력발전소가 있고, 동시에 2030년까지 해상풍력 7GW를 목표로 하고 있어.',
    '오늘은 에너지 연구소 연구원이 되어, 바람과 햇빛으로 전기를 얼마나 만들 수 있는지 직접 실험해 보자!',
  ],
};

const briefing = (
  <ConceptCards
    title="💡 개념 브리핑 — 재생에너지의 원리"
    tone="energy"
    cards={[
      {
        emoji: '💨',
        title: '풍력: 발전량은 풍속의 세제곱',
        body: '바람이 날개를 밀어 회전시키고, 그 회전이 발전기를 돌려 전기를 만듭니다. 발전량은 풍속의 세제곱에 비례해서, 바람이 2배 세지면 발전량은 8배가 됩니다.',
        highlight: '발전량 ∝ 풍속³ (2배 → 8배, 3배 → 27배)',
      },
      {
        emoji: '☀️',
        title: '태양광: 빛이 닿는 각도가 중요해요',
        body: '햇빛이 패널에 수직으로 닿을 때 발전량이 가장 큽니다. 비스듬히 닿으면 같은 빛이 더 넓은 면적에 퍼지기 때문에 단위 면적당 받는 빛의 양이 줄어듭니다.',
        highlight: `발전량 ∝ cos(입사각) · 우리나라 최적각은 남향 ${SOLAR_OPTIMAL.min}~${SOLAR_OPTIMAL.max}°`,
      },
      {
        emoji: '🏭',
        title: '영흥화력 vs 해상풍력',
        body: '화력발전은 지금 당장 많은 전기를 안정적으로 만들지만 온실가스를 내뿜습니다. 해상풍력은 온실가스가 거의 없지만 건설에 시간과 비용이 들고, 철새 이동경로 같은 환경 요소도 함께 검토해야 합니다.',
        highlight: '어떤 선택에도 얻는 것과 잃는 것이 함께 있어요.',
      },
      {
        emoji: '🎯',
        title: '이 챕터의 SDGs',
        body: 'SDG 7은 모두가 깨끗하고 값싼 에너지를 쓸 수 있게 하자는 목표이고, SDG 9는 그것을 가능하게 하는 산업과 기반시설, 기술 혁신에 관한 목표입니다.',
        highlight: 'SDG 7 · SDG 9',
      },
    ]}
    facts={[
      { emoji: '💨', value: `${INCHEON.offshoreWindTarget2030GW}GW`, label: '2030년 인천 해상풍력 목표' },
      { emoji: '📐', value: `${SOLAR_OPTIMAL.min}~${SOLAR_OPTIMAL.max}°`, label: '태양광 패널 최적 설치각(남향)' },
      { emoji: '⚡', value: '2배 → 8배', label: '풍속과 발전량의 관계' },
    ]}
  />
);

export default function Chapter4() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={briefing}
      experiments={[
        { key: 'wind', label: '풍력발전 시뮬레이터', emoji: '💨', element: <WindSim chapterId={chapter.id} /> },
        { key: 'solar', label: '태양광 각도 실험', emoji: '☀️', element: <SolarSim chapterId={chapter.id} /> },
      ]}
    />
  );
}
