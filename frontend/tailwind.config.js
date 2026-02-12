/**
 * SKILLCAST DESIGN SYSTEM - Tailwind CSS Configuration
 *
 * This file defines the complete design system for SkillCast, implementing
 * a neo-brutalism aesthetic with consistent colors, spacing, and typography.
 *
 * DESIGN PHILOSOPHY:
 * - Neo-brutalism: Bold, chunky, high-contrast design
 * - Consistent spacing based on 8pt grid system
 * - Limited color palette for brand consistency
 * - Heavy shadows and borders for visual impact
 * - Typography scale that works across devices
 *
 * KEY DESIGN TOKENS:
 * 1. COLORS - Carefully chosen palette for different UI states
 * 2. SHADOWS - "Brutal" shadow system for depth and interaction
 * 3. SPACING - 8pt grid system for consistent layouts
 * 4. TYPOGRAPHY - Responsive type scales for mobile and desktop
 * 5. BORDERS - Custom 3px border width for neo-brutal aesthetic
 *
 * EXTENDING THE DESIGN SYSTEM:
 * - Add new colors by extending the colors object
 * - Create new shadow variants in boxShadow section
 * - Define new spacing values following 8pt grid
 * - Add typography styles using fontSize configuration
 *
 * USAGE IN COMPONENTS:
 * ```jsx
 * <div className="bg-violet text-offwhite shadow-brutal border-3 border-ink">
 * ```
 *
 * RESPONSIVE DESIGN:
 * - Mobile-first approach with desktop overrides
 * - Separate typography scales for mobile (h1-m) and desktop (h1-d)
 * - Consistent spacing across all breakpoints
 */

/** @type {import('tailwindcss').Config} */
export default {
  // 📝 CONTENT PATHS - Where Tailwind should look for class usage
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      // 🎨 COLOR PALETTE - Neo-brutalism Color System
      // Each color serves specific UI purposes and emotional responses
      colors: {
        // ⚪ BASE COLORS
        offwhite: "#F8F8F8", // Main background - soft, not harsh white
        ink: "#000000", // Primary text and borders - pure black for contrast

        // 🟡 ACCENT COLORS - Each color has semantic meaning
        yellow: "#FFD100", // Credit/rewards - optimistic, valuable
        violet: "#A358FF", // Primary brand - creative, energetic
        green: "#00FF85", // Success/live status - vibrant, active
        pink: "#FF3BFF", // Alerts/warnings - attention-getting
        cyan: "#00E0FF", // Secondary actions - cool, supporting
      },

      // 🏗️ SHADOW SYSTEM - "Brutal" depth system
      // Creates the characteristic neo-brutalist depth effect
      boxShadow: {
        // Standard shadow sizes with black offset shadows
        "brutal-sm": "4px 4px 0px 0px rgba(0,0,0,1)", // Small elements
        brutal: "8px 8px 0px 0px rgba(0,0,0,1)", // Default cards/buttons
        "brutal-lg": "12px 12px 0px 0px rgba(0,0,0,1)", // Large modals/panels
      },

      // 📏 SPACING SYSTEM - 8pt Grid for Consistency
      // All spacing values follow 8pt increments for visual harmony
      spacing: {
        0.5: "0.125rem", // 2px  - micro adjustments
        1: "0.25rem", // 4px  - tiny spacing
        2: "0.5rem", // 8px  - small spacing (base unit)
        3: "0.75rem", // 12px - medium-small spacing
        4: "1rem", // 16px - standard spacing
        6: "1.5rem", // 24px - medium spacing
        8: "2rem", // 32px - large spacing
        10: "2.5rem", // 40px - extra large spacing
        12: "3rem", // 48px - section spacing
        16: "4rem", // 64px - major section spacing
      },

      // ✍️ TYPOGRAPHY SYSTEM - Responsive Type Scale
      // Separate scales for mobile and desktop for optimal readability
      fontSize: {
        // 📱 STANDARD TEXT SIZES
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px - micro text
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px - small text
        base: ["1rem", { lineHeight: "1.6" }], // 16px - body text
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px - large text
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px - emphasis
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px - subheadings

        // 🖥️ DESKTOP HEADINGS - Larger, more impactful
        "h1-d": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.04em" }], // 64px
        "h2-d": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }], // 40px

        // 📱 MOBILE HEADINGS - Scaled down for smaller screens
        "h1-m": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.04em" }], // 40px
        "h2-m": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }], // 28px
      },

      // 🔲 BORDER SYSTEM - Neo-brutalist Border Width
      borderWidth: {
        3: "0.1875rem", // 3px - signature neo-brutal border thickness
      },

      // 📏 LAYOUT CONSTRAINTS
      maxWidth: {
        layout: "87.5rem", // 1400px - maximum content width for readability
      },
    },
  },
};
