import {
  LinkModel,
  PortModel,
  DefaultLinkModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";

export class LayerPortModel extends PortModel {
  constructor(alignment: PortModelAlignment) {
    super({
      type: "layer",
      name: alignment,
      alignment,
    });
  }

  createLinkModel(): LinkModel {
    return new DefaultLinkModel();
  }
}
