const status = document.getElementById('auth-status');
const params = new URLSearchParams(location.hash.slice(1));
const query = new URLSearchParams(location.search);
history.replaceState(null, '', '/auth/callback');
if (query.has('error')) {
  status.textContent = `Twitch authorization was declined: ${query.get('error')}`;
} else if (!params.get('access_token') || !params.get('state')) {
  status.textContent = 'Twitch did not return an access token.';
} else {
  try {
    const response = await fetch('/api/twitch/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: params.get('access_token'), state: params.get('state') }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Connection failed');
    status.textContent = `Connected to ${result.channel}. Returning to the studio…`;
    setTimeout(() => { location.href = '/'; }, 1000);
  } catch (error) {
    status.textContent = error.message;
  }
}
