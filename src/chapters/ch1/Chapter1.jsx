import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import BlueCarbonLab from './BlueCarbonLab';
import MicroplasticHunter from './MicroplasticHunter';
import { getChapter } from '../../data/chapters';
import { chapterContent } from '../../data/concepts';

// 스토리·개념 브리핑 문구는 src/data/concepts.js에서 관리한다(문항 검수표와 동일 출처).
const chapter = getChapter('ch1_bluecarbon');
const { story, briefing } = chapterContent('ch1_bluecarbon');

export default function Chapter1() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={<ConceptCards {...briefing} />}
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
