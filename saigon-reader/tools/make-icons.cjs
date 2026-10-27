// Renders the SVG icons to the PNG sizes iOS and Android need. Run: npm run icons
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "icons");
const jobs = [
  ["icon.svg", "icon-192.png", 192],
  ["icon.svg", "icon-512.png", 512],
  ["maskable.svg", "maskable-512.png", 512],
  ["maskable.svg", "apple-touch-icon.png", 180], // iOS rounds the corners itself
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [src, out, size] of jobs) {
    const svg = fs.readFileSync(path.join(dir, src), "utf8");
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:transparent}</style><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}" width="${size}" height="${size}">`);
    await page.screenshot({ path: path.join(dir, out), omitBackground: true });
    console.log("wrote", out);
  }
  await browser.close();
})();
