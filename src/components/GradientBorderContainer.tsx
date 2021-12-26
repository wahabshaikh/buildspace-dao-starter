import { FC } from "react";

interface GradientBorderContainerProps {
  variant?: "primary" | "secondary" | "tertiary";
}

const GradientBorderContainer: FC<GradientBorderContainerProps> = ({
  children,
  variant = "primary",
}) => {
  return (
    <section
      className={`h-full rounded-md p-1 gradient-${variant} transform duration-300 hover:scale-105`}
    >
      <div className="h-full rounded-md p-4 bg-black">{children}</div>
    </section>
  );
};

export default GradientBorderContainer;
