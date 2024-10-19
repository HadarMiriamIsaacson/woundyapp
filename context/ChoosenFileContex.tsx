import React, { useEffect, useState } from "react";

interface IChoosenFileContext {
  setFileCurrent: (file: string) => void;
  fileCurrent: string | undefined;
}

const ChoosenFileContext = React.createContext<IChoosenFileContext | null>(null);

export const ChoosenFileContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [fileCurrent, setFileCurrent] = useState<string | undefined>();

  return (
    <ChoosenFileContext.Provider value={{  setFileCurrent, fileCurrent }}>
      {children}
    </ChoosenFileContext.Provider>
  );
};

export const useChoosenFileContext = () => {
  const context = React.useContext(ChoosenFileContext);

  if (!context) {
    throw new Error("Choosen file context not provided");
  }
  return context;
};
