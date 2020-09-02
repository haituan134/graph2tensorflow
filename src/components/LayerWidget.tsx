import React from "react";
import { DiagramEngine, PortWidget, PortModelAlignment } from "@projectstorm/react-diagrams";
import { LayerModel } from "../models/LayerModel";

interface LayerWidgetType {
  node: LayerModel;
  engine: DiagramEngine;
  size: number;
}

function LayerWidget({ node, engine, size }: LayerWidgetType) {
  return (
    <div style={{ border: "1px solid #bbb", padding: "5px 10px" }}>
      <span>Node</span>
      <PortWidget
        style={{
          left: size - 8,
          top: size / 2 - 8,
          position: "absolute",
        }}
        port={node.getPort(PortModelAlignment.LEFT)!}
        engine={engine}>
        <div style={{ height: "20px", width: "20px", backgroundColor: "red" }} />
      </PortWidget>
    </div>
  );
}

export default LayerWidget;
