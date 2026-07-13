import { useEffect, useState } from 'react';
import { CONTACT_EMAIL } from '@/data/site';

const formatTime = () =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Maceio',
  }).format(new Date());

export const Header = () => {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-white">
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm md:px-8">
        <a href="#" className="font-medium lowercase tracking-tight">
          john amorim<sup className="text-[0.6em]">®</sup>
        </a>

        <div className="hidden items-center gap-2 text-white/70 md:flex">
          <span>Maceió</span>
          <span className="tabular-nums">{time}</span>
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="hidden underline-offset-4 transition-opacity hover:underline hover:opacity-70 lg:block"
        >
          {CONTACT_EMAIL}
        </a>

        <nav className="flex items-center gap-4 md:gap-6">
          <a href="#projetos" className="transition-opacity hover:opacity-60">
            Projetos
          </a>
          <a href="#servicos" className="transition-opacity hover:opacity-60">
            Serviços
          </a>
          <a
            href="#contato"
            className="rounded-full border border-white/80 px-4 py-1.5 transition-colors hover:bg-white hover:text-black"
          >
            Oi!
          </a>
        </nav>
      </div>
    </header>
  );
};
