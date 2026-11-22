import { mount } from "#shared/dom.js";
import { App } from "./App.js";

const root = document.getElementById("app");
if (root) mount(App, root);
