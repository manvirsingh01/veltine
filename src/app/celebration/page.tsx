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
    const [showCamera, setShowCamera] = useState(false);
    const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
    const [fallingHearts, setFallingHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
    const [musicNotes, setMusicNotes] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

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

        return () => clearInterval(fireworkInterval);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Open camera
    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            streamRef.current = stream;
            setShowCamera(true);

            // Wait for modal to render, then set video source
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (error) {
            console.error('Camera error:', error);
            setStatusMessage('❌ Camera not available. Try Browse Gallery.');
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    // Take photo from camera
    const takePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                setUploadedImage(imageData);
            }
        }
        closeCamera();
    };

    // Close camera
    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    };

    const uploadToImgBB = async (base64Image: string): Promise<string | null> => {
        try {
            const base64Data = base64Image.split(',')[1];
            const formData = new FormData();
            formData.append('key', '666fb0955cdaa1276ec3e3a61a965011');
            formData.append('image', base64Data);
            formData.append('name', `lucky_valentine_${Date.now()}`);

            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                return data.data.url;
            }
            return null;
        } catch (error) {
            console.error('imgBB upload error:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!thought.trim()) {
            setStatusMessage('❌ Please type a message!');
            return;
        }
        if (!selectedReaction) {
            setStatusMessage('❌ Please select an emoji reaction!');
            return;
        }
        if (!uploadedImage) {
            setStatusMessage('❌ Please add a photo!');
            return;
        }

        if (!sending) {
            setSending(true);
            setStatusMessage('💕 Sending your message... please wait');

            let imageUrl = null;

            if (uploadedImage) {
                setStatusMessage('📷 Uploading photo...');
                imageUrl = await uploadToImgBB(uploadedImage);
                if (imageUrl) {
                    setStatusMessage('✅ Photo uploaded! Sending email...');
                }
            }

            try {
                let messageText = '💝 LUCKY REPLIED TO YOUR VALENTINE! 💝\n\n';
                messageText += '-----------------------------------\n\n';

                if (selectedReaction) {
                    messageText += `REACTION: ${selectedReaction}\n\n`;
                }

                if (thought.trim()) {
                    messageText += `MESSAGE: "${thought}"\n\n`;
                }

                if (imageUrl) {
                    messageText += `📷 PHOTO: ${imageUrl}\n\n`;
                }

                messageText += '-----------------------------------\n';
                messageText += '💕 Lucky said YES to being your Valentine! 💕\n';
                messageText += `Sent at: ${new Date().toLocaleString()}`;

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: '15ed0c1f-3ad9-4be6-842c-042be87843f7',
                        subject: `💝 Lucky replied! ${selectedReaction || '❤️'} - Valentine App`,
                        from_name: 'Valentine App',
                        name: 'Lucky',
                        email: 'lucky@valentine.app',
                        message: messageText
                    })
                });

                const data = await response.json();
                console.log('Email Response:', data);

                if (data.success) {
                    setStatusMessage('✅ Message sent successfully! 💕');
                } else {
                    setStatusMessage('📨 Message saved!');
                }
            } catch (error) {
                console.error('Email error:', error);
                setStatusMessage('📨 Message saved!');
            }

            setTimeout(() => {
                sessionStorage.setItem('valentineThought', thought || selectedReaction || '💕');
                sessionStorage.setItem('valentineReaction', selectedReaction);
                if (uploadedImage) {
                    sessionStorage.setItem('valentineImage', uploadedImage);
                }
                router.push('/thankyou');
            }, 2000);
        }
    };

    return (
        <div className="celebration-container" style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8fab 30%, #fb6f92 60%, #e63946 100%)'
        }}>
            {/* Camera Modal */}
            {showCamera && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            maxWidth: '100%',
                            maxHeight: '60vh',
                            borderRadius: '20px',
                            border: '4px solid white',
                        }}
                    />
                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                        <button
                            onClick={takePhoto}
                            style={{
                                background: 'linear-gradient(135deg, #ff6b6b, #ff8fab)',
                                border: '3px solid white',
                                borderRadius: '50%',
                                width: '70px',
                                height: '70px',
                                cursor: 'pointer',
                                fontSize: '28px',
                            }}
                        >
                            📸
                        </button>
                        <button
                            onClick={closeCamera}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '2px solid white',
                                borderRadius: '15px',
                                padding: '15px 25px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1em',
                            }}
                        >
                            ✕ Cancel
                        </button>
                    </div>
                </div>
            )}

            {fireworks.map((fw) => (
                <div key={fw.id} className="firework" style={{ left: `${fw.x}%`, top: `${fw.y}%`, backgroundColor: fw.color, boxShadow: `0 0 20px ${fw.color}, 0 0 40px ${fw.color}` }} />
            ))}

            {fallingHearts.map((heart) => (
                <div key={heart.id} className="falling-heart" style={{ left: `${heart.left}%`, animationDelay: `${heart.delay}s`, animationDuration: `${heart.duration}s` }}>
                    {['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)]}
                </div>
            ))}

            {musicNotes.map((note) => (
                <div key={note.id} className="music-note" style={{ left: `${note.left}%`, top: `${note.top}%`, animationDelay: `${note.delay}s` }}>
                    {['🎵', '🎶', '🎼', '♬'][Math.floor(Math.random() * 4)]}
                </div>
            ))}

            <h1 className="celebration-title">🎉 Yay! You Said Yes! 🎉</h1>

            <div style={{ fontSize: '4em', animation: 'pulse 1s infinite', marginBottom: '20px', zIndex: 10 }}>💖💖💖</div>

            <p style={{ color: 'white', fontSize: '1.3em', marginBottom: '20px', textShadow: '2px 2px 10px rgba(0,0,0,0.3)', zIndex: 10 }}>
                🎵 Music is playing, hearts are falling! 🎵
            </p>

            <div className="input-section">
                <p style={{ color: 'white', fontSize: '1.2em', marginBottom: '15px', textShadow: '1px 1px 5px rgba(0,0,0,0.3)' }}>
                    Share your reaction with me 💭
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
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

                <div style={{ marginBottom: '15px' }}>
                    <p style={{ color: 'white', fontSize: '1em', marginBottom: '10px', opacity: 0.9 }}>
                        📸 Add your photo with reaction:
                    </p>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={openCamera}
                            style={{
                                background: 'linear-gradient(135deg, #ff6b6b, #ff8fab)',
                                border: '2px solid white',
                                borderRadius: '15px',
                                padding: '12px 20px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1em',
                                fontWeight: 'bold',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                            }}
                        >
                            📷 Take Photo
                        </button>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '2px dashed rgba(255,255,255,0.5)',
                                borderRadius: '15px',
                                padding: '12px 20px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1em'
                            }}
                        >
                            🖼️ Browse Gallery
                        </button>
                    </div>

                    {uploadedImage && (
                        <div style={{ marginTop: '15px' }}>
                            <img src={uploadedImage} alt="Your photo" style={{ maxWidth: '180px', maxHeight: '180px', borderRadius: '15px', border: '4px solid white', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }} />
                            <button type="button" onClick={() => setUploadedImage(null)} style={{ display: 'block', margin: '10px auto', background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9em' }}>
                                ✕ Remove Photo
                            </button>
                        </div>
                    )}
                </div>

                <input type="text" className="thought-input" placeholder="Type your special message..." value={thought} onChange={(e) => setThought(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} />

                {statusMessage && (
                    <p style={{ color: 'white', fontSize: '1.1em', marginTop: '10px', padding: '10px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', textAlign: 'center' }}>
                        {statusMessage}
                    </p>
                )}

                <button type="button" className="submit-btn" onClick={handleSubmit} disabled={sending} style={{ opacity: sending ? 0.7 : 1 }}>
                    {sending ? 'Sending... 💕' : 'Send with Love 💌'}
                </button>
            </div>

            <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '50px', opacity: 0.5 }}>🎊</div>
            <div style={{ position: 'absolute', top: '15%', right: '8%', fontSize: '50px', opacity: 0.5 }}>🎉</div>
            <div style={{ position: 'absolute', bottom: '10%', left: '8%', fontSize: '40px', opacity: 0.5 }}>🌹</div>
            <div style={{ position: 'absolute', bottom: '15%', right: '5%', fontSize: '40px', opacity: 0.5 }}>💐</div>
        </div>
    );
}
