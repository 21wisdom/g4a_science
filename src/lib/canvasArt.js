// HTML5 Canvas로 "나만의 프로젝트 카드"와 "최종 인증서" 이미지를 만든다
// (기획서 6장 Ch5 / 10.1 — 브라우저 내장 기능만 사용, 외부 라이브러리·서버 없음).
import CONFIG from '../config';

const PALETTE = {
  body: '#C5DCF3',
  ear: '#F4EC8E',
  line: '#453527',
  face: '#FFFFFF',
  shadow: '#BAC5CA',
  sea: '#2E86C1',
  town: '#34A853',
};

async function ready() {
  try {
    if (document.fonts?.ready) await document.fonts.ready;
  } catch {
    /* 폰트 로딩 실패해도 기본 폰트로 그린다 */
  }
}

function font(size, weight = 700) {
  return `${weight} ${size}px "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** 지정한 폭에 맞춰 줄로 나눈다(그리지는 않는다) */
function splitLines(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * 지정한 폭에 맞춰 줄바꿈하며 그리고, 마지막 y 좌표를 돌려준다.
 * x는 현재 ctx.textAlign 기준점이다(left면 왼쪽 끝, center면 중심).
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  let lines = splitLines(ctx, text, maxWidth);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] += ' …';
  }
  let cy = y;
  for (const l of lines) {
    ctx.fillText(l, x, cy);
    cy += lineHeight;
  }
  return cy;
}

/** 물곰이 간단 도형(캔버스용) */
function drawMulgomi(ctx, cx, cy, s) {
  const L = PALETTE.line;
  ctx.save();
  ctx.lineWidth = 5 * s;
  ctx.strokeStyle = L;
  ctx.lineJoin = 'round';

  // 귀
  ctx.fillStyle = PALETTE.ear;
  [[-52, -46], [52, -46]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(cx + dx * s, cy + dy * s, 23 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // 몸통
  ctx.fillStyle = PALETTE.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 66 * s, 72 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 얼굴
  ctx.fillStyle = PALETTE.face;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 12 * s, 42 * s, 33 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 눈·코·입
  ctx.fillStyle = L;
  [[-27, -10], [27, -10]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(cx + dx * s, cy + dy * s, 7 * s, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.beginPath();
  ctx.moveTo(cx - 8 * s, cy + 6 * s);
  ctx.lineTo(cx + 8 * s, cy + 6 * s);
  ctx.lineTo(cx, cy + 16 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 14 * s, cy + 24 * s);
  ctx.quadraticCurveTo(cx, cy + 34 * s, cx + 14 * s, cy + 24 * s);
  ctx.stroke();
  ctx.restore();
}

/* ── 시민과학 프로젝트 카드 ─────────────────────────────────────────── */
export async function drawProjectCard(data) {
  await ready();
  const W = 900;
  const H = 1330;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#F7FBFF';
  ctx.fillRect(0, 0, W, H);

  // 테두리
  ctx.strokeStyle = PALETTE.line;
  ctx.lineWidth = 10;
  roundRect(ctx, 24, 24, W - 48, H - 48, 28);
  ctx.stroke();

  // 헤더
  ctx.fillStyle = PALETTE.town;
  roundRect(ctx, 44, 44, W - 88, 132, 20);
  ctx.fill();
  ctx.strokeStyle = PALETTE.line;
  ctx.lineWidth = 6;
  roundRect(ctx, 44, 44, W - 88, 132, 20);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = font(42, 900);
  ctx.textBaseline = 'middle';
  ctx.fillText('우리동네 시민과학 프로젝트', 76, 96);
  ctx.font = font(24, 700);
  ctx.fillText(`${CONFIG.appName} · Chapter 5`, 76, 142);

  drawMulgomi(ctx, W - 128, 112, 0.62);

  let y = 232;
  const boxes = [
    { no: '1', title: '문제 발견', value: data.problem },
    { no: '2', title: '조사 질문', value: data.question },
    { no: '3', title: '모니터링 설계', value: data.monitoring },
    { no: '4', title: '정책 제안', value: data.proposal },
  ];

  ctx.textBaseline = 'top';
  for (const b of boxes) {
    const boxH = 208;
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, 60, y, W - 120, boxH, 18);
    ctx.fill();
    ctx.strokeStyle = PALETTE.line;
    ctx.lineWidth = 5;
    roundRect(ctx, 60, y, W - 120, boxH, 18);
    ctx.stroke();

    // 번호 뱃지
    ctx.fillStyle = PALETTE.ear;
    ctx.beginPath();
    ctx.arc(104, y + 44, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = PALETTE.line;
    ctx.font = font(28, 900);
    ctx.textAlign = 'center';
    ctx.fillText(b.no, 104, y + 28);
    ctx.textAlign = 'left';

    ctx.font = font(28, 900);
    ctx.fillText(b.title, 142, y + 28);

    ctx.font = font(25, 500);
    wrapText(ctx, b.value || '-', 82, y + 86, W - 164, 38, 3);

    y += boxH + 20;
  }

  // 푸터
  ctx.fillStyle = PALETTE.line;
  ctx.font = font(24, 700);
  ctx.fillText(`탐험대원: ${data.name || '이름'}`, 72, H - 92);
  ctx.textAlign = 'right';
  ctx.font = font(20, 500);
  ctx.fillText(`${data.date} · ${CONFIG.organizer}`, W - 72, H - 88);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

/* ── 최종 인증서 ───────────────────────────────────────────────────── */
export async function drawCertificate({ name, gradeLabel, date, score, total, badges = [] }) {
  await ready();
  const W = 1240;
  const H = 877;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 배경 그라데이션
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#F7FBFF');
  g.addColorStop(1, '#E6F1FA');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // 이중 테두리
  ctx.strokeStyle = PALETTE.line;
  ctx.lineWidth = 12;
  roundRect(ctx, 28, 28, W - 56, H - 56, 26);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.sea;
  ctx.lineWidth = 4;
  roundRect(ctx, 50, 50, W - 100, H - 100, 18);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = PALETTE.line;
  ctx.font = font(30, 700);
  ctx.fillText('인 증 서', W / 2, 122);

  ctx.font = font(52, 900);
  ctx.fillStyle = PALETTE.sea;
  ctx.fillText(CONFIG.certificateTitle, W / 2, 190);

  // 이름
  ctx.fillStyle = PALETTE.line;
  ctx.font = font(30, 700);
  ctx.fillText('성명', W / 2, 278);
  ctx.font = font(64, 900);
  ctx.fillText(name || '탐험대원', W / 2, 340);
  ctx.strokeStyle = PALETTE.ear;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 220, 384);
  ctx.lineTo(W / 2 + 220, 384);
  ctx.stroke();

  // 본문
  ctx.fillStyle = PALETTE.line;
  ctx.font = font(26, 500);
  ctx.textAlign = 'center';
  const lines = [
    `위 학생은 「${CONFIG.appName}」의 5개 챕터를 모두 마치고,`,
    '인천의 갯벌·바다·데이터·에너지·시민과학 활동을 통해',
    '관찰과 데이터를 근거로 판단하는 과학적 사고 절차를 익혔기에',
    '이 증서를 수여합니다.',
  ];
  lines.forEach((t, i) => ctx.fillText(t, W / 2, 436 + i * 42));

  // 성취 요약
  ctx.font = font(24, 700);
  ctx.fillStyle = PALETTE.sea;
  ctx.fillText(
    `학년군 ${gradeLabel} · 최종 통합 퀴즈 ${score}/${total} · 획득 배지 ${badges.length}개`,
    W / 2,
    632,
  );

  // 배지 나열 (textAlign은 center 상태이므로 중심 좌표를 넘긴다)
  ctx.font = font(20, 500);
  ctx.fillStyle = PALETTE.line;
  if (badges.length) {
    wrapText(ctx, badges.join(' · '), W / 2, 664, 780, 30, 3);
  }

  // 날짜·발급
  ctx.font = font(26, 700);
  ctx.fillText(date, W / 2, 772);
  ctx.font = font(24, 900);
  ctx.fillText(CONFIG.organizer, W / 2, 812);

  drawMulgomi(ctx, 148, 700, 0.85);
  drawMulgomi(ctx, W - 148, 700, 0.85);

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
