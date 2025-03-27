import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],
    darkMode: "selector",
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
            },
        },
        colors: {
            ...colors,
            primary: "#158BEA",
            onPrimary: "#ffffff",
            secondary: "#9B9B9B",
            success: {
                light: "#54BF59",
                dark: "#54BF59",
            },
            onSuccess: {
                light: "#ffffff",
                dark: "#ffffff",
            },
            error: {
                light: "#f31616",
                dark: "#ff5b5b",
            },
            onError: {
                light: "#ffffff",
                dark: "#ffffff",
            },
            surface: {
                light: "#ffffff",
                dark: "#2e2e3b",
            },
            onSurface: {
                light: "#f4f4f4",
                dark: "#000000",
            },
            background: {
                light: "#f3f3f5",
                dark: "#21212C",
            },
            onBackground: {
                light: "#f4f4f4",
                dark: "#000000",
            },
        },
        extend: {
            fontFamily: {
                ...defaultTheme.fontFamily,
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
                display: ["Inter", ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                ...defaultTheme.fontSize,
                "2xs": "0.65rem",
            },
        },
    },
    plugins: [forms, typography],
};
