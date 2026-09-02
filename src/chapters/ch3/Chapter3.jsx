import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import GraphBuilder from './GraphBuilder';
import TrendPredictor from './TrendPredictor';
import { getChapter } from '../../data/chapters';
import { HEATWAVE, INCHEON } from '../../data/datasets';

const chapter = getChapter('ch3_data');

// 워크북 PART 3 도입부(아빠와 훈이의 AI 데이터센터 대화)를 각색
const story = {
  lines: [
    '훈이가 아빠에게 물었어. "아빠, 요즘 왜 이렇게 더워요? 옛날에도 이랬어요?"',
    '아빠가 말했지. "느낌만으로는 알 수 없단다. 숫자로 확인해 봐야지."',
    '나는 물곰이 데이터 탐정! 인천의 숫자 뒤에 숨은 진실을 함께 찾아보자.',
    '오늘 우리가 볼 데이터는 세 가지야. 폭염일수, 인구, 그리고 해수면 상승.',
    '숫자는 거짓말을 하지 않아. 하지만 숫자를 보여주는 방법은 사람을 속일 수도 있어. 그 비밀도 함께 파헤쳐 보자!',
  ],
};

const briefing = (
  <ConceptCards
    title="💡 개념 브리핑 — 데이터로 생각하기"
    tone="data"
    cards={[
      {
        emoji: '📊',
        title: '어떤 그래프를 써야 할까?',
        body: '서로 다른 것의 양을 비교할 때는 막대그래프, 시간에 따른 변화를 볼 때는 꺾은선그래프, 전체 중 차지하는 비율을 볼 때는 원그래프를 씁니다.',
        highlight: '비교는 막대, 변화는 꺾은선, 비율은 원!',
      },
      {
        emoji: '🧮',
        title: '평균과 증가율',
        body: '평균은 값을 모두 더한 뒤 개수로 나눈 값입니다. 증가율은 (나중 값 − 처음 값) ÷ 처음 값 × 100으로 구하며, 얼마나 늘었는지를 백분율로 알려 줍니다.',
        highlight: '증가율(%) = (나중 − 처음) ÷ 처음 × 100',
      },
      {
        emoji: '📈',
        title: '추세선과 예측',
        body: '점으로 찍은 데이터의 흐름을 하나의 직선으로 나타낸 것이 추세선입니다. 이 선을 미래로 늘이면 예측값을 얻을 수 있어요. 다만 예측은 "지금 흐름이 계속된다면"이라는 가정 위에 있습니다.',
        highlight: '예측은 사실이 아니라 근거 있는 추정이에요.',
      },
      {
        emoji: '🔍',
        title: '그래프도 거짓말을 할 수 있어요',
        body: '같은 데이터라도 세로축을 0부터 그리느냐, 중간부터 그리느냐에 따라 차이가 훨씬 크게 보이기도 합니다. 그래서 그래프를 볼 때는 축이 어디서 시작하는지 반드시 확인해야 합니다.',
        highlight: '데이터를 볼 때는 표현 방법까지 함께 보세요.',
      },
    ]}
    facts={[
      { emoji: '🥵', value: `${HEATWAVE[0].days}일 → ${HEATWAVE[1].days}일`, label: '인천 폭염일수(1970년대 → 2010년대)' },
      { emoji: '👥', value: '295만 → 303만', label: '인천 인구(2019 → 2025)' },
      {
        emoji: '🌊',
        value: `${INCHEON.seaLevelRise2050.incheon}cm`,
        label: `2050년 인천 해수면 상승 예측(지구 평균 ${INCHEON.seaLevelRise2050.globalAvg}cm)`,
      },
    ]}
  />
);

export default function Chapter3() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={briefing}
      experiments={[
        { key: 'graph', label: '그래프 빌더', emoji: '📊', element: <GraphBuilder chapterId={chapter.id} /> },
        { key: 'trend', label: '미래예측 시뮬레이터', emoji: '📈', element: <TrendPredictor chapterId={chapter.id} /> },
      ]}
    />
  );
}
