import { NodeModel, NodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { LayerPortModel } from "./LayerPortModel";
import { LayerInstance } from "../utils/layers";
import _ from "lodash";

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

  get inboundLayerNames(): string[] {
    return _.flatten(
      Object.values(this.getPorts()).map((port) => {
        return Object.values(port.getLinks())
          .map((link) => {
            if (link.getTargetPort() === port) {
              return (link.getSourcePort().getNode() as LayerModel).data.config.name;
            } else {
              return null;
            }
          })
          .filter((name) => name);
      }),
    );
  }
}
