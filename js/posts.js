async function loadPostIndex() {
  const res = await fetch(`posts/index.json?t=${Date.now()}`);
  return res.ok ? res.json() : [];
}

async function renderPostList(lang) {
  const el = document.getElementById('post-list');
  el.innerHTML = '<p style="color:var(--ink-muted-48);padding:40px 0;">불러오는 중...</p>';

  const posts = await loadPostIndex();

  if (!posts.length) {
    el.innerHTML = `<p style="color:var(--ink-muted-48);padding:40px 0;">${t('records_empty')}</p>`;
    return;
  }

  el.innerHTML = posts.map(post => {
    const title = lang === 'ko' ? post.title_ko : post.title_en;
    const catKey = post.category === 'record' ? 'cat_record' : 'cat_plan';
    const catClass = post.category === 'record' ? 'cat-record' : 'cat-plan';
    return `
      <a class="post-item" href="post.html?slug=${post.slug}">
        <span class="post-date">${post.date}</span>
        <span class="post-title">${title}</span>
        <span class="post-cat ${catClass}">${t(catKey)}</span>
      </a>
    `;
  }).join('');
}
