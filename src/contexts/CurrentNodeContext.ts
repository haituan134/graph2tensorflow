import React, { Dispatch, SetStateAction, useContext } from "react";
import { LayerModel } from "../models/LayerModel";

type CurrentNodeContextType = {
  currentNode: LayerModel | null;
  setCurrentNode: Dispatch<SetStateAction<LayerModel | null>>;
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
