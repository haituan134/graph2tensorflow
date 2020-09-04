import React, { useState } from "react";
import CodeModal from "./CodeModal";

function Header() {
  let [isModalActive, setIsModalActive] = useState(false);
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
        <button type="button" className="header__action-button">
          {/* prettier-ignore */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M16.04 16.89C16.5601 16.42 17.24 16.12 18 16.12C19.61 16.12 20.92 17.43 20.92 19.04C20.92 20.65 19.61 21.96 18 21.96C16.39 21.96 15.08 20.65 15.08 19.04C15.08 18.82 15.11 18.6 15.16 18.39L8.04004 14.23C7.5 14.73 6.79004 15.04 6 15.04C4.33997 15.04 3 13.7 3 12.04C3 10.38 4.33997 9.03998 6 9.03998C6.79004 9.03998 7.5 9.34998 8.04004 9.84998L15.09 5.73999C15.04 5.50995 15 5.27997 15 5.03998C15 3.38 16.34 2.03998 18 2.03998C19.66 2.03998 21 3.38 21 5.03998C21 6.69995 19.66 8.03998 18 8.03998C17.21 8.03998 16.5 7.72998 15.96 7.22998L8.91003 11.34C8.95996 11.57 9 11.8 9 12.04C9 12.28 8.95996 12.5099 8.91003 12.74L16.04 16.89ZM19 5.03998C19 4.48999 18.55 4.03998 18 4.03998C17.45 4.03998 17 4.48999 17 5.03998C17 5.58997 17.45 6.03998 18 6.03998C18.55 6.03998 19 5.58997 19 5.03998ZM6 13.04C5.44995 13.04 5 12.59 5 12.04C5 11.49 5.44995 11.04 6 11.04C6.55005 11.04 7 11.49 7 12.04C7 12.59 6.55005 13.04 6 13.04ZM17 19.06C17 19.61 17.45 20.06 18 20.06C18.55 20.06 19 19.61 19 19.06C19 18.51 18.55 18.06 18 18.06C17.45 18.06 17 18.51 17 19.06Z" fill="orange" />
          </svg>
          Share
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
