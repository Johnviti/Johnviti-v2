import { useEffect } from 'react';
import { OG_IMAGE, SITE_URL } from '@/data/site';

/**
 * Atualiza título, descrição e tags Open Graph/Twitter por rota.
 *
 * O SPA troca de página sem recarregar, então o `<head>` estático do
 * `index.html` só serve à primeira pintura; aqui reescrevemos as tags a cada
 * navegação para que prévia de link (WhatsApp, LinkedIn) e leitores reflitam a
 * página atual. As tags são criadas sob demanda e reaproveitadas.
 */

type Meta = {
  title: string;
  description: string;
  /** Caminho absoluto do site (ex.: `/case/foo`); usado no canonical/og:url. */
  path?: string;
  /** Imagem de compartilhamento — absoluta ou relativa à raiz. */
  image?: string;
};

const absolute = (url: string) =>
  url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

const setNamed = (attr: 'name' | 'property', key: string, content: string) => {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export function useDocumentMeta({ title, description, path, image }: Meta) {
  useEffect(() => {
    const url = absolute(path ?? window.location.pathname);
    const img = absolute(image ?? OG_IMAGE);

    document.title = title;
    setNamed('name', 'description', description);
    setCanonical(url);

    setNamed('property', 'og:type', 'website');
    setNamed('property', 'og:site_name', 'John Amorim');
    setNamed('property', 'og:title', title);
    setNamed('property', 'og:description', description);
    setNamed('property', 'og:url', url);
    setNamed('property', 'og:image', img);

    setNamed('name', 'twitter:card', 'summary_large_image');
    setNamed('name', 'twitter:title', title);
    setNamed('name', 'twitter:description', description);
    setNamed('name', 'twitter:image', img);
  }, [title, description, path, image]);
}
