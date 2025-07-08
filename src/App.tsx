import Saccades from "./components/exercises/Saccades";
import SmoothPursuit from "./components/exercises/SmoothPursuit";
import VORVMS from "./components/exercises/VorVms";
import SettingsWrapper from "./components/settings/SettingsWrapper";
import SettingsToggleButton from "./components/settings/SettingsToggleButton";
import { applyBackgroundStyle } from "./utils/backgroundUtils";
import useSettingsStore from "./store/settingsStore";

export default function App() {
  const settings = useSettingsStore((state) => state.settings);
  const isSettingsOpen = useSettingsStore((state) => state.isSettingsOpen);
  const setSettingsOpen = useSettingsStore((state) => state.setSettingsOpen);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const renderExercise = () => {
    switch (settings.exercise) {
      case "saccades":
        return <Saccades {...settings.saccades} />;
      case "smoothPursuit":
        return <SmoothPursuit {...settings.smoothPursuit} />;
      case "vorVms":
        return <VORVMS {...settings.vorVms} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {settings.background.type === "video" && (
        <video
          ref={(el) => {
            if (el) el.playbackRate = 0.5;
          }}
          src={settings.background.videoSrc}
          className="absolute top-0 left-0 w-full h-full object-cover blur-sm"
          style={{ filter: "blur(4px)", zIndex: -1 }}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      <div
        className="absolute inset-0"
        style={applyBackgroundStyle(settings.background)}
      >
        <SettingsToggleButton
          isOpen={isSettingsOpen}
          onClick={() => setSettingsOpen(!isSettingsOpen)}
        />
        <SettingsWrapper
          isOpen={isSettingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onChange={updateSettings}
        />
        {renderExercise()}
      </div>
    </div>
  );
}

