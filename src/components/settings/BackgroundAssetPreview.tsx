import React, { useState } from "react";

interface BackgroundAssetPreviewProps {
  src: string;
}

const BackgroundAssetPreview: React.FC<BackgroundAssetPreviewProps> = ({ src }) => {
  const [loading, setLoading] = useState(true);
  const isVideo = /\.(mp4|webm)$/i.test(src);

  return (
    <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded">
      {loading && <span className="text-gray-400">Loading...</span>}
      {isVideo ? (
        <video
          src={src}
          className="w-full h-24 object-cover rounded"
          autoPlay
          loop
          muted
          onLoadedData={() => setLoading(false)}
          style={{ display: loading ? 'none' : 'block' }}
        />
      ) : (
        <img
          src={src}
          className="w-full h-24 object-cover rounded"
          alt="background asset"
          onLoad={() => setLoading(false)}
          style={{ display: loading ? 'none' : 'block' }}
        />
      )}
    </div>
  );
};

export default BackgroundAssetPreview;
