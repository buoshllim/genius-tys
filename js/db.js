const SB_URL = 'https://pshwspycsfinlkppdwto.supabase.co';
const SB_ANON = 'sb_publishable_dptKe70c_js2Ow-iFdjxgg_rVYIBa4m';
const SB_HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

async function dbFetchPosts() {
  const res = await fetch(`${SB_URL}/rest/v1/tys_posts?order=created_at.desc&select=slug,title_ko,title_en,category,date`, { headers: SB_HEADERS });
  return res.ok ? res.json() : [];
}

async function dbFetchPost(slug) {
  const res = await fetch(`${SB_URL}/rest/v1/tys_posts?slug=eq.${encodeURIComponent(slug)}&limit=1`, { headers: SB_HEADERS });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}
