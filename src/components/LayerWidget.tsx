import React, { useState, useEffect } from "react";
import { DiagramEngine, PortWidget, PortModelAlignment } from "@projectstorm/react-diagrams";
import { LayerModel } from "../models/LayerModel";
import { useSetCurrentNode, useCurrentNode } from "../contexts/CurrentNodeContext";
import { engine } from "../utils/globalEngine";

interface LayerWidgetType {
  node: LayerModel;
  engine: DiagramEngine;
}

function LayerWidget({ node, engine: rawEngine }: LayerWidgetType) {
  let currentNode = useCurrentNode();
  let setCurrentNode = useSetCurrentNode();
  let isHighlighted = node.getID() === currentNode?.getID();

  let [layerName, setLayerName] = useState(node.data.config.name);

  useEffect(
    function () {
      node.setLayerName = setLayerName;
    },
    [node],
  );

  function handleSelect() {
    setCurrentNode(node);
  }

  function handleDeleteLayer() {
    engine.removeNode(node);
    setCurrentNode(null);
  }

  return (
    <div className={"layer" + (isHighlighted ? " active" : "")}>
      <div className="layer-name">
        <span onClick={handleSelect}>{layerName}</span>
        <button
          type="button"
          onClick={handleDeleteLayer}
          aria-label="Delete layer"
          className="layer__delete-btn">
          {/* prettier-ignore */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="pink" />
          </svg>
        </button>
      </div>
      <div className="layer__ports">
        <PortWidget port={node.getPort(PortModelAlignment.LEFT)!} engine={rawEngine}>
          <div className="layer__port layer__port-input">
            {/* prettier-ignore */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.67 11L12.09 7.41L13.5 6L19.5 12L13.5 18L12.08 16.59L15.67 13H1.5V11H15.67ZM22.5 18H20.5V6H22.5V18Z" fill="#fff" fillOpacity="0.54"/>
            </svg>
            inp
          </div>
        </PortWidget>
        <PortWidget port={node.getPort(PortModelAlignment.RIGHT)!} engine={rawEngine}>
          <div className="layer__port layer__port-output">
            out
            {/* prettier-ignore */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.67 11L12.09 7.41L13.5 6L19.5 12L13.5 18L12.08 16.59L15.67 13H1.5V11H15.67ZM22.5 18H20.5V6H22.5V18Z" fill="#fff" fillOpacity="0.54"/>
            </svg>
          </div>
        </PortWidget>
      </div>
    </div>
  );
}

export default LayerWidget;
