import layerData from "./data.json";
import _ from "lodash";

export interface LayerInstance {
  class_name: string;
  config: Record<string, any>;
  cnt_input: number;
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
      const instance = _.cloneDeep(layer.layerValue as LayerInstance);
      instance.config.name = instance.class_name + "_" + this.count++;
      return instance;
    },
  };
  return map;
}, {} as LayerInfos);

export const layerNames = Object.keys(layerInfos)
  .map((name) => name)
  .sort();
