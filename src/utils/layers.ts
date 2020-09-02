import layerData from "./data.json";

interface LayerInfos {
  [layerName: string]: {
    prototype: {
      class_name: string;
      config: Record<string, any>;
    };
    attributes: Record<string, any>;
  };
}

export const layerInfos: LayerInfos = layerData.layers.reduce((map, layer) => {
  map[layer.layerValue.class_name] = {
    prototype: {
      ...layer.layerValue,
    },
    attributes: layer.attribute,
  };
  return map;
}, {} as LayerInfos);

export const layerNames = Object.keys(layerInfos)
  .map((name) => name)
  .sort();
