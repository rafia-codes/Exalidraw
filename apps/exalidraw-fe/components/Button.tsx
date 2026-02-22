import React from "react";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "hero-outline";
type Size = "sm" | "default" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles: Record<Variant, string> = {
    default: "bg-black text-white hover:bg-black/80",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    ghost: "hover:bg-gray-100",
    link: "text-blue-600 underline hover:text-blue-800",
  hero:
      "bg-black text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300",

    "hero-outline":
      "border-2 border-gray-300 bg-white text-black hover:border-black hover:text-black hover:-translate-y-0.5 duration-300",
  };

  const sizeStyles: Record<Size, string> = {
    sm: "h-9 px-3",
    default: "h-10 px-4",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
}