import layerData from "./data.json";
import _ from "lodash";

export interface LayerInstance {
  class_name: string;
  config: Record<string, any>;
  inbound_nodes: string[];
}

interface LayerInfo {
  attributes: Record<string, any>;
  count: number;
  createOne: (this: LayerInfo) => LayerInstance;
}
interface LayerInfos {
  [layerName: string]: LayerInfo;
}

export const layerInfos: LayerInfos = layerData.layers.reduce((map, layer) => {
  map[layer.layerValue.class_name] = {
    attributes: layer.attribute,
    count: 0,
    createOne() {
      const instance = _.cloneDeep(layer.layerValue) as any;
      instance.config.name = instance.class_name + "_" + this.count++;
      instance.inbound_nodes = [];
      return instance;
    },
  };
  return map;
}, {} as LayerInfos);

export const layerNames = Object.keys(layerInfos)
  .map((name) => name)
  .sort();
