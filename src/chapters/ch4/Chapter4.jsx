import React from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ConceptCards from '../../components/ConceptCards';
import WindSim from './WindSim';
import SolarSim from './SolarSim';
import { getChapter } from '../../data/chapters';
import { chapterContent } from '../../data/concepts';

// 스토리·개념 브리핑 문구는 src/data/concepts.js에서 관리한다(문항 검수표와 동일 출처).
const chapter = getChapter('ch4_energy');
const { story, briefing } = chapterContent('ch4_energy');

export default function Chapter4() {
  return (
    <ChapterLayout
      chapter={chapter}
      story={story}
      briefing={<ConceptCards {...briefing} />}
      experiments={[
        {
          key: 'wind',
          label: '풍력발전 시뮬레이터',
          emoji: '💨',
          element: <WindSim chapterId={chapter.id} />,
        },
        {
          key: 'solar',
          label: '태양광 각도 실험',
          emoji: '☀️',
          element: <SolarSim chapterId={chapter.id} />,
        },
      ]}
    />
  );
}
