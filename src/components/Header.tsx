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
          src="data:image/png;base64,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"
          alt="Logo"
          className="header__logo"
        />
        <h1 className="header__page-name" title="Stan Kanatan">
          graph2tensorflow
        </h1>
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
