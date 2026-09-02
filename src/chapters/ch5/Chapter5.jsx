import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import ProjectBuilder from './ProjectBuilder';
import { getChapter } from '../../data/chapters';

const chapter = getChapter('ch5_town');

const story = {
  lines: [
    '여기까지 온 탐험대원, 정말 대단해! 갯벌도, 바다도, 데이터도, 에너지도 모두 탐험했어.',
    '이제 마지막 미션이야. 지금까지 배운 방법을 우리 동네에 직접 써 볼 차례거든.',
    '과학은 연구실에서만 하는 게 아니야. 관찰하고, 기록하고, 근거를 모으면 누구나 과학자가 될 수 있어. 이걸 시민과학이라고 해.',
    '우리 동네에서 어떤 문제가 눈에 띄었니? 그 문제를 조사 질문으로 바꾸고, 계획을 세우고, 제안까지 만들어 보자!',
  ],
};

const briefing = (
  <ConceptCards
    title="💡 개념 브리핑 — 시민과학 4단계"
    tone="town"
    cards={[
      {
        emoji: '🔍',
        title: '1단계. 문제 발견',
        body: '등굣길, 학교 운동장, 동네 공원에서 "어, 이상한데?" 싶은 장면을 찾습니다. 시민과학은 언제나 일상의 관찰에서 시작해요.',
        highlight: '좋은 연구는 좋은 관찰에서 시작합니다.',
      },
      {
        emoji: '❓',
        title: '2단계. 조사 질문 만들기',
        body: '"쓰레기가 많다"는 느낌입니다. "어떤 쓰레기가 해변 어느 구역에서 가장 많이 나올까?"는 조사할 수 있는 질문이에요. 대상·장소·시간을 분명히 하면 답을 확인할 수 있습니다.',
        highlight: '느낌을 측정 가능한 질문으로 바꾸세요.',
      },
      {
        emoji: '📋',
        title: '3단계. 모니터링 설계',
        body: '언제, 어디서, 무엇을, 어떤 단위로 기록할지 미리 정합니다. 방법을 통일해야 여러 사람의 자료를 모아서 비교할 수 있어요.',
        highlight: '같은 방법으로 재야 비교할 수 있어요.',
      },
      {
        emoji: '📣',
        title: '4단계. 정책 제안',
        body: '모은 데이터를 근거로 "무엇을 바꾸면 좋을지" 제안합니다. 데이터가 함께 있는 제안은 훨씬 설득력이 큽니다.',
        highlight: '근거 있는 제안이 동네를 바꿉니다.',
      },
    ]}
    facts={[
      { emoji: '🏙️', value: 'SDG 11', label: '이 챕터의 중심 목표' },
      { emoji: '🤝', value: 'SDG 17', label: '함께할수록 강해지는 협력' },
      { emoji: '🎓', value: 'SDG 4·13·14', label: '함께 연결되는 목표' },
    ]}
  />
);

export default function Chapter5() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={briefing}
      experiments={[
        { key: 'builder', label: '프로젝트 빌더', emoji: '📝', element: <ProjectBuilder chapterId={chapter.id} /> },
      ]}
    />
  );
}
