import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(appDir, 'public');
const target = path.resolve(appDir, '..', 'docs');
fs.mkdirSync(path.join(target, 'assets'), { recursive: true });

const showcase = fs.readFileSync(path.join(source, 'showcase.html'), 'utf8')
  .replaceAll('href="/assets/', 'href="./assets/')
  .replaceAll('src="/assets/', 'src="./assets/')
  .replace('src="/overlay?fixture=1"', 'src="./overlay.html?fixture=1"')
  .replaceAll('href="/"', 'href="https://github.com/saurin16/haunt-my-desk"')
  .replace('Open host studio ↗', 'Run host studio ↗');
fs.writeFileSync(path.join(target, 'index.html'), showcase);

const overlay = fs.readFileSync(path.join(source, 'overlay.html'), 'utf8')
  .replaceAll('href="/assets/', 'href="./assets/')
  .replaceAll('src="/assets/', 'src="./assets/');
fs.writeFileSync(path.join(target, 'overlay.html'), overlay);

for (const file of ['style.css', 'demo.frozen.json', 'overlay.js', 'showcase.js']) {
  let contents = fs.readFileSync(path.join(source, 'assets', file), 'utf8');
  if (file === 'overlay.js') contents = contents.replace("fetch('/assets/demo.frozen.json')", "fetch('./assets/demo.frozen.json')");
  fs.writeFileSync(path.join(target, 'assets', file), contents);
}
console.log(`Built static, labeled showcase in ${target}`);
