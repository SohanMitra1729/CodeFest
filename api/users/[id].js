"use strict";

// Serverless handler for /api/users/[id]
// Supports GET (fetch by id) and PUT (update)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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

module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    if (req.method === "GET") {
      const { status, body } = await supabaseRequest(`/users?select=*&id=eq.${id}`);
      return res.status(status).json(body && body.length ? body[0] : null);
    }

    if (req.method === "PUT" || req.method === "PATCH") {
      const updates = req.body;
      const { status, body } = await supabaseRequest(`/users?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(updates) });
      return res.status(status).json(body);
    }

    res.setHeader("Allow", ["GET", "PUT", "PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("Error in /api/users/[id]:", err);
    return res.status(500).json({ error: "user fetch/update failed" });
  }
};
