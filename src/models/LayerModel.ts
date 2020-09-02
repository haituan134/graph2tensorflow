import { NodeModel, NodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { LayerPortModel } from "./LayerPortModel";

export interface LayerModelGenerics {
  PORT: LayerPortModel;
}

export class LayerModel extends NodeModel<NodeModelGenerics & LayerModelGenerics> {
  constructor() {
    super({
      type: "layer",
    });
    this.addPort(new LayerPortModel(PortModelAlignment.LEFT));
    this.addPort(new LayerPortModel(PortModelAlignment.RIGHT));
  }
}
