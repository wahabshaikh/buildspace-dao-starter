import { FC } from "react";

const Heading: FC = ({ children }) => {
  return (
    <h1 className="text-3xl md:text-6xl font-black font-title text-center">
      {children}
    </h1>
  );
};

export default Heading;
