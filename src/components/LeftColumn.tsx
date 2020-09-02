import React, { DragEvent } from "react";
import { DefaultNodeModel } from "@projectstorm/react-diagrams";
import { engine } from "../utils/globalEngine";
import { layerNames, layerInfos } from "../utils/layers";

let nodeCount = 0;

function LeftColumn() {
  function handleAddNode() {
    let newNode = new DefaultNodeModel({
      name: "Node " + ++nodeCount,
      color: "red",
    });
    engine.addNode(newNode);
  }

  function handleDragLayer(event: DragEvent<HTMLDivElement>) {
    const layerName = (event.target as HTMLDivElement).textContent;
    if (layerName) {
      const layer = layerInfos[layerName];
      event.dataTransfer?.setData("new_node", JSON.stringify(layer));
    }
  }

  function layerItem(name: string) {
    return (
      <div key={name} draggable onDragStart={handleDragLayer}>
        {name}
      </div>
    );
  }

  return (
    <aside>
      {layerNames.map((name) => layerItem(name))}
      <div>
        <button type="button" onClick={handleAddNode}>
          Add node
        </button>
      </div>
    </aside>
  );
}

export default LeftColumn;
