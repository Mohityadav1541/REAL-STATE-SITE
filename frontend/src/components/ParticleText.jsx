import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParticleText({ text }) {
  const canvasRef = useRef(null);
  const { scrollY } = useScroll();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only run on client
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowSize.width === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set canvas resolution
    const width = windowSize.width;
    const height = windowSize.height; 
    canvas.width = width;
    canvas.height = height;

    let particles = [];

    const initParticles = () => {
      particles = [];
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d');

      // Match styles
      const fontSize = width * 0.12; 
      offCtx.font = `800 ${fontSize}px "Outfit", sans-serif`;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'middle';
      offCtx.lineWidth = 2;
      offCtx.strokeStyle = 'rgba(255, 255, 255, 1)'; 
      
      const textX = 20; 
      const textY = height - (height * 0.02) - (fontSize / 2); 

      offCtx.strokeText(text, textX, textY);

      const imageData = offCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // step 4 or 5 for performance
      const step = width < 768 ? 4 : 5; 

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) { 
            particles.push({
              baseX: x,
              baseY: y,
              targetX: x + (Math.random() - 0.5) * width * 1.5,
              targetY: y + height * 0.5 + Math.random() * height * 1.5,
              speed: 0.5 + Math.random() * 1.5,
              size: 1 + Math.random() * 2,
              parallaxSpeed: 0.1 + Math.random() * 0.4
            });
          }
        }
      }
    };

    initParticles();

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const currentScroll = scrollY.get();
      // The second image/section appears around scroll = windowHeight * 0.3
      const startBreak = windowSize.height * 0.1;
      const endBreak = windowSize.height * 0.8;
      
      let progress = 0;
      if (currentScroll > startBreak) {
        progress = Math.min(1, (currentScroll - startBreak) / (endBreak - startBreak));
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; 

      const easeProgress = progress * progress * (3 - 2 * progress); // smoothstep
      
      // Parallax text effect before breaking
      const yOffset = currentScroll * 0.2; // Slower parallax effect, similar to original

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // When progress=0, use yOffset. When progress>0, interpolate to target
        const currentX = p.baseX + (p.targetX - p.baseX) * easeProgress;
        
        let currentY;
        if (progress === 0) {
           currentY = p.baseY + yOffset;
        } else {
           const scatteredY = p.baseY + (p.targetY - p.baseY) * easeProgress;
           // Add additional downward movement based on scroll to make them fall faster than the page scrolls up
           currentY = scatteredY + currentScroll * p.parallaxSpeed;
        }

        ctx.fillRect(currentX, currentY, p.size, p.size);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [windowSize, text, scrollY]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
      <motion.canvas
        ref={canvasRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
