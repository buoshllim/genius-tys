export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: cors() });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const body = await req.json();
  const { password, action } = body;

  if (!password || password !== process.env.WRITE_PASSWORD) {
    return json({ error: '비밀번호가 틀렸어!' }, 401);
  }

  const SB = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_KEY;
  const headers = {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  };

  try {
    if (action === 'create') {
      const { slug, title_ko, title_en, category, content_ko, content_en, date } = body;
      const res = await fetch(`${SB}/rest/v1/tys_posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ slug, title_ko, title_en: title_en || null, category, content_ko, content_en: content_en || null, date }),
      });
      if (!res.ok) {
        const err = await res.text();
        return json({ error: err }, 500);
      }
      return json({ ok: true });
    }

    if (action === 'update') {
      const { slug, title_ko, title_en, category, content_ko, content_en } = body;
      const res = await fetch(`${SB}/rest/v1/tys_posts?slug=eq.${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ title_ko, title_en: title_en || null, category, content_ko, content_en: content_en || null }),
      });
      if (!res.ok) return json({ error: await res.text() }, 500);
      return json({ ok: true });
    }

    if (action === 'delete') {
      const { slug } = body;
      const res = await fetch(`${SB}/rest/v1/tys_posts?slug=eq.${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) return json({ error: await res.text() }, 500);
      return json({ ok: true });
    }

    // password check only
    return json({ ok: true });

  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors() } });
}

function cors() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
}
