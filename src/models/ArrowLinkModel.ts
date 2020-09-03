import { DefaultLinkModel } from "@projectstorm/react-diagrams";

export class ArrowLinkModel extends DefaultLinkModel {
  constructor() {
    super({
      type: "arrow-link",
    });

    this.registerListener({
      eventDidFire: this.mouseReleaseListener,
    });
  }

  deleteLink() {
    this.getSourcePort()?.removeLink(this);
    this.getTargetPort()?.removeLink(this);
    this.remove();
  }

  mouseReleaseListener = (event: any) => {
    let { function: eventName, isSelected }: { function: string; isSelected: boolean } = event;
    if (eventName !== "selectionChanged" || isSelected) {
      return;
    }
    if (!this.getSourcePort() || !this.getTargetPort()) {
      this.deleteLink();
    }
  };
}
