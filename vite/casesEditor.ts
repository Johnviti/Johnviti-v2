import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Connect, Plugin, ViteDevServer } from 'vite';

/**
 * API de escrita do editor local de cases (`/revisao`).
 *
 * Existe SÓ no `vite dev` (`apply: 'serve'`) e só quando `CASES_EDITOR=true`
 * está no `.env` — no build de produção o plugin nem é registrado, então a
 * rota não vai para o bundle nem para o servidor estático.
 *
 * Além disso, cada requisição precisa vir de um endereço de loopback: mesmo
 * que o dev server seja exposto com `--host`, a máquina de fora recebe 403.
 */

const FILES = {
  cases: 'src/data/cases.json',
  en: 'src/data/cases.en.json',
  projects: 'src/data/projects.json',
} as const;

/** `::1`, `127.0.0.1` e o `::ffff:127.0.0.1` que o Node usa em dual-stack. */
const isLoopback = (address: string | undefined): boolean => {
  if (!address) return false;
  const addr = address.replace(/^::ffff:/, '');
  return addr === '127.0.0.1' || addr === '::1' || addr.startsWith('127.');
};

const readJson = async <T>(root: string, rel: string): Promise<T> =>
  JSON.parse(await readFile(path.join(root, rel), 'utf8')) as T;

/** Mesma formatação usada pelos arquivos versionados: 2 espaços + newline. */
const writeJson = (root: string, rel: string, value: unknown) =>
  writeFile(path.join(root, rel), `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const readBody = (req: Connect.IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      /* Um case inteiro tem alguns KB; 5 MB é folga de sobra e evita que um
         corpo malformado cresça sem limite. */
      if (raw.length > 5_000_000) reject(new Error('corpo grande demais'));
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });

type CaseStudy = { slug: string } & Record<string, unknown>;
type CasesFile = { cases: CaseStudy[] };
type EnFile = Record<string, Record<string, unknown>>;
type Project = { slug: string } & Record<string, unknown>;

export function casesEditorPlugin(root: string, enabled: boolean): Plugin {
  return {
    name: 'johnviti:cases-editor',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      if (!enabled) return;

      server.middlewares.use('/__cases', async (req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(payload));
        };

        if (!isLoopback(req.socket.remoteAddress ?? undefined)) {
          send(403, { error: 'O editor de cases só responde em localhost.' });
          return;
        }

        try {
          if (req.method === 'GET') {
            const [pt, en, projects] = await Promise.all([
              readJson<CasesFile>(root, FILES.cases),
              readJson<EnFile>(root, FILES.en),
              readJson<Project[]>(root, FILES.projects),
            ]);
            send(200, { cases: pt.cases, en, projects });
            return;
          }

          if (req.method === 'PUT') {
            const body = JSON.parse(await readBody(req)) as {
              slug?: string;
              case?: CaseStudy;
              en?: Record<string, unknown> | null;
            };
            const slug = body.slug;
            if (!slug || !body.case) {
              send(400, { error: 'Envie `slug` e `case`.' });
              return;
            }
            if (body.case.slug !== slug) {
              send(400, { error: 'O `slug` do corpo não bate com o do case.' });
              return;
            }

            const pt = await readJson<CasesFile>(root, FILES.cases);
            const index = pt.cases.findIndex((c) => c.slug === slug);
            if (index === -1) {
              send(404, { error: `Case \`${slug}\` não existe.` });
              return;
            }
            pt.cases[index] = body.case;
            await writeJson(root, FILES.cases, pt);

            /* A tradução é opcional: `null` remove a entrada, um objeto
               substitui, e ausência (undefined) deixa como está. */
            if (body.en !== undefined) {
              const en = await readJson<EnFile>(root, FILES.en);
              if (body.en === null) delete en[slug];
              else en[slug] = body.en;
              await writeJson(root, FILES.en, en);
            }

            /* O tile da galeria vive em `projects.json` e repete nome e capa —
               mantém os dois em sincronia para não divergirem em silêncio. */
            const projects = await readJson<Project[]>(root, FILES.projects);
            const p = projects.find((entry) => entry.slug === slug);
            if (p) {
              let dirty = false;
              if (typeof body.case.title === 'string' && p.name !== body.case.title) {
                p.name = body.case.title;
                dirty = true;
              }
              if (typeof body.case.cover === 'string' && p.cover !== body.case.cover) {
                p.cover = body.case.cover;
                dirty = true;
              }
              if (dirty) await writeJson(root, FILES.projects, projects);
            }

            send(200, { ok: true, slug });
            return;
          }

          send(405, { error: 'Use GET ou PUT.' });
        } catch (error) {
          send(500, { error: error instanceof Error ? error.message : String(error) });
        }
      });

      server.config.logger.info(
        '\n  [32m➜[39m  [1mEditor de cases[22m: /revisao [2m(local, CASES_EDITOR=true)[22m',
      );
    },
  };
}
