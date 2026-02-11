import { twMerge } from "tailwind-merge";

export const Button = ({
  children,
  variant = "yellow",
  className,
  ...props
}) => {
  const variants = {
    yellow: "bg-yellow text-ink hover:bg-[#e6bd00]",
    violet: "bg-violet text-white hover:bg-[#8f47ff]",
    pink: "bg-pink text-white hover:bg-[#e632e6]",
    cyan: "bg-cyan text-ink hover:bg-[#00c9e6]",
    outline: "bg-white text-ink hover:bg-slate-50",
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
