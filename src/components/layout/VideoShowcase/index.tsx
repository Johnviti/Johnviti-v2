export const VideoShowcase = () => {
    return (
        <section className="w-full h-screen flex justify-center bg-[#020617] relative">

            <div className="w-full h-full relative z-20">
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 border-none flex flex-col items-center justify-center relative backdrop-blur-md">

                    {/* Placeholder content since we don't have the video file yet */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0,transparent_50%)]"></div>
                    <div className="w-20 h-20 rounded-full bg-slate-800/80 mb-6 flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(0,170,255,0.1)]">
                        <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-[#00aaff] border-b-[12px] border-b-transparent translate-x-1"></div>
                    </div>
                    <div className="text-center px-4 relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Apresentação do Projeto</h3>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#b7ff00]/10 border border-[#b7ff00]/20 text-[#b7ff00] text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#b7ff00] animate-pulse"></span>
                            Motion em construção
                        </div>
                    </div>

                </div>
            </div>
            {/* Background transitions to match previous sections */}
            <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#020617] pointer-events-none z-10"></div>
        </section>
    );
};

export default VideoShowcase;
