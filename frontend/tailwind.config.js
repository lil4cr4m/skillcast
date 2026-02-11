/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Muted, softer versions of our brand colors
        accent: "#FDE047", // Softer Yellow
        vibe: "#8B5CF6", // Softer Purple
        fresh: "#34D399", // Softer Emerald
        canvas: "#F8FAFC", // Off-white background
      },
      boxShadow: {
        // Changed from pure black to a deep navy-slate
        "soft-brutal": "4px 4px 0px 0px rgba(15, 23, 42, 1)",
        "soft-brutal-lg": "6px 6px 0px 0px rgba(15, 23, 42, 1)",
        "soft-brutal-hover": "2px 2px 0px 0px rgba(15, 23, 42, 1)",
      },
      borderRadius: {
        xl: "1.25rem", // Softer, more organic corners
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
