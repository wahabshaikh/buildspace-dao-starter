import { FC } from "react";

const Container: FC = ({ children }) => {
  return (
    <main className="min-h-screen w-full bg-black text-orange-200 flex flex-col items-center justify-center">
      {children}
    </main>
  );
};

export default Container;
