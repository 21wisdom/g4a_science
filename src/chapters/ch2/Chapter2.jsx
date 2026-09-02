import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import SpaceSorting from './SpaceSorting';
import { getChapter } from '../../data/chapters';
import { OCEAN_SPACE_TYPES, INCHEON } from '../../data/datasets';

const chapter = getChapter('ch2_ocean');

const story = {
  lines: [
    '오늘은 배를 타고 인천 앞바다로 나가는 날이야!',
    '위에서 내려다본 인천 바다는 곳곳이 서로 다른 모습을 하고 있어. 진흙 벌판, 갈대밭, 항구, 그리고 바다 한가운데 나타난 모래섬까지.',
    '바다를 지키려면 먼저 "여기가 어떤 곳인지" 알아야 해. 장소마다 사는 생물도, 필요한 보호 방법도 다르거든.',
    '자, 탐험대원! 사진을 보고 어떤 해양공간인지 판별해 줘. 그리고 꼭 말해줘 — 왜 그렇게 생각했는지!',
  ],
};

const briefing = (
  <ConceptCards
    title="💡 개념 브리핑 — 인천의 해양공간 6가지"
    tone="sea"
    cards={OCEAN_SPACE_TYPES.map((t) => ({
      emoji: t.emoji,
      title: t.name,
      body: `${t.short}. ${t.detail}`,
      highlight: null,
    })).concat([
      {
        emoji: '🔎',
        title: '판별의 근거 5가지',
        body: '흙의 성질(곱다/거칠다), 물길과 물의 모습, 생물의 흔적(게구멍·조개), 식물(갈대·염생식물), 사람의 이용 흔적(항구·방파제). 이 다섯 가지를 살피면 어떤 공간인지 판단할 수 있어요.',
        highlight: '근거 없는 판단은 과학이 아니에요.',
      },
    ])}
    facts={[
      { emoji: '🗺️', value: '6가지', label: '인천의 해양공간 유형' },
      { emoji: '🌊', value: `약 ${INCHEON.tidalFlatAreaKm2}㎢`, label: '인천 갯벌 면적' },
      { emoji: '💨', value: `${INCHEON.offshoreWindTarget2030GW}GW`, label: '2030년 인천 해상풍력 목표' },
    ]}
  />
);

export default function Chapter2() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={briefing}
      experiments={[
        { key: 'sort', label: '공간 판별 카드', emoji: '🧭', element: <SpaceSorting chapterId={chapter.id} /> },
      ]}
    />
  );
}
