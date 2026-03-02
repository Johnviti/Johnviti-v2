"use client";
import { ShiningText } from "@/components/ui/shining-text";

export const Footer = () => {
    return (
        <footer className="relative w-full py-24 flex flex-col items-center justify-start border-t border-[#ffffff05] overflow-hidden min-h-[60vh]">

            {/* Indicação de desenvolvimento */}
            <div className="flex justify-center opacity-80 mb-20 z-10">
                <ShiningText text="Novas seções em desenvolvimento..." />
            </div>

            {/* Skeleton Components para indicar seções futuras */}
            <div className="w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-40">

                {/* Skeleton Card 1 */}
                <div className="w-full flex flex-col gap-4 animate-pulse">
                    <div className="w-full h-40 bg-white/5 rounded-xl border border-white/10"></div>
                    <div className="h-5 bg-white/5 rounded-md w-3/4"></div>
                    <div className="h-3 bg-white/5 rounded-md w-full"></div>
                    <div className="h-3 bg-white/5 rounded-md w-5/6"></div>
                </div>

                {/* Skeleton Card 2 */}
                <div className="w-full flex flex-col gap-4 animate-pulse" style={{ animationDelay: '200ms' }}>
                    <div className="w-full h-40 bg-white/5 rounded-xl border border-white/10"></div>
                    <div className="h-5 bg-white/5 rounded-md w-2/3"></div>
                    <div className="h-3 bg-white/5 rounded-md w-full"></div>
                    <div className="h-3 bg-white/5 rounded-md w-4/5"></div>
                </div>

                {/* Skeleton Card 3 */}
                <div className="w-full flex flex-col gap-4 animate-pulse hidden lg:flex" style={{ animationDelay: '400ms' }}>
                    <div className="w-full h-40 bg-white/5 rounded-xl border border-white/10"></div>
                    <div className="h-5 bg-white/5 rounded-md w-1/2"></div>
                    <div className="h-3 bg-white/5 rounded-md w-full"></div>
                    <div className="h-3 bg-white/5 rounded-md w-3/4"></div>
                </div>
            </div>

            {/* Skeleton Footer Bar */}
            <div className="w-full max-w-5xl mx-auto px-6 mt-16 opacity-30 animate-pulse" style={{ animationDelay: '600ms' }}>
                <div className="w-full h-16 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl border border-white/5"></div>
            </div>

            {/* Efeito de desbotamento para o final da página */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#111] to-transparent pointer-events-none z-10"></div>
        </footer>
    );
};

export default Footer;
