import React, { useRef, useEffect } from "react";
import createRawEngine, {
  DiagramEngine,
  DiagramModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { Engine } from "../models/Engine";
import { initialiseEngine } from "../utils/globalEngine";
import { SimplePortFactory } from "../models/SimplePortFactory";
import { LayerPortModel } from "../models/LayerPortModel";
import { LayerFactory } from "../models/LayerFactory";

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
    let rawEngine = engineRef.current;
    rawEngine
      .getPortFactories()
      .registerFactory(
        new SimplePortFactory("layer", () => new LayerPortModel(PortModelAlignment.LEFT)),
      );
    rawEngine.getNodeFactories().registerFactory(new LayerFactory());

    let engine = new Engine(rawEngine, canvasRef.current!);
    initialiseEngine(engine);
  }, []);

  function handleDropEvent(event: React.DragEvent<HTMLDivElement>) {
    return;
  }

  return (
    <div
      className="canvas-wrapper"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDropEvent}>
      <CanvasWidget engine={engineRef.current} ref={canvasRef} className="canvas" />
    </div>
  );
}

export default MainCanvas;
