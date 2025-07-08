import React, { useEffect, useRef } from 'react';
import type { SmoothPursuitSettings } from '../../types';

const SmoothPursuit: React.FC<SmoothPursuitSettings> = ({ speed, color }) => {
  const ballRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 100, y: 100 });
  const direction = useRef({ x: 1, y: 1 });

  useEffect(() => {
    const ballSize = 40;
    let animationFrameId: number;

    const updatePosition = () => {
      const nextX = position.current.x + direction.current.x * (speed * 0.5);
      const nextY = position.current.y + direction.current.y * (speed * 0.5);
      const maxX = window.innerWidth - ballSize;
      const maxY = window.innerHeight - ballSize;

      if (nextX <= 0 || nextX >= maxX) direction.current.x *= -1;
      if (nextY <= 0 || nextY >= maxY) direction.current.y *= -1;

      position.current.x = Math.min(Math.max(nextX, 0), maxX);
      position.current.y = Math.min(Math.max(nextY, 0), maxY);

      if (ballRef.current) {
        ballRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);

  return (
    <div
      ref={ballRef}
      className="w-10 h-10 rounded-full absolute"
      style={{ backgroundColor: color }}
    />
  );
};

export default SmoothPursuit;