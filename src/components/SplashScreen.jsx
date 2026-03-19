import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo/logo.png';

const SplashScreen = ({ onFinish }) => {
    const [progress, setProgress] = useState(0); // 0 to 100
    const [phase, setPhase] = useState('entering'); // entering, revealing, finished
    
    useEffect(() => {
        // Start reveal after a short delay
        const startTimer = setTimeout(() => setPhase('revealing'), 500);
        
        // Final fade out
        const endTimer = setTimeout(() => setPhase('finished'), 4000);
        const finishTimer = setTimeout(() => onFinish(), 4800);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    useEffect(() => {
        if (phase === 'revealing') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 0.8; // Control speed of reveal
                });
            }, 20);
            return () => clearInterval(interval);
        }
    }, [phase]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#040a14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 1s ease-in-out',
            opacity: phase === 'finished' ? 0 : 1,
            overflow: 'hidden',
        }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(67, 97, 200, 0.08) 0%, transparent 60%)',
                opacity: phase === 'entering' ? 0 : 1,
                transition: 'opacity 1s ease',
            }} />

            <div style={{ 
                position: 'relative', 
                width: 'min(450px, 90vw)', 
                aspectRatio: '450 / 140' 
            }}>
                {/* 1. THE HIDDEN LOGO (Base layer) */}
                <img 
                    src={logo} 
                    alt="" 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1) opacity(0.05)', // Very faint ghost
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }} 
                />

                {/* 2. THE REVEALING LOGO (Clipping layer) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    clipPath: `inset(0 0 ${100 - progress}% 0)`, // Reveals from top to bottom
                    overflow: 'visible'
                }}>
                    <img 
                        src={logo} 
                        alt="Servweld" 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(67, 97, 200, 0.8))',
                        }} 
                    />
                </div>

                {/* 3. THE WELDING ARC (The "Edge" line) */}
                {progress > 0 && progress < 100 && (
                    <div style={{
                        position: 'absolute',
                        left: '-5%',
                        width: '110%',
                        height: '4px',
                        top: `${progress}%`,
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                    }}>
                        {/* Glow and core spark */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, transparent, #a8b8ff, #ffffff, #a8b8ff, transparent)',
                            boxShadow: '0 0 30px #4361c8, 0 0 10px #ffffff',
                            animation: 'flicker 0.1s infinite',
                        }} />
                        
                        {/* Smoke Source */}
                        <SmokeEmitter progress={progress} />
                    </div>
                )}
            </div>

            <style>{`
                @keyframes flicker {
                    0% { opacity: 0.8; transform: translateY(-1px) scaleX(0.98); }
                    50% { opacity: 1; transform: translateY(0) scaleX(1.02); }
                    100% { opacity: 0.9; transform: translateY(1px) scaleX(1); }
                }
                @keyframes smoke-fade {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                    100% { transform: translate(var(--dx), -100px) scale(3); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

// --- Smoke Particle System ---------------------------------------
const SmokeEmitter = ({ progress }) => {
    const [particles, setParticles] = useState([]);
    const frameRef = useRef(0);

    useEffect(() => {
        if (progress >= 100) return;

        const interval = setInterval(() => {
            frameRef.current++;
            if (frameRef.current % 3 === 0) { // Emit every 3 ticks
                const newParticle = {
                    id: Date.now(),
                    left: `${10 + Math.random() * 80}%`,
                    dx: `${(Math.random() - 0.5) * 60}px`,
                    size: `${5 + Math.random() * 15}px`,
                };
                setParticles(prev => [...prev.slice(-30), newParticle]); // Keep last 30
            }
        }, 30);

        return () => clearInterval(interval);
    }, [progress]);

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            {particles.map(p => (
                <div key={p.id} style={{
                    position: 'absolute',
                    left: p.left,
                    bottom: 0,
                    width: p.size,
                    height: p.size,
                    background: 'radial-gradient(circle, rgba(200, 210, 255, 0.45) 0%, transparent 80%)',
                    borderRadius: '50%',
                    filter: 'blur(4px)',
                    '--dx': p.dx,
                    animation: 'smoke-fade 2s ease-out forwards',
                }} />
            ))}
        </div>
    );
};

export default SplashScreen;
