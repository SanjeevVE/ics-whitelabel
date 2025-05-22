import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";

  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,

  className = "",

  variant = "default",

  ...props
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors";

  const variantStyles =
    variant === "default"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50";

  return (
    <button
      type='button'
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
