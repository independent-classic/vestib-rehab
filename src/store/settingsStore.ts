import { create } from "zustand";
import type { AppSettings } from "../types";

interface SettingsStore {
  settings: AppSettings;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  exercise: "smoothPursuit",
  background: {
    type: "color",
    color: "#000000",
    image: "/assets/static-bg/bg1.png",
    videoSrc: "/assets/moving-bg/bg1.mp4",
  },
  saccades: {
    mode: "stationary",
    speed: 2,
    distance: 50,
    numberOfPoints: 2,
    colors: ["#FF0000", "#00FF00", "#0000FF"],
    pointSize: 20,
  },
  smoothPursuit: {
    speed: 10,
    color: "#FF0000",
  },
  vorVms: {
    bpm: 60,
    color: "#FFFFFF",
  },
};

const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  isSettingsOpen: false,

  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    })),
}));

export default useSettingsStore;