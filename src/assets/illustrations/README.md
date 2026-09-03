# 배경 삽화 폴더

여기에 파일을 넣으면 `src/lib/illustrations.js`가 파일명으로 자동 인식합니다.
**코드 수정은 필요 없고**, 아직 없는 삽화는 기존 SVG 장면으로 자동 대체되므로
한 장씩 채워 넣어도 앱은 정상 동작합니다.

지원 형식: `.webp`(권장) `.png` `.jpg` `.svg`

## 파일명 규칙

### 1. 챕터 대표 이미지 — 스토리 인트로 상단 배너

| 파일명 | 챕터 | 어울리는 장면 |
|---|---|---|
| `chapter-ch1_bluecarbon.webp` | 갯벌의 비밀 | 인천 갯벌 |
| `chapter-ch2_ocean.webp` | 바다 탐험대 | 인천 앞바다·섬 |
| `chapter-ch3_data.webp` | 데이터 탐정단 | 인천기상대 |
| `chapter-ch4_energy.webp` | 에너지 연구소 | 해상풍력·태양광 |
| `chapter-ch5_town.webp` | 우리동네 프로젝트 | 동네 거리·학교 주변 |

### 2. Ch2 해양공간 6종 장면 — 판별 카드에 사용

| 파일명 | 공간 유형 |
|---|---|
| `ocean-estuary.webp` | 하구지역 |
| `ocean-tidalflat.webp` | 갯벌 |
| `ocean-coast.webp` | 연안지역 |
| `ocean-island.webp` | 섬주변해역 |
| `ocean-pooldeung.webp` | 풀등 |
| `ocean-openocean.webp` | 먼바다 |

### 3. 개념 설명 보조 이미지

| 파일명 | 쓰이는 곳 |
|---|---|
| `concept-wind.webp` | Ch4 풍력발전 시뮬레이터 |
| `concept-solar.webp` | Ch4 태양광 각도 실험 |

## 현재 들어와 있는 삽화

| 파일 | 원본 | 쓰이는 곳 |
|---|---|---|
| `ocean-tidalflat.webp` | 인천갯벌 | Ch2 갯벌 카드 + Ch1 챕터 배너(별칭) |
| `ocean-island.webp` | 인천섬(승봉도) | Ch2 섬주변해역 카드 + Ch2 챕터 배너(별칭) |
| `ocean-coast.webp` | 인천연안부두 | Ch2 연안지역 카드 |
| `ocean-estuary.webp` | 인천한강하구 | Ch2 하구지역 카드 |
| `ocean-pooldeung.webp` | 대이작도 풀등 | Ch2 풀등 카드 |
| `ocean-openocean.webp` | 인천 먼바다 | Ch2 먼바다 카드 |
| `chapter-ch3_data.webp` | 인천기상대 | Ch3 챕터 배너 |
| `concept-wind.webp` | 해상풍력단지(덴마크) | Ch4 풍력 실험 + Ch4 챕터 배너(별칭) |
| `concept-solar.webp` | 학교 옥상 태양광 | Ch4 태양광 실험 + Ch5 챕터 배너(별칭) |

Ch2 해양공간 6종과 5개 챕터 배너가 모두 채워졌습니다.

한 장을 두 자리에서 쓸 때는 파일을 복사하지 않고 `src/lib/illustrations.js`의 `ALIAS`에
매핑합니다.

## 캡션 — 장소 오표기 방지

삽화가 챕터 장소와 다른 곳을 담고 있으면 `src/lib/illustrations.js`의 `CAPTIONS`에
실제 장소를 적습니다. 이 값이 챕터의 `place`보다 우선해 배너 캡션으로 표시됩니다.

예를 들어 Ch4의 장소는 영흥도이지만 삽화는 덴마크 해상풍력단지이므로,
배너에 **"해상풍력 발전단지 (덴마크)"**로 표기됩니다.

## 아직 없는 삽화

- 우리 동네 거리·학교 주변 전용 이미지 — 현재는 학교 옥상 태양광 삽화를 Ch5 배너로 겸용 중입니다.
  전용 이미지를 넣으면 `chapter-ch5_town.webp`로 저장하고 `ALIAS`에서 해당 줄을 지우면 됩니다.

## 권장 사양

- 가로형 이미지(4:3 또는 16:9), 긴 변 1200px 내외
- WebP 품질 80~85 (한 장 100~200KB). 교실 태블릿·저속 회선을 고려한 값입니다.
- 실제 인물의 얼굴이 식별되는 사진이나 타 브랜드 로고가 보이는 이미지는 사용하지 않습니다.

## 출처 표기

삽화가 특정 지역·시설을 촬영·재구성한 것이라면, 해당 장면을 설명하는 화면 문구가
사실과 어긋나지 않도록 확인이 필요합니다. 예를 들어 해외에서 촬영된 해상풍력 이미지를
인천 영흥도 설명에 쓰면 안 되며, 이런 경우 캡션에 실제 촬영지를 밝힙니다.
