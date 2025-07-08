import { useEffect, useState } from "react";
import FloatingSettingsPanel from "./FloatingSettingsPanel";
import MobileSettingsDrawer from "./MobileSettingsDrawer";
import type { AppSettings } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
}

const SettingsWrapper = ({ isOpen, onClose, settings, onChange }: Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;

  return isMobile ? (
    <MobileSettingsDrawer
      isOpen={isOpen}
      onClose={onClose}
      settings={settings}
      onChange={onChange}
    />
  ) : (
    <FloatingSettingsPanel
      isOpen={isOpen}
      onClose={onClose}
      settings={settings}
      onChange={onChange}
    />
  );
};

export default SettingsWrapper;