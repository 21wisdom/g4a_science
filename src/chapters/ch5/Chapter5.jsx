import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import ProjectBuilder from './ProjectBuilder';
import { getChapter } from '../../data/chapters';
import { chapterContent } from '../../data/concepts';

// 스토리·개념 브리핑 문구는 src/data/concepts.js에서 관리한다(문항 검수표와 동일 출처).
const chapter = getChapter('ch5_town');
const { story, briefing } = chapterContent('ch5_town');

export default function Chapter5() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={<ConceptCards {...briefing} />}
      experiments={[
        {
          key: 'builder',
          label: '프로젝트 빌더',
          emoji: '📝',
          element: <ProjectBuilder chapterId={chapter.id} />,
        },
      ]}
    />
  );
}
