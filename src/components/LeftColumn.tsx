import React from "react";
import { DefaultNodeModel } from "@projectstorm/react-diagrams";
import { engine } from "../utils/globalEngine";

let nodeCount = 0;

function LeftColumn() {
  function handleAddNode() {
    let newNode = new DefaultNodeModel({
      name: "Node " + ++nodeCount,
      color: "red",
    });
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
