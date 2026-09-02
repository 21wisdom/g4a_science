import React from 'react';

/**
 * 물곰이 마스코트 (인천과학문화거점센터 공식 캐릭터, 사용 허가 확인 완료)
 *
 * 공식 PNG 에셋 사용법:
 *   src/assets/mascot/ 폴더에 공식 파일(예: 물곰이외곽선-003.png)을 넣기만 하면
 *   아래 glob이 자동으로 감지해 SVG 대신 공식 이미지를 렌더링한다.
 *   에셋이 없을 때는 기획서 9.1절 실측 팔레트/스타일 가이드
 *   (몸통 #C5DCF3 / 귀 #F4EC8E / 아웃라인 #453527 / 얼굴 #FFFFFF / 그림자 #BAC5CA,
 *    두꺼운 다크브라운 외곽선 + 파스텔 플랫컬러, 점 눈·역삼각형 코·물결선 입)
 *   에 맞춰 그린 SVG 대체 이미지가 표시된다.
 *
 * 리액션은 정지 이미지 1장 + CSS 애니메이션 조합으로 구현한다(기획서 9.1 권장안).
 */
const assetModules = import.meta.glob('../assets/mascot/*.{png,svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const officialAsset = Object.values(assetModules)[0] || null;

const MOOD_ANIM = {
  idle: 'animate-idlebounce',
  happy: 'animate-jump',
  sad: 'animate-shakeh',
  think: 'animate-idlebounce',
  none: '',
};

const SIZES = { xs: 48, sm: 72, md: 110, lg: 150, xl: 200 };

export default function Mascot({ mood = 'idle', size = 'md', className = '', alt = '물곰이' }) {
  const px = SIZES[size] || SIZES.md;
  const anim = MOOD_ANIM[mood] ?? MOOD_ANIM.idle;

  return (
    <div
      className={`relative inline-block shrink-0 ${anim} ${className}`}
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      {officialAsset ? (
        <img src={officialAsset} alt={alt} className="h-full w-full object-contain" draggable="false" />
      ) : (
        <MulgomiSvg mood={mood} />
      )}
    </div>
  );
}

function MulgomiSvg({ mood }) {
  const LINE = '#453527';
  const BODY = '#C5DCF3';
  const EAR = '#F4EC8E';
  const FACE = '#FFFFFF';
  const SHADOW = '#BAC5CA';
  const sw = 7;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="물곰이">
      {/* 그림자 */}
      <ellipse cx="100" cy="182" rx="52" ry="9" fill={SHADOW} opacity="0.55" />

      {/* 귀 (크림 옐로 포인트 컬러) */}
      <circle cx="47" cy="55" r="24" fill={EAR} stroke={LINE} strokeWidth={sw} />
      <circle cx="153" cy="55" r="24" fill={EAR} stroke={LINE} strokeWidth={sw} />

      {/* 몸통 + 머리 (파스텔 블루 메인 컬러) */}
      <path
        d="M100 20c-40 0-64 26-64 60 0 14 5 26 12 35-9 8-14 19-14 32 0 21 25 32 66 32s66-11 66-32c0-13-5-24-14-32 7-9 12-21 12-35 0-34-24-60-64-60z"
        fill={BODY}
        stroke={LINE}
        strokeWidth={sw}
        strokeLinejoin="round"
      />

      {/* 발 */}
      <ellipse cx="66" cy="168" rx="20" ry="13" fill={BODY} stroke={LINE} strokeWidth={sw} />
      <ellipse cx="134" cy="168" rx="20" ry="13" fill={BODY} stroke={LINE} strokeWidth={sw} />

      {/* 얼굴(주둥이) 화이트 */}
      <ellipse cx="100" cy="98" rx="42" ry="34" fill={FACE} stroke={LINE} strokeWidth={sw} />

      {/* 눈 — 점 눈, 오답(sad)일 때는 곡선으로 */}
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

      {/* 코 — 역삼각형 */}
      <path d="M92 92h16l-8 10z" fill={LINE} stroke={LINE} strokeWidth="4" strokeLinejoin="round" />

      {/* 입 — 물결선 */}
      <path
        d="M86 110c5 7 9 7 14 0 5 7 9 7 14 0"
        stroke={LINE}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* 볼 터치 */}
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
