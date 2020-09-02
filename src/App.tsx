import React from "react";
import MainCanvas from "./components/MainCanvas";
import LeftColumn from "./components/LeftColumn";
import CurrentNodeContextProvider from "./components/CurrentNodeContextProvider";
import RightColumn from "./components/RightColumn";

function App() {
  return (
    <CurrentNodeContextProvider>
      <LeftColumn />
      <MainCanvas />
      <RightColumn />
    </CurrentNodeContextProvider>
  );
}

export default App;
