import {
  DiagramEngine,
  NodeModel,
  DiagramModel,
  DefaultLinkModel,
} from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { LayerModel } from "./LayerModel";
import { LayerInstance, layerInfos } from "../utils/layers";
import { link } from "fs";
import { max } from "lodash";

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

  createGraphFromJSON(graphJSON: Record<string, any>) {
    this.nodeList.forEach((node) => {
      this.nodeSet.delete(node);
      this.removeNode(node);
    });
    const layers = graphJSON.layers as LayerInstance[];
    try {
      layers.forEach((layer) => {
        const layerId = Number((layer.config.name as string).split("_")[1]);
        const layerInfo = layerInfos[layer.class_name];
        layerInfo.count = Math.max(layerId + 1, layerInfo.count);
        this.addNode(new LayerModel(layer));
      });

      layers.forEach((layer) => {
        const srcLayerNode = this.findLayerNodeWithName(layer.config.name);
        if (srcLayerNode) {
          const targetLayerNodes = layer.inbound_nodes
            .map((nodeName) => {
              return this.findLayerNodeWithName(nodeName);
            })
            .filter((node) => node);
          targetLayerNodes.forEach((targetLayerNode, index) => {
            const outPort = targetLayerNode?.outPort;
            if (outPort) {
              if (index >= srcLayerNode.inPortList.length) {
                srcLayerNode.addNewInputPort();
              }
              const inPort = srcLayerNode.inPortList[index];
              const link = new DefaultLinkModel();
              link.setSourcePort(outPort);
              link.setTargetPort(inPort);
              this.model.addLink(link);
            }
          });
        }
      });
      this.refreshCanvas();
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
