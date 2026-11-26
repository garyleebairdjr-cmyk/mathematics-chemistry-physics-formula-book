// After `vite build`: give every route its own index.html so static hosts
// (GitHub Pages, Netlify, …) serve deep links like /read/algebra with a 200,
// and keep 404.html as a fallback for anything else.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const index = join(dist, "index.html");
const order = readFileSync("src/data/index.ts", "utf8").match(/const order = \[([\s\S]*?)\];/);
if (!order) throw new Error("Could not find the chapter order in src/data/index.ts");
const slugs = [...order[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const routes = ["atlas", "calculators", "lab", ...slugs.map((slug) => `read/${slug}`)];

for (const route of routes) {
  mkdirSync(join(dist, route), { recursive: true });
  copyFileSync(index, join(dist, route, "index.html"));
}
copyFileSync(index, join(dist, "404.html"));
console.log(`static-routes: wrote ${routes.length} route pages + 404.html`);
