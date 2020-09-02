import React, { DragEvent } from "react";
import { engine } from "../utils/globalEngine";
import { layerNames, layerInfos } from "../utils/layers";
import { LayerModel } from "../models/LayerModel";

function LeftColumn() {
  function handleAddNode() {
    let newNode = new LayerModel();
    engine.addNode(newNode);
  }

  function handleDragLayer(event: DragEvent<HTMLDivElement>) {
    const layerName = (event.target as HTMLDivElement).textContent;
    if (layerName) {
      const layerInstance = layerInfos[layerName].createOne();
      event.dataTransfer?.setData("new_node", JSON.stringify(layerInstance));
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
