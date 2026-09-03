// 배경 삽화 로더.
//
// src/assets/illustrations/ 폴더에 파일을 넣으면 파일명(확장자 제외)을 키로 자동 인식한다.
// 아직 준비되지 않은 삽화는 null을 돌려주고, 각 화면은 기존 SVG 장면으로 자연스럽게 대체된다.
// 따라서 삽화를 한 장씩 채워 넣어도 앱은 항상 정상 동작한다.
//
// 파일명 규칙
//   chapter-<챕터id>.webp   : 챕터 대표 이미지 (예: chapter-ch1_bluecarbon.webp)
//   ocean-<공간유형id>.webp : Ch2 해양공간 장면 (estuary/tidalflat/coast/island/pooldeung/openocean)
//   concept-<키>.webp       : 개념 설명용 보조 이미지 (예: concept-wind, concept-solar)

const modules = import.meta.glob('../assets/illustrations/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const BY_KEY = Object.entries(modules).reduce((acc, [path, url]) => {
  const key = path.split('/').pop().replace(/\.(png|jpe?g|webp|svg)$/i, '');
  acc[key] = url;
  return acc;
}, {});

// 한 장의 삽화를 여러 자리에서 쓰는 경우의 별칭.
// 같은 파일을 두 번 저장하지 않기 위한 매핑이다.
const ALIAS = {
  'chapter-ch1_bluecarbon': 'ocean-tidalflat', // 갯벌 챕터 배너 = 갯벌 장면
  'chapter-ch2_ocean': 'ocean-island', // 바다 챕터 배너 = 섬 장면
  'chapter-ch4_energy': 'concept-wind', // 에너지 챕터 배너 = 해상풍력 장면
  'chapter-ch5_town': 'concept-solar', // 우리동네 챕터 배너 = 학교 옥상 장면
};

// 삽화가 담고 있는 장소를 정확히 밝히기 위한 캡션.
// 특히 국내가 아닌 곳에서 촬영·재구성된 이미지를 인천 설명처럼 보이게 두면 안 되므로,
// 해당 이미지에는 실제 장소를 반드시 명시한다.
const CAPTIONS = {
  'concept-wind': '해상풍력 발전단지 (덴마크)',
  'chapter-ch4_energy': '해상풍력 발전단지 (덴마크)',
  'concept-solar': '학교 옥상에 설치된 태양광 발전 설비',
  'chapter-ch5_town': '학교와 우리 동네',
  'ocean-pooldeung': '썰물에 드러난 모래톱(풀등)',
  'ocean-openocean': '육지가 보이지 않는 먼바다',
};

/** 삽화에 함께 표시할 캡션. 없으면 null */
export function illustCaption(key) {
  return CAPTIONS[key] ?? null;
}

/** 키에 해당하는 삽화 URL. 없으면 null */
export function illust(key) {
  if (BY_KEY[key]) return BY_KEY[key];
  const alias = ALIAS[key];
  return alias ? (BY_KEY[alias] ?? null) : null;
}

export const chapterImage = (chapterId) => illust(`chapter-${chapterId}`);
export const oceanSceneImage = (typeId) => illust(`ocean-${typeId}`);
export const conceptImage = (key) => illust(`concept-${key}`);

export default illust;
