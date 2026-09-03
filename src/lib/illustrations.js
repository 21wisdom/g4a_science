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

/** 키에 해당하는 삽화 URL. 없으면 null */
export function illust(key) {
  return BY_KEY[key] ?? null;
}

export const chapterImage = (chapterId) => illust(`chapter-${chapterId}`);
export const oceanSceneImage = (typeId) => illust(`ocean-${typeId}`);
export const conceptImage = (key) => illust(`concept-${key}`);

export default illust;
