// A "plugin" adds a field to Settings from the outside. Every importer of
// ./settings.js now sees `darkMode` as part of the interface.
import { defaults } from "./settings.js";

declare module "./settings.js" {
  interface Settings {
    darkMode: boolean;
  }
}

defaults.darkMode = false;
