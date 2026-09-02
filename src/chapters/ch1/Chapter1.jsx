import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import BlueCarbonLab from './BlueCarbonLab';
import MicroplasticHunter from './MicroplasticHunter';
import { getChapter } from '../../data/chapters';
import { INCHEON } from '../../data/datasets';

const chapter = getChapter('ch1_bluecarbon');

// 워크북 PART 1 도입부(민지와 할머니의 소래습지 산책)를 캐릭터 대사로 각색
const story = {
  lines: [
    '안녕! 나는 인천 과학문화 마스코트 물곰이야. 오늘부터 너는 「인천 리틀 사이언티스트」 대원이야!',
    '오늘 아침, 민지는 할머니와 소래습지로 산책을 나갔어. 질척한 갯벌 위로 게들이 바쁘게 오가고 있었지.',
    '할머니가 말씀하셨어. "얘야, 이 갯벌이 지구를 식혀주는 거란다."',
    '민지는 고개를 갸웃했어. "진흙 벌판이 어떻게 지구를 식혀요?"',
    '바로 그거야! 갯벌 흙 속에는 눈에 보이지 않는 탄소가 잔뜩 저장돼 있거든. 우리가 직접 실험해서 확인해 보자!',
  ],
};

const briefing = (
  <ConceptCards
    title="💡 개념 브리핑 — 갯벌과 블루카본"
    tone="tidal"
    cards={[
      {
        emoji: '🌊',
        title: '블루카본이 뭐예요?',
        body: '갯벌·염습지·해초밭처럼 바다와 맞닿은 생태계가 붙잡아 저장한 탄소를 블루카본이라고 불러요. 육상 산림이 저장한 탄소는 그린카본이라고 하지요.',
        highlight: '갯벌은 바다의 탄소 저장고예요.',
      },
      {
        emoji: '⚖️',
        title: '어떻게 탄소를 재나요?',
        body: '흙을 말려서 물을 없앤 뒤(W₂), 높은 온도로 태우면 유기물이 타서 사라집니다(W₃). 태우기 전과 후의 무게 차이가 바로 흙 속에 있던 유기물, 곧 탄소의 양이에요. 이것을 강열감량법이라고 해요.',
        highlight: '유기물 함량(%) = (W₂ − W₃) ÷ W₂ × 100',
      },
      {
        emoji: '🦀',
        title: '왜 갯벌에 탄소가 쌓일까요?',
        body: '갯벌은 바닷물에 자주 잠겨 산소가 부족해요. 산소가 적으면 죽은 생물과 식물이 잘 썩지 않아서, 탄소가 흙 속에 그대로 갇힌 채 수천 년 동안 쌓입니다.',
        highlight: '오래 잠겨 있는 곳일수록 탄소가 더 많이 쌓여요.',
      },
      {
        emoji: '🥤',
        title: '미세플라스틱이란?',
        body: '5mm보다 작은 플라스틱 조각이에요. 비닐이나 그물, 화장품 알갱이가 잘게 부서져 만들어집니다. 갯벌 생물이 먹이로 착각해 먹으면, 물고기를 거쳐 결국 우리 식탁으로 돌아와요.',
        highlight: '우리가 버린 것이 우리에게 돌아옵니다.',
      },
    ]}
    facts={[
      { emoji: '🗺️', value: `약 ${INCHEON.tidalFlatAreaKm2}㎢`, label: '인천 갯벌 면적' },
      { emoji: '🌳', value: `최대 ${INCHEON.carbonAbsorbVsForest}배`, label: '육상 산림 대비 탄소 흡수량' },
      { emoji: '🎯', value: '11·12·13·14', label: '이 챕터와 연결된 SDGs' },
    ]}
  />
);

export default function Chapter1() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={briefing}
      experiments={[
        {
          key: 'lab',
          label: '블루카본 실험실',
          emoji: '🧪',
          element: <BlueCarbonLab chapterId={chapter.id} />,
        },
        {
          key: 'hunt',
          label: '미세플라스틱 헌터',
          emoji: '🔬',
          element: <MicroplasticHunter chapterId={chapter.id} />,
        },
      ]}
    />
  );
}
