import React, { useRef, useEffect } from "react";
import createRawEngine, { DiagramEngine, DiagramModel } from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { Engine } from "../models/Engine";
import { initialiseEngine } from "../utils/globalEngine";

function createEngine() {
  let engine = createRawEngine();
  let model = new DiagramModel();
  engine.setModel(model);
  return engine;
}

function MainCanvas() {
  let canvasRef = useRef<CanvasWidget | null>(null);
  let engineRef = useRef<DiagramEngine>(createEngine());
  useEffect(function () {
    let engine = new Engine(engineRef.current, canvasRef.current!);
    initialiseEngine(engine);
  }, []);
  return <CanvasWidget engine={engineRef.current} ref={canvasRef} className="canvas" />;
}

export default MainCanvas;
