'use client';

import { useEffect, useRef, useState } from 'react';

interface MandalaBackgroundProps {
  opacity?: number;
}

const MandalaBackground = ({ opacity = 1 }: MandalaBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
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

      // Create mandala patterns - much slower and full screen
      const layers = 8;
      const maxRadius = Math.max(rect.width, rect.height) * 0.7; // Full screen coverage

      for (let layer = 0; layer < layers; layer++) {
        const radius = (maxRadius / layers) * (layer + 1) * 0.4;
        const petals = 6 + layer * 3;
        const rotationSpeed = (layer % 2 === 0 ? 1 : -1) * 0.08; // Much slower
        const rotation = (time * rotationSpeed + layer * 45) * Math.PI / 180;

        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2 + rotation;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Create gradient for each petal using sophisticated color palettes
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25 + layer * 8);
          
          // Cycle through the three beautiful gradient palettes
          const paletteIndex = Math.floor((time * 0.01 + layer * 0.3 + i * 0.1)) % 3;
          const baseOpacity = 0.12 - layer * 0.01; // Much more transparent
          
          if (paletteIndex === 0) {
            // Palette 1: #7c4dff to #1783ff
            gradient.addColorStop(0, `rgba(124, 77, 255, ${baseOpacity * 1.5})`);
            gradient.addColorStop(0.6, `rgba(23, 131, 255, ${baseOpacity})`);
            gradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
          } else if (paletteIndex === 1) {
            // Palette 2: #7c4dff to #ec3cdb to #eb5646
            gradient.addColorStop(0, `rgba(124, 77, 255, ${baseOpacity * 1.2})`);
            gradient.addColorStop(0.4, `rgba(236, 60, 219, ${baseOpacity})`);
            gradient.addColorStop(0.8, `rgba(235, 86, 70, ${baseOpacity * 0.8})`);
            gradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
          } else {
            // Palette 3: #7c4dff to #253143
            gradient.addColorStop(0, `rgba(124, 77, 255, ${baseOpacity})`);
            gradient.addColorStop(0.7, `rgba(37, 49, 67, ${baseOpacity * 0.6})`);
            gradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          
          // Create petal shape
          const petalSize = 8 + layer * 2;
          ctx.ellipse(x, y, petalSize, petalSize * 2, angle, 0, Math.PI * 2);
          ctx.fill();

          // Add connecting lines with new color scheme
          if (layer > 1) {
            const lineOpacity = 0.03 - layer * 0.003;
            if (paletteIndex === 0) {
              ctx.strokeStyle = `rgba(23, 131, 255, ${lineOpacity})`;
            } else if (paletteIndex === 1) {
              ctx.strokeStyle = `rgba(236, 60, 219, ${lineOpacity})`;
            } else {
              ctx.strokeStyle = `rgba(124, 77, 255, ${lineOpacity})`;
            }
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        }
      }

      // Central mandala core with new gradient palette
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
      const corePhase = Math.floor(time * 0.02) % 3;
      
      if (corePhase === 0) {
        // Core using palette 1
        coreGradient.addColorStop(0, `rgba(124, 77, 255, 0.15)`);
        coreGradient.addColorStop(0.6, `rgba(23, 131, 255, 0.08)`);
        coreGradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
      } else if (corePhase === 1) {
        // Core using palette 2
        coreGradient.addColorStop(0, `rgba(124, 77, 255, 0.12)`);
        coreGradient.addColorStop(0.4, `rgba(236, 60, 219, 0.08)`);
        coreGradient.addColorStop(0.8, `rgba(235, 86, 70, 0.05)`);
        coreGradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
      } else {
        // Core using palette 3
        coreGradient.addColorStop(0, `rgba(124, 77, 255, 0.1)`);
        coreGradient.addColorStop(0.7, `rgba(37, 49, 67, 0.06)`);
        coreGradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
      }

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.fill();

      // Update time for next frame - much slower
      setTime(prev => prev + 0.1);
      
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
  }, [time, isClient]);

  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
};

export default MandalaBackground;
