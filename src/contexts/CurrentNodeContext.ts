import React, { Dispatch, SetStateAction, useContext } from "react";

type CurrentNodeContextType = {
  currentNode: any;
  setCurrentNode: Dispatch<SetStateAction<any>>;
};

let CurrentNodeContext = React.createContext<CurrentNodeContextType | undefined>(undefined);

function useCurrentNode() {
  let context = useContext(CurrentNodeContext);
  if (context === undefined) {
    throw new Error("CurrentNodeContextProvider is required");
  }
  return context.currentNode;
}

function useSetCurrentNode() {
  let context = useContext(CurrentNodeContext);
  if (context === undefined) {
    throw new Error("CurrentNodeContextProvider is required");
  }
  return context.setCurrentNode;
}

export default CurrentNodeContext;
export { useCurrentNode, useSetCurrentNode };
