import React from "react";
import { engine } from "../utils/globalEngine";
import { LayerModel } from "../models/LayerModel";

function LeftColumn() {
  function handleAddNode() {
    let newNode = new LayerModel();
    engine.addNode(newNode);
  }
  return (
    <div>
      <button type="button" onClick={handleAddNode}>
        Add node
      </button>
    </div>
  );
}

export default LeftColumn;
