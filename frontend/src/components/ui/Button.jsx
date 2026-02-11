import { twMerge } from "tailwind-merge";

export const Button = ({
  children,
  variant = "yellow",
  className,
  ...props
}) => {
  const variants = {
    yellow: "bg-yellow text-ink hover:bg-yellow/90",
    violet: "bg-violet text-white hover:bg-violet/90",
    pink: "bg-pink text-white hover:bg-pink/90",
    cyan: "bg-cyan text-ink hover:bg-cyan/90",
    // Primary SkillCast action: Start Cast
    neon: "bg-green text-ink hover:bg-green/90",
    outline: "bg-white text-ink hover:bg-yellow/10",
  };

  return (
    <button
      className={twMerge(
        "border-[0.1875rem] border-ink px-[1.5rem] py-[0.75rem] font-black rounded-[0.75rem] transition-all",
        "shadow-brutal active:translate-x-[0.1875rem] active:translate-y-[0.1875rem] active:shadow-none",
        "text-[1rem] uppercase tracking-tight flex items-center justify-center gap-[0.5rem]",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
