import { createContext, useContext } from 'react';

/**
 * Idioma do site — português (padrão) e inglês.
 *
 * O texto de interface vive no dicionário abaixo; o conteúdo dos cases vive em
 * `src/data/cases.json` (pt) e `src/data/cases.en.json` (en), montado por
 * `@/data/cases`. Para acrescentar um idioma: some o código em `LANGUAGES`,
 * adicione a coluna no dicionário e crie o `cases.<código>.json` equivalente.
 *
 * O provider vive em `I18nProvider.tsx`; aqui ficam dicionário, contexto e hook.
 */

export const LANGUAGES = [
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'en', label: 'EN', name: 'English' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];

export const LANG_STORAGE_KEY = 'john-amorim-idioma';

/** `lang` do documento troca junto — leitores de tela e hifenização seguem. */
export const HTML_LANG: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };

export const dictionary = {
  /* ------------------------------------------------------------ navegação */
  'nav.menu': { pt: 'Menu', en: 'Menu' },
  'nav.openMenu': { pt: 'Abrir menu', en: 'Open menu' },
  'nav.closeMenu': { pt: 'Fechar menu', en: 'Close menu' },
  'nav.close': { pt: 'Fechar', en: 'Close' },
  'nav.gallery': { pt: 'Galeria', en: 'Gallery' },
  'nav.contact': { pt: 'Contato', en: 'Contact' },
  'nav.resume': { pt: 'Currículo', en: 'Résumé' },
  'nav.resumeAction': { pt: 'Baixar PDF', en: 'Download PDF' },
  'nav.versions': { pt: 'Versões', en: 'Versions' },
  'nav.social': { pt: 'Redes', en: 'Social' },
  'nav.backToGallery': { pt: 'Voltar para a galeria', en: 'Back to the gallery' },

  /* -------------------------------------------------- tema / idioma */
  'theme.toLight': { pt: 'Ativar modo claro', en: 'Switch to light mode' },
  'theme.toDark': { pt: 'Ativar modo escuro', en: 'Switch to dark mode' },
  'lang.label': { pt: 'Idioma', en: 'Language' },
  'lang.switchTo': { pt: 'Mudar para', en: 'Switch to' },

  /* ---------------------------------------------------------- galeria */
  'gallery.viewProject': { pt: 'Ver projeto', en: 'View project' },
  'gallery.instruction': {
    pt: 'Arraste em qualquer direção para explorar a galeria.',
    en: 'Drag in any direction to explore the gallery.',
  },
  'gallery.instructionHint': {
    pt: 'OU USE A RODA DO MOUSE E AS SETAS DO TECLADO',
    en: 'OR USE THE MOUSE WHEEL AND ARROW KEYS',
  },

  /* -------------------------------------------------------------- case */
  'case.notFound': { pt: 'CASE NÃO ENCONTRADO', en: 'CASE NOT FOUND' },
  'case.projectName': { pt: 'Nome do projeto', en: 'Project name' },
  'case.whatWeDid': { pt: 'O que fizemos', en: 'What we did' },
  'case.industries': { pt: 'Indústrias', en: 'Industries' },
  'case.location': { pt: 'Localização', en: 'Location' },
  'case.stage': { pt: 'Estágio', en: 'Stage' },
  'case.intro': { pt: 'Introdução', en: 'Introduction' },
  'case.challenge': { pt: 'Desafio', en: 'Challenge' },
  'case.approach': { pt: 'Abordagem', en: 'Approach' },
  'case.website': { pt: 'Website', en: 'Website' },
  'case.label': { pt: 'Case study', en: 'Case study' },
  'case.wip': { pt: 'Em desenvolvimento', en: 'In progress' },
  'case.wipBody': {
    pt: 'A vitrine visual deste projeto ainda está sendo montada. A capa e o contexto acima já contam a história — o restante chega em breve.',
    en: 'The visual showcase for this project is still being put together. The cover and the context above already tell the story — the rest is coming soon.',
  },
  'case.ctaTitle': { pt: 'Vamos construir algo.', en: "Let's build something." },
  'case.ctaAction': { pt: 'Entrar em contato', en: 'Get in touch' },
  'case.more': { pt: 'Quer ver mais?', en: 'Want to see more?' },
  'case.floating': { pt: 'Vamos trabalhar juntos', en: "Let's work together" },

  /* ----------------------------------------------------------- contato */
  'contact.eyebrow': { pt: 'Contato', en: 'Contact' },
  'contact.title': {
    pt: 'Oi! Conta tudo pra mim',
    en: 'Hey! Tell me all the things',
  },
  'contact.lead': {
    pt: 'Conte sobre a ideia, o prazo e o que precisa existir no fim. Respondo em até dois dias úteis.',
    en: 'Tell me about the idea, the deadline and what needs to exist at the end. I reply within two business days.',
  },
  'contact.servicesLabel': { pt: 'No que posso ajudar?', en: 'What can I help with?' },
  'contact.budgetLabel': { pt: 'Orçamento previsto', en: 'Estimated budget' },
  'contact.budgetSkip': { pt: 'Ainda não sei', en: 'Not sure yet' },
  'contact.name': { pt: 'Nome', en: 'Name' },
  'contact.namePlaceholder': { pt: 'como devo te chamar', en: 'what should I call you' },
  'contact.email': { pt: 'E-mail', en: 'Email' },
  'contact.emailPlaceholder': { pt: 'para onde eu respondo', en: 'where I should reply' },
  'contact.company': { pt: 'Empresa (opcional)', en: 'Company (optional)' },
  'contact.companyPlaceholder': {
    pt: 'marca, time ou projeto',
    en: 'brand, team or project',
  },
  'contact.message': { pt: 'Mensagem', en: 'Message' },
  'contact.messagePlaceholder': {
    pt: 'conte um pouco sobre a ideia',
    en: 'tell me a bit about the idea',
  },
  'contact.send': { pt: 'Enviar pedido', en: 'Send request' },
  'contact.sending': { pt: 'Enviando…', en: 'Sending…' },
  'contact.sentTitle': { pt: 'Mensagem enviada.', en: 'Message sent.' },
  'contact.sentBody': {
    pt: 'Obrigado pelo contato — respondo assim que possível.',
    en: 'Thanks for reaching out — I will get back to you shortly.',
  },
  'contact.sentAgain': { pt: 'Enviar outra mensagem', en: 'Send another message' },
  'contact.errorFallback': {
    pt: 'Se preferir, escreva direto para',
    en: 'If you prefer, write directly to',
  },
  'contact.notConfigured': {
    pt: 'O formulário ainda não foi configurado. Defina VITE_WEB3FORMS_ACCESS_KEY no arquivo .env — ou escreva direto para',
    en: 'The form has not been configured yet. Set VITE_WEB3FORMS_ACCESS_KEY in the .env file — or write directly to',
  },
  'contact.reply': {
    pt: 'Respondo em até 2 dias úteis.',
    en: 'I reply within 2 business days.',
  },
  'contact.privacy': {
    pt: 'Seus dados são usados só para responder este contato.',
    en: 'Your data is used only to answer this message.',
  },
  'contact.writeMe': { pt: 'Escreva para mim', en: 'Write to me' },
  'contact.whereIAm': { pt: 'Onde eu estou', en: 'Where I am' },
  'contact.address': { pt: 'Maceió, Alagoas — Brasil', en: 'Maceió, Alagoas — Brazil' },
  'contact.remote': {
    pt: 'Trabalho remoto com times de qualquer fuso.',
    en: 'Working remotely with teams in any time zone.',
  },
  'contact.followMe': { pt: 'Me acompanhe', en: 'Follow me' },
} as const;

export type MessageKey = keyof typeof dictionary;

export type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Alterna entre os idiomas disponíveis, em ordem. */
  cycleLang: () => void;
  t: (key: MessageKey) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

/** Idioma inicial: o salvo; na primeira visita, o do navegador. */
export const readInitialLang = (): Lang => {
  if (typeof window === 'undefined') return 'pt';
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') return saved;
  } catch {
    // localStorage bloqueado — cai no idioma do navegador.
  }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n precisa estar dentro de <I18nProvider>.');
  return ctx;
}
