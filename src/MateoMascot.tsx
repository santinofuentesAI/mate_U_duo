import { useState, useEffect } from 'react';

type MascotMood = 'idle' | 'happy' | 'thinking' | 'celebrate' | 'encourage' | 'wave';

interface Props {
  mood?: MascotMood;
  size?: number;
  animate?: boolean;
}

export function MateoMascot({ mood = 'idle', size = 160, animate = true }: Props) {
  const [blink, setBlink] = useState(false);
  
  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [animate]);

  // Eye states based on mood
  const eyeY = mood === 'happy' ? 78 : mood === 'thinking' ? 76 : 75;
  const eyeHeight = blink ? 2 : mood === 'happy' ? 14 : 16;
  const pupilY = mood === 'thinking' ? 82 : 80;
  
  // Mouth paths for different moods
  const mouths: Record<MascotMood, string> = {
    idle: 'M60 100 Q75 105 90 100',
    happy: 'M55 98 Q75 112 95 98',
    thinking: 'M60 102 L90 102',
    celebrate: 'M50 95 Q75 115 100 95',
    encourage: 'M58 100 Q75 108 92 100',
    wave: 'M60 102 Q75 108 90 102'
  };

  // Arm positions for wave
  const leftArmY = mood === 'wave' ? 118 : 130;
  const leftArmRotate = mood === 'wave' ? 'rotate(-20 35 120)' : '';
  
  // Sparkles for celebrate
  const showSparkles = mood === 'celebrate';

  return (
    <svg 
      className={`mateo-mascot ${animate ? 'is-animated' : ''} mood-${mood}`}
      viewBox="0 0 160 180" 
      width={size}
      height={size * 1.125}
      aria-label="Mateo, tu compañero de matemáticas" 
      role="img"
      style={{ display: 'block' }}
    >
      {/* Shadow */}
      <ellipse cx="80" cy="165" rx="45" ry="8" fill="#00000015" className="mascot-shadow"/>
      
      {/* Body - Calculator-inspired shape */}
      <rect x="35" y="60" width="90" height="100" rx="12" fill="#7556ef" className="mascot-body"/>
      <rect x="35" y="60" width="90" height="100" rx="12" fill="url(#bodyGradient)" opacity="0.3"/>
      
      {/* Screen area - lighter purple */}
      <rect x="45" y="70" width="70" height="35" rx="6" fill="#9d84ff" className="mascot-screen"/>
      <rect x="45" y="70" width="70" height="35" rx="6" fill="#ffffff" opacity="0.2"/>
      
      {/* Math symbols on screen */}
      <text x="75" y="92" fontSize="20" fill="#ffffff" fontWeight="bold" textAnchor="middle">π</text>
      <text x="55" y="88" fontSize="12" fill="#ffffffaa" fontWeight="bold">∑</text>
      <text x="95" y="88" fontSize="12" fill="#ffffffaa" fontWeight="bold">∫</text>
      
      {/* Eyes on screen */}
      <ellipse cx="60" cy={eyeY} rx="8" ry={eyeHeight} fill="#2c2441" className="mascot-eye"/>
      <ellipse cx="90" cy={eyeY} rx="8" ry={eyeHeight} fill="#2c2441" className="mascot-eye"/>
      {!blink && <>
        <ellipse cx="62" cy={pupilY} rx="3" ry="5" fill="#ffffff" opacity="0.6"/>
        <ellipse cx="92" cy={pupilY} rx="3" ry="5" fill="#ffffff" opacity="0.6"/>
      </>}
      
      {/* Button grid - calculator buttons */}
      <g className="mascot-buttons">
        {[0, 1, 2, 3].map(row => 
          [0, 1, 2, 3].map(col => (
            <rect 
              key={`${row}-${col}`}
              x={48 + col * 15} 
              y={115 + row * 10} 
              width="12" 
              height="8" 
              rx="2" 
              fill="#5a3fd4"
              opacity="0.6"
            />
          ))
        )}
      </g>
      
      {/* Arms */}
      <ellipse 
        cx="30" 
        cy={leftArmY} 
        rx="12" 
        ry="28" 
        fill="#6b4ed9" 
        transform={leftArmRotate}
        className="mascot-arm-left"
      />
      <ellipse cx="130" cy="132" rx="12" ry="26" fill="#6b4ed9" className="mascot-arm-right"/>
      
      {/* Hands - little circles */}
      <circle cx="28" cy={leftArmY + 26} r="8" fill="#8b6ef2" className="mascot-hand-left"/>
      <circle cx="132" cy="156" r="8" fill="#8b6ef2" className="mascot-hand-right"/>
      
      {/* Mouth */}
      <path 
        d={mouths[mood]} 
        fill="none" 
        stroke="#2c2441" 
        strokeWidth="3" 
        strokeLinecap="round"
        className="mascot-mouth"
      />
      
      {/* Blush cheeks for happy/encourage moods */}
      {(mood === 'happy' || mood === 'encourage' || mood === 'celebrate') && <>
        <ellipse cx="48" cy="100" rx="8" ry="5" fill="#ff6b9d" opacity="0.5"/>
        <ellipse cx="102" cy="100" rx="8" ry="5" fill="#ff6b9d" opacity="0.5"/>
      </>}
      
      {/* Celebrate sparkles */}
      {showSparkles && (
        <g className="mascot-sparkles">
          <text x="25" y="55" fontSize="16" fill="#fbbf24">✨</text>
          <text x="120" y="50" fontSize="16" fill="#fbbf24">✨</text>
          <text x="15" y="140" fontSize="14" fill="#fbbf24">⭐</text>
          <text x="135" y="135" fontSize="14" fill="#fbbf24">⭐</text>
        </g>
      )}
      
      {/* Thinking bubble */}
      {mood === 'thinking' && (
        <g className="mascot-thought">
          <circle cx="120" cy="45" r="3" fill="#9d84ff" opacity="0.6"/>
          <circle cx="130" cy="35" r="5" fill="#9d84ff" opacity="0.7"/>
          <ellipse cx="145" cy="25" rx="12" ry="10" fill="#9d84ff" opacity="0.8"/>
          <text x="145" y="28" fontSize="10" fill="#2c2441" textAnchor="middle" fontWeight="bold">?</text>
        </g>
      )}
      
      {/* Gradients */}
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
