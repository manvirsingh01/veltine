'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const songs = [
    '/songs/1 english.mp3',
    '/songs/2 tukur tukur.mp3',
    '/songs/3 janne kyu.mp3',
    '/songs/4 lutt putt gaya.mp3',
    '/songs/5 sitara.mp3',
];

const pageSongMap: { [key: string]: number } = {
    '/': 0,
    '/chat': 1,
    '/proposal': 2,
    '/celebration': 3,
    '/thankyou': 4,
};

export default function MusicPlayer() {
    const pathname = usePathname();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);

    useEffect(() => {
        const songIndex = pageSongMap[pathname] ?? 0;
        const songUrl = songs[songIndex];

        if (!audioRef.current) {
            audioRef.current = new Audio(songUrl);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;

            // Try autoplay
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setShowPrompt(false);
            }).catch(() => {
                // Autoplay blocked - wait for user interaction
            });
        } else {
            const currentSong = songs[songIndex].split('/').pop();
            if (!audioRef.current.src.includes(encodeURIComponent(currentSong || ''))) {
                const wasPlaying = !audioRef.current.paused;
                audioRef.current.src = songUrl;
                audioRef.current.load();
                if (wasPlaying) {
                    audioRef.current.play().catch(() => { });
                }
            }
        }
    }, [pathname]);

    // Start music on any click
    useEffect(() => {
        const startMusic = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    setShowPrompt(false);
                }).catch(() => { });
            }
        };

        document.addEventListener('click', startMusic);
        document.addEventListener('touchstart', startMusic);

        return () => {
            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
        };
    }, []);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setShowPrompt(false);
            }).catch(() => { });
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <>
            {/* Prompt to click */}
            {showPrompt && (
                <div style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    background: 'rgba(255,107,107,0.95)',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    zIndex: 9999,
                    animation: 'pulse 1.5s infinite',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                }}>
                    🎵 Click anywhere for music!
                </div>
            )}

            {/* Music button */}
            <button
                onClick={togglePlay}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isPlaying
                        ? 'linear-gradient(135deg, #6bcb77, #4d96ff)'
                        : 'linear-gradient(135deg, #ff6b6b, #ff8fab)',
                    border: '3px solid white',
                    boxShadow: '0 5px 20px rgba(255,107,107,0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    zIndex: 9999,
                    transition: 'all 0.3s ease',
                }}
                title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
                {isPlaying ? '⏸️' : '🎵'}
            </button>
        </>
    );
}
