'use client';

import { useEffect, useRef, useState } from 'react';

interface SparkleEffectProps {
  isHovered: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  intensity?: number;
  color?: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
  twinkle: number;
}

const SparkleEffect = ({ 
  isHovered, 
  containerRef, 
  intensity = 1,
  color = '#7c4dff'
}: SparkleEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const hoverTimeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nextSparkleId = 0;

    const updateCanvasSize = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    const createSparkle = (containerRect: DOMRect): Sparkle => {
      const baseY = containerRect.height - 20; // Start near bottom
      const spread = Math.min(containerRect.width * 0.8, 300); // Limit spread
      
      return {
        id: nextSparkleId++,
        x: (containerRect.width / 2) + (Math.random() - 0.5) * spread,
        y: baseY + Math.random() * 10,
        size: Math.random() * 3 + 1,
        opacity: 0,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: -Math.random() * 1.5 - 0.5 // Always move upward
        },
        life: 0,
        maxLife: Math.random() * 180 + 120, // 2-5 seconds at 60fps
        twinkle: Math.random() * Math.PI * 2
      };
    };

    const updateSparkle = (sparkle: Sparkle) => {
      sparkle.life++;
      sparkle.x += sparkle.velocity.x;
      sparkle.y += sparkle.velocity.y;
      sparkle.twinkle += 0.1;

      // Fade in quickly, then fade out
      const lifeRatio = sparkle.life / sparkle.maxLife;
      if (lifeRatio < 0.1) {
        sparkle.opacity = lifeRatio * 10; // Fade in
      } else if (lifeRatio > 0.7) {
        sparkle.opacity = 1 - ((lifeRatio - 0.7) / 0.3); // Fade out
      } else {
        sparkle.opacity = 1; // Full opacity
      }

      // Add twinkling effect
      sparkle.opacity *= 0.5 + 0.5 * Math.sin(sparkle.twinkle);

      // Slight gravity effect
      sparkle.velocity.y += 0.01;
    };

    const drawSparkle = (sparkle: Sparkle) => {
      if (sparkle.opacity <= 0) return;

      ctx.save();
      
      // Create gradient for sparkle
      const gradient = ctx.createRadialGradient(
        sparkle.x, sparkle.y, 0,
        sparkle.x, sparkle.y, sparkle.size * 2
      );
      
      // Use the provided color with sparkle opacity
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${sparkle.opacity})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${sparkle.opacity * 0.8})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      
      // Draw sparkle with cross pattern for more sparkly effect
      ctx.beginPath();
      ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
      ctx.fill();

      // Add cross sparkle lines
      ctx.strokeStyle = `rgba(255, 255, 255, ${sparkle.opacity * 0.6})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(sparkle.x - sparkle.size, sparkle.y);
      ctx.lineTo(sparkle.x + sparkle.size, sparkle.y);
      ctx.moveTo(sparkle.x, sparkle.y - sparkle.size);
      ctx.lineTo(sparkle.x, sparkle.y + sparkle.size);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      ctx.clearRect(0, 0, containerRect.width, containerRect.height);

      // Update hover time
      if (isHovered) {
        hoverTimeRef.current += 1;
      } else {
        hoverTimeRef.current = Math.max(0, hoverTimeRef.current - 2); // Fade out faster
      }

      // Calculate spawn rate based on hover duration
      const maxSpawnRate = 3 * intensity;
      const hoverIntensity = Math.min(hoverTimeRef.current / 180, 1); // Build up over 3 seconds
      const currentSpawnRate = maxSpawnRate * hoverIntensity;

      // Create new sparkles
      if (isHovered && Math.random() < currentSpawnRate / 60) {
        sparklesRef.current.push(createSparkle(containerRect));
      }

      // Update and draw sparkles
      sparklesRef.current = sparklesRef.current.filter(sparkle => {
        updateSparkle(sparkle);
        drawSparkle(sparkle);
        
        // Remove dead sparkles
        return sparkle.life < sparkle.maxLife && 
               sparkle.x > -20 && sparkle.x < containerRect.width + 20 &&
               sparkle.y > -20 && sparkle.y < containerRect.height + 20;
      });

      // Clear all sparkles if not hovered and hover time is 0
      if (!isHovered && hoverTimeRef.current <= 0) {
        sparklesRef.current = [];
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    updateCanvasSize();
    animate();

    const handleResize = () => updateCanvasSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient, isHovered, containerRef, intensity, color]);

  if (!isClient) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ 
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}
    />
  );
};

export default SparkleEffect;
