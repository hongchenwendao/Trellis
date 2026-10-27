import { copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const name of ["README.md", "LICENSE", "COPYRIGHT", "NOTICE"]) {
  copyFileSync(resolve(root, name), resolve(process.cwd(), name));
}
