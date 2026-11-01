export const catalog = Object.freeze({
  mug: {
    label: 'Empty mug',
    icon: '☕',
    accent: '#ffbb7c',
    challenges: [
      { id: 'mug-reveal', text: 'Hide the empty mug with both hands. Reveal it with a flourish.', seconds: 30 },
      { id: 'mug-turn', text: 'Turn the empty mug one full circle. Freeze like you broke the spell.', seconds: 25 },
    ],
  },
  notebook: {
    label: 'Notebook',
    icon: '📓',
    accent: '#a69bff',
    challenges: [
      { id: 'notebook-ghost', text: 'Open the notebook and draw a tiny ghost before time runs out.', seconds: 30 },
      { id: 'notebook-reveal', text: 'Flip to a page, close your eyes, and point to one word.', seconds: 25 },
    ],
  },
  plush: {
    label: 'Plush toy',
    icon: '🧸',
    accent: '#82e6dd',
    challenges: [
      { id: 'plush-vanish', text: 'Make the plush disappear below frame, then bring it back like magic.', seconds: 30 },
      { id: 'plush-pose', text: 'Give the plush a heroic pose and hold it for five seconds.', seconds: 25 },
    ],
  },
});

export function challengeFor(objectId, challengeId) {
  return catalog[objectId]?.challenges.find((item) => item.id === challengeId) ?? null;
}
