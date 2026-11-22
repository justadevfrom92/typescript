// Composition root: the only file that knows which concrete implementations are used.
import { mount } from "#shared/dom.js";
import { createDirectory } from "./services/directory.js";
import { HttpUserRepository } from "./services/HttpUserRepository.js";
import { InMemoryUserRepository } from "./services/InMemoryUserRepository.js";
import { App } from "./ui/App.js";

const repositories = [new HttpUserRepository(), new InMemoryUserRepository(undefined, undefined, 300)];
const directory = createDirectory(repositories[0]!);

const root = document.getElementById("app");
if (root) mount(() => <App directory={directory} repositories={repositories} />, root);
