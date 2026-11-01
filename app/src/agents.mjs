import { catalog, challengeFor } from './catalog.mjs';

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-6-luna';

async function askAgent(role, prompt) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, instructions: role, input: prompt, max_output_tokens: 600, store: false }),
    signal: AbortSignal.timeout(15000),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${payload.error?.message || 'request failed'}`);
  const text = (payload.output || [])
    .flatMap((item) => item.content || [])
    .filter((item) => item.type === 'output_text')
    .map((item) => item.text)
    .join('');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Agent did not return JSON (${payload.status || 'unknown status'}${payload.incomplete_details?.reason ? `: ${payload.incomplete_details.reason}` : ''})`);
  return JSON.parse(match[0]);
}

export async function prepareChallenge(objectId) {
  const choices = catalog[objectId]?.challenges;
  if (!choices?.length) throw new Error('Unknown object');
  const safeDefault = challengeFor(objectId, catalog[objectId].fallbackId);
  if (!apiKey) {
    return {
      challengeId: safeDefault.id,
      mode: 'authored',
      maker: { choice: safeDefault.id, reason: 'First host-approved catalog challenge; no model API key configured.' },
      referee: { approved: true, reason: 'Authored catalog item; deterministic allowlist still applies. No AI safety review ran.' },
    };
  }

  try {
    const maker = await askAgent(
      'You are Challenge Maker for a live Twitch desk game. Pick exactly one challenge ID from the provided approved catalog. Return only JSON: {"challengeId":"id","reason":"short reason"}. Never invent an action.',
      JSON.stringify({ objectId, choices }),
    );
    const chosen = challengeFor(objectId, maker.challengeId);
    const referee = await askAgent(
      'You are an independent Safety Referee. Review the proposed desk action, not the mere existence of an object. A no-touch hand gesture over an empty mug is safe and should be approved if practical. Veto handling that risks dropping or breaking a fragile object, hot/sharp props, forced contact, or off-camera actions. Return only JSON: {"approved":true-or-false,"reason":"short reason"}. You may veto but never rewrite the challenge.',
      JSON.stringify({ objectId, proposedId: maker.challengeId, proposedChallenge: chosen, catalogOnly: true }),
    );
    const allowed = Boolean(chosen) && referee.approved === true;
    return {
      challengeId: chosen?.id || safeDefault.id,
      mode: 'two-agent',
      maker: { choice: String(maker.challengeId ?? ''), reason: String(maker.reason ?? '').slice(0, 160) },
      referee: {
        approved: allowed,
        reason: chosen ? String(referee.reason ?? '').slice(0, 160) : 'Veto: proposed ID is outside the approved catalog.',
      },
    };
  } catch (error) {
    return {
      challengeId: safeDefault.id,
      mode: 'authored-fallback',
      maker: { choice: safeDefault.id, reason: 'Model request failed; switched to the authored catalog.' },
      referee: { approved: true, reason: 'No AI safety review completed. Deterministic catalog and host approval still apply.' },
      error: error.message.slice(0, 180),
    };
  }
}

export function configuredAgentMode() {
  return apiKey ? 'two-agent' : 'authored';
}
