import { useState, useRef, useEffect } from 'react';
import './saturn-player.css';

export default function SaturnPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.25;

            // Strategy:
            // 1. Try to play with sound immediately.
            // 2. If blocked, play muted immediately (visuals working).
            // 3. Unmute on ANY user interaction (mouse move, scroll, click, etc).

            const startAudio = async () => {
                try {
                    // Try playing with sound first
                    await audioRef.current?.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay with sound blocked. Switching to muted autoplay.");
                    // Fallback: Play muted
                    if (audioRef.current) {
                        audioRef.current.muted = true;
                        try {
                            await audioRef.current.play();
                            setIsPlaying(true);
                            console.log("Muted autoplay started.");
                        } catch (mutedErr) {
                            console.log("Muted autoplay also blocked (rare).");
                        }
                    }
                }
            };

            startAudio();

            // Unmute on ANY interaction
            const unmuteAndPlay = () => {
                if (audioRef.current) {
                    // Try to unmute and play
                    const wasMuted = audioRef.current.muted;
                    audioRef.current.muted = false;
                    audioRef.current.volume = 0.25;

                    const playPromise = audioRef.current.play();

                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                setIsPlaying(true);
                                // Success! Remove listeners
                                ['click', 'keydown', 'mousemove', 'wheel', 'touchstart', 'pointerdown', 'pointermove', 'scroll', 'mousedown'].forEach(event => {
                                    window.removeEventListener(event, unmuteAndPlay, { capture: true });
                                });
                            })
                            .catch(e => {
                                // Failed (browser blocked). Keep listeners active to try again on next interaction.
                                // Restore muted state if it was muted, so it keeps playing visually if possible
                                if (wasMuted) {
                                    audioRef.current!.muted = true;
                                    audioRef.current!.play().catch(() => { });
                                }
                            });
                    }
                }
            };

            // Add listeners to WINDOW for better capture (especially scroll)
            // We don't use { once: true } anymore, we manually remove on success
            ['click', 'keydown', 'mousemove', 'wheel', 'touchstart', 'pointerdown', 'pointermove', 'scroll', 'mousedown'].forEach(event => {
                window.addEventListener(event, unmuteAndPlay, { capture: true });
            });
        }
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error("Audio play failed:", err));
        }
    };

    return (
        <div className="saturn-container">
            <button
                className={`saturn-planet ${isPlaying ? 'playing' : 'paused'}`}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause Music" : "Play Music"}
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                <div className="saturn-body"></div>
                <div className="saturn-ring"></div>
                <div className="saturn-glow"></div>
            </button>
            <audio ref={audioRef} src="/home.mp3" loop autoPlay />
        </div>
    );
}
