import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    // Pre-existing code (incl. generated shadcn/ui and R3F refs) trips these
    // stricter rules; keep them visible as warnings until cleaned up.
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
    },
  },
  { ignores: [".next/**", "src/generated/**", "next-env.d.ts"] },
];

export default eslintConfig;
