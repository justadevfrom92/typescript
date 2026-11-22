// Run with: npm run build && node 04-MappedAndUtilityTypes/dist/main.js
import { createGetters, hasErrors, roleLabels, validateNewUser } from "./utilities.js";

const getters = createGetters({ name: "Ada", year: 1843 });
console.log(getters.getName(), getters.getYear());

const errors = validateNewUser({ name: "A", email: "not-an-email", role: "member" });
console.log("Has errors:", hasErrors(errors), errors);
console.log(roleLabels.admin);
