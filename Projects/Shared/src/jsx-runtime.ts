// A tiny JSX runtime built on the real DOM (no React, no virtual DOM).
// TypeScript compiles <div className="x">hi</div> into jsx("div", { className: "x", children: "hi" }).
// Elements become real DOM nodes. Function components are called with their props.
// Hooks (useState, useEffect) live in ./hooks.ts and work inside mount().

import { renderComponent } from "./hooks.js";

export type Child = Node | string | number | boolean | null | undefined | Child[];
export type Component<P = {}> = (props: P) => Node;

type EventHandler<E extends Event = Event> = (event: E) => void;

export type HtmlProps = {
  children?: Child;
  id?: string;
  className?: string;
  style?: string | Partial<Record<keyof CSSStyleDeclaration & string, string>>;
  ref?: (element: HTMLElement) => void;
  onClick?: EventHandler<MouseEvent>;
  onInput?: EventHandler<InputEvent>;
  onChange?: EventHandler;
  onSubmit?: EventHandler<SubmitEvent>;
  onKeyDown?: EventHandler<KeyboardEvent>;
  onError?: EventHandler;
  onLoad?: EventHandler;
  [attribute: string]: unknown;
};

export const Fragment = Symbol("Fragment");

type ElementType = string | typeof Fragment | Component<any>;

export function jsx(type: ElementType, props: Record<string, unknown>, key?: string | number): Node {
  if (type === Fragment) return toFragment(props["children"] as Child);
  if (typeof type === "function") return renderComponent(type, props, key);

  const element = document.createElement(type);
  // Children first, so a <select value> can find its <option>s.
  element.append(toFragment(props["children"] as Child));
  for (const [name, value] of Object.entries(props)) {
    if (name !== "children") setProperty(element, name, value);
  }
  return element;
}

export { jsx as jsxs, jsx as jsxDEV };

function toFragment(child: Child): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const add = (item: Child): void => {
    if (item == null || typeof item === "boolean") return;
    if (Array.isArray(item)) item.forEach(add);
    else if (item instanceof Node) fragment.append(item);
    else fragment.append(String(item));
  };
  add(child);
  return fragment;
}

function setProperty(element: HTMLElement, name: string, value: unknown): void {
  if (value == null || value === false) return;
  if (name === "ref" && typeof value === "function") {
    queueMicrotask(() => value(element));
  } else if (name.startsWith("on") && typeof value === "function") {
    element.addEventListener(name.slice(2).toLowerCase(), value as EventListener);
  } else if (name === "className") {
    element.setAttribute("class", String(value));
  } else if (name === "style" && typeof value === "object") {
    Object.assign(element.style, value);
  } else if (name === "value" || name === "checked" || name === "selected") {
    // Properties (not attributes) reflect the live state of form controls.
    Object.assign(element, { [name]: value });
  } else if (name === "htmlFor") {
    element.setAttribute("for", String(value));
  } else {
    element.setAttribute(name, value === true ? "" : String(value));
  }
}

// Type information TypeScript uses to check JSX.
export namespace JSX {
  export type Element = Node;
  export interface ElementChildrenAttribute {
    children: {};
  }
  export interface IntrinsicAttributes {
    key?: string | number;
  }
  export type IntrinsicElements = {
    [Tag in keyof HTMLElementTagNameMap]: HtmlProps;
  };
}
