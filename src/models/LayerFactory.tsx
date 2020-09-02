import React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { LayerModel } from "./LayerModel";
import LayerWidget from "../components/LayerWidget";

export class LayerFactory extends AbstractReactFactory<LayerModel, DiagramEngine> {
  constructor() {
    super("layer");
  }

  generateReactWidget(event: any): JSX.Element {
    return <LayerWidget engine={this.engine} node={event.model} />;
  }

  generateModel() {
    return new LayerModel({ class_name: "", config: {} });
  }
}
