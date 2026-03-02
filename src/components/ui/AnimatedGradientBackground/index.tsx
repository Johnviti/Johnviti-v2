
const AnimatedGradientBackground = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            {/* Base Background Color */}
            <div className="absolute inset-0 bg-background"></div>

            {/* Gradient blobs */}
            {/* Blob 1 */}
            <div
                className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-main/20 blur-[120px] mix-blend-screen animate-blob"
                style={{ animationDuration: '20s' }}
            ></div>

            {/* Blob 2 */}
            <div
                className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/20 blur-[120px] mix-blend-screen animate-blob"
                style={{ animationDuration: '25s', animationDelay: '-5s' }}
            ></div>

            {/* Blob 3 */}
            <div
                className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-sky-400/20 blur-[120px] mix-blend-screen animate-blob"
                style={{ animationDuration: '30s', animationDelay: '-10s' }}
            ></div>

            {/* Blob 4 (Subtle purple touch) */}
            <div
                className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[100px] mix-blend-screen animate-blob"
                style={{ animationDuration: '22s', animationDelay: '-8s' }}
            ></div>
        </div>
    );
};

export default AnimatedGradientBackground;
