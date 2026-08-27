const VOICEBOX_URL = 'http://127.0.0.1:17493'

export async function healthCheck() {
  const res = await fetch(`${VOICEBOX_URL}/health`)
  return res.json()
}

export async function getProfiles() {
  const res = await fetch(`${VOICEBOX_URL}/profiles`)
  return res.json()
}

export async function generateSpeech(text, profileId) {
  const res = await fetch(`${VOICEBOX_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, profile_id: profileId }),
  })
  return res.json()
}

export async function getGenerationStatus(generationId) {
  const res = await fetch(`${VOICEBOX_URL}/generate/${generationId}/status`)
  return res.json()
}

export async function getAudio(generationId) {
  return `${VOICEBOX_URL}/audio/${generationId}`
}

export async function getPresets(engine) {
  const res = await fetch(`${VOICEBOX_URL}/profiles/presets/${engine}`)
  return res.json()
}
