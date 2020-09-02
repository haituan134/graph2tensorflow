import React, { DragEvent } from "react";
import { layerNames, layerInfos } from "../utils/layers";

function LeftColumn() {
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

  return <aside>{layerNames.map((name) => layerItem(name))}</aside>;
}

export default LeftColumn;
