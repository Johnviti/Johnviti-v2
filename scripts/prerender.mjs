/**
 * Prerender de SEO (postbuild).
 *
 * O app é uma SPA: o `<head>` estático do `index.html` só serve à primeira
 * pintura, e crawlers de social (WhatsApp/LinkedIn/Twitter) não executam JS.
 * Este script pega o `dist/index.html` como molde e escreve um HTML por rota
 * com title/description/canonical/OG/Twitter corretos e, nos cases, um JSON-LD
 * `CreativeWork` e um bloco `<noscript>` com o texto — conteúdo real para quem
 * não roda JS. Também gera `sitemap.xml`, `robots.txt` e `404.html`.
 *
 * Fonte da verdade do domínio: `SITE_URL`/`OG_IMAGE` em `src/data/site.ts`
 * (lidos por regex para não duplicar o valor).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const indexPath = join(dist, 'index.html');

if (!existsSync(indexPath)) {
  console.error('[prerender] dist/index.html não encontrado — rode `vite build` antes.');
  process.exit(1);
}

/* ----------------------------------------------------- dados & constantes */

const siteTs = readFileSync(join(root, 'src/data/site.ts'), 'utf8');
const readConst = (name, fallback) =>
  siteTs.match(new RegExp(`${name}\\s*=\\s*['"\`]([^'"\`]+)['"\`]`))?.[1] ?? fallback;

const SITE_URL = readConst('SITE_URL', 'https://john-amorim-portfolio.vercel.app');
const OG_IMAGE = readConst('OG_IMAGE', '/cases/card-05.png');

const cases = JSON.parse(readFileSync(join(root, 'src/data/cases.json'), 'utf8')).cases;
const projects = JSON.parse(readFileSync(join(root, 'src/data/projects.json'), 'utf8'));

const abs = (u) => (/^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const caseTitle = (title) =>
  `John Amorim - ${title.charAt(0).toUpperCase()}${title.slice(1).toLowerCase()}`;

const bySlug = Object.fromEntries(cases.map((c) => [c.slug, c]));

/* ---------------------------------------------------------- manipular head */

const template = readFileSync(indexPath, 'utf8');

const setTitle = (html, title) =>
  html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);

const setCanonical = (html, href) =>
  html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(href)}$2`);

/** Troca o `content` de uma meta por name/property; insere se não existir. */
const setMeta = (html, attr, key, content) => {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  if (re.test(html)) return html.replace(re, `$1${esc(content)}$2`);
  return html.replace(
    '</head>',
    `  <meta ${attr}="${key}" content="${esc(content)}" />\n</head>`,
  );
};

/** Aplica o bloco de meta de uma rota. */
const applyMeta = (html, { title, description, url, image }) => {
  let out = setTitle(html, title);
  out = setCanonical(out, url);
  out = setMeta(out, 'name', 'description', description);
  out = setMeta(out, 'property', 'og:title', title);
  out = setMeta(out, 'property', 'og:description', description);
  out = setMeta(out, 'property', 'og:url', url);
  out = setMeta(out, 'property', 'og:image', image);
  out = setMeta(out, 'name', 'twitter:title', title);
  out = setMeta(out, 'name', 'twitter:description', description);
  out = setMeta(out, 'name', 'twitter:image', image);
  return out;
};

/** Injeta scripts/HTML extra antes de `</head>` ou `</body>`. */
const injectHead = (html, snippet) => html.replace('</head>', `${snippet}\n</head>`);
const injectBody = (html, snippet) => html.replace('</body>', `${snippet}\n</body>`);

const writeRoute = (routePath, html) => {
  const out = routePath === '/404' ? join(dist, '404.html') : join(dist, routePath, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
};

/* --------------------------------------------------------------- rotas */

let written = 0;

// Home: reescreve o próprio index.html com meta canônica (idempotente).
writeFileSync(
  indexPath,
  applyMeta(template, {
    title: 'John Amorim — Design de produto & desenvolvimento',
    description:
      'Portfólio de John Amorim: experiências digitais com design de produto, desenvolvimento de software e dashboards. Explore os projetos na galeria imersiva.',
    url: `${SITE_URL}/`,
    image: abs(OG_IMAGE),
  }),
);
written++;

const staticRoutes = [
  {
    path: '/contato',
    title: 'John Amorim - Contato',
    description:
      'Descreva o contexto, o prazo e o resultado esperado. Respondo em até dois dias úteis.',
  },
  {
    path: '/minimal',
    title: 'John Amorim — Versão minimalista',
    description: 'Uma leitura minimalista do portfólio de John Amorim.',
  },
];

for (const r of staticRoutes) {
  const html = applyMeta(template, {
    title: r.title,
    description: r.description,
    url: `${SITE_URL}${r.path}`,
    image: abs(OG_IMAGE),
  });
  writeRoute(r.path, html);
  written++;
}

// 404
writeRoute(
  '/404',
  applyMeta(template, {
    title: 'John Amorim — 404',
    description: 'O endereço não existe ou foi movido. Volte para a galeria.',
    url: `${SITE_URL}/404`,
    image: abs(OG_IMAGE),
  }),
);
written++;

// Cases — meta por projeto + JSON-LD + noscript com o texto real.
for (const p of projects) {
  const c = bySlug[p.slug];
  const title = caseTitle(c ? c.title : p.name);
  const description = c?.intro ?? `Case study do projeto ${p.name}.`;
  const image = abs(c?.cover ?? p.cover);
  const url = `${SITE_URL}/case/${p.slug}`;

  let html = applyMeta(template, { title, description, url, image });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: c?.title ?? p.name,
    headline: c?.title ?? p.name,
    description,
    url,
    image,
    inLanguage: 'pt-BR',
    author: { '@type': 'Person', name: 'John Amorim', url: SITE_URL },
    ...(c?.year ? { dateCreated: String(c.year) } : {}),
  };
  html = injectHead(
    html,
    `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  );

  if (c) {
    const parts = [c.intro, c.challenge, c.approach].filter(Boolean);
    const noscript =
      `  <noscript>\n    <article>\n      <h1>${esc(c.title)}</h1>\n` +
      parts.map((t) => `      <p>${esc(t)}</p>`).join('\n') +
      `\n    </article>\n  </noscript>`;
    html = injectBody(html, noscript);
  }

  writeRoute(`/case/${p.slug}`, html);
  written++;
}

/* -------------------------------------------------- sitemap + robots */

const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, pri: '1.0', freq: 'weekly' },
  { loc: `${SITE_URL}/contato`, pri: '0.6', freq: 'monthly' },
  { loc: `${SITE_URL}/minimal`, pri: '0.4', freq: 'monthly' },
  ...projects.map((p) => ({ loc: `${SITE_URL}/case/${p.slug}`, pri: '0.8', freq: 'monthly' })),
];
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`,
    )
    .join('\n') +
  `\n</urlset>\n`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

console.log(
  `[prerender] ${written} rotas + sitemap (${urls.length} URLs) + robots.txt + 404.html — base ${SITE_URL}`,
);
