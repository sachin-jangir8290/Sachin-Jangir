# Ghosty voice (ElevenLabs) — setup

The API key must never go in `index.html` (the site is public). This Worker keeps it secret.

1. Sign up free at https://dash.cloudflare.com → **Workers & Pages → Create → Worker**. Name it `ghosty-voice`.
2. Click **Edit code**, paste the contents of `elevenlabs-proxy.js`, and **Deploy**.
3. Go to the Worker's **Settings → Variables and Secrets → Add** → type **Secret**, name `ELEVENLABS_API_KEY`, value = your (new) ElevenLabs key. Save.
4. Copy the Worker URL (e.g. `https://ghosty-voice.yourname.workers.dev`).
5. In `index.html`, set `const TTS_PROXY='https://ghosty-voice.yourname.workers.dev';` and push.

Optional: change `VOICE_ID` in the Worker to any voice from your ElevenLabs Voice Library.
If the Worker is unreachable, Ghosty falls back to the browser's built-in voice.
