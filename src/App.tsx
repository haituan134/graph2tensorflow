import React from "react";
import MainCanvas from "./components/MainCanvas";
import LeftColumn from "./components/LeftColumn";
import CurrentNodeContextProvider from "./components/CurrentNodeContextProvider";

function App() {
  return (
    <CurrentNodeContextProvider>
      <LeftColumn />
      <MainCanvas />
    </CurrentNodeContextProvider>
  );
}

export default App;
