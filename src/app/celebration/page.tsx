'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function CelebrationPage() {
    const router = useRouter();
    const [thought, setThought] = useState('');
    const [sending, setSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [selectedReaction, setSelectedReaction] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
    const [fallingHearts, setFallingHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
    const [musicNotes, setMusicNotes] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const reactions = ['😍', '🥰', '💕', '💖', '❤️', '😘', '🤗', '💝'];

    useEffect(() => {
        const hearts = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
        }));
        setFallingHearts(hearts);

        const notes = Array.from({ length: 10 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: 50 + Math.random() * 40,
            delay: Math.random() * 3,
        }));
        setMusicNotes(notes);

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

        try {
            audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleZxgMTFbkbiyqJxzXGFnfIWHiISChIWJi4qHhIGBgYODhIOCgYCAgICAgA==');
            audioRef.current.volume = 0.3;
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if ((thought.trim() || selectedReaction || uploadedImage) && !sending) {
            setSending(true);
            setStatusMessage('💕 Message saved, sending... please wait');

            // Build message
            let fullMessage = '💝 Lucky replied to your Valentine!\n\n';
            if (selectedReaction) {
                fullMessage += `Reaction: ${selectedReaction}\n\n`;
            }
            if (thought.trim()) {
                fullMessage += `Message: "${thought}"\n\n`;
            }
            if (imageFile) {
                fullMessage += `📷 Lucky also attached a photo!\n\n`;
            }
            fullMessage += `\n💕 Lucky said YES to being your Valentine! 💕`;

            // Save to local JSON first
            try {
                await fetch('/api/save-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        reaction: selectedReaction,
                        message: thought,
                        image: uploadedImage,
                    }),
                });
                setStatusMessage('💾 Message saved locally!');
            } catch (error) {
                console.log('Local save error:', error);
            }

            // Send email using Web3Forms with new key
            try {
                const formData = new FormData();
                formData.append("access_key", "15ed0c1f-3ad9-4be6-842c-042be87843f7");
                formData.append("subject", `💝 Lucky replied! ${selectedReaction || '❤️'}`);
                formData.append("from_name", "Valentine App");
                formData.append("name", "Lucky");
                formData.append("email", "lucky@valentine.app");
                formData.append("message", fullMessage);

                if (imageFile) {
                    formData.append("attachment", imageFile, imageFile.name);
                }

                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    setStatusMessage('✅ Message sent successfully! 💕');
                } else {
                    setStatusMessage('💾 Message saved! Email will be sent soon.');
                }
            } catch (error) {
                console.log('Email error:', error);
                setStatusMessage('💾 Message saved! Email will be sent soon.');
            }

            // Wait a moment to show status, then navigate
            setTimeout(() => {
                sessionStorage.setItem('valentineThought', thought || selectedReaction || '💕');
                sessionStorage.setItem('valentineReaction', selectedReaction);
                if (uploadedImage) {
                    sessionStorage.setItem('valentineImage', uploadedImage);
                }
                router.push('/thankyou');
            }, 1500);
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
                fontSize: '1.3em',
                marginBottom: '20px',
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
                    Share your reaction with me 💭
                </p>

                {/* Reaction picker */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '15px',
                    flexWrap: 'wrap'
                }}>
                    {reactions.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedReaction(selectedReaction === emoji ? '' : emoji)}
                            style={{
                                fontSize: '2em',
                                background: selectedReaction === emoji ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                                border: selectedReaction === emoji ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                transform: selectedReaction === emoji ? 'scale(1.2)' : 'scale(1)',
                            }}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                {/* Image upload */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: '2px dashed rgba(255,255,255,0.5)',
                            borderRadius: '15px',
                            padding: '10px 20px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1em',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        📷 Add a Photo
                    </button>
                    {uploadedImage && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                style={{
                                    maxWidth: '150px',
                                    maxHeight: '150px',
                                    borderRadius: '10px',
                                    border: '3px solid white',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setUploadedImage(null);
                                    setImageFile(null);
                                }}
                                style={{
                                    display: 'block',
                                    margin: '5px auto',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '0.8em'
                                }}
                            >
                                ✕ Remove
                            </button>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    className="thought-input"
                    placeholder="Type your special message..."
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />

                {/* Status message - inline, no popup */}
                {statusMessage && (
                    <p style={{
                        color: 'white',
                        fontSize: '1.1em',
                        marginTop: '10px',
                        padding: '10px 20px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}>
                        {statusMessage}
                    </p>
                )}

                <button
                    type="button"
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={sending}
                    style={{ opacity: sending ? 0.7 : 1 }}
                >
                    {sending ? 'Sending... 💕' : 'Send with Love 💌'}
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
