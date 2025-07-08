import React, { useState, useRef } from "react";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, className }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Show on hover (desktop)
  const handleMouseEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => setOpen(false), 100);
  };
  // Show on tap/click (mobile)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  // Close on outside click (mobile)
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  return (
    <span className={"relative inline-block " + (className || "")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      tabIndex={0}
      aria-label="Info"
      style={{ cursor: "pointer" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16" height="16" fill="currentColor"
        viewBox="0 0 16 16"
        className="inline-block text-blue-500 ml-1 align-middle"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="white" />
        <text x="8" y="12" textAnchor="middle" fontSize="10" fill="currentColor">i</text>
      </svg>
      {open && (
        <div
          className="absolute z-50 left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-lg text-xs w-56 max-w-xs"
          style={{ minWidth: 150 }}
          role="tooltip"
        >
          {text}
        </div>
      )}
    </span>
  );
};

export default InfoTooltip;
