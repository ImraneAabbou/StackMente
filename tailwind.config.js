import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
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
            blue: {
                ...colors.blue,
                DEFAULT: "#158BEA",
            },
            green: {
                ...colors.green,
                DEFAULT: "#54BF59",
            },
            gray: {
                ...colors.gray,
                DEFAULT: "#9B9B9B",
            },
            text: {
                light: "#f4f4f4",
                dark: "#000000",
            },
            warn: "#ccc500",
            success: {
                light: "#54BF59",
                dark: "#54BF59",
            },
            error: {
                light: "#f31616",
                dark: "#ff5b5b",
            },
            input: {
                light: "#ffffff",
                dark: "#2e2e3b",
            },
            background: {
                light: "#f3f3f5",
                dark: "#21212C",
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
            }
        },
    },
    plugins: [forms],
};
