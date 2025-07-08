import React from "react";
import ReactDOM from "react-dom";

interface AssetPickerModalProps {
  assets: string[];
  onSelect: (src: string) => void;
  onClose: () => void;
  title: string;
}

const AssetPickerModal: React.FC<AssetPickerModalProps> = ({ assets, onSelect, onClose, title }) => {
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(assets.map(src => [src, true]))
  );

  React.useEffect(() => {
    // Reset loading state if assets change
    setLoadingStates(Object.fromEntries(assets.map(src => [src, true])));
  }, [assets]);

  const handleLoaded = (src: string) => {
    setLoadingStates(prev => ({ ...prev, [src]: false }));
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen w-full">
      {/* Gray overlay to dim the background */}
      <div className="absolute inset-0 bg-gray-700 bg-opacity-40" />
      <div className="bg-white p-4 rounded w-96 relative shadow-2xl ring-2 ring-black/10 z-10" style={{ boxShadow: '0 8px 48px 0 rgba(0,0,0,0.32), 0 1.5px 6px 0 rgba(0,0,0,0.12)' }}>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="Close asset picker"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {assets.map((src) => (
            <button
              key={src}
              className="border rounded p-2 hover:bg-blue-100 flex items-center justify-center min-h-24"
              onClick={() => onSelect(src)}
              style={{ minHeight: 96 }}
            >
              <>
                {src.match(/\.(mp4|webm)$/) ? (
                  <video
                    src={src}
                    className="w-full h-24 object-cover rounded"
                    autoPlay
                    loop
                    muted
                    onLoadedData={() => handleLoaded(src)}
                    style={{ background: '#eee', display: loadingStates[src] ? 'none' : 'block' }}
                  />
                ) : (
                  <img
                    src={src}
                    className="w-full h-24 object-cover rounded"
                    alt="background asset"
                    onLoad={() => handleLoaded(src)}
                    style={{ background: '#eee', display: loadingStates[src] ? 'none' : 'block' }}
                  />
                )}
                {loadingStates[src] && (
                  <span className="w-full h-24 flex items-center justify-center text-gray-400">Loading...</span>
                )}
              </>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AssetPickerModal;
