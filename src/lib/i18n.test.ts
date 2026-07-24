import { describe, expect, it } from 'vitest';
import { dictionary, LANGUAGES } from '@/lib/i18n';

describe('dicionário i18n', () => {
  const entries = Object.entries(dictionary);

  it('tem entradas', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('toda chave tem tradução não-vazia em todos os idiomas', () => {
    const codes = LANGUAGES.map((l) => l.code);
    for (const [key, value] of entries) {
      for (const code of codes) {
        const text = (value as Record<string, string>)[code];
        expect(typeof text, `${key}.${code} deve ser string`).toBe('string');
        expect(text.trim().length, `${key}.${code} não pode ser vazio`).toBeGreaterThan(0);
      }
    }
  });
});
