'use client';

import { useState, useEffect } from 'react';
import IntroAnimation from './ui/IntroAnimation';

export default function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
    const hasPlayed = sessionStorage.getItem('introPlayed');
    if (!hasPlayed) {
      setShowIntro(true);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setShowIntro(false);
  };

  if (!mounted) {
    // Avoid hydration mismatch by rendering nothing (or just children hidden) until mounted
    return null;
  }

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleComplete} />}
      {/* We always render children so it's ready underneath the zooming polaroid */}
      <div style={{ opacity: showIntro ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        {children}
      </div>
    </>
  );
}
