/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: "#FFFFFF",
        ink: "#000000",
        yellow: "#FFD100", // Cyber Yellow
        violet: "#A358FF", // Electric Violet
        green: "#00FF85", // Neon Green
        pink: "#FF3BFF", // Hot Pink
        cyan: "#00E0FF", // Cyan Blue
      },
      boxShadow: {
        brutal: "5px 5px 0px 0px #000000",
        "brutal-lg": "8px 8px 0px 0px #000000",
        "brutal-sm": "3px 3px 0px 0px #000000",
      },
      // 8pt grid expressed in rem (1rem = 16px)
      spacing: {
        0.5: "0.125rem", // 2px
        1: "0.25rem", // 4px
        2: "0.5rem", // 8px
        3: "0.75rem", // 12px
        4: "1rem", // 16px
        6: "1.5rem", // 24px
        8: "2rem", // 32px
        10: "2.5rem", // 40px
        12: "3rem", // 48px
        16: "4rem", // 64px
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        // Desktop scale
        "h1-d": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.04em" }],
        "h2-d": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        // Mobile scale
        "h1-m": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.04em" }],
        "h2-m": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      borderWidth: { 3: "0.1875rem" },
      maxWidth: {
        layout: "87.5rem", // 1400px in rem
      },
    },
  },
};
