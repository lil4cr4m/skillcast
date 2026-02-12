/**
 * SKILLCAST UI - Button Component System
 *
 * This is the core button component used throughout the SkillCast application.
 * Implements the neo-brutalist design language with consistent styling.
 *
 * DESIGN FEATURES:
 * - Heavy borders and bold shadows for visual impact
 * - Multiple color variants for different use cases
 * - Active press animations (button "pushes" down)
 * - Consistent typography and spacing
 * - Flexible content support (text, icons, combinations)
 *
 * VARIANTS:
 * - yellow: Default warning/attention actions
 * - violet: Primary brand actions (login, main CTAs)
 * - pink: Destructive/dangerous actions (delete, etc.)
 * - cyan: Secondary actions (cancel, back)
 * - neon: High-priority actions (create content, start cast)
 * - outline: Subtle actions (secondary options)
 *
 * USAGE:
 * ```jsx
 * <Button variant="violet" onClick={handleSubmit}>
 *   <Check size={16} /> Save Changes
 * </Button>
 * ```
 *
 * CUSTOMIZATION:
 * - Use className prop to extend default styles
 * - All HTML button props are supported (...props)
 * - Icons from Lucide React work well as children
 *
 * ACCESSIBILITY:
 * - Semantic HTML button element
 * - Keyboard navigation support
 * - Focus states included in Tailwind defaults
 * - Color contrast meets WCAG requirements
 */

// STYLING UTILITY
// Tailwind-merge for intelligent class merging and overrides
import { twMerge } from "tailwind-merge";

/**
 * Button Component - Neo-brutalist UI Element
 *
 * Props:
 * @param {React.ReactNode} children - Button content (text, icons, etc.)
 * @param {string} variant - Color/style variant (yellow, violet, pink, cyan, neon, outline)
 * @param {string} className - Additional CSS classes to merge
 * @param {object} props - All other HTML button props (onClick, disabled, type, etc.)
 */
export const Button = ({
  children,
  variant = "yellow", // Default to yellow variant
  className,
  ...props
}) => {
  // 🎨 COLOR VARIANT DEFINITIONS
  // Each variant has specific background, text, and hover colors
  // Colors are defined in tailwind.config.js as custom theme colors
  const variants = {
    // ⚠️ YELLOW - Default, attention-getting, warnings
    yellow: "bg-yellow text-ink hover:opacity-90",

    // 💜 VIOLET - Primary brand color, main CTAs
    violet: "bg-violet text-white hover:opacity-90",

    // 💗 PINK - Destructive actions, errors
    pink: "bg-pink text-white hover:opacity-90",

    // 🩵 CYAN - Secondary actions, alternatives
    cyan: "bg-cyan text-ink hover:opacity-90",

    // 🔴 DANGER - Destructive actions, delete, logout
    danger: "bg-danger text-white hover:opacity-90",

    // 🟢 NEON - High priority actions, create content
    // Named "neon" for the vibrant, attention-getting quality
    neon: "bg-neon text-ink hover:opacity-90",

    // ⚪ OUTLINE - Subtle, secondary options
    outline: "bg-offwhite text-ink hover:bg-violet-muted/20",
  };

  return (
    <button
      className={twMerge(
        // 🏗️ BASE BUTTON STRUCTURE
        // Heavy border, generous padding, rounded corners
        "border-[0.1875rem] border-ink px-[1.5rem] py-[0.75rem] font-black rounded-[0.75rem] transition-all",

        // 🎭 BRUTALIST SHADOW & INTERACTION
        // Raised shadow effect that flattens on hover, then fully presses on active
        "shadow-brutal hover:shadow-none active:translate-x-[0.125rem] active:translate-y-[0.125rem] active:shadow-none",

        // ✍️ TYPOGRAPHY & LAYOUT
        // Bold, uppercase text with tight tracking, flexbox for icons
        "text-[1rem] uppercase tracking-tight flex items-center justify-center gap-[0.5rem]",

        // 🎨 APPLY SELECTED VARIANT
        variants[variant],

        // 🛠️ MERGE CUSTOM CLASSES
        // User-provided className takes precedence
        className,
      )}
      {...props} // Spread all other props (onClick, disabled, etc.)
    >
      {children}
    </button>
  );
};

export default Button;
