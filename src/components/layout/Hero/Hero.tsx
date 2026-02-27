import LogoIcon from '@/assets/logo-john-amorim.svg';
import CardIcon from '@/assets/card.png';
import JohnAmorim from '@/assets/john-amorim.png';
// import NameFull from '@/assets/name-full.svg';
import { Github, Linkedin, Instagram } from "lucide-react";

export const Hero = () => {
  return (
    <section className="h-full w-full flex flex-col justify-center relative overflow-hidden pb-16">
      <div className="flex items-end w-full h-full">

        {/* Hero Fotter Left */}
        <div className="flex flex-col w-40 items-start gap-2 pb-16">
          <h2 className="text-white font-bold text-2xl">
            Expertise
          </h2>
          <p className="text-white text-lg">
            Especializado em Web Designer,UX/UI, Front-end Development and FullStack
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex flex-col w-full items-center">
          <div>
            <span>I am</span>
            <figure className="">
              {/* <img src={NameFull} alt="Assinatura do Nome John Amorim" /> */}
            </figure>
            <span className="text-white font-bold text-2xl">Developer & Designer</span>
          </div>
          <figure className=''>
            <img src={JohnAmorim} alt="John Amorim" className="w-auto h-[calc(100dvh-76px)]" />
          </figure>
          {/* 3D */}
        </div>

        {/* Hero Fotter Right */}
        <div className="flex flex-col w-40 items-start gap-2 pb-16">
          <h2>
            My Projects
          </h2>
          <figure className="bg-white w-40 h-24">
            {/* <img src={cardIcon} alt="Project" /> */}
          </figure>
          <div className="flex w-full items-center justify-end gap-2">
            <p>follow me</p>
            <div className="flex items-center gap-2">
              <a href="https://github.com/Johnviti" target="_blank" rel="noopener noreferrer">
                 <Github size={16} />
              </a>
              <a href="https://www.linkedin.com/in/johnviti/" target="_blank" rel="noopener noreferrer">
                 <Linkedin size={16} />
              </a>
              <a href="https://www.instagram.com/johnviti/" target="_blank" rel="noopener noreferrer">
                 <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};