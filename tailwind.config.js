/** @type {import('tailwindcss').Config} */
// 색상 토큰은 기획서 9.1절(물곰이 공식 에셋 실측 팔레트)과 챕터별 컬러 팔레트를 그대로 등록한다.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 마스코트(물곰이) 팔레트 — 게임 전체 기준 팔레트
        mulgomi: {
          body: '#C5DCF3',
          ear: '#F4EC8E',
          line: '#453527',
          face: '#FFFFFF',
          shadow: '#BAC5CA',
        },
        // 챕터별 고유 컬러
        sea: { light: '#DCEEFB', DEFAULT: '#2E86C1', deep: '#1B4F72' },
        tidal: { light: '#F3E7D3', DEFAULT: '#A9743F', deep: '#6E4A28' },
        data: { light: '#E8E2F7', DEFAULT: '#7D5BA6', deep: '#4E3570' },
        energy: { light: '#FDF3D0', DEFAULT: '#E9A80B', deep: '#8A6404' },
        town: { light: '#DDF3E4', DEFAULT: '#34A853', deep: '#1E6B34' },
        ok: '#1F8A4C',
        no: '#C0392B',
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      borderWidth: { 3: '3px' },
      boxShadow: {
        pop: '0 4px 0 0 #453527',
        popsm: '0 3px 0 0 #453527',
      },
      keyframes: {
        idlebounce: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        jump: {
          '0%,100%': { transform: 'translateY(0) scale(1)' },
          '30%': { transform: 'translateY(-22px) scale(1.06)' },
          '60%': { transform: 'translateY(0) scale(0.96)' },
        },
        shakeh: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%,60%': { transform: 'translateX(-8px)' },
          '40%,80%': { transform: 'translateX(8px)' },
        },
        popin: {
          '0%': { opacity: 0, transform: 'translateY(12px) scale(0.97)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        spinblade: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        idlebounce: 'idlebounce 2.4s ease-in-out infinite',
        jump: 'jump 0.6s ease-out 1',
        shakeh: 'shakeh 0.5s ease-in-out 1',
        popin: 'popin 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};
