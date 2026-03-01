import CardIcon from '@/assets/card.png';
import JohnAmorim from '@/assets/john-amorim.png';
import Signature from '@/components/ui/Signature';
import { Github, Linkedin, Instagram } from "lucide-react";

export const Hero = () => {
  return (
    <section className="h-full w-full flex flex-col justify-center relative overflow-hidden pb-16">
      <div className="flex items-end w-full h-full">

        {/* Hero Fotter Left */}
        <div className="flex flex-col basis-full xl:basis-[30%] 2xl:basis-[35%] 3xl:basis-[30%] items-start gap-2 pb-16 2xl:pb-10">
          <h2 className="text-white font-bold text-lg 2xl:text-xl">
            Expertise
          </h2>
          <p className="text-white text-sm 2xl:text-base">
            Especializado em Web Designer,UX/UI, Front-end Development and FullStack
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex flex-col w-full items-center">
          <figure className=''>
            <img src={JohnAmorim} alt="John Amorim" className="w-auto h-[calc(100dvh-76px)]" />
          </figure>
          <p className="absolute text-white text-lg 2xl:text-xl left-40 top-20">I am</p>
          <figure className="absolute w-full h-full flex items-start justify-center">
            <Signature color="#00B2FF" strokeColor="#00B2FF" strokeWidth={0.5} />
          </figure>
          <p className="absolute bt-0 text-white text-lg 2xl:text-xl left-70 top-100 2xl:top-90">Developer & Designer</p>
          {/* 3D */}
        </div>

        {/* Hero Fotter Right */}
        <div className="flex flex-col  basis-full xl:basis-[20%] 2xl:basis-[35%] 3xl:basis-[30%] items-start gap-2 pb-16 2xl:pb-10">
          <h2 className='text-white font-bold text-lg 2xl:text-xl'>
            My Projects
          </h2>
          <figure className="bg-white w-full h-24">
            <img src={CardIcon} alt="Project" className='object-cover h-24 w-full' />
          </figure>
          <div className="flex w-full items-center justify-end gap-2">
            <p className="text-sm 2xl:text-base">follow me</p>
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