import type { Config } from "tailwindcss";
// import animate from "tailwindcss-animate";
// import scrollbar from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {},
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
  // plugins: [animate, scrollbar],
} satisfies Config;

export default config;
