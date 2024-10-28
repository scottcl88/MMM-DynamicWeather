import eslintPluginJs from "@eslint/js";
import eslintPluginTs from "typescript-eslint";

const config = [
  eslintPluginJs.configs.recommended,
  ...eslintPluginTs.configs.strict,
  ...eslintPluginTs.configs.stylistic,
  {
    ignores: ["MMM-DynamicWeather.js", "node_helper.js"],
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/prefer-for-of": "off",
    },
  },
];

export default config;
