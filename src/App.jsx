import React, { useEffect } from 'react';
import useGameStore from './store/useGameStore';
import StartScreen from './screens/StartScreen';
import ProfilesScreen from './screens/ProfilesScreen';
import GradeSelect from './screens/GradeSelect';
import NamingScreen from './screens/NamingScreen';
import HubMap from './screens/HubMap';
import JournalScreen from './screens/JournalScreen';
import SettingsScreen from './screens/SettingsScreen';
import FinalQuizScreen from './screens/FinalQuizScreen';
import CertificateScreen from './screens/CertificateScreen';
import Chapter1 from './chapters/ch1/Chapter1';
import Chapter2 from './chapters/ch2/Chapter2';
import Chapter3 from './chapters/ch3/Chapter3';
import Chapter4 from './chapters/ch4/Chapter4';
import Chapter5 from './chapters/ch5/Chapter5';

const CHAPTER_VIEWS = {
  ch1_bluecarbon: Chapter1,
  ch2_ocean: Chapter2,
  ch3_data: Chapter3,
  ch4_energy: Chapter4,
  ch5_town: Chapter5,
};

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const activeChapterId = useGameStore((s) => s.activeChapterId);
  const profile = useGameStore((s) => s.current());
  const go = useGameStore((s) => s.go);

  // 저학년 모드에서는 본문 폰트를 한 단계 키운다(기획서 9장 타이포그래피)
  useEffect(() => {
    document.body.classList.toggle('grade-low', profile?.gradeMode === 'low');
  }, [profile?.gradeMode]);

  // 프로필 없이 게임 화면으로 들어온 경우 시작 화면으로 되돌린다
  useEffect(() => {
    const needsProfile = ['hub', 'chapter', 'journal', 'settings', 'final', 'certificate'];
    if (!profile && needsProfile.includes(screen)) go('start');
  }, [profile, screen, go]);

  if (screen === 'chapter' && activeChapterId) {
    const View = CHAPTER_VIEWS[activeChapterId];
    return View ? <View /> : <HubMap />;
  }

  switch (screen) {
    case 'profiles':
      return <ProfilesScreen />;
    case 'grade':
      return <GradeSelect />;
    case 'naming':
      return <NamingScreen />;
    case 'hub':
      return <HubMap />;
    case 'journal':
      return <JournalScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'final':
      return <FinalQuizScreen />;
    case 'certificate':
      return <CertificateScreen />;
    case 'start':
    default:
      return <StartScreen />;
  }
}
