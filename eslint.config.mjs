import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Clean architecture guard: domain code must stay free of frameworks and browser APIs.
const FRAMEWORK_IMPORTS = ["react", "react/*", "react-dom", "react-dom/*", "next", "next/*"];
const OUTER_LAYER_IMPORTS = ["**/application/**", "**/adapters/**", "**/ui/**", "@/app/**"];
const BROWSER_GLOBALS = ["window", "document", "localStorage", "sessionStorage", "navigator", "fetch"];

const domainLayerRules = {
  files: ["src/features/*/domain/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: FRAMEWORK_IMPORTS,
            message: "Domain code must not depend on React or Next.js.",
          },
          {
            group: OUTER_LAYER_IMPORTS,
            message: "Domain code must not import from outer layers.",
          },
        ],
      },
    ],
    "no-restricted-globals": [
      "error",
      ...BROWSER_GLOBALS.map((name) => ({
        name,
        message: "Domain code must not use browser APIs. Use a port instead.",
      })),
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  domainLayerRules,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
