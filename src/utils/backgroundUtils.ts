import type { BackgroundSettings } from "../types";

export const applyBackgroundStyle = (background: BackgroundSettings): React.CSSProperties => {
  switch (background.type) {
    case "color":
      return {
        backgroundColor: background.color,
      };
    case "image":
      return {
        backgroundImage: `url(${background.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    case "video":
      return {
        backgroundImage: `url(${background.motion})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        animation: "backgroundMove 30s linear infinite",
      };
    default:
      return {};
  }
};