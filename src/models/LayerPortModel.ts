import { LinkModel, PortModel, PortModelAlignment } from "@projectstorm/react-diagrams";
import { ArrowLinkModel } from "./ArrowLinkModel";

export class LayerPortModel extends PortModel {
  portType: "in" | "out";

  constructor(alignment: PortModelAlignment) {
    super({
      type: "layer",
      name: alignment,
      alignment,
    });
    this.portType = alignment === PortModelAlignment.LEFT ? "in" : "out";
  }

  createLinkModel(): LinkModel {
    return new ArrowLinkModel();
  }

  canLinkToPort(port: LayerPortModel) {
    // Only allow link from outPort to inPort
    if (this.portType !== "out" || port.portType !== "in") {
      return false;
    }
    // An inPort can have at most 1 link
    if (Object.keys(port.links).length >= 1) {
      return false;
    }
    // TODO: remove this to allow a layer output to be used in multiple places
    if (Object.keys(this.links).length >= 2) {
      return false;
    }
    return true;
  }
}
