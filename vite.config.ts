import inertia from "@inertiajs/vite";
import { wayfinder } from "@laravel/vite-plugin-wayfinder";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import { bunny } from "laravel-vite-plugin/fonts";
import { execSync } from "node:child_process";
import { defineConfig, lazyPlugins } from "vite-plus";

function phpAvailable(): boolean {
    if (process.env.WAYFINDER_GENERATE_COMMAND === "false") {
        return false;
    }

    try {
        execSync("php -v", { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

export default defineConfig({
    plugins: lazyPlugins(() => [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.tsx"],
            refresh: true,
            fonts: [
                bunny("Poppins", {
                    weights: [400, 500, 600, 700],
                }),
            ],
        }),
        inertia(),
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        tailwindcss(),
        ...(phpAvailable()
            ? [wayfinder({ formVariants: true })]
            : []),
    ]),
    server: {
        host: "0.0.0.0",
        port: 5173,

        hmr: {
            host: "localhost",
        },

        watch: {
            usePolling: !phpAvailable(),
            interval: 100,
            ignored: [
                "**/.agents/**",
                "**/.claude/**",
                "**/.cursor/**",
                "**/.junie/**",
                "**/vendor/**",
            ],
        },
    },
    lint: {
        ignorePatterns: [
            "vendor/**",
            "node_modules/**",
            "public/**",
            "bootstrap/ssr/**",
            "tailwind.config.js",
            "resources/js/actions/**",
            "resources/js/components/ui/*",
            "resources/js/routes/**",
            "resources/js/wayfinder/**",
        ],
        options: {
            denyWarnings: true,
            typeAware: true,
        },
    },
    fmt: {
        printWidth: 80,
        tabWidth: 4,
        singleQuote: true,
        semi: true,
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: "css",
        ignorePatterns: [
            ".github/**",
            "composer.json",
            "resources/js/components/ui/*",
            "resources/views/mail/*",
        ],
        sortTailwindcss: {
            functions: ["clsx", "cn", "cva"],
            entryPoint: "resources/css/app.css",
        },
    },
});
