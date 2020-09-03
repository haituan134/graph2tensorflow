import {
  LinkModel,
  PortModel,
  DefaultLinkModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";

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
    let link = new DefaultLinkModel();

    function deleteLink() {
      link.getSourcePort()?.removeLink(link);
      link.getTargetPort()?.removeLink(link);
      link.remove();
    }

    function dropListener(event: any) {
      let { function: eventName, isSelected }: { function: string; isSelected: boolean } = event;
      if (eventName !== "selectionChanged" || isSelected) {
        return;
      }
      if (!link.getSourcePort() || !link.getTargetPort()) {
        deleteLink();
      }
    }

    link.getPoints().forEach(function (point) {
      point.registerListener({
        eventDidFire: dropListener,
      });
    });
    link.registerListener({
      eventDidFire: dropListener,
    });
    return link;
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
