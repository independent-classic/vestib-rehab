import { useEffect, useRef, useState } from "react";
import type { AppSettings, ExerciseType } from "../../types";
import InfoTooltip from "./InfoTooltip";

interface FloatingSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
}

const staticImages = [
  { id: 1, src: "src/assets/static-bg/bg1.png", label: "Background 1" },
  { id: 2, src: "src/assets/static-bg/bg2.png", label: "Background 2" },
];

const movingVideos = [
  { id: 1, src: "src/assets/moving-bg/bg1.mp4", label: "Tennis" },
  { id: 1, src: "src/assets/moving-bg/bg2.mp4", label: "Soccer" },
];



const FloatingSettingsPanel = ({ onClose, settings, onChange }: FloatingSettingsPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { exercise, background, saccades, smoothPursuit, vorVms } = settings;
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  // Preloading images
  const preloadImages = (staticImages: string[]) => {
    staticImages.forEach((url: string) => {
      const img = new Image();
      img.src = url;
    });
  };

  // Preloading videos (basic approach: load metadata)
  const preloadVideos = (movingVideos: string[]) => {
    movingVideos.forEach((url: string) => {
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'metadata';
    });
  };

  // Usage Example
  useEffect(() => {
    preloadImages([
      'src/assets/static-bg/bg1.png',
      'src/assets/static-bg/bg2.png'
    ]);

    preloadVideos([
      'src/assets/moving-bg/bg1.mp4',
      'src/assets/moving-bg/bg2.mp4'
    ]);
  }, []);



  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="fixed top-4 right-4 z-50 rounded-lg shadow-lg bg-white max-w-sm w-full p-4"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        aria-label="Close settings"
      >
        ✕
      </button>

      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="mb-3">
        <label className="block text-sm mb-1 flex items-center gap-1">Background Type
          <InfoTooltip text="Choose the type of background for the exercise (color, image, or video)." />
        </label>
        <select
          value={background.type}
          onChange={(e) => onChange({
            ...settings,
            background: { ...background, type: e.target.value as any },
          })}
          className="border border-gray-300 rounded w-full p-1"
        >
          <option value="color">Color</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      {background.type === "color" && (
        <div className="mb-3">
          <label className="block text-sm mb-1 flex items-center gap-1">Background Color
            <InfoTooltip text="Select the solid color used as the exercise background." />
          </label>
          <input
            type="color"
            value={background.color}
            onChange={(e) => onChange({
              ...settings,
              background: { ...background, color: e.target.value },
            })}
            className="w-full h-10 p-0 border border-gray-300 rounded"
          />
        </div>
      )}

      {(background.type === "image" || background.type === "video") && (
        <div className="mb-3">
          <label className="block text-sm mb-1">Select Background</label>
          <button
            className="border border-gray-300 rounded w-full p-2 bg-gray-50 hover:bg-gray-100"
            onClick={() => background.type === "image" ? setShowImageDialog(true) : setShowVideoDialog(true)}
          >
            Choose
          </button>
        </div>
      )}

      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Select Background Image</h3>
            <div className="grid grid-cols-2 gap-4">
              {staticImages.map((img) => (
                <button key={img.id} className="border border-gray-300 rounded overflow-hidden hover:shadow" onClick={() => {
                  onChange({ ...settings, background: { ...background, image: img.src } });
                  setShowImageDialog(false);
                }}>
                  <img src={img.src} alt={img.label} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100" onClick={() => setShowImageDialog(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showVideoDialog && background.type === "video" && (
        <div className="mb-3">
          <label className="block text-sm mb-1">Select Background Video</label>
          <button
            className="border border-gray-300 rounded w-full p-2 bg-gray-50 hover:bg-gray-100"
            onClick={() => setShowVideoDialog(true)}
          >
            Choose Video
          </button>
        </div>
      )
      }

      {/* Video selection dialog */}
      {showVideoDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Select Background Video</h3>
            <div className="grid grid-cols-1 gap-4">
              {movingVideos.map((vid) => (
                <button
                  key={vid.id}
                  className="border border-gray-300 rounded overflow-hidden hover:shadow flex items-center space-x-4 p-2"
                  onClick={() => {
                    onChange({ ...settings, background: { ...background, videoSrc: vid.src } });
                    setShowVideoDialog(false);
                  }}
                >
                  <video
                    src={vid.src}
                    muted
                    autoPlay={false}
                    loop
                    className="w-32 h-20 object-cover rounded"
                  />
                  <span>{vid.label}</span>
                </button>
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => setShowVideoDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className="block text-sm mb-1 flex items-center gap-1" htmlFor="exercise-select">Exercise
          <InfoTooltip text="Select which type of eye movement exercise to perform." />
        </label>
        <select
          id="exercise-select"
          className="border border-gray-300 rounded w-full p-1"
          value={exercise}
          onChange={(e) => onChange({ ...settings, exercise: e.target.value as ExerciseType })}
        >
          <option value="smoothPursuit">Smooth Pursuit</option>
          <option value="saccades">Saccades</option>
          <option value="vorVms">VOR/VMS</option>
        </select>
      </div>

      {
        exercise === "smoothPursuit" && (
          <div className="mb-3">
            <label className="block text-sm mb-1 flex items-center gap-1">Ball Color
              <InfoTooltip text="Choose the color of the moving ball in Smooth Pursuit." />
            </label>
            <input
              type="color"
              value={smoothPursuit.color}
              onChange={(e) => onChange({
                ...settings,
                smoothPursuit: { ...smoothPursuit, color: e.target.value },
              })}
              className="w-full h-10 p-0 border border-gray-300 rounded"
            />
          </div>
        )
      }

      {
        exercise === "smoothPursuit" && (
          <div className="mb-3">
            <label className="block text-sm mb-1 flex items-center gap-1">Speed
              <InfoTooltip text="Adjust the speed of the moving ball in Smooth Pursuit." />
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={settings[exercise].speed}
              onChange={(e) => onChange({
                ...settings,
                [exercise]: {
                  ...settings[exercise],
                  speed: parseFloat(e.target.value),
                },
              })}
              className="w-full"
            />
          </div>
        )
      }

      {
        exercise === "vorVms" && (
          <>
            <div className="mb-3">
              <label className="block text-sm mb-1 flex items-center gap-1">Speed
                <InfoTooltip text="Set the beats per minute (BPM) for the VOR/VMS exercise." />
              </label>
              <input
                type="range"
                min="40"
                max="120"
                step="1"
                value={settings[exercise].bpm}
                onChange={(e) => onChange({
                  ...settings,
                  [exercise]: {
                    ...settings[exercise],
                    bpm: parseFloat(e.target.value),
                  },
                })}
                className="w-full"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1 flex items-center gap-1">Color
                <InfoTooltip text="Choose the color for the VOR/VMS exercise target." />
              </label>
              <input
                type="color"
                value={vorVms.color}
                onChange={(e) => onChange({
                  ...settings,
                  vorVms: { ...vorVms, color: e.target.value },
                })}
                className="w-full h-10 p-0 border border-gray-300 rounded"
              />
            </div>
          </>
        )
      }

      {
        exercise === "saccades" && (
          <>
            <div className="mb-3">
              <label className="block text-sm mb-1 flex items-center gap-1">Mode
                <InfoTooltip text="Choose how the saccade points behave: stationary, random, or multiple." />
              </label>
              <select
                value={saccades.mode}
                onChange={(e) => onChange({
                  ...settings,
                  saccades: { ...saccades, mode: e.target.value as "stationary" | "random" | "multi" }
                })}
                className="border border-gray-300 rounded w-full p-1"
              >
                <option value="stationary">2 Points Stationary</option>
                <option value="random">2 Points Random</option>
                <option value="multi">Multiple Points</option>
              </select>
            </div>

            {saccades.mode === "stationary" && (
              <div className="mb-3">
                <label className="block text-sm mb-1 flex items-center gap-1">Distance
                  <InfoTooltip text="Adjusts how far apart the two stationary points are." />
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={saccades.distance}
                  onChange={(e) => onChange({
                    ...settings,
                    saccades: { ...saccades, distance: parseFloat(e.target.value) }
                  })}
                  className="w-full"
                />
              </div>
            )}

            {(saccades.mode === "stationary" || saccades.mode === "random") && (
              <div className="mb-3">
                <label className="block text-sm mb-1 flex items-center gap-1">Point Colors
                  <InfoTooltip text="Change the colors of the saccade points." />
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={saccades.colors[0] || "#000000"}
                    onChange={(e) => onChange({
                      ...settings,
                      saccades: { ...saccades, colors: [e.target.value, saccades.colors[1] || "#000000"] }
                    })}
                    className="h-10 w-10 border border-gray-300 rounded"
                  />
                  <input
                    type="color"
                    value={saccades.colors[1] || "#000000"}
                    onChange={(e) => onChange({
                      ...settings,
                      saccades: { ...saccades, colors: [saccades.colors[0] || "#000000", e.target.value] }
                    })}
                    className="h-10 w-10 border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}

            {(saccades.mode === "random" || saccades.mode === "multi") && (
              <div className="mb-3">
                <label className="block text-sm mb-1 flex items-center gap-1">Speed
                  <InfoTooltip text="Adjusts the speed of the saccade points." />
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.05"
                  value={saccades.speed}
                  onChange={(e) => onChange({
                    ...settings,
                    saccades: { ...saccades, speed: parseFloat(e.target.value) }
                  })}
                  className="w-full"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="block text-sm mb-1 flex items-center gap-1">Point Size
                <InfoTooltip text="Set the diameter of the saccade points in pixels." />
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const newSize = Math.max(5, saccades.pointSize - 1);
                    onChange({
                      ...settings,
                      saccades: { ...saccades, pointSize: newSize },
                    });
                  }}
                  className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  aria-label="Decrease point size"
                >
                  –
                </button>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={saccades.pointSize}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 5;
                    val = Math.min(Math.max(val, 5), 100);
                    onChange({
                      ...settings,
                      saccades: { ...saccades, pointSize: val },
                    });
                  }}
                  className="border border-gray-300 rounded w-16 text-center p-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSize = Math.min(100, saccades.pointSize + 1);
                    onChange({
                      ...settings,
                      saccades: { ...saccades, pointSize: newSize },
                    });
                  }}
                  className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  aria-label="Increase point size"
                >
                  +
                </button>
              </div>
            </div>
          </>
        )
      }
    </div >
  );
};

export default FloatingSettingsPanel;

