"use strict";

// Catch-all serverless handler for Vercel: handles /api/users, /api/users/:id and /api/execute

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

function supabaseHeaders() {
  return {
    apikey: SUPABASE_SERVICE_KEY || "",
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY || ""}`,
    "Content-Type": "application/json",
  };
}

async function supabaseRequest(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const res = await fetch(url, { headers: supabaseHeaders(), ...options });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { json = text; }
  return { status: res.status, body: json, headers: res.headers };
}

module.exports = async (req, res) => {
  // Add CORS headers to allow frontend fetch requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Build absolute URL to parse pathname and query safely
  const host = req.headers.host || 'localhost';
  const fullUrl = new URL(req.url, `http://${host}`);
  const pathname = fullUrl.pathname;

  // Basic config check
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    // Allow execute endpoint to still work even if Supabase isn't configured
    if (!pathname.startsWith('/api/execute')) {
      return res.status(500).json({ error: 'Supabase not configured (set SUPABASE_URL and SUPABASE_SERVICE_KEY)' });
    }
  }

  try {
    // --- Users collection ---
    if (pathname === '/api/users') {
      if (req.method === 'POST') {
        const profile = req.body;
        const { status, body } = await supabaseRequest('/users', { method: 'POST', body: JSON.stringify(profile) });
        return res.status(status).json(body);
      }

      // GET list
      const limit = fullUrl.searchParams.get('limit') || 100;
      const { status, body } = await supabaseRequest(`/users?select=*&limit=${limit}`);
      return res.status(status).json(body);
    }

    // --- User by id ---
    const userIdMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
    if (userIdMatch) {
      const id = decodeURIComponent(userIdMatch[1]);
      if (req.method === 'GET') {
        const { status, body } = await supabaseRequest(`/users?select=*&id=eq.${id}`);
        return res.status(status).json(body && body.length ? body[0] : null);
      }

      if (req.method === 'PUT' || req.method === 'PATCH') {
        const updates = req.body;
        const { status, body } = await supabaseRequest(`/users?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
        return res.status(status).json(body);
      }

      return res.setHeader('Allow', ['GET', 'PUT', 'PATCH']) || res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // --- Execute endpoint ---
    if (pathname === '/api/execute') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }

      const { code, language, testCases } = req.body || {};
      if (!code || !language || !testCases) return res.status(400).json({ error: 'Missing parameters' });

      const results = [];
      for (const tc of testCases) {
        const response = await fetch(PISTON_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language, version: '*', files: [{ name: 'main', content: code }], stdin: tc.input }),
        });

        const data = await response.json();
        const output = (data.run?.output || '').toString().trim();
        const passed = output === tc.expectedOutput;
        results.push({ input: tc.input, expected: tc.expectedOutput, output, passed });
      }

      const passedCount = results.filter(r => r.passed).length;
      return res.json({ message: 'Execution complete', results, score: `${passedCount}/${results.length}` });
    }

    // Default: not found
    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('API handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
