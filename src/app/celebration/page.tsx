'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function CelebrationPage() {
    const router = useRouter();
    const [thought, setThought] = useState('');
    const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
    const [fallingHearts, setFallingHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
    const [musicNotes, setMusicNotes] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create falling hearts
        const hearts = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
        }));
        setFallingHearts(hearts);

        // Create music notes
        const notes = Array.from({ length: 10 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: 50 + Math.random() * 40,
            delay: Math.random() * 3,
        }));
        setMusicNotes(notes);

        // Create fireworks periodically
        const fireworkInterval = setInterval(() => {
            const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bd6', '#ff9f45'];
            const newFirework = {
                id: Date.now(),
                x: Math.random() * 100,
                y: Math.random() * 60,
                color: colors[Math.floor(Math.random() * colors.length)],
            };
            setFireworks(prev => [...prev.slice(-10), newFirework]);
        }, 800);

        // Try to play celebration sound (browser may block autoplay)
        try {
            audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleZxgMTFbkbiyqJxzXGFnfIWHiISChIWJi4qHhIGBgYODhIOCgYCAgICAgA==');
            audioRef.current.volume = 0.3;
            audioRef.current.loop = true;
        } catch {
            // Audio not supported
        }

        return () => {
            clearInterval(fireworkInterval);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const handleSubmit = () => {
        if (thought.trim()) {
            // Store thought and navigate
            sessionStorage.setItem('valentineThought', thought);
            router.push('/thankyou');
        }
    };

    return (
        <div className="celebration-container" style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8fab 30%, #fb6f92 60%, #e63946 100%)'
        }}>
            {/* Fireworks */}
            {fireworks.map((fw) => (
                <div
                    key={fw.id}
                    className="firework"
                    style={{
                        left: `${fw.x}%`,
                        top: `${fw.y}%`,
                        backgroundColor: fw.color,
                        boxShadow: `0 0 20px ${fw.color}, 0 0 40px ${fw.color}`,
                    }}
                />
            ))}

            {/* Falling hearts */}
            {fallingHearts.map((heart) => (
                <div
                    key={heart.id}
                    className="falling-heart"
                    style={{
                        left: `${heart.left}%`,
                        animationDelay: `${heart.delay}s`,
                        animationDuration: `${heart.duration}s`,
                    }}
                >
                    {['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)]}
                </div>
            ))}

            {/* Music notes */}
            {musicNotes.map((note) => (
                <div
                    key={note.id}
                    className="music-note"
                    style={{
                        left: `${note.left}%`,
                        top: `${note.top}%`,
                        animationDelay: `${note.delay}s`,
                    }}
                >
                    {['🎵', '🎶', '🎼', '♬'][Math.floor(Math.random() * 4)]}
                </div>
            ))}

            {/* Celebration content */}
            <h1 className="celebration-title">
                🎉 Yay! You Said Yes! 🎉
            </h1>

            <div style={{
                fontSize: '4em',
                animation: 'pulse 1s infinite',
                marginBottom: '20px',
                zIndex: 10
            }}>
                💖💖💖
            </div>

            <p style={{
                color: 'white',
                fontSize: '1.5em',
                marginBottom: '30px',
                textShadow: '2px 2px 10px rgba(0,0,0,0.3)',
                zIndex: 10
            }}>
                🎵 Music is playing, hearts are falling! 🎵
            </p>

            {/* Input section */}
            <div className="input-section">
                <p style={{
                    color: 'white',
                    fontSize: '1.2em',
                    marginBottom: '15px',
                    textShadow: '1px 1px 5px rgba(0,0,0,0.3)'
                }}>
                    Share your thoughts with me 💭
                </p>
                <input
                    type="text"
                    className="thought-input"
                    placeholder="Type your special message..."
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button className="submit-btn" onClick={handleSubmit}>
                    Send with Love 💌
                </button>
            </div>

            {/* Decorations */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '50px', opacity: 0.5 }}>🎊</div>
            <div style={{ position: 'absolute', top: '15%', right: '8%', fontSize: '50px', opacity: 0.5 }}>🎉</div>
            <div style={{ position: 'absolute', bottom: '10%', left: '8%', fontSize: '40px', opacity: 0.5 }}>🌹</div>
            <div style={{ position: 'absolute', bottom: '15%', right: '5%', fontSize: '40px', opacity: 0.5 }}>💐</div>
        </div>
    );
}
