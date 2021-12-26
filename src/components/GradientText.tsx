import { FC } from "react";

interface GradientTextProps {
  variant?: "primary" | "secondary" | "tertiary";
}

const GradientText: FC<GradientTextProps> = ({
  children,
  variant = "primary",
}) => {
  return (
    <span
      className={`leading-relaxed text-transparent bg-clip-text gradient-${variant}`}
    >
      {children}
    </span>
  );
};

export default GradientText;
