import { useEffect, useRef, useState } from "react";

import InfoTooltip from "./InfoTooltip";
import AssetPickerModal from "./AssetPickerModal";
import { staticImages, movingVideos } from "./backgroundAssets";
import type { AppSettings } from "../../types";

interface MobileSettingsDrawerProps {
  onClose: () => void;
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
}

const MobileSettingsDrawer = ({ onClose, settings, onChange }: MobileSettingsDrawerProps) => {
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);
  const { exercise, background, saccades, smoothPursuit, vorVms } = settings;
  const drawerRef = useRef<HTMLDivElement>(null);
  // Track touch for speed or distance sliders
  const [isSliderTouchActive, setIsSliderTouchActive] = useState(false);
  const [visible, setVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  // Animate out on close
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };


  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      style={{ background: "transparent" }}
    >
      <div
        ref={drawerRef}
        className={
          `absolute bottom-0 left-0 w-full max-h-[80vh] bg-white p-4 overflow-y-auto rounded-t-xl shadow-lg pointer-events-auto`
        }
        style={{
          transition: 'transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s',
          transform: visible ? 'translateY(0%)' : 'translateY(100%)',
          opacity: isSliderTouchActive ? 0.65 : 1,
          willChange: 'transform, opacity',
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          aria-label="Close settings"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        {/* Background Type */}
        <div className="mb-4">
          <label className="block text-sm mb-1 flex items-center gap-1">Background Type
            <InfoTooltip text="Choose the type of background for the exercise (color, image, or video)." />
          </label>
          <select
            value={background.type}
            onChange={e => onChange({ ...settings, background: { ...background, type: e.target.value as any } })}
            className="border border-gray-300 rounded w-full p-2"
          >
            <option value="color">Color</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Background Color */}
        {background.type === "color" && (
          <div className="mb-4">
            <label className="block text-sm mb-1 flex items-center gap-1">Background Color
              <InfoTooltip text="Select the solid color used as the exercise background." />
            </label>
            <input
              type="color"
              value={background.color}
              onChange={e => onChange({ ...settings, background: { ...background, color: e.target.value } })}
              className="w-full h-12 border border-gray-300 rounded"
            />
          </div>
        )}

        {/* Background Image Picker */}
        {background.type === "image" && (
          <div className="mb-4">
            <label className="block text-sm mb-1 flex items-center gap-1">Background Image
              <InfoTooltip text="Choose a background image for the exercise." />
            </label>
            <div className="flex items-center gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded"
                onClick={() => setShowImagePicker(true)}
                type="button"
              >
                Choose Image
              </button>
              {background.image && (
                <img src={background.image} className="w-16 h-10 object-cover rounded border ml-2" alt="Selected background" />
              )}
            </div>
          </div>
        )}

        {/* Background Video Picker */}
        {background.type === "video" && (
          <div className="mb-4">
            <label className="block text-sm mb-1 flex items-center gap-1">Background Video
              <InfoTooltip text="Choose a background video for the exercise." />
            </label>
            <div className="flex items-center gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded"
                onClick={() => setShowVideoPicker(true)}
                type="button"
              >
                Choose Video
              </button>
              {background.videoSrc && (
                <video src={background.videoSrc} className="w-16 h-10 object-cover rounded border ml-2" autoPlay loop muted />
              )}
            </div>
          </div>
        )}

        {/* Asset Picker Modals */}
        {showImagePicker && (
          <AssetPickerModal
            assets={staticImages.map(img => img.src)}
            onSelect={(src: string) => {
              onChange({ ...settings, background: { ...background, image: src } });
              setShowImagePicker(false);
            }}
            onClose={() => setShowImagePicker(false)}
            title="Select Background Image"
          />
        )}
        {showVideoPicker && (
          <AssetPickerModal
            assets={movingVideos.map(vid => vid.src)}
            onSelect={(src: string) => {
              onChange({ ...settings, background: { ...background, videoSrc: src } });
              setShowVideoPicker(false);
            }}
            onClose={() => setShowVideoPicker(false)}
            title="Select Background Video"
          />
        )}

        {/* Exercise */}
        <div className="mb-4">
          <label className="block text-sm mb-1 flex items-center gap-1">Exercise
            <InfoTooltip text="Select which type of eye movement exercise to perform." />
          </label>
          <select
            value={exercise}
            onChange={e => onChange({ ...settings, exercise: e.target.value as any })}
            className="border border-gray-300 rounded w-full p-2"
          >
            <option value="smoothPursuit">Smooth Pursuit</option>
            <option value="saccades">Saccades</option>
            <option value="vorVms">VOR/VMS</option>
          </select>
        </div>

        {/* Smooth Pursuit Settings */}
        {exercise === "smoothPursuit" && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1 flex items-center gap-1">Ball Color
                <InfoTooltip text="Choose the color of the moving ball in Smooth Pursuit." />
              </label>
              <input
                type="color"
                value={smoothPursuit.color}
                onChange={e => onChange({ ...settings, smoothPursuit: { ...smoothPursuit, color: e.target.value } })}
                className="w-full h-12 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 flex items-center gap-1">Speed
                <InfoTooltip text="Adjust the speed of the moving ball in Smooth Pursuit." />
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={smoothPursuit.speed}
                onChange={e => onChange({ ...settings, smoothPursuit: { ...smoothPursuit, speed: parseFloat(e.target.value) } })}
                className="w-full"
                onTouchStart={() => setIsSliderTouchActive(true)}
                onTouchEnd={() => setIsSliderTouchActive(false)}
                onTouchCancel={() => setIsSliderTouchActive(false)}
              />
            </div>
          </>
        )}

        {/* VOR/VMS Settings */}
        {exercise === "vorVms" && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1 flex items-center gap-1">Speed
                <InfoTooltip text="Set the beats per minute (BPM) for the VOR/VMS exercise." />
              </label>
              <input
                type="range"
                min="40"
                max="120"
                step="1"
                value={vorVms.bpm}
                onChange={e => onChange({ ...settings, vorVms: { ...vorVms, bpm: parseFloat(e.target.value) } })}
                className="w-full"
                onTouchStart={() => setIsSliderTouchActive(true)}
                onTouchEnd={() => setIsSliderTouchActive(false)}
                onTouchCancel={() => setIsSliderTouchActive(false)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 flex items-center gap-1">Color
                <InfoTooltip text="Choose the color for the VOR/VMS exercise target." />
              </label>
              <input
                type="color"
                value={vorVms.color}
                onChange={e => onChange({ ...settings, vorVms: { ...vorVms, color: e.target.value } })}
                className="w-full h-12 border border-gray-300 rounded"
              />
            </div>
          </>
        )}

        {/* Saccades Settings */}
        {exercise === "saccades" && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1 flex items-center gap-1">Mode
                <InfoTooltip text="Choose how the saccade points behave: stationary, random, or multiple." />
              </label>
              <select
                value={saccades.mode}
                onChange={e => onChange({ ...settings, saccades: { ...saccades, mode: e.target.value as any } })}
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="stationary">2 Points Stationary</option>
                <option value="random">2 Points Random</option>
                <option value="multi">Multiple Points</option>
              </select>
            </div>
            {saccades.mode === "stationary" && (
              <div className="mb-4">
                <label className="block text-sm mb-1 flex items-center gap-1">Distance
                  <InfoTooltip text="Adjusts how far apart the two stationary points are." />
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={saccades.distance}
                  onChange={e => onChange({ ...settings, saccades: { ...saccades, distance: parseFloat(e.target.value) } })}
                  className="w-full"
                  onTouchStart={() => setIsSliderTouchActive(true)}
                  onTouchEnd={() => setIsSliderTouchActive(false)}
                  onTouchCancel={() => setIsSliderTouchActive(false)}
                />
              </div>
            )}
            {(saccades.mode === "stationary" || saccades.mode === "random") && (
              <div className="mb-4">
                <label className="block text-sm mb-1 flex items-center gap-1">Point Colors
                  <InfoTooltip text="Change the colors of the saccade points." />
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={saccades.colors[0] || "#000000"}
                    onChange={e => onChange({ ...settings, saccades: { ...saccades, colors: [e.target.value, saccades.colors[1] || "#000000"] } })}
                    className="h-12 w-12 border border-gray-300 rounded"
                  />
                  <input
                    type="color"
                    value={saccades.colors[1] || "#000000"}
                    onChange={e => onChange({ ...settings, saccades: { ...saccades, colors: [saccades.colors[0] || "#000000", e.target.value] } })}
                    className="h-12 w-12 border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
            {(saccades.mode === "random" || saccades.mode === "multi") && (
              <div className="mb-4">
                <label className="block text-sm mb-1 flex items-center gap-1">Speed
                  <InfoTooltip text="Adjusts the speed of the saccade points." />
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.05"
                  value={saccades.speed}
                  onChange={e => onChange({ ...settings, saccades: { ...saccades, speed: parseFloat(e.target.value) } })}
                  className="w-full"
                  onTouchStart={() => setIsSliderTouchActive(true)}
                  onTouchEnd={() => setIsSliderTouchActive(false)}
                  onTouchCancel={() => setIsSliderTouchActive(false)}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm mb-1 flex items-center gap-1">Point Size
                <InfoTooltip text="Set the diameter of the saccade points in pixels." />
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const newSize = Math.max(5, saccades.pointSize - 1);
                    onChange({ ...settings, saccades: { ...saccades, pointSize: newSize } });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  aria-label="Decrease point size"
                >
                  –
                </button>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={saccades.pointSize}
                  onChange={e => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 5;
                    val = Math.min(Math.max(val, 5), 100);
                    onChange({ ...settings, saccades: { ...saccades, pointSize: val } });
                  }}
                  className="border border-gray-300 rounded w-20 text-center p-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSize = Math.min(100, saccades.pointSize + 1);
                    onChange({ ...settings, saccades: { ...saccades, pointSize: newSize } });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  aria-label="Increase point size"
                >
                  +
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default MobileSettingsDrawer;