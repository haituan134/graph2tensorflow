import React, { useState } from "react";
import CurrentNodeContext from "../contexts/CurrentNodeContext";

function CurrentNodeContextProvider({ children }: { children: React.ReactNode }) {
  let [currentNode, setCurrentNode] = useState<any>(null);
  return (
    <CurrentNodeContext.Provider value={{ currentNode, setCurrentNode }}>
      {children}
    </CurrentNodeContext.Provider>
  );
}

export default CurrentNodeContextProvider;
