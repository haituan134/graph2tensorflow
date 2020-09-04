import React, { useState, useEffect } from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams";
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

  // State for force-updates
  let [forceUpdateKey, setForceUpdateKey] = useState(0);
  function handleAddPort() {
    node.addNewInputPort();
    setForceUpdateKey((p) => 1 - p);
  }

  function handleDeletePort(index: number) {
    return () => {
      node.removeInputPort(index);
      setForceUpdateKey((p) => 1 - p);
    };
  }

  return (
    <div className={"layer" + (isHighlighted ? " active" : "")}>
      <div className="layer-name">
        <span onClick={handleSelect}>{layerName}</span>
        <button
          type="button"
          onClick={handleDeleteLayer}
          aria-label="Delete layer"
          className="layer__delete-btn delete-btn">
          {/* prettier-ignore */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="pink" />
          </svg>
        </button>
      </div>
      <div className="layer__ports">
        <div key={forceUpdateKey}>
          {node.inPortList.map(function (port, index) {
            return (
              <PortWidget key={port.getName()} port={port} engine={rawEngine}>
                <div className="layer__port layer__port-input">
                  {/* prettier-ignore */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.67 11L12.09 7.41L13.5 6L19.5 12L13.5 18L12.08 16.59L15.67 13H1.5V11H15.67ZM22.5 18H20.5V6H22.5V18Z" fill="#fff" fillOpacity="0.54"/>
                  </svg>
                  <span className="layer__port-input__port-name">
                    inp {node.inPortList.length > 0 ? index + 1 : ""}
                  </span>
                  {node.data.cnt_input === -1 && (
                    <button
                      type="button"
                      onClick={handleDeletePort(index)}
                      aria-label="Delete input port"
                      className="layer__port-input__delete-btn delete-btn">
                      {/* prettier-ignore */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="pink" />
                    </svg>
                    </button>
                  )}
                </div>
              </PortWidget>
            );
          })}
          {node.data.cnt_input === -1 && (
            <div className="layer__port layer__port-input" onClick={handleAddPort}>
              {/* prettier-ignore */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#fff" fillOpacity="0.54"/>
              </svg>
              add input
            </div>
          )}
        </div>
        <PortWidget port={node.outPort} engine={rawEngine}>
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
