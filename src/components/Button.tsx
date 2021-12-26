import classNames from "classnames";
import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={classNames(
        `mt-4 rounded-md gradient-${variant} px-4 py-3 text-xl text-white font-bold transform duration-300 hover:scale-110`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
