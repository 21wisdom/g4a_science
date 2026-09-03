import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import SpaceSorting from './SpaceSorting';
import { getChapter } from '../../data/chapters';
import { chapterContent } from '../../data/concepts';

// 스토리·개념 브리핑 문구는 src/data/concepts.js에서 관리한다(문항 검수표와 동일 출처).
const chapter = getChapter('ch2_ocean');
const { story, briefing } = chapterContent('ch2_ocean');

export default function Chapter2() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={<ConceptCards {...briefing} />}
      experiments={[
        {
          key: 'sort',
          label: '공간 판별 카드',
          emoji: '🧭',
          element: <SpaceSorting chapterId={chapter.id} />,
        },
      ]}
    />
  );
}
