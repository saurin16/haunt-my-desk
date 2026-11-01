const $ = (id) => document.getElementById(id);
const fixture = new URLSearchParams(location.search).has('fixture');
let state = null;
let fixtureStart = Date.now();

async function loadFixture() {
  const response = await fetch('/assets/demo.frozen.json');
  state = await response.json();
  $('showcase-label').classList.remove('hidden');
  draw();
}

function draw() {
  if (!state) return;
  const round = state.current;
  const live = round?.status === 'live';
  const marker = $('haunt-marker');
  const card = $('spell-card');
  marker.classList.toggle('hidden', !live);
  card.classList.toggle('hidden', !live);
  if (live) {
    const object = state.objects[round.objectId];
    marker.style.left = `${object.x * 100}%`;
    marker.style.top = `${object.y * 100}%`;
    marker.style.setProperty('--object-accent', object.accent);
    $('object-icon').textContent = object.icon;
    $('object-name').textContent = object.label.toUpperCase();
    $('challenge-text').textContent = round.challenge.text;
    $('viewer-name').textContent = round.user;
    $('spell-number').textContent = `#${String(state.counters.received).padStart(3, '0')}`;
    const endsAt = fixture ? fixtureStart + round.challenge.seconds * 1000 : round.endsAt;
    const seconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    $('timer-value').textContent = String(seconds).padStart(2, '0');
    $('timer-bar').style.width = `${(seconds / round.challenge.seconds) * 100}%`;
    card.classList.toggle('urgent', seconds <= 7);
  }
  const latest = state.history?.[0];
  const showResult = !fixture && !live && latest && Date.now() - latest.finishedAt < 7000;
  $('result-card').classList.toggle('hidden', !showResult);
  if (showResult) {
    $('result-label').textContent = latest.status === 'success' ? 'SPELL BROKEN' : latest.status === 'failure' ? 'CURSE SURVIVES' : 'SPELL DISMISSED';
    $('result-viewer').textContent = `CAST BY ${latest.user}`;
    $('result-sigil').textContent = latest.status === 'success' ? '✦' : '◇';
  }
}

if (fixture) loadFixture();
else {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  function connect() {
    const socket = new WebSocket(`${protocol}//${location.host}/ws`);
    socket.onmessage = (event) => { const packet = JSON.parse(event.data); if (packet.type === 'state') { state = packet.state; draw(); } };
    socket.onclose = () => setTimeout(connect, 1500);
  }
  connect();
}
setInterval(draw, 200);
