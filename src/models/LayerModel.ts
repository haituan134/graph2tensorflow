import { NodeModel, NodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { LayerPortModel } from "./LayerPortModel";
import { LayerInstance } from "../utils/layers";

export interface LayerModelGenerics {
  PORT: LayerPortModel;
}

export class LayerModel extends NodeModel<NodeModelGenerics & LayerModelGenerics> {
  data: LayerInstance;
  setLayerName?: (layerName: string) => any;

  constructor(rawNode: LayerInstance) {
    super({
      type: "layer",
    });
    this.addPort(new LayerPortModel(PortModelAlignment.LEFT));
    this.addPort(new LayerPortModel(PortModelAlignment.RIGHT));
    this.data = rawNode;
  }
}
