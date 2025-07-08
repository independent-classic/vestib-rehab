export type ExerciseType = 'smoothPursuit' | 'saccades' | 'vorVms';

export interface BackgroundSettings {
    type: 'color' | 'image' | 'video';
    color?: string;
    image?: string;
    motion?: string;
    videoSrc: string;
}

export interface SmoothPursuitSettings {
    color: string;
    speed: number;
}

export type SaccadesMode = 'stationary' | 'random' | 'multi';

export interface SaccadesSettings {
    mode: SaccadesMode;
    speed: number;
    distance: number;
    numberOfPoints: number;
    colors: string[];
    pointSize: number; // default size if not passed
}

export interface VorVmsSettings {
    bpm: number; // in bpm
    color: string;
}

export interface AppSettings {
    exercise: ExerciseType;
    background: BackgroundSettings;
    smoothPursuit: SmoothPursuitSettings;
    saccades: SaccadesSettings;
    vorVms: VorVmsSettings;
}