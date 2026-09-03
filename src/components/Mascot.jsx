import React from 'react';

/**
 * 물곰이 마스코트 (인천과학문화거점센터 공식 캐릭터, 사용 허가 확인 완료)
 *
 * 공식 PNG 에셋 3종을 표정·포즈별로 사용한다(src/assets/mascot/).
 *   mulgomi-idle.png   두 손을 든 기본 포즈      → 평상시 안내
 *   mulgomi-talk.png   한 손을 든 놀란 표정      → 설명·힌트·오답 리액션
 *   mulgomi-happy.png  손을 흔드는 웃는 표정      → 정답·완료·축하
 *
 * 파일을 교체하거나 새 포즈를 추가할 때는 같은 폴더에 `mulgomi-<mood>.png` 형식으로
 * 넣기만 하면 되고, 코드 수정은 필요 없다. 에셋이 하나도 없으면 기획서 9.1절 팔레트로
 * 그린 SVG 대체 이미지가 표시된다.
 *
 * 리액션(idle 바운스 / 정답 시 점프 / 오답 시 흔들림)은 CSS 애니메이션으로 처리한다.
 */
const assetModules = import.meta.glob('../assets/mascot/*.{png,svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// 파일명(확장자 제외, `mulgomi-` 접두사 제거)을 키로 정리한다.
const ASSETS = Object.entries(assetModules).reduce((acc, [path, url]) => {
  const base = path.split('/').pop().replace(/\.(png|svg|webp)$/i, '');
  acc[base.replace(/^mulgomi[-_]?/i, '').toLowerCase() || 'idle'] = url;
  return acc;
}, {});

const anyAsset = Object.values(ASSETS)[0] || null;

// mood → 사용할 포즈 에셋 (없으면 순서대로 대체)
function assetFor(mood) {
  const chain = {
    idle: ['idle', 'talk', 'happy'],
    happy: ['happy', 'idle', 'talk'],
    think: ['talk', 'idle', 'happy'],
    sad: ['talk', 'idle', 'happy'],
    none: ['idle', 'talk', 'happy'],
  }[mood] || ['idle'];
  for (const key of chain) if (ASSETS[key]) return ASSETS[key];
  return anyAsset;
}

const MOOD_ANIM = {
  idle: 'animate-idlebounce',
  happy: 'animate-jump',
  sad: 'animate-shakeh',
  think: 'animate-idlebounce',
  none: '',
};

// 세로가 긴 캐릭터라 높이 기준으로 크기를 정한다.
const SIZES = { xs: 52, sm: 80, md: 120, lg: 168, xl: 264 };

export default function Mascot({ mood = 'idle', size = 'md', className = '', alt = '물곰이' }) {
  const px = SIZES[size] || SIZES.md;
  const anim = MOOD_ANIM[mood] ?? MOOD_ANIM.idle;
  const src = assetFor(mood);

  return (
    <div
      className={`relative inline-flex shrink-0 items-end justify-center ${anim} ${className}`}
      style={{ height: px, width: src ? px * 0.7 : px }}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-auto object-contain" draggable="false" />
      ) : (
        <MulgomiSvg mood={mood} />
      )}
    </div>
  );
}

/** 공식 에셋이 없을 때 쓰는 대체 이미지(기획서 9.1절 실측 팔레트·스타일 가이드 기준) */
function MulgomiSvg({ mood }) {
  const LINE = '#453527';
  const BODY = '#C5DCF3';
  const EAR = '#F4EC8E';
  const FACE = '#FFFFFF';
  const SHADOW = '#BAC5CA';
  const sw = 7;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="물곰이">
      <ellipse cx="100" cy="182" rx="52" ry="9" fill={SHADOW} opacity="0.55" />
      <circle cx="47" cy="55" r="24" fill={EAR} stroke={LINE} strokeWidth={sw} />
      <circle cx="153" cy="55" r="24" fill={EAR} stroke={LINE} strokeWidth={sw} />
      <path
        d="M100 20c-40 0-64 26-64 60 0 14 5 26 12 35-9 8-14 19-14 32 0 21 25 32 66 32s66-11 66-32c0-13-5-24-14-32 7-9 12-21 12-35 0-34-24-60-64-60z"
        fill={BODY}
        stroke={LINE}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <ellipse cx="66" cy="168" rx="20" ry="13" fill={BODY} stroke={LINE} strokeWidth={sw} />
      <ellipse cx="134" cy="168" rx="20" ry="13" fill={BODY} stroke={LINE} strokeWidth={sw} />
      <ellipse cx="100" cy="98" rx="42" ry="34" fill={FACE} stroke={LINE} strokeWidth={sw} />
      {mood === 'sad' ? (
        <>
          <path d="M62 74c6-7 16-7 22 0" stroke={LINE} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M116 74c6-7 16-7 22 0" stroke={LINE} strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'happy' ? (
        <>
          <path d="M62 78c6 8 16 8 22 0" stroke={LINE} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M116 78c6 8 16 8 22 0" stroke={LINE} strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="73" cy="76" r="7.5" fill={LINE} />
          <circle cx="127" cy="76" r="7.5" fill={LINE} />
        </>
      )}
      <path d="M92 92h16l-8 10z" fill={LINE} stroke={LINE} strokeWidth="4" strokeLinejoin="round" />
      <path
        d="M86 110c5 7 9 7 14 0 5 7 9 7 14 0"
        stroke={LINE}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="58" cy="96" rx="8" ry="5" fill="#F6C6C0" opacity="0.75" />
      <ellipse cx="142" cy="96" rx="8" ry="5" fill="#F6C6C0" opacity="0.75" />
    </svg>
  );
}

/** 말풍선을 곁들인 안내 캐릭터 배치용 컴포넌트 */
export function MascotSpeech({ mood = 'idle', size = 'md', children, className = '' }) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <Mascot mood={mood} size={size} />
      <div className="relative flex-1 card-pop bg-white p-4">
        <span
          className="absolute -left-2 top-7 h-4 w-4 rotate-45 border-b-3 border-l-3 border-mulgomi-line bg-white"
          aria-hidden="true"
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
