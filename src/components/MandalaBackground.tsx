'use client';

import { useEffect, useRef, useState } from 'react';

interface MandalaBackgroundProps {
  opacity?: number;
}

const MandalaBackground = ({ opacity = 1 }: MandalaBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation function
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Create mandala patterns
      const layers = 6;
      const maxRadius = Math.min(rect.width, rect.height) * 0.8;

      for (let layer = 0; layer < layers; layer++) {
        const radius = (maxRadius / layers) * (layer + 1) * 0.3;
        const petals = 8 + layer * 4;
        const rotationSpeed = (layer % 2 === 0 ? 1 : -1) * 0.5;
        const rotation = (time * rotationSpeed + layer * 30) * Math.PI / 180;

        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2 + rotation;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Create gradient for each petal
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20 + layer * 5);
          
          // Psychedelic color cycling
          const hue1 = (time * 2 + i * 30 + layer * 60) % 360;
          const hue2 = (hue1 + 60) % 360;
          
          gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, ${0.3 - layer * 0.03})`);
          gradient.addColorStop(0.5, `hsla(${hue2}, 80%, 50%, ${0.2 - layer * 0.02})`);
          gradient.addColorStop(1, `hsla(${hue1}, 60%, 40%, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          
          // Create petal shape
          const petalSize = 8 + layer * 2;
          ctx.ellipse(x, y, petalSize, petalSize * 2, angle, 0, Math.PI * 2);
          ctx.fill();

          // Add connecting lines
          if (layer > 0) {
            ctx.strokeStyle = `hsla(${hue1}, 60%, 50%, ${0.1 - layer * 0.01})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        }
      }

      // Central mandala core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
      const coreHue = time % 360;
      coreGradient.addColorStop(0, `hsla(${coreHue}, 80%, 70%, 0.4)`);
      coreGradient.addColorStop(0.5, `hsla(${(coreHue + 120) % 360}, 70%, 60%, 0.2)`);
      coreGradient.addColorStop(1, `hsla(${(coreHue + 240) % 360}, 60%, 50%, 0)`);

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Update time for next frame
      setTime(prev => prev + 0.3);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [time]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
};

export default MandalaBackground;
