import { DiagramEngine, NodeModel, DiagramModel } from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";

class Engine {
  private engine: DiagramEngine;
  private canvas: CanvasWidget;
  private model: DiagramModel;
  private nodeSet: Set<NodeModel>;

  constructor(rawEngine: DiagramEngine, canvas: CanvasWidget) {
    this.engine = rawEngine;
    this.canvas = canvas;
    this.nodeSet = new Set();

    this.model = rawEngine.getModel();
    this.engine.setModel(this.model);
  }

  refreshCanvas() {
    this.canvas.forceUpdate();
  }

  addNode<NodeType extends NodeModel>(node: NodeType) {
    this.model.addNode(node);
    this.nodeSet.add(node);
    this.refreshCanvas();
  }

  removeNode<NodeType extends NodeModel>(node: NodeType) {
    let portMap = node.getPorts();
    for (let portId in portMap) {
      let port = portMap[portId];
      let linkMap = port.getLinks();
      for (let linkId in linkMap) {
        let link = linkMap[linkId];
        // Dear Lord, this thing requires me to manually unlink every link I want to delete
        link.getSourcePort().removeLink(link);
        link.getTargetPort().removeLink(link);
        this.model.removeLink(link);
      }
    }
    this.model.removeNode(node);
    this.nodeSet.delete(node);
    this.refreshCanvas();
  }

  get nodeList() {
    return [...this.nodeSet];
  }
}

export { Engine };
