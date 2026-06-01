// Post index — add new posts here when you write them
const POST_INDEX = [
  {
    slug: '2026-06-01-hello',
    date: '2026.06.01',
    title_en: 'Hello, World!',
    title_ko: '안녕, 세상아!',
    category: 'record',
  },
];

function renderPostList(lang) {
  const el = document.getElementById('post-list');
  if (!POST_INDEX.length) {
    el.innerHTML = `<p style="color:var(--ink-muted-48); padding: 40px 0;" data-i18n="records_empty">${t('records_empty')}</p>`;
    return;
  }

  el.innerHTML = POST_INDEX.map(post => {
    const title = lang === 'ko' ? post.title_ko : post.title_en;
    const catKey = post.category === 'record' ? 'cat_record' : 'cat_plan';
    const catClass = post.category === 'record' ? 'cat-record' : 'cat-plan';
    return `
      <a class="post-item" href="post.html?slug=${post.slug}&lang=${lang}">
        <span class="post-date">${post.date}</span>
        <span class="post-title">${title}</span>
        <span class="post-cat ${catClass}">${t(catKey)}</span>
      </a>
    `;
  }).join('');
}
