import ChapterIntroPage from '@/components/chapter/ChapterIntroPage';
import configData from '@/config/chapters/cp-soustraction-sens.json';

const config = {
  ...configData,
  level: configData.level as 'CP' | 'CE1' | 'CM1'
};

export default function IntroPage() {
  return <ChapterIntroPage config={config} />;
}
