import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const Button = ({ children, variant = "primary", className, ...props }) => {
  const styles = {
    // Bold borders and hard shadows
    primary: "bg-accent text-slate-900 border-slate-900 hover:bg-yellow-200",
    secondary: "bg-vibe text-white border-slate-900 hover:bg-violet-400",
    outline: "bg-white text-slate-900 border-slate-900 hover:bg-slate-50",
    danger: "bg-rose-500 text-white border-black hover:bg-rose-400",
  };

  return (
    <button
      className={twMerge(
        clsx(
          "border-2 px-6 py-2.5 font-bold rounded-xl transition-all",
          "shadow-soft-brutal hover:shadow-soft-brutal-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          styles[variant],
          className,
        ),
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
