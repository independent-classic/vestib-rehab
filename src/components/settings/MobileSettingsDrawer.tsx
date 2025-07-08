import { useEffect, useRef } from "react";

const MobileSettingsDrawer = ({ isOpen, onClose, settings, onChange }: Props) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-end"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div
        ref={drawerRef}
        className="bg-white w-full max-h-[80vh] p-4 overflow-y-auto rounded-t-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          aria-label="Close settings"
        >
          ✕
        </button>
        {/* render settings form here */}
      </div>
    </div>
  );
};

export default MobileSettingsDrawer;