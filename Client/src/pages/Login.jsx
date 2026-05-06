import React from 'react';
import LoginForm from '../features/auth/LoginForm';
import { Logo   } from "@/components/ui/logo";


const Login = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0e1012 0%, #1a1d22 50%, #0c0e10 100%)',
      }}
    >
      {/* ── Orange ambient glows ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* top-center bloom */}
        <div style={{
          position: 'absolute', top: '-12%', left: '50%',
          transform: 'translateX(-50%)',
          width: '720px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(232,57,29,0.30) 0%, rgba(232,57,29,0.10) 40%, transparent 70%)',
          filter: 'blur(10px)',
        }} />
        {/* bottom-right accent */}
        <div style={{
          position: 'absolute', bottom: '-6%', right: '12%',
          width: '420px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(232,57,29,0.16) 0%, transparent 65%)',
          filter: 'blur(14px)',
        }} />
      </div>

      {/* ── Geometric craft lines (SVG) ── */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        <defs>
          {/* soft orange line style */}
          <filter id="lineglow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Long diagonal lines crossing behind card ── */}
        <line x1="0"    y1="0"   x2="600"  y2="900" stroke="rgba(232,57,29,0.18)" strokeWidth="2"   filter="url(#lineglow)" />
        <line x1="100"  y1="0"   x2="680"  y2="900" stroke="rgba(232,57,29,0.10)" strokeWidth="1.4" />
        <line x1="1440" y1="0"   x2="860"  y2="900" stroke="rgba(232,57,29,0.18)" strokeWidth="2"   filter="url(#lineglow)" />
        <line x1="1340" y1="0"   x2="780"  y2="900" stroke="rgba(232,57,29,0.10)" strokeWidth="1.4" />

        {/* ── Horizontal hairlines ── */}
        <line x1="0" y1="300" x2="420" y2="300" stroke="rgba(232,57,29,0.16)" strokeWidth="1.8" />
        <line x1="1020" y1="300" x2="1440" y2="300" stroke="rgba(232,57,29,0.16)" strokeWidth="1.8" />
        <line x1="0" y1="600" x2="380" y2="600" stroke="rgba(232,57,29,0.12)" strokeWidth="1.2" />
        <line x1="1060" y1="600" x2="1440" y2="600" stroke="rgba(232,57,29,0.12)" strokeWidth="1.2" />

        {/* ── Top-left corner bracket ── */}
        <polyline points="80,60 40,60 40,130"  fill="none" stroke="rgba(232,57,29,0.45)" strokeWidth="2.5" filter="url(#lineglow)" />
        <circle cx="40" cy="60" r="3.5" fill="rgba(232,57,29,0.70)" />

        {/* ── Top-right corner bracket ── */}
        <polyline points="1360,60 1400,60 1400,130" fill="none" stroke="rgba(232,57,29,0.45)" strokeWidth="2.5" filter="url(#lineglow)" />
        <circle cx="1400" cy="60" r="3.5" fill="rgba(232,57,29,0.70)" />

        {/* ── Bottom-left corner bracket ── */}
        <polyline points="80,840 40,840 40,770"  fill="none" stroke="rgba(232,57,29,0.35)" strokeWidth="2" filter="url(#lineglow)" />
        <circle cx="40" cy="840" r="3" fill="rgba(232,57,29,0.55)" />

        {/* ── Bottom-right corner bracket ── */}
        <polyline points="1360,840 1400,840 1400,770" fill="none" stroke="rgba(232,57,29,0.35)" strokeWidth="2" filter="url(#lineglow)" />
        <circle cx="1400" cy="840" r="3" fill="rgba(232,57,29,0.55)" />

        {/* ── Small tick marks left side ── */}
        <line x1="20" y1="400" x2="60" y2="400" stroke="rgba(232,57,29,0.40)" strokeWidth="2" />
        <line x1="20" y1="450" x2="48" y2="450" stroke="rgba(232,57,29,0.25)" strokeWidth="1.4" />
        <line x1="20" y1="500" x2="60" y2="500" stroke="rgba(232,57,29,0.40)" strokeWidth="2" />

        {/* ── Small tick marks right side ── */}
        <line x1="1420" y1="400" x2="1380" y2="400" stroke="rgba(232,57,29,0.40)" strokeWidth="2" />
        <line x1="1420" y1="450" x2="1392" y2="450" stroke="rgba(232,57,29,0.25)" strokeWidth="1.4" />
        <line x1="1420" y1="500" x2="1380" y2="500" stroke="rgba(232,57,29,0.40)" strokeWidth="2" />

        {/* ── Dot grid accent top-left ── */}
        {[0,1,2,3,4].map(col => [0,1,2,3].map(row => (
          <circle
            key={`tl-${col}-${row}`}
            cx={120 + col * 18} cy={80 + row * 18}
            r="1.2" fill="rgba(232,57,29,0.18)"
          />
        )))}

        {/* ── Dot grid accent bottom-right ── */}
        {[0,1,2,3,4].map(col => [0,1,2,3].map(row => (
          <circle
            key={`br-${col}-${row}`}
            cx={1260 + col * 18} cy={790 + row * 18}
            r="1.2" fill="rgba(232,57,29,0.14)"
          />
        )))}

        {/* ── Cross / plus marks ── */}
        <line x1="190" y1="740" x2="210" y2="740" stroke="rgba(232,57,29,0.45)" strokeWidth="1.8" />
        <line x1="200" y1="730" x2="200" y2="750" stroke="rgba(232,57,29,0.45)" strokeWidth="1.8" />

        <line x1="1230" y1="155" x2="1250" y2="155" stroke="rgba(232,57,29,0.45)" strokeWidth="1.8" />
        <line x1="1240" y1="145" x2="1240" y2="165" stroke="rgba(232,57,29,0.45)" strokeWidth="1.8" />
      </svg>

      {/* ── Login card ── */}
      <div
        className="bg-brand-charcoal p-8 md:p-10 rounded-3xl max-w-md w-full border border-gray-800 relative z-10"
        style={{
          boxShadow: '0 0 0 1px rgba(232,57,29,0.15), 0 8px 60px rgba(0,0,0,0.6), 0 0 40px rgba(232,57,29,0.08)',
        }}
      >
        <div className="text-center mb-8">
          <Logo className="h-20" />
          <p className="text-gray-400 mt-2 text-sm">
            Staxhaus is invite-only.<br />Check your inbox for an invitation.
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center text-xs text-gray-500 font-mono tracking-widest">
          &lt;/the school of experience&gt;
        </div>
      </div>
    </div>
  );
};

export default Login;
