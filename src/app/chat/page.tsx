'use client';

import { useRouter } from 'next/navigation';

export default function ChatPage() {
    const router = useRouter();

    const handleContinue = () => {
        router.push('/proposal');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #ffc2d1 0%, #ffebee 50%, #ff8fab 100%)',
            position: 'relative'
        }}>
            {/* From label */}
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
                💌 From:
            </div>

            {/* Classroom decorations */}
            <div className="decoration" style={{ top: '5%', left: '5%', marginTop: '40px' }}>📚</div>
            <div className="decoration" style={{ top: '8%', right: '8%' }}>🏫</div>
            <div className="decoration" style={{ bottom: '10%', left: '5%' }}>📝</div>
            <div className="decoration" style={{ bottom: '8%', right: '5%' }}>❤️</div>

            <div style={{ maxWidth: '450px', width: '100%' }}>
                {/* Chat Header */}
                <div className="chat-header">
                    💕 Chat with Lucky 💕
                </div>

                {/* Chat Body */}
                <div className="chat-body">
                    {/* Lucky asks */}
                    <div className="chat-bubble received">
                        <strong>Lucky:</strong> Kon?? 🤔
                    </div>

                    {/* You reply */}
                    <div className="chat-bubble sent">
                        <strong>Me:</strong> Manvir Singh 😊
                    </div>

                    {/* Lucky asks again */}
                    <div className="chat-bubble received">
                        <strong>Lucky:</strong> Classmate?? 📚
                    </div>

                    {/* You confirm */}
                    <div className="chat-bubble sent">
                        <strong>Me:</strong> Ji ha Madam! 🙏
                    </div>

                    {/* Continue button */}
                    <button className="continue-btn" onClick={handleContinue}>
                        Continue 💝
                    </button>
                </div>
            </div>
        </div>
    );
}
