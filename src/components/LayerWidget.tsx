import React, { useState } from "react";
import { DiagramEngine, PortWidget, PortModelAlignment } from "@projectstorm/react-diagrams";
import { LayerModel } from "../models/LayerModel";
import { useSetCurrentNode } from "../contexts/CurrentNodeContext";

interface LayerWidgetType {
  node: LayerModel;
  engine: DiagramEngine;
}

function LayerWidget({ node, engine }: LayerWidgetType) {
  let [isHighlighted, setIsHighlighted] = useState(false);
  let setCurrentNode = useSetCurrentNode();

  function handleSelect() {
    setIsHighlighted(true);
    setCurrentNode(node);
  }

  function handleUnselect() {
    setIsHighlighted(false);
    setCurrentNode(null);
  }

  return (
    <button
      type="button"
      className={"layer" + (isHighlighted ? " active" : "")}
      onClick={handleSelect}
      onBlur={handleUnselect}>
      <div className="layer-name">Node</div>
      <div className="layer__ports">
        <PortWidget port={node.getPort(PortModelAlignment.LEFT)!} engine={engine}>
          <div className="layer__port-input">Input</div>
        </PortWidget>
        <PortWidget port={node.getPort(PortModelAlignment.RIGHT)!} engine={engine}>
          <div className="layer__port-output">Output</div>
        </PortWidget>
      </div>
    </button>
  );
}

export default LayerWidget;
