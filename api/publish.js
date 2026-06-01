export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password, slug, titleKo, titleEn, category, content, date } = req.body;

  if (!password || password !== process.env.WRITE_PASSWORD) {
    return res.status(401).json({ error: '비밀번호가 틀렸어!' });
  }
  if (!slug || !titleKo || !content) {
    return res.status(400).json({ error: '제목이랑 내용을 입력해줘!' });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const base = `https://api.github.com/repos/${owner}/${repo}/contents`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  function encode(str) {
    return Buffer.from(str, 'utf-8').toString('base64');
  }

  async function ghGet(path) {
    const r = await fetch(`${base}/${path}`, { headers });
    return r.ok ? r.json() : null;
  }

  async function ghPut(path, fileContent, message, sha) {
    const body = { message, content: encode(fileContent) };
    if (sha) body.sha = sha;
    const r = await fetch(`${base}/${path}`, { method: 'PUT', headers, body: JSON.stringify(body) });
    return r.ok;
  }

  try {
    // 1. Upload .ko.md
    const koOk = await ghPut(`posts/${slug}.ko.md`, content, `post: ${titleKo}`);
    if (!koOk) return res.status(500).json({ error: '글 파일 업로드 실패' });

    // 2. Upload .en.md if English title provided
    if (titleEn && titleEn !== titleKo) {
      await ghPut(`posts/${slug}.en.md`, content, `post(en): ${titleEn}`);
    }

    // 3. Update posts/index.json
    const existing = await ghGet('posts/index.json');
    let posts = [];
    if (existing) {
      posts = JSON.parse(Buffer.from(existing.content.replace(/\n/g, ''), 'base64').toString('utf-8'));
    }

    posts.unshift({ slug, date, title_ko: titleKo, title_en: titleEn || titleKo, category });

    const indexOk = await ghPut(
      'posts/index.json',
      JSON.stringify(posts, null, 2),
      `index: add ${titleKo}`,
      existing ? existing.sha : undefined
    );
    if (!indexOk) return res.status(500).json({ error: '목록 업데이트 실패' });

    return res.status(200).json({ ok: true, slug });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
