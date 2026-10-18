// Cloudflare Worker: proxies Ghosty's text to ElevenLabs TTS so the API key stays secret.
// Setup: set secret ELEVENLABS_API_KEY (wrangler secret put ELEVENLABS_API_KEY or dashboard → Settings → Variables).
const ALLOWED_ORIGINS = ['https://sachin-jangir8290.github.io'];
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // change to any ElevenLabs voice ID you like
const MODEL_ID = 'eleven_flash_v2_5';
const MAX_CHARS = 400;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST' || !allowed) return new Response('Forbidden', { status: 403, headers: cors });

    let text = '';
    try { text = String((await request.json()).text || '').slice(0, MAX_CHARS).trim(); } catch {}
    if (!text) return new Response('Bad request', { status: 400, headers: cors });

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_64`, {
      method: 'POST',
      headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.4 } }),
    });
    if (!r.ok) return new Response('TTS error', { status: 502, headers: cors });
    return new Response(r.body, { headers: { ...cors, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' } });
  },
};
