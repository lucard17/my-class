import eslint from "@eslint/js";
// import node from "eslint-plugin-node";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default [
    eslint.configs.recommended,
    {
        files: ["src/**/*.{ts,js}", "src/**/*.d.{ts,js}", "src/**/*.dto.{ts,js}"],
        languageOptions: {
            parser: tsParser,
            sourceType: "module",
            globals: {
                ...globals.node,
                structuredClone: "readonly",
                process: "readonly",
            },
        },
        plugins: {
            "unused-imports": unusedImports,
            "@typescript-eslint": tsEslint,
        },

        rules: {
            ...tsEslint.configs.recommended.rules,
            "no-async-promise-executor": "off",
            "no-console": "error",
            "no-undef": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "no-unused-private-class-members": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-wrapper-object-types": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "no-redeclare": "off",
            "no-useless-escape": "off",
        },
    },
    { ignores: ["node_modules", "dist"] },
];
