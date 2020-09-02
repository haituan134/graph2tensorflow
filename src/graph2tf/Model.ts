import Layer from "./Layer";
type GraphJson = {
  layers: Layer[];
};

class Model {
  layers: Layer[];
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
