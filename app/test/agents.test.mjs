import test from 'node:test';
import assert from 'node:assert/strict';

test('two-agent path preserves referee veto and catalog allowlist', async () => {
  process.env.OPENAI_API_KEY = 'test-key';
  const { prepareChallenge } = await import('../src/agents.mjs?mocked');
  const originalFetch = globalThis.fetch;
  try {
    const replies = [
      { challengeId: 'mug-reveal', reason: 'A clear camera action' },
      { approved: false, reason: 'Host setup does not show an empty mug' },
      { challengeId: 'invented-dangerous-action', reason: 'New idea' },
      { approved: true, reason: 'Looks fine' },
    ];
    let calls = 0;
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ output: [{ content: [{ type: 'output_text', text: JSON.stringify(replies[calls++]) }] }] }),
    });
    const veto = await prepareChallenge('mug');
    assert.equal(veto.mode, 'two-agent');
    assert.equal(veto.referee.approved, false);
    const invalid = await prepareChallenge('mug');
    assert.equal(invalid.referee.approved, false);
    assert.equal(invalid.challengeId, 'mug-airspell');
    assert.equal(calls, 4);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.OPENAI_API_KEY;
  }
});
