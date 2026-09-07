// Vercel Edge Middleware — HTTP Basic Auth gate for Cash Ops Command.
//
// Protects the private operational and astrological materials.
// Password defaults to "myth" so the gate works with no dashboard
// configuration. Set SITE_PASSWORD in Vercel project environment variables
// to change it. Any username is accepted; only the password is checked.

export const config = {
  matcher: '/((?!_next/static|_vercel|favicon.png|apple-touch-icon.png|icon-192.png|icon-512.png).*)',
};

const REALM = 'CashOps Command';

export default function middleware(request) {
  const expected = process.env.SITE_PASSWORD || 'myth';
  const header = request.headers.get('authorization') || '';

  if (header.startsWith('Basic ')) {
    let decoded = '';
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = '';
    }
    // Split on the FIRST colon only: the username may be empty, password checked
    const supplied = decoded.slice(decoded.indexOf(':') + 1);
    if (decoded.includes(':') && supplied === expected) {
      return; // authorised — fall through to the static asset
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
