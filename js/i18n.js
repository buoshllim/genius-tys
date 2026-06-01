const STRINGS = {
  en: {
    nav_home: 'Home',
    nav_games: 'Games & Apps',
    nav_records: 'Records & Plans',

    hero_sub: 'I build games & apps.',
    goal_eyebrow: 'My Final Goal',
    goal_text: 'To build a world-class company that advances science.',
    featured_tag: 'Featured Game',
    featured_desc1: 'A fast-paced 5v5 browser soccer game.',
    featured_desc2: 'Jump in and play with your friends right now!',
    featured_cta: "LET'S PLAY NOW",

    games_title: 'Games & Apps',
    games_sub: 'Everything I\'ve built.',

    records_title: 'Records & Plans',
    records_sub: 'My thoughts, progress, and goals.',
    records_empty: 'No posts yet. Stay tuned!',

    tag_game: 'Game',
    tag_app: 'App',
    cat_record: 'Record',
    cat_plan: 'Plans & Goals',

    back: '← Back',
    footer: '© GENIUS TY.S. All rights reserved.',

    // game descriptions
    mini_soccer_desc: 'A chaotic real-time 5v5 soccer game in your browser.',
    polybattle_desc: 'A fast-paced polygon battle game. Outsmart your opponents and be the last shape standing.',
    great_nature_desc: 'An infinite runner set in a stunning natural world.',
    age_of_sail_desc: 'Sail across endless seas in this infinite runner.',
    ftdas_desc: 'A football tactics board and data analysis system.',
  },
  ko: {
    nav_home: '홈',
    nav_games: '게임 & 앱',
    nav_records: '기록 & 계획',

    hero_sub: '게임과 앱을 만들어요.',
    goal_eyebrow: '나의 최종 목표',
    goal_text: '과학을 연구하는 아주 위대하고 세계적인 기업을 만드는 것.',
    featured_tag: '대표 게임',
    featured_desc1: '빠른 템포의 5v5 브라우저 축구 게임.',
    featured_desc2: '지금 바로 친구들과 함께 플레이해 봐!',
    featured_cta: "지금 바로 플레이!",

    games_title: '게임 & 앱',
    games_sub: '내가 만든 것들.',

    records_title: '기록 & 계획',
    records_sub: '생각, 진행 상황, 그리고 목표들.',
    records_empty: '아직 글이 없어요. 기대해 주세요!',

    tag_game: '게임',
    tag_app: '앱',
    cat_record: '기록',
    cat_plan: '계획 & 목표',

    back: '← 뒤로',
    footer: '© GENIUS TY.S. All rights reserved.',

    mini_soccer_desc: '브라우저에서 즐기는 혼돈의 5v5 실시간 축구 게임.',
    polybattle_desc: '빠른 템포의 폴리곤 배틀 게임. 상대를 제압하고 마지막으로 살아남아라.',
    great_nature_desc: '아름다운 자연 세계를 배경으로 한 인피니티 러너.',
    age_of_sail_desc: '끝없는 바다를 항해하는 인피니티 러너.',
    ftdas_desc: '축구 전술 보드 및 데이터 분석 시스템.',
  }
};

let currentLang = localStorage.getItem('genius_lang') || 'en';

function t(key) {
  return STRINGS[currentLang][key] || STRINGS['en'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('genius_lang', lang);
  applyLang();
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    // links don't change text via i18n-href, just update active lang
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  if (typeof onLangChange === 'function') onLangChange();
}

function initLang() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  applyLang();
}
