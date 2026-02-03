'use client';

import { useEffect, useState } from 'react';

export default function ThankYouPage() {
    const [thought, setThought] = useState('');
    const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
    const [sparkles, setSparkles] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);

    useEffect(() => {
        // Get the thought from session storage
        const savedThought = sessionStorage.getItem('valentineThought') || 'My heart belongs to you 💕';
        setThought(savedThought);

        // Create falling hearts
        const newHearts = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 4 + Math.random() * 4,
        }));
        setHearts(newHearts);

        // Create sparkles
        const newSparkles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
        }));
        setSparkles(newSparkles);
    }, []);

    return (
        <div className="thankyou-container">
            {/* Falling hearts */}
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="falling-heart"
                    style={{
                        left: `${heart.left}%`,
                        animationDelay: `${heart.delay}s`,
                        animationDuration: `${heart.duration}s`,
                    }}
                >
                    {['❤️', '💕', '💖', '💗'][Math.floor(Math.random() * 4)]}
                </div>
            ))}

            {/* Sparkles */}
            {sparkles.map((sparkle) => (
                <div
                    key={sparkle.id}
                    className="floating-heart"
                    style={{
                        left: `${sparkle.left}%`,
                        top: `${sparkle.top}%`,
                        animationDelay: `${sparkle.delay}s`,
                        fontSize: '30px'
                    }}
                >
                    ✨
                </div>
            ))}

            <div className="thankyou-heart">💖</div>

            <h1 className="thankyou-title">
                Thank You for Being My Valentine! 💝
            </h1>

            <div style={{
                fontSize: '3em',
                margin: '20px 0',
                animation: 'pulse 1.5s infinite'
            }}>
                🌹💕🌹
            </div>

            <div className="thought-display">
                <p style={{ fontSize: '0.8em', marginBottom: '10px', opacity: 0.8 }}>
                    Your message:
                </p>
                &quot;{thought}&quot;
            </div>

            {/* Love you buddy message */}
            <div style={{
                background: 'rgba(255,255,255,0.25)',
                padding: '25px 50px',
                borderRadius: '25px',
                color: 'white',
                fontSize: '1.8em',
                fontWeight: 'bold',
                maxWidth: '500px',
                margin: '25px',
                backdropFilter: 'blur(10px)',
                border: '3px solid rgba(255,255,255,0.4)',
                textAlign: 'center',
                animation: 'pulse 2s infinite',
                textShadow: '2px 2px 10px rgba(0,0,0,0.3)'
            }}>
                💕 Love You Buddy! 💕
            </div>

            {/* Replied will soon message */}
            <div style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '20px 40px',
                borderRadius: '20px',
                color: 'white',
                fontSize: '1.3em',
                maxWidth: '400px',
                margin: '10px',
                backdropFilter: 'blur(5px)',
                border: '2px solid rgba(255,255,255,0.3)',
                textAlign: 'center',
            }}>
                💌 Replied will come soon! 💌
            </div>

            {/* Decorative elements */}
            <div style={{ position: 'absolute', top: '5%', left: '5%', fontSize: '40px', opacity: 0.5 }}>🏫</div>
            <div style={{ position: 'absolute', top: '8%', right: '8%', fontSize: '40px', opacity: 0.5 }}>💐</div>
            <div style={{ position: 'absolute', bottom: '10%', left: '5%', fontSize: '40px', opacity: 0.5 }}>🎓</div>
            <div style={{ position: 'absolute', bottom: '8%', right: '5%', fontSize: '40px', opacity: 0.5 }}>💌</div>
        </div>
    );
}
