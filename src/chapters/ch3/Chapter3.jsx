import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import GraphBuilder from './GraphBuilder';
import TrendPredictor from './TrendPredictor';
import { getChapter } from '../../data/chapters';
import { chapterContent } from '../../data/concepts';

// 스토리·개념 브리핑 문구는 src/data/concepts.js에서 관리한다(문항 검수표와 동일 출처).
const chapter = getChapter('ch3_data');
const { story, briefing } = chapterContent('ch3_data');

export default function Chapter3() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={<ConceptCards {...briefing} />}
      experiments={[
        {
          key: 'graph',
          label: '그래프 빌더',
          emoji: '📊',
          element: <GraphBuilder chapterId={chapter.id} />,
        },
        {
          key: 'trend',
          label: '미래예측 시뮬레이터',
          emoji: '📈',
          element: <TrendPredictor chapterId={chapter.id} />,
        },
      ]}
    />
  );
}
