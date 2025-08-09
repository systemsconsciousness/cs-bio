'use client';

import { useEffect, useRef, useState } from 'react';

interface MandalaBackgroundProps {
  opacity?: number;
}

const MandalaBackground = ({ opacity = 1 }: MandalaBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0); // Use ref instead of state to avoid re-renders
  const [isClient, setIsClient] = useState(false);
  const speedMultiplierRef = useRef(1); // Use ref for performance
  const targetSpeedRef = useRef(1);
  const mousePosRef = useRef({ x: 0, y: 0 }); // Use ref for performance
  const lastFrameTimeRef = useRef(0); // For consistent timing

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mouse tracking effect - throttled for performance
  useEffect(() => {
    if (!isClient) return;

    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;

    const updateMouseTracking = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate distance from center
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Calculate maximum possible distance (corner to center)
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      
      // Normalize distance (0 = center, 1 = edge)
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
      
      // Create speed multiplier: 0.6x at edges, 1.4x at center (more conservative range)
      const speed = 0.6 + (1 - normalizedDistance) * 0.8; // 0.6 to 1.4 (more stable)
      
      targetSpeedRef.current = speed;
      mousePosRef.current = { x: mouseX, y: mouseY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      
      // Throttle updates using RAF
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateMouseTracking);
    };

    // Only add mouse tracking on desktop to improve mobile performance
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to full screen with mobile optimization
    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 2) : (window.devicePixelRatio || 1); // Limit DPR on mobile
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

    // Animation function with consistent timing
    const animate = (currentTime: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // Calculate delta time for consistent animation speed
      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = currentTime;
      }
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000; // Convert to seconds
      lastFrameTimeRef.current = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Enhanced smooth interpolation with more fluid, delayed response
      const lerpFactor = 0.02; // Faster response for better performance
      const newSpeed = speedMultiplierRef.current + (targetSpeedRef.current - speedMultiplierRef.current) * lerpFactor;
      speedMultiplierRef.current = newSpeed;

      // Create mandala patterns - optimized for performance
      const isMobile = width < 768;
      const layers = isMobile ? 6 : 8; // Further reduced layers on mobile
      const maxRadius = Math.max(width, height) * (isMobile ? 0.8 : 1.0); // Smaller on mobile

      // Update time consistently using delta time
      timeRef.current += deltaTime * 60 * newSpeed; // 60 = base speed, consistent across framerates

      for (let layer = 0; layer < layers; layer++) {
        const radius = (maxRadius / layers) * (layer + 1) * 0.4;
        const petals = 6 + layer * 3;
        const baseRotationSpeed = (layer % 2 === 0 ? 1 : -1) * 0.08;
        const rotation = (timeRef.current * baseRotationSpeed + layer * 45) * Math.PI / 180;

        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2 + rotation;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Calculate mouse proximity for this specific circle only (desktop only)
          let mouseProximityMultiplier = 1;
          const mousePos = mousePosRef.current;
          
          if (!isMobile && (mousePos.x > 0 || mousePos.y > 0)) {
            const distanceToMouse = Math.sqrt((x - mousePos.x) ** 2 + (y - mousePos.y) ** 2);
            const proximityRadius = 120; // Radius of mouse influence
            if (distanceToMouse < proximityRadius) {
              const proximityFactor = 1 - (distanceToMouse / proximityRadius);
              mouseProximityMultiplier = 1 + (proximityFactor * 1.5); // Reduced boost for better performance
            }
          }

          // Create gradient for each petal using sophisticated color palettes
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20 + layer * 6); // Smaller gradients for performance
          
          // Cycle through the three beautiful gradient palettes
          const paletteIndex = Math.floor((timeRef.current * 0.01 + layer * 0.3 + i * 0.1)) % 3;
          const baseOpacity = (0.1 - layer * 0.008) * mouseProximityMultiplier; // Reduced base opacity for subtlety
          
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
          const sizeVariation = Math.sin(timeRef.current * 0.02 + i * 0.5 + layer * 0.3) * 0.5 + 1;
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
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25); // Even smaller radius for performance
      const corePhase = Math.floor(timeRef.current * 0.02) % 3;
      
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
      const coreBreathing = Math.sin(timeRef.current * 0.008) * 0.2 + 1; // 0.8 to 1.2 multiplier, much slower
      const coreSize = 12 * coreBreathing; // Even smaller base size for mobile
      
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fill();

      // Continue animation with consistent timing
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation with initial timestamp
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient]); // Only depend on isClient for much better performance

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
