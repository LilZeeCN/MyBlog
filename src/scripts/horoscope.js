// 将 TypeScript 代码转换为纯 JavaScript 供浏览器使用

// 星座枚举
const ZodiacSign = {
  ARIES: '白羊座',
  TAURUS: '金牛座',
  GEMINI: '双子座',
  CANCER: '巨蟹座',
  LEO: '狮子座',
  VIRGO: '处女座',
  LIBRA: '天秤座',
  SCORPIO: '天蝎座',
  SAGITTARIUS: '射手座',
  CAPRICORN: '摩羯座',
  AQUARIUS: '水瓶座',
  PISCES: '双鱼座'
};

// 星座日期范围
const ZODIAC_DATES = {
  [ZodiacSign.CAPRICORN]: [{ month: 12, day: 22 }, { month: 1, day: 19 }],
  [ZodiacSign.AQUARIUS]: [{ month: 1, day: 20 }, { month: 2, day: 18 }],
  [ZodiacSign.PISCES]: [{ month: 2, day: 19 }, { month: 3, day: 20 }],
  [ZodiacSign.ARIES]: [{ month: 3, day: 21 }, { month: 4, day: 19 }],
  [ZodiacSign.TAURUS]: [{ month: 4, day: 20 }, { month: 5, day: 20 }],
  [ZodiacSign.GEMINI]: [{ month: 5, day: 21 }, { month: 6, day: 21 }],
  [ZodiacSign.CANCER]: [{ month: 6, day: 22 }, { month: 7, day: 22 }],
  [ZodiacSign.LEO]: [{ month: 7, day: 23 }, { month: 8, day: 22 }],
  [ZodiacSign.VIRGO]: [{ month: 8, day: 23 }, { month: 9, day: 22 }],
  [ZodiacSign.LIBRA]: [{ month: 9, day: 23 }, { month: 10, day: 23 }],
  [ZodiacSign.SCORPIO]: [{ month: 10, day: 24 }, { month: 11, day: 22 }],
  [ZodiacSign.SAGITTARIUS]: [{ month: 11, day: 23 }, { month: 12, day: 21 }],
};

// 星座特质
const ZODIAC_TRAITS = {
  [ZodiacSign.ARIES]: {
    element: 'fire',
    keywords: ['热情', '冲动', '领导力', '冒险', '直率'],
    baseStrength: [80, 75, 85, 75, 80]
  },
  [ZodiacSign.TAURUS]: {
    element: 'earth',
    keywords: ['稳重', '务实', '享受', '固执', '可靠'],
    baseStrength: [75, 80, 70, 85, 75]
  },
  [ZodiacSign.GEMINI]: {
    element: 'air',
    keywords: ['机智', '善变', '沟通', '好奇', '活泼'],
    baseStrength: [78, 80, 75, 70, 75]
  },
  [ZodiacSign.CANCER]: {
    element: 'water',
    keywords: ['敏感', '顾家', '情绪化', '直觉', '保护'],
    baseStrength: [75, 70, 80, 70, 75]
  },
  [ZodiacSign.LEO]: {
    element: 'fire',
    keywords: ['自信', '慷慨', '戏剧化', '创造力', '领导'],
    baseStrength: [85, 80, 85, 80, 75]
  },
  [ZodiacSign.VIRGO]: {
    element: 'earth',
    keywords: ['完美主义', '分析', '服务', '实际', '细节'],
    baseStrength: [75, 75, 65, 85, 70]
  },
  [ZodiacSign.LIBRA]: {
    element: 'air',
    keywords: ['平衡', '和谐', '犹豫', '审美', '社交'],
    baseStrength: [78, 80, 75, 75, 75]
  },
  [ZodiacSign.SCORPIO]: {
    element: 'water',
    keywords: ['深沉', '神秘', '强烈', '洞察', '执着'],
    baseStrength: [80, 70, 80, 80, 70]
  },
  [ZodiacSign.SAGITTARIUS]: {
    element: 'fire',
    keywords: ['乐观', '自由', '哲学', '冒险', '直率'],
    baseStrength: [82, 85, 75, 70, 80]
  },
  [ZodiacSign.CAPRICORN]: {
    element: 'earth',
    keywords: ['野心', '自律', '传统', '责任感', '实际'],
    baseStrength: [80, 75, 70, 85, 70]
  },
  [ZodiacSign.AQUARIUS]: {
    element: 'air',
    keywords: ['独立', '创新', '人道', '叛逆', '理智'],
    baseStrength: [78, 80, 70, 75, 75]
  },
  [ZodiacSign.PISCES]: {
    element: 'water',
    keywords: ['梦幻', '同情', '艺术', '逃避', '直觉'],
    baseStrength: [75, 70, 80, 65, 70]
  },
};

const FORECAST_TEMPLATES = {
  positive: [
    '今天你的能量很充足，适合开展新计划。',
    '星象显示今天会有意想不到的好运降临。',
    '保持积极的心态，今天会有意外的收获。',
    '你的直觉今天特别敏锐，相信你的第一感觉。',
    '今天是展现你魅力的好时机，把握住！',
  ],
  neutral: [
    '今天是一个平稳的日子，适合处理日常事务。',
    '保持耐心，事情正在朝着好的方向发展。',
    '今天适合思考和规划，不宜做重大决定。',
    '平稳的一天，适合充电和反思。',
    '按部就班的一天，稳扎稳打就好。',
  ],
  negative: [
    '今天可能会有一些小挑战，但别担心。',
    '建议保持低调，避免冲突和争论。',
    '今天可能需要额外的耐心，深呼吸。',
    '遇到困难时记得寻求朋友的支持。',
    '放慢脚步，不要急于求成。',
  ]
};

const LUCKY_COLORS = {
  fire: ['红色', '橙色', '金色', '紫色'],
  earth: ['绿色', '棕色', '米色', '灰色'],
  air: ['黄色', '蓝色', '白色', '银色'],
  water: ['蓝色', '紫色', '青色', '黑色']
};

// 根据生日获取星座
function getZodiacSign(birthday) {
  const month = birthday.getMonth() + 1;
  const day = birthday.getDate();

  for (const [sign, dates] of Object.entries(ZODIAC_DATES)) {
    if ((month === dates[0].month && day >= dates[0].day) ||
        (month === dates[1].month && day <= dates[1].day)) {
      return sign;
    }
  }

  return ZodiacSign.CAPRICORN;
}

// 基于日期生成伪随机数
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

// 生成当日运势
function generateDailyHoroscope(sign, date = new Date()) {
  // 使用本地日期而非 UTC 日期，避免时区问题
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const seed = `${sign}-${dateStr}`;

  let counter = 0;
  const random = () => {
    counter++;
    return seededRandom(seed + counter.toString());
  };

  const traits = ZODIAC_TRAITS[sign];
  const variance = () => (random() - 0.5) * 20;

  const scores = {
    overall: Math.min(100, Math.max(0, traits.baseStrength[0] + variance())),
    luck: Math.min(100, Math.max(0, traits.baseStrength[1] + variance())),
    love: Math.min(100, Math.max(0, traits.baseStrength[2] + variance())),
    career: Math.min(100, Math.max(0, traits.baseStrength[3] + variance())),
    health: Math.min(100, Math.max(0, traits.baseStrength[4] + variance()))
  };

  const colors = LUCKY_COLORS[traits.element];
  const luckyColor = colors[Math.floor(random() * colors.length)];
  const luckyNumber = Math.floor(random() * 99) + 1;

  const hours = ['早上', '中午', '下午', '傍晚', '晚上'];
  const luckyTime = hours[Math.floor(random() * hours.length)];

  const score = scores.overall;
  let forecastType = 'positive';
  if (score >= 70) forecastType = 'positive';
  else if (score >= 50) forecastType = 'neutral';
  else forecastType = 'negative';

  const templates = FORECAST_TEMPLATES[forecastType];
  const shortForecast = templates[Math.floor(random() * templates.length)];

  const detailedForecast = generateDetailedForecast(sign, scores);
  const advice = generateAdvice(sign, scores, traits);

  const moods = ['😊', '🤔', '😌', '🥳', '😤', '🧘', '✨', '🌟', '💫', '🔮'];
  const mood = moods[Math.floor(random() * moods.length)];

  return {
    sign,
    date: dateStr,
    overallScore: scores.overall,
    luckScore: scores.luck,
    loveScore: scores.love,
    careerScore: scores.career,
    healthScore: scores.health,
    luckyColor,
    luckyNumber,
    luckyTime,
    shortForecast,
    detailedForecast,
    advice,
    mood
  };
}

function generateDetailedForecast(_sign, scores) {
  const parts = [];

  if (scores.love >= 70) {
    parts.push('感情方面运势不错，可能有浪漫的邂逅。');
  } else if (scores.love <= 40) {
    parts.push('感情上可能有些波折，需要多一些耐心。');
  }

  if (scores.career >= 70) {
    parts.push('工作上会有好的机会，把握住！');
  } else if (scores.career <= 40) {
    parts.push('工作上可能遇到一些挑战，保持冷静。');
  }

  if (scores.health >= 70) {
    parts.push('身体状况良好，精力充沛。');
  } else if (scores.health <= 40) {
    parts.push('注意休息，不要过度劳累。');
  }

  if (scores.luck >= 70) {
    parts.push('幸运女神眷顾你，今天会有好运气。');
  }

  return parts.join(' ') || '今天是一个普通的日子，保持平和的心态。';
}

function generateAdvice(sign, scores, traits) {
  const adviceList = [];

  if (scores.luck < 50) {
    adviceList.push('今天不宜冒险，稳扎稳打比较好。');
  }

  if (scores.love < 50) {
    adviceList.push('多和身边的人沟通，表达你的感受。');
  }

  if (scores.career > 70) {
    adviceList.push('工作上大胆一些，你的努力会被看到。');
  }

  adviceList.push(`发挥${sign}的${traits.keywords[0]}特质会带来好运。`);

  return adviceList;
}

// 获取星座图标
function getZodiacIcon(sign) {
  const icons = {
    [ZodiacSign.ARIES]: '♈',
    [ZodiacSign.TAURUS]: '♉',
    [ZodiacSign.GEMINI]: '♊',
    [ZodiacSign.CANCER]: '♋',
    [ZodiacSign.LEO]: '♌',
    [ZodiacSign.VIRGO]: '♍',
    [ZodiacSign.LIBRA]: '♎',
    [ZodiacSign.SCORPIO]: '♏',
    [ZodiacSign.SAGITTARIUS]: '♐',
    [ZodiacSign.CAPRICORN]: '♑',
    [ZodiacSign.AQUARIUS]: '♒',
    [ZodiacSign.PISCES]: '♓'
  };
  return icons[sign] || '✨';
}

// 页面逻辑
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('birthday-modal');
  const birthdayBtn = document.getElementById('birthday-btn');
  const changeBirthdayBtn = document.getElementById('change-birthday-btn');
  const saveBtn = document.getElementById('save-birthday');
  const input = document.getElementById('birthday-input');

  const placeholder = document.getElementById('horoscope-placeholder');
  const display = document.getElementById('horoscope-display');

  // 生成并显示运势
  function showHoroscope(birthday) {
    const birthDate = new Date(birthday);
    const sign = getZodiacSign(birthDate);
    const horoscope = generateDailyHoroscope(sign);

    // 隐藏placeholder，显示运势
    placeholder.classList.add('hidden');
    display.classList.remove('hidden');

    // 填充数据
    document.getElementById('horoscope-icon').textContent = getZodiacIcon(sign);
    document.getElementById('horoscope-sign').textContent = sign;
    document.getElementById('horoscope-date').textContent = horoscope.date;
    document.getElementById('horoscope-score').textContent = Math.round(horoscope.overallScore);
    document.getElementById('horoscope-forecast').textContent = horoscope.shortForecast;

    // 各项指数
    document.getElementById('luck-score').textContent = Math.round(horoscope.luckScore);
    document.getElementById('love-score').textContent = Math.round(horoscope.loveScore);
    document.getElementById('career-score').textContent = Math.round(horoscope.careerScore);
    document.getElementById('health-score').textContent = Math.round(horoscope.healthScore);

    // 幸运元素
    document.getElementById('lucky-color').textContent = horoscope.luckyColor;
    document.getElementById('lucky-number').textContent = horoscope.luckyNumber;
    document.getElementById('lucky-time').textContent = horoscope.luckyTime;

    // 心情和建议
    document.getElementById('horoscope-mood').textContent = horoscope.mood;
    const adviceList = document.getElementById('horoscope-advice');
    adviceList.innerHTML = horoscope.advice.map(a => `<li>• ${a}</li>`).join('');

    // 更新圆形进度条
    const circle = document.getElementById('score-circle');
    const offset = 352 - (352 * horoscope.overallScore / 100);
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
    }, 100);
  }

  // 检查是否已设置生日
  const savedBirthday = localStorage.getItem('birthday');
  if (savedBirthday) {
    input.value = savedBirthday;
    showHoroscope(savedBirthday);
  }

  // 事件监听
  if (birthdayBtn) {
    birthdayBtn.addEventListener('click', () => {
      modal.showModal();
    });
  }

  if (changeBirthdayBtn) {
    changeBirthdayBtn.addEventListener('click', () => {
      modal.showModal();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const birthday = input.value;
      if (birthday) {
        localStorage.setItem('birthday', birthday);
        modal.close();
        showHoroscope(birthday);
      }
    });
  }
});
