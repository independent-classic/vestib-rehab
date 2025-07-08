import React, { useState } from "react";

interface BackgroundSettingsProps {
  backgroundType: "color" | "scenery" | "animated";
  backgroundValue: string;
  onChange: (type: "backgroundType" | "backgroundValue", value: string) => void;
}

const placeholderImages = ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"];
const placeholderVideos = ["/animated1.mp4", "/animated2.mp4"];

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  backgroundType,
  backgroundValue,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <label className="block mb-2 font-medium">Background Type</label>
      <select
        className="w-full border p-2 rounded mb-4"
        value={backgroundType}
        onChange={(e) => onChange("backgroundType", e.target.value)}
      >
        <option value="color">Solid Color</option>
        <option value="scenery">Image</option>
        <option value="animated">Moving Background</option>
      </select>

      {backgroundType === "color" && (
        <div>
          <label className="block mb-2 font-medium">Background Color</label>
          <input
            type="color"
            className="w-full h-10"
            value={backgroundValue}
            onChange={(e) => onChange("backgroundValue", e.target.value)}
          />
        </div>
      )}

      {(backgroundType === "scenery" || backgroundType === "animated") && (
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowPicker(true)}
          >
            Choose {backgroundType === "scenery" ? "Image" : "Animation"}
          </button>

          {showPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded max-h-[80vh] overflow-y-auto w-96 relative">
                <h3 className="text-lg font-bold mb-4">Select {backgroundType === "scenery" ? "Image" : "Animation"}</h3>

                <div className="grid grid-cols-2 gap-4">
                  {(backgroundType === "scenery" ? placeholderImages : placeholderVideos).map((src) => (
                    <div
                      key={src}
                      className="border rounded overflow-hidden cursor-pointer hover:shadow-lg"
                      onClick={() => {
                        onChange("backgroundValue", src);
                        setShowPicker(false);
                      }}
                    >
                      {backgroundType === "scenery" ? (
                        <img src={src} alt="Background option" className="w-full h-24 object-cover" />
                      ) : (
                        <video src={src} className="w-full h-24 object-cover" muted loop autoPlay />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => setShowPicker(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundSettings;

