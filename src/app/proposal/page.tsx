'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProposalPage() {
    const router = useRouter();
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [hearts, setHearts] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        // Create floating hearts
        const newHearts = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 4,
        }));
        setHearts(newHearts);
    }, []);

    const handleYes = () => {
        router.push('/celebration');
    };

    const moveNoButton = () => {
        // Move the No button to a random position
        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 80;
        setNoPosition({
            x: Math.max(20, Math.random() * maxX),
            y: Math.max(100, Math.random() * maxY),
        });
    };

    const handleNoHover = () => {
        moveNoButton();
    };

    const handleNoClick = () => {
        // Show message on mobile
        setShowMessage(true);
        moveNoButton();

        // Hide message after 2 seconds
        setTimeout(() => {
            setShowMessage(false);
        }, 2000);
    };

    return (
        <div className="proposal-container">
            {/* To label */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                fontSize: '1.5em',
                fontWeight: 'bold',
                color: '#fb6f92',
                textShadow: '2px 2px 10px rgba(0,0,0,0.1)',
                zIndex: 100
            }}>
                💝 To:
            </div>

            {/* Message popup - Ha bol de yaar */}
            {showMessage && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'linear-gradient(135deg, #ff6b6b, #ff8fab)',
                    color: 'white',
                    padding: '20px 40px',
                    borderRadius: '20px',
                    fontSize: '1.8em',
                    fontWeight: 'bold',
                    zIndex: 10000,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    animation: 'bounceIn 0.5s ease',
                    textAlign: 'center',
                }}>
                    Ha bol de yaar! 😜💕
                </div>
            )}

            {/* Floating hearts background */}
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="floating-heart"
                    style={{
                        left: `${heart.left}%`,
                        top: `${heart.top}%`,
                        animationDelay: `${heart.delay}s`,
                    }}
                >
                    💗
                </div>
            ))}

            {/* Classroom decorations */}
            <div className="decoration" style={{ top: '5%', left: '5%', marginTop: '40px' }}>📚</div>
            <div className="decoration" style={{ top: '8%', right: '8%' }}>🎓</div>
            <div className="decoration" style={{ bottom: '10%', left: '5%' }}>✨</div>
            <div className="decoration" style={{ bottom: '8%', right: '5%' }}>🌹</div>

            <div className="proposal-hearts">💖💖💖</div>

            <h1 className="proposal-title">
                Will You Be My Valentine? 💝
            </h1>

            <div className="proposal-buttons" style={{ position: 'relative', minHeight: '100px', width: '100%' }}>
                <button className="yes-btn" onClick={handleYes}>
                    Yes! 💕
                </button>

                <button
                    className="no-btn"
                    onMouseEnter={handleNoHover}
                    onClick={handleNoClick}
                    onTouchStart={handleNoClick}
                    style={{
                        left: noPosition.x || 'auto',
                        top: noPosition.y || 'auto',
                        position: noPosition.x ? 'fixed' : 'relative',
                    }}
                >
                    No 😢
                </button>
            </div>

            <p style={{
                marginTop: '50px',
                color: '#b5838d',
                fontSize: '1.1em',
                fontStyle: 'italic'
            }}>
                ~ From your classmate with love 💕 ~
            </p>
        </div>
    );
}
