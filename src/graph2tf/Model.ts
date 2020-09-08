import { LayerInstance } from "../utils/layers";

export type GraphJson = {
  layers: LayerInstance[];
};

class Model {
  layers: LayerInstance[];
  nameToIndex: Record<string, number>;
  constructor(json: GraphJson) {
    this.layers = json.layers;

    let id = 0;
    this.nameToIndex = {};
    this.layers.forEach((element) => {
      this.nameToIndex[element.config.name] = id++;
    });
  }
  toString() {
    return JSON.stringify(this);
  }
}

export default Model;
