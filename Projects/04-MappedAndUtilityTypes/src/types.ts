// Lesson 04: built-in utility types, mapped types, conditional types and template literal types.

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  createdAt: Date;
};

// Built-in utility types
export type NewUser = Omit<User, "id" | "createdAt">; // what a sign-up form sends
export type UserPatch = Partial<Pick<User, "name" | "email">>; // what an edit form sends
export type UserPreview = Readonly<Pick<User, "id" | "name">>;
export type UsersById = Record<number, User>;

// Custom mapped types
export type Nullable<T> = { [K in keyof T]: T[K] | null };
export type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] };

// Key remapping with template literal types: { name: string } -> { getName: () => string }
export type Getters<T> = { [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K] };

// Conditional types and `infer`
export type ElementOf<T> = T extends readonly (infer E)[] ? E : never;
export type UnwrapPromise<T> = T extends Promise<infer V> ? V : T; // the built-in Awaited<T> also unwraps nested promises
export type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

// Validation errors keyed by the same fields as the form.
export type FormErrors<T> = Partial<Record<keyof T, string>>;
