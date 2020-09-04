import React, { DragEvent, useState } from "react";
import { layerNames, layerInfos } from "../utils/layers";
import { engine } from "../utils/globalEngine";

function LeftColumn() {
  let [search, setSearch] = useState("");

  function handleDragLayer(event: DragEvent<HTMLDivElement>) {
    const layerName = (event.target as HTMLDivElement).textContent;
    if (layerName) {
      const layerInstance = layerInfos[layerName].createOne();
      event.dataTransfer?.setData("new_node", JSON.stringify(layerInstance));
    }
  }

  return (
    <aside id="layer-list">
      <label className="layer-list__search-box--wrapper">
        {/* prettier-ignore */}
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.965 14.255H15.755L20.745 19.255L19.255 20.745L14.255 15.755V14.965L13.985 14.685C12.845 15.665 11.365 16.255 9.755 16.255C6.16504 16.255 3.255 13.345 3.255 9.755C3.255 6.16501 6.16504 3.255 9.755 3.255C13.345 3.255 16.255 6.16501 16.255 9.755C16.255 11.365 15.665 12.845 14.6851 13.985L14.965 14.255ZM5.255 9.755C5.255 12.245 7.26501 14.255 9.755 14.255C12.245 14.255 14.255 12.245 14.255 9.755C14.255 7.26501 12.245 5.255 9.755 5.255C7.26501 5.255 5.255 7.26501 5.255 9.755Z" fill="#fff" fillOpacity="0.54"/>
        </svg>
        <input
          type="text"
          className="layer-list__search-box"
          placeholder="Search for"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {layerNames.map(function (layerName) {
        if (!layerName.toLowerCase().includes(search.toLowerCase())) {
          return null;
        }
        return (
          <div key={layerName} className="layer-list__item" draggable onDragStart={handleDragLayer}>
            {layerName}
          </div>
        );
      })}
      <button onClick={() => console.log(engine.convertToJson())}>Convert</button>
    </aside>
  );
}

export default LeftColumn;
