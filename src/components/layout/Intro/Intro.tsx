

import VaporizeTextCycle, { Tag } from '../Effects/vapour-text-effect';

interface IntroProps {
    onComplete: () => void;
}

export const Intro = ({ onComplete }: IntroProps) => {
    return (
        <div className="fixed inset-0 z-[10000] bg-background flex items-center justify-center">
            <div className="w-full h-full max-w-4xl max-h-[500px]">
                <VaporizeTextCycle
                    texts={["Prazer!", "Sou o John Amorim"]}
                    font={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "60px",
                        fontWeight: 700
                    }}
                    color="rgba(255, 255, 255, 0.9)"
                    spread={3}
                    density={8}
                    animation={{
                        vaporizeDuration: 1.5,
                        fadeInDuration: 0.5,
                        waitDuration: 0.8
                    }}
                    direction="left-to-right"
                    alignment="center"
                    tag={Tag.H1}
                    loop={false}
                    onComplete={onComplete}
                />
            </div>
        </div>
    );
};
