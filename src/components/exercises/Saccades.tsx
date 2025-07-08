import React, { useEffect, useState, useRef } from "react";
import type { SaccadesSettings } from "../../types";

interface Point {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  visible: boolean;
}

const Saccades: React.FC<SaccadesSettings> = ({
  mode,
  speed,
  distance,
  numberOfPoints,
  colors,
  pointSize = 30,
}) => {
  const [points, setPoints] = useState<Point[]>([]);

  const isMobile = window.innerWidth < 768;

  // Store intervals for cleanup in multi mode
  const multiIntervals = useRef<ReturnType<typeof setInterval>[]>([]);

  // Initialize points when dependencies change
  useEffect(() => {
    if (mode === "stationary") {
      const pts: Point[] = [];
      for (let i = 0; i < numberOfPoints; i++) {
        pts.push({
          id: i,
          x: isMobile
            ? 50
            : (100 - distance * (numberOfPoints - 1)) / 2 + distance * i,
          y: isMobile
            ? (100 - distance * (numberOfPoints - 1)) / 2 + distance * i
            : 50,
          size: pointSize,
          color: colors[i] || "#000",
          visible: true,
        });
      }
      setPoints(pts);
    } else if (mode === "random") {
      setPoints([
        {
          id: 0,
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
          size: pointSize,
          color: colors[0] || "#000",
          visible: true,
        },
        {
          id: 1,
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
          size: pointSize,
          color: colors[1] || "#000",
          visible: true,
        },
      ]);
    } else if (mode === "multi") {
      const pts: Point[] = [];
      for (let i = 0; i < 4; i++) {
        pts.push({
          id: i,
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
          size: pointSize,
          color: colors[i % colors.length] || "#000",
          visible: true,
        });
      }
      setPoints(pts);
    }
  }, [mode, speed, distance, numberOfPoints, colors, isMobile, pointSize]);

  // Manage flashing behavior
  useEffect(() => {
    // Clear all intervals on cleanup or mode change
    multiIntervals.current.forEach(clearInterval);
    multiIntervals.current = [];

    if (mode === "random" || mode === "multi") {
      setPoints((prev) =>
        prev.map((pt) => ({
          ...pt,
          visible: false,
        }))
      );

      // For each point, set up its own interval
      const intervalIds: ReturnType<typeof setInterval>[] = [];
      const num = mode === "random" ? 2 : points.length;
      for (let i = 0; i < num; i++) {
        let isVisible = false;
        const toggle = () => {
          isVisible = !isVisible;
          setPoints((prev) =>
            prev.map((p, idx) =>
              idx === i
                ? {
                    ...p,
                    x: Math.random() * 90 + 5,
                    y: Math.random() * 90 + 5,
                    visible: isVisible,
                  }
                : p
            )
          );
        };
        // Start immediately
        toggle();
        // Use randomized interval duration for both random and multi modes
        const interval = setInterval(toggle, (Math.random() * 700 + 400) / speed);
        intervalIds.push(interval);
      }
      multiIntervals.current = intervalIds;
      return () => {
        intervalIds.forEach(clearInterval);
        multiIntervals.current = [];
      };
    }

    // No flashing in stationary mode, so no intervals needed
    return () => {};
  }, [mode, speed, points.length]);

  return (
    <div className="relative w-full h-full">
      {points.map(
        (p) =>
          p.visible && (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                top: `${p.y}%`,
                left: `${p.x}%`,
                transform: "translate(-50%, -50%)",
              }}
              aria-label={`Saccade point ${p.id + 1}`}
            />
          )
      )}
    </div>
  );
};

export default Saccades;