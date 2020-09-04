import React from "react";
import MainCanvas from "./components/MainCanvas";
import LeftColumn from "./components/LeftColumn";
import CurrentNodeContextProvider from "./components/CurrentNodeContextProvider";
import RightColumn from "./components/RightColumn";
import Header from "./components/Header";

function App() {
  return (
    <CurrentNodeContextProvider>
      <Header />
      <div className="container">
        <LeftColumn />
        <MainCanvas />
        <RightColumn />
      </div>
    </CurrentNodeContextProvider>
  );
}

export default App;
