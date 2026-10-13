import React, { useState, useRef } from 'react';
import { ShieldCheck, Sparkles, QrCode, Award, Layers, Compass, ExternalLink } from 'lucide-react';
import { User, SchoolInfo } from '../types';

interface HolographicIDCardProps {
  currentUser: User;
  schoolInfo: SchoolInfo;
  onOpenAuth?: () => void;
}

export const HolographicIDCard: React.FC<HolographicIDCardProps> = ({
  currentUser,
  schoolInfo,
  onOpenAuth,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setSheenPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setSheenPosition({ x: 50, y: 50 });
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="w-full flex items-center justify-center p-2"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative w-full max-w-md h-64 sm:h-72 rounded-[2rem] p-6 text-white overflow-hidden cursor-pointer select-none ios-glass-card border border-white/30 shadow-[0_25px_60px_-15px_rgba(6,182,212,0.35)] group"
      >
        {/* Dynamic Holographic Prismatic Sheen Overlay based on mouse position */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255,255,255,0.45) 0%, rgba(96,165,250,0.3) 25%, rgba(192,132,252,0.25) 50%, transparent 80%)`,
          }}
        />

        {/* Ambient Grid Line Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Card Content Layout */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top Row: School & DepEd Verification */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md border border-white/30">
                P7
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-200">
                  {schoolInfo.schoolName}
                </h4>
                <p className="text-[10px] text-white/70">
                  {schoolInfo.gradeLevel} • {schoolInfo.section} • S.Y. {schoolInfo.schoolYear}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 text-[10px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>DepEd Verified</span>
            </div>
          </div>

          {/* Middle: User Identity */}
          <div className="flex items-center justify-between gap-4 my-auto">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">
                Authorized Credentials
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                {currentUser.name}
              </h3>
              <p className="text-xs text-white/80 font-medium capitalize mt-0.5 flex items-center gap-1.5">
                <span>Role: <strong>{currentUser.title || currentUser.role}</strong></span>
                <span>•</span>
                <span className="text-cyan-300">{currentUser.studentNumber || 'LRN: 10192837465'}</span>
              </p>
            </div>

            {/* Holographic QR / Barcode */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 border border-white/20 flex flex-col items-center justify-center backdrop-blur-md shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <QrCode className="w-8 h-8 text-cyan-300" />
              <span className="text-[8px] font-mono text-white/60 mt-0.5">SCAN ID</span>
            </div>
          </div>

          {/* Bottom Bar: Adviser & Action */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-white/70">
            <div>
              <span className="text-white/40">Adviser:</span>{' '}
              <strong className="text-white">{schoolInfo.adviser}</strong>
            </div>

            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="text-[10px] text-cyan-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Switch Pass</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
