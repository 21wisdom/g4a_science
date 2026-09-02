// 게임에서 다루는 SDGs 목표(워크북 각 파트 SDGs 연계표 기준)
export const SDGS = {
  4: { no: 4, title: '양질의 교육', color: '#C5192D', emoji: '📚' },
  7: { no: 7, title: '모두를 위한 깨끗한 에너지', color: '#FCC30B', emoji: '⚡' },
  9: { no: 9, title: '산업·혁신과 사회기반시설', color: '#FD6925', emoji: '🏭' },
  11: { no: 11, title: '지속가능한 도시와 공동체', color: '#F99D26', emoji: '🏙️' },
  12: { no: 12, title: '책임감 있는 소비와 생산', color: '#BF8B2E', emoji: '♻️' },
  13: { no: 13, title: '기후변화 대응', color: '#3F7E44', emoji: '🌍' },
  14: { no: 14, title: '해양생태계 보전', color: '#0A97D9', emoji: '🌊' },
  17: { no: 17, title: '지구촌 협력', color: '#19486A', emoji: '🤝' },
};

export const sdgList = (nums) => nums.map((n) => SDGS[n]).filter(Boolean);
export default SDGS;
