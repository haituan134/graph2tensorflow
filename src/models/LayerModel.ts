import { NodeModel, NodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { LayerPortModel } from "./LayerPortModel";
import { LayerInstance } from "../utils/layers";
import { engine } from "../utils/globalEngine";

export interface LayerModelGenerics {
  PORT: LayerPortModel;
}

export class LayerModel extends NodeModel<NodeModelGenerics & LayerModelGenerics> {
  data: LayerInstance;
  setLayerName?: (layerName: string) => any;
  inPortList: LayerPortModel[] = [];
  outPort: LayerPortModel;

  constructor(rawNode: LayerInstance) {
    super({
      type: "layer",
    });
    for (let i = 0; i < rawNode.cnt_input; ++i) {
      this.addNewInputPort();
    }
    this.outPort = new LayerPortModel(PortModelAlignment.RIGHT);
    this.addPort(this.outPort);
    this.data = rawNode;
  }

  addNewInputPort() {
    let port = new LayerPortModel(PortModelAlignment.LEFT);
    this.inPortList.push(port);
    this.addPort(port);
  }

  removeInputPort(index: number) {
    const deletedPort = this.inPortList.splice(index, 1)[0];
    Object.entries(deletedPort.links).forEach(([_, link]) => {
      deletedPort.removeLink(link);
      link.getTargetPort().removeLink(link);
      link.remove();
    });
    this.removePort(deletedPort);
    engine.refreshCanvas();
  }
}
