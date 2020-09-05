import React, { useState } from "react";
import CodeModal from "./CodeModal";
import { engine } from "../utils/globalEngine";

function Header() {
  let [isModalActive, setIsModalActive] = useState(false);

  function exportJSON(): void {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        JSON.stringify(engine.convertToJson(), null, 2),
      )}`,
    );
    element.setAttribute("download", `graph.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function onReaderLoad(ev: ProgressEvent<FileReader>) {
    if (ev.target && typeof ev.target.result === "string") {
      engine.createGraphFromJSON(JSON.parse(ev.target.result));
    } else {
      alert("Failed to import!");
    }
  }

  function importJSON(event: React.ChangeEvent<HTMLInputElement>) {
    const evFiles = event.target.files;
    if (evFiles && evFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.readAsText(evFiles[0]);
    }
  }

  return (
    <div className="header">
      <div className="header__logo--wrapper">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcToHmAAoR7a-UCuO44Sri6uDyMBFiFyGbxmEQ&usqp=CAU"
          alt="Logo"
          className="header__logo"
        />
        <h1 className="header__page-name">Stan Kanatan</h1>
      </div>
      <div className="header__action-button--wrapper">
        <label className="header__action-button">
          <input type="file" id="header__import" accept="json" onChange={importJSON} />
          {/* prettier-ignore */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M15 16.5V10.5H19L12 3.5L5 10.5H9V16.5H15ZM12 6.33L14.17 8.5H13V14.5H11V8.5H9.82999L12 6.33ZM19 20.5V18.5H5V20.5H19Z" fill="orange" />
          </svg>
          Import
        </label>
        <button type="button" className="header__action-button" onClick={exportJSON}>
          {/* prettier-ignore */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M19 9.5H15V3.5H9V9.5H5L12 16.5L19 9.5ZM11 11.5V5.5H13V11.5H14.17L12 13.67L9.83002 11.5H11ZM19 20.5V18.5H5V20.5H19Z" fill="#337ab7" />
          </svg>
          Export
        </button>
        <button
          type="button"
          className="header__action-button"
          onClick={() => setIsModalActive(true)}>
          {/* prettier-ignore */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47998 2 2 6.48 2 12C2 17.52 6.47998 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5L16 12L10 7.5V16.5ZM4 12C4 16.41 7.59003 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4C7.59003 4 4 7.59 4 12Z" fill="green" />
          </svg>
          Compile
        </button>
      </div>
      {isModalActive && <CodeModal onClose={() => setIsModalActive(false)} />}
    </div>
  );
}

export default Header;
