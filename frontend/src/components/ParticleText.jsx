import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

export default function ParticleText({ text = 'SS DEVELOPERS' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = dimensions.width;
    const height = dimensions.height;
    canvas.width = width;
    canvas.height = height;

    let particles = [];
    let animationFrameId;

    const createParticles = () => {
      particles = [];
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      // Font size responsive: ~11vw, capped appropriately
      const fontSize = Math.max(48, Math.min(width * 0.11, 140));
      offCtx.font = `800 ${fontSize}px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif`;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'alphabetic';

      // Draw SOLID text for pixel scanning
      offCtx.fillStyle = '#ffffff';
      const textX = Math.max(20, width * 0.03);
      const textY = height - Math.max(30, height * 0.05);

      offCtx.fillText(text, textX, textY);

      // Read image data
      const imageData = offCtx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Adaptive sampling step for dense, solid-looking atoms
      const step = width < 768 ? 3 : 4;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];

          // Threshold for solid pixels
          if (alpha > 80) {
            const normalizedAlpha = alpha / 255;
            particles.push({
              baseX: x,
              baseY: y,
              // Random physics properties for each atom
              radius: 1.2 + Math.random() * 1.6,
              alpha: Math.min(1, 0.75 + normalizedAlpha * 0.25),
              // Downward fall velocity & scatter
              fallDistance: 350 + Math.random() * 600,
              scatterX: (Math.random() - 0.5) * 180,
              // Staggered start delay for organic dissolving
              delay: Math.random() * 0.35,
              // Atomic oscillation phase
              jitterPhase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    // Ensure custom font is ready before measuring & drawing
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(createParticles);
    } else {
      createParticles();
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.05;

      const currentScroll = scrollY.get();

      // Scroll threshold: starts breaking at 30px, completely dissolved by 450px
      const breakStart = 30;
      const breakEnd = Math.min(500, height * 0.6);

      let globalProgress = 0;
      if (currentScroll > breakStart) {
        globalProgress = Math.min(1, (currentScroll - breakStart) / (breakEnd - breakStart));
      }

      const totalParticles = particles.length;

      for (let i = 0; i < totalParticles; i++) {
        const p = particles[i];

        // Individual atom progress with staggered delay
        const effectiveProgress = Math.max(
          0,
          Math.min(1, (globalProgress - p.delay) / (1 - p.delay + 0.0001))
        );

        // Smooth cubic ease for natural gravity fall
        const ease = effectiveProgress * effectiveProgress * (3 - 2 * effectiveProgress);

        // High-energy thermal vibration before and during explosion
        const jitterIntensity = Math.sin(effectiveProgress * Math.PI) * 12;
        const jitterX = Math.cos(time * 3 + p.jitterPhase) * jitterIntensity;
        const jitterY = Math.sin(time * 3 + p.jitterPhase) * jitterIntensity;

        // Position: baseX/baseY + scatter + downward fall + jitter
        const curX = p.baseX + p.scatterX * ease + jitterX;
        const curY = p.baseY + p.fallDistance * (ease * 1.2) + jitterY;

        // Opacity: fades out cleanly as atoms fall down
        const atomOpacity = Math.max(0, p.alpha * (1 - effectiveProgress * 1.15));

        if (atomOpacity <= 0.01) continue;

        ctx.fillStyle = `rgba(255, 255, 255, ${atomOpacity})`;
        ctx.beginPath();
        ctx.arc(curX, curY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, text, scrollY]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 6,
      }}
    >
      <motion.canvas
        ref={canvasRef}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{
          scale: [0.92, 1.08, 0.98, 1],
          opacity: [0, 1, 1, 1],
        }}
        transition={{
          duration: 2.2,
          times: [0, 0.45, 0.75, 1],
          ease: 'easeInOut',
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          transformOrigin: 'bottom left',
        }}
      />
    </div>
  );
}
