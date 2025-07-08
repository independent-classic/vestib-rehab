
import React, { useEffect, useState } from 'react';

interface VorVmsProps {
  bpm: number; // Beats per minute, range typically 40 - 120
  color: string; // Color of the letter
}

const VorVms: React.FC<VorVmsProps> = ({ bpm, color }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v);
    }, (60 / bpm) * 1000); // Flash interval in milliseconds

    return () => clearInterval(interval);
  }, [bpm]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span
        className="text-6xl font-bold"
        style={{ color: visible ? color : 'transparent' }}
      >
        A
      </span>
    </div>
  );
};

export default VorVms;

