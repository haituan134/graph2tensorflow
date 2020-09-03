import React, { useRef, useEffect, MouseEvent } from "react";
import createRawEngine, {
  DiagramEngine,
  DiagramModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import { CanvasWidget, DeleteItemsAction } from "@projectstorm/react-canvas-core";
import { Engine } from "../models/Engine";
import { initialiseEngine, engine } from "../utils/globalEngine";
import { SimplePortFactory } from "../models/SimplePortFactory";
import { LayerPortModel } from "../models/LayerPortModel";
import { LayerFactory } from "../models/LayerFactory";
import { LayerModel } from "../models/LayerModel";
import { useSetCurrentNode } from "../contexts/CurrentNodeContext";

function createEngine() {
  let engine = createRawEngine({ registerDefaultDeleteItemsAction: false });
  engine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [46] }));
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
    let dropPoint = engineRef.current.getRelativeMousePoint(event);
    let rawNode = JSON.parse(event.dataTransfer.getData("new_node"));
    let newLayer = new LayerModel(rawNode);
    newLayer.setPosition(dropPoint);
    engine.addNode(newLayer);
  }

  let setCurrentNode = useSetCurrentNode();
  function handleClickOutsideOfAllNodes(e: MouseEvent) {
    let target = e.target as HTMLElement;
    if (target.closest(".layer")) {
      // Click on a node, ignore
      return;
    }
    setCurrentNode(null);
  }

  return (
    <div
      className="canvas-wrapper"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDropEvent}
      onClick={handleClickOutsideOfAllNodes}>
      <CanvasWidget engine={engineRef.current} ref={canvasRef} className="canvas" />
    </div>
  );
}

export default MainCanvas;
