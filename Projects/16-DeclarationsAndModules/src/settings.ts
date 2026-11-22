// A module whose interface other modules can extend (module augmentation).
export interface Settings {
  language: string;
}

export const defaults: Partial<Settings> = { language: "en" };

export function readSetting<K extends keyof Settings>(settings: Settings, key: K): Settings[K] {
  return settings[key];
}
