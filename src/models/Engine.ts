import { DiagramEngine, NodeModel, DiagramModel, LinkModel } from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";

class Engine {
  private engine: DiagramEngine;
  private canvas: CanvasWidget;
  private model: DiagramModel;
  private nodeSet: Set<NodeModel>;
  private linkSet: Set<LinkModel>;

  constructor(rawEngine: DiagramEngine, canvas: CanvasWidget) {
    this.engine = rawEngine;
    this.canvas = canvas;
    this.model = rawEngine.getModel();

    this.nodeSet = new Set();
    this.linkSet = new Set();

    this.engine.setModel(this.model);
  }

  private refreshCanvas() {
    this.canvas.forceUpdate();
  }

  addNode<NodeType extends NodeModel>(node: NodeType) {
    this.model.addNode(node);
    this.nodeSet.add(node);
    this.refreshCanvas();
  }

  removeNode<NodeType extends NodeModel>(node: NodeType) {
    this.model.removeNode(node);
    this.nodeSet.delete(node);
    this.refreshCanvas();
  }

  addLink<LinkType extends LinkModel>(link: LinkType) {
    this.model.addLink(link);
    this.linkSet.add(link);
    this.refreshCanvas();
  }

  removeLink<LinkType extends LinkModel>(link: LinkType) {
    this.model.removeLink(link);
    this.linkSet.delete(link);
    this.refreshCanvas();
  }

  get nodeList() {
    return [...this.nodeSet];
  }

  get linkList() {
    return [...this.linkSet];
  }
}

export { Engine };
