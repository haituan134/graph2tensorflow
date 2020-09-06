import {
  DiagramEngine,
  NodeModel,
  DiagramModel,
  DefaultLinkModel,
} from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { LayerModel } from "./LayerModel";
import { LayerInstance, layerInfos } from "../utils/layers";
import Model, { GraphJson } from "../graph2tf/Model";
import { topo } from "../graph2tf/graph2tf";

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

  convertToJson() {
    return {
      layers: this.nodeList.map((node) => {
        const layerNode = node as LayerModel;
        const layer = layerNode.data;
        layer.inbound_nodes = layerNode.inboundLayerNames;
        layer.position = [layerNode.getPosition().x, layerNode.getPosition().y];
        return layer;
      }),
    };
  }

  createGraphFromJSON(graphJSON: GraphJson) {
    this.nodeList.forEach((node) => {
      this.nodeSet.delete(node);
      this.removeNode(node);
    });

    try {
      const model = new Model(graphJSON);
      const [isDAG, topoOrder] = topo(model);

      if (isDAG) {
        const layerNodes: LayerModel[] = [];
        let hasPosition = true;
        model.layers.forEach((layer) => {
          const layerId = Number((layer.config.name as string).split("_")[1]);
          const layerInfo = layerInfos[layer.class_name];
          layerInfo.count = Math.max(layerId + 1, layerInfo.count);
          const layerNode = new LayerModel(layer);
          if (!layer.position) hasPosition = false;
          layerNodes.push(layerNode);
          this.addNode(layerNode);
        });

        const visited = Array(model.layers.length);
        const depthToCurrentY: { [key: number]: number } = {};
        let maxDepth = 0;
        const updatePositionCbs: ((maxDepth: number) => void)[] = [];
        visited.fill(false);
        const visitLayer = (depth: number) => (layerIndex: number) => {
          if (visited[layerIndex]) return;
          visited[layerIndex] = true;
          const currentLayer = model.layers[layerIndex];
          const currentLayerNode = layerNodes[layerIndex];
          maxDepth = Math.max(depth, maxDepth);
          if (!hasPosition) {
            updatePositionCbs.push((maxDepth: number) => {
              currentLayerNode.setPosition(
                (currentLayerNode.width + 20) * maxDepth - (currentLayerNode.width + 20) * depth,
                depthToCurrentY[depth] || (depthToCurrentY[depth] = 0),
              );
              depthToCurrentY[depth] += currentLayerNode.height + 20;
            });
          }

          currentLayer.inbound_nodes.forEach((inboundLayerName, index) => {
            const inboundLayerIndex = model.nameToIndex[inboundLayerName];
            const outPort = layerNodes[inboundLayerIndex].outPort;
            if (outPort) {
              if (index >= currentLayerNode.inPortList.length) {
                currentLayerNode.addNewInputPort();
              }
              const inPort = currentLayerNode.inPortList[index];
              const link = new DefaultLinkModel();
              link.setSourcePort(outPort);
              link.setTargetPort(inPort);
              this.model.addLink(link);
            }
            visitLayer(depth + 1)(inboundLayerIndex);
          });
        };
        topoOrder.reverse().forEach(visitLayer(0));
        this.refreshCanvas();
        if (!hasPosition) {
          setTimeout(() => {
            updatePositionCbs.forEach((updatePositionCb) => updatePositionCb(maxDepth));
            console.log(depthToCurrentY);
            this.refreshCanvas();
          }, 100);
        }
      } else {
        throw "Non DAG graph";
      }
    } catch {
      alert("Failed when trying to recreate graph from json file!");
    }
  }

  findLayerNodeWithName(name: string): LayerModel | undefined {
    return this.nodeList.find(
      (node) => node instanceof LayerModel && node.data.config.name === name,
    ) as LayerModel;
  }
}

export { Engine };
