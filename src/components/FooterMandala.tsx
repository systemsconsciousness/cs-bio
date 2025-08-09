'use client';

import { useEffect, useRef, useState } from 'react';

interface FooterMandalaProps {
  opacity?: number;
}

const FooterMandala = ({ opacity = 1 }: FooterMandalaProps) => {
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

    // Set canvas size to match container
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

    // Animation function - similar to hero but inverted positioning
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height + 100; // Position below footer for upward effect

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Create footer mandala patterns - inverted and smaller
      const layers = 6;
      const maxRadius = Math.max(rect.width, rect.height) * 0.8;

      for (let layer = 0; layer < layers; layer++) {
        const radius = (maxRadius / layers) * (layer + 1) * 0.5;
        const petals = 8 + layer * 2;
        const rotationSpeed = (layer % 2 === 0 ? -1 : 1) * 0.06; // Opposite rotation
        const rotation = (time * rotationSpeed + layer * 60) * Math.PI / 180;

        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2 + rotation;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Only draw if within canvas bounds
          if (y < rect.height && y > -50) {
            // Create gradient using footer color palette
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20 + layer * 6);
            
            // Cycle through color palettes but more muted
            const paletteIndex = Math.floor((time * 0.008 + layer * 0.2 + i * 0.08)) % 3;
            const baseOpacity = 0.08 - layer * 0.008; // More subtle for footer
            
            if (paletteIndex === 0) {
              // Palette 1: #7c4dff to #1783ff
              gradient.addColorStop(0, `rgba(124, 77, 255, ${baseOpacity * 1.2})`);
              gradient.addColorStop(0.6, `rgba(23, 131, 255, ${baseOpacity * 0.8})`);
              gradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
            } else if (paletteIndex === 1) {
              // Palette 2: #7c4dff to #ec3cdb to #eb5646
              gradient.addColorStop(0, `rgba(124, 77, 255, ${baseOpacity})`);
              gradient.addColorStop(0.4, `rgba(236, 60, 219, ${baseOpacity * 0.7})`);
              gradient.addColorStop(0.8, `rgba(235, 86, 70, ${baseOpacity * 0.5})`);
              gradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
            } else {
              // Palette 3: #7c4dff to #253143
              gradient.addColorStop(0, `rgba(124, 77, 255, ${baseOpacity * 0.8})`);
              gradient.addColorStop(0.7, `rgba(37, 49, 67, ${baseOpacity * 0.4})`);
              gradient.addColorStop(1, `rgba(124, 77, 255, 0)`);
            }

            ctx.fillStyle = gradient;
            ctx.beginPath();
            
            // Create varied circle shapes
            const baseSize = 4 + layer * 2;
            const sizeVariation = Math.sin(time * 0.015 + i * 0.4 + layer * 0.2) * 0.4 + 1;
            const circleSize = baseSize * sizeVariation;
            
            ctx.arc(x, y, circleSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Update time for next frame - very slow
      setTime(prev => prev + 0.08);
      
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

export default FooterMandala;
