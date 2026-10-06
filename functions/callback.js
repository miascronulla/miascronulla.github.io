// Cloudflare Pages Function: finishes GitHub OAuth and hands the token to Decap CMS.
// Needs GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (Cloudflare encrypted variables).
const page = (status, payload, origin) => {
  const msg = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html><meta charset="utf-8"><title>Signing in…</title><p>Signing in…</p>
<script>
(function(){
  var msg=${JSON.stringify(msg)}, origin=${JSON.stringify(origin)};
  function recv(e){ if(e.origin!==origin) return; window.opener.postMessage(msg, origin); window.removeEventListener('message', recv); window.close(); }
  window.addEventListener('message', recv);
  window.opener && window.opener.postMessage('authorizing:github', origin);
})();
</script>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'",
      'Set-Cookie': 'cms_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=0',
    },
  });
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = (request.headers.get('Cookie') || '').match(/cms_oauth_state=([^;]+)/);
  if (!code || !state || !cookie || cookie[1] !== state) {
    return page('error', { message: 'Invalid or expired login attempt. Please try again.' }, origin);
  }
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) return page('error', { message: data.error_description || 'GitHub login failed.' }, origin);
  return page('success', { token: data.access_token, provider: 'github' }, origin);
}
