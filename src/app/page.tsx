'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EnvelopePage() {
  const router = useRouter();
  const [hearts, setHearts] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);

  useEffect(() => {
    // Create floating hearts
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setHearts(newHearts);
  }, []);

  const handleClick = () => {
    router.push('/chat');
  };

  return (
    <div className="envelope-container" onClick={handleClick}>
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
          💕
        </div>
      ))}

      {/* Classroom decorations */}
      <div className="decoration" style={{ top: '10%', left: '10%' }}>📚</div>
      <div className="decoration" style={{ top: '15%', right: '15%' }}>✏️</div>
      <div className="decoration" style={{ bottom: '20%', left: '8%' }}>🎒</div>
      <div className="decoration" style={{ bottom: '15%', right: '10%' }}>📖</div>

      {/* Envelope */}
      <div className="envelope">
        <div className="envelope-flap"></div>
        <div className="envelope-seal">
          💝
        </div>
        <div className="envelope-heart">💌</div>
      </div>

      <p className="click-hint" style={{ 
        position: 'absolute', 
        bottom: '15%', 
        color: '#fb6f92',
        fontSize: '1.2em',
        fontWeight: 'bold'
      }}>
        ✨ Click to Open ✨
      </p>
    </div>
  );
}
