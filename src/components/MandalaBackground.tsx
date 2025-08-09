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
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [targetSpeed, setTargetSpeed] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mouse tracking effect
  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate distance from center
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Calculate maximum possible distance (corner to center)
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      
      // Normalize distance (0 = center, 1 = edge)
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
      
      // Create speed multiplier: 0.3x at edges, 2.5x at center (never backward)
      const speed = 0.3 + (1 - normalizedDistance) * 2.2; // 0.3 to 2.5 (always forward)
      
      setTargetSpeed(speed);
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to full screen
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation function
    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Enhanced smooth interpolation with more fluid, delayed response
      const lerpFactor = 0.008; // Much slower transition for more fluid feel (was 0.02)
      const newSpeed = speedMultiplier + (targetSpeed - speedMultiplier) * lerpFactor;
      setSpeedMultiplier(newSpeed);

      // Create mandala patterns - much slower and bigger than screen
      const layers = 10;
      const maxRadius = Math.max(width, height) * 1.2; // Extends beyond screen for full coverage

      for (let layer = 0; layer < layers; layer++) {
        const radius = (maxRadius / layers) * (layer + 1) * 0.4;
        const petals = 6 + layer * 3;
        const baseRotationSpeed = (layer % 2 === 0 ? 1 : -1) * 0.08;
        const rotationSpeed = baseRotationSpeed * speedMultiplier; // Mouse-responsive speed
        const rotation = (time * rotationSpeed + layer * 45) * Math.PI / 180;

        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2 + rotation;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Calculate mouse proximity for this specific circle only
          let mouseProximityMultiplier = 1;
          if (mousePos.x > 0 || mousePos.y > 0) {
            const distanceToMouse = Math.sqrt((x - mousePos.x) ** 2 + (y - mousePos.y) ** 2);
            const proximityRadius = 120; // Radius of mouse influence
            if (distanceToMouse < proximityRadius) {
              const proximityFactor = 1 - (distanceToMouse / proximityRadius);
              mouseProximityMultiplier = 1 + (proximityFactor * 2); // Boost opacity by up to 200%
            }
          }

          // Create gradient for each petal using sophisticated color palettes
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25 + layer * 8);
          
          // Cycle through the three beautiful gradient palettes
          const paletteIndex = Math.floor((time * 0.01 + layer * 0.3 + i * 0.1)) % 3;
          const baseOpacity = (0.12 - layer * 0.01) * mouseProximityMultiplier; // Apply mouse effect to individual circles
          
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
          
          // Create varied circle shapes with mouse-responsive animation
          const baseSize = 6 + layer * 3;
          const sizeVariation = Math.sin(time * 0.02 * speedMultiplier + i * 0.5 + layer * 0.3) * 0.5 + 1;
          const circleSize = baseSize * sizeVariation;
          
          ctx.arc(x, y, circleSize, 0, Math.PI * 2);
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



      // Central mandala core with mouse-responsive gradient - much smaller
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
      const corePhase = Math.floor(time * 0.02 * speedMultiplier) % 3;
      
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
      
      // Much smaller and slower breathing central core
      const coreBreathing = Math.sin(time * 0.008 * speedMultiplier) * 0.2 + 1; // 0.8 to 1.2 multiplier, much slower
      const coreSize = 15 * coreBreathing; // Much smaller base size
      
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fill();

      // Update time for next frame - base speed with mouse multiplier
      setTime(prev => prev + (0.1 * speedMultiplier));
      
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
  }, [time, isClient, speedMultiplier, targetSpeed, mousePos]);

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
