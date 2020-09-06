import Model from "./Model";
import { LayerInstance } from "../utils/layers";
//import modelJson from "./sample-model.json";

let visiting: boolean[];
let visited: boolean[];
let cnt = 0;

function checkInputLayer(model: Model) {
  for (let index = 0; index < model.layers.length; index++) {
    let layer = model.layers[index];
    if (layer.class_name === "Input" && layer.inbound_nodes.length !== 0) return false;
    if (layer.class_name !== "Input" && layer.inbound_nodes.length === 0) return false;
  }

  return true;
}

function visit(u: number, model: Model, ans: number[]): boolean {
  visited[u] = true;
  visiting[u] = true;

  model.layers[u].inbound_nodes.forEach((name) => {
    let v = model.nameToIndex[name];
    if (!visited[v]) {
      if (!visit(v, model, ans)) return false;
    } else if (visiting[v]) {
      return false;
    }
  });

  ans[cnt++] = u;
  visiting[u] = false;
  return true;
}

function topo(model: Model): [boolean, number[]] {
  visited = Array<boolean>(model.layers.length);
  visiting = Array<boolean>(model.layers.length);
  visited.fill(false);
  visiting.fill(false);
  cnt = 0;

  let ans: number[] = Array<number>(model.layers.length);
  for (let u = 0; u < model.layers.length; u++) {
    if (!visited[u]) {
      if (!visit(u, model, ans)) return [false, []];
    }
  }

  return [true, ans];
}

function getAttributeLayer(layer: LayerInstance): string {
  let config: Record<string, any> = {};
  for (let key in layer.config) {
    if (
      layer.config[key] !== null &&
      key !== "name" &&
      (key !== "dtype" || layer.config[key] !== "float32") &&
      (key !== "trainable" || layer.config[key] !== true) &&
      (key !== "kernel_initializer" || layer.config[key] !== "glorot_uniform") &&
      (key !== "activation" || layer.config[key] !== "linear") &&
      (key !== "sparse" || layer.config[key] !== false) &&
      (key !== "ragged" || layer.config[key] !== false) &&
      (key !== "bias_initializer" || layer.config[key] !== "zeros") &&
      (key !== "use_bias" || layer.config[key] !== true) &&
      (key !== "padding" || layer.config[key] !== "valid") &&
      (key !== "data_format" || layer.config[key] !== "channels_last") &&
      (layer.class_name !== "Conv2D" ||
        key !== "strides" ||
        layer.config[key][0] !== 1 ||
        layer.config[key][0] !== 1) &&
      (layer.class_name !== "MaxPooling2D" ||
        key !== "strides" ||
        layer.config[key][0] !== 2 ||
        layer.config[key][0] !== 2) &&
      (key !== "dilation_rate" || layer.config[key][0] !== 1 || layer.config[key][1] !== 1) &&
      (key !== "groups" || layer.config[key] !== 1)
    ) {
      config[key] = layer.config[key];
    }
  }

  // let attributeJSON = JSON.stringify(config);
  return Object.entries(config)
    .map(function ([key, value]) {
      return `${key}=${JSON.stringify(value)}`;
    })
    .join(", ");
}

function computingLayer(layer: LayerInstance): string {
  if (layer.inbound_nodes.length <= 1) {
    return `(${layer.inbound_nodes[0]})`;
  } else {
    return `([${layer.inbound_nodes.join(", ")}])`;
  }
}

function declareLayer(layer: LayerInstance): string {
  return `${layer.config.name} = keras.layers.${layer.class_name}(${getAttributeLayer(layer)})`;
}

function checkOutputLayer(name: string, model: Model): boolean {
  for (let index = 0; index < model.layers.length; index++) {
    if (model.layers[index].inbound_nodes.includes(name)) {
      return false;
    }
  }
  return true;
}

function declareModel(model: Model): string {
  let inputs: string[] = [];
  let outputs: string[] = [];
  model.layers.forEach((layer) => {
    if (layer.class_name === "Input") {
      inputs.push(layer.config.name);
    }
  });

  model.layers.forEach((layer) => {
    if (checkOutputLayer(layer.config.name, model)) {
      outputs.push(layer.config.name);
    }
  });

  return `model = keras.Model(inputs=[${inputs.join(", ")}], outputs=[${outputs.join(", ")}])`;
}

function toTensorflowCode(model: Model, topoOrder: number[], style = 1): string {
  let ans = "";
  if (style === 1) {
    topoOrder.forEach((indexLayer) => {
      if (model.layers[indexLayer].class_name !== "Input") {
        ans +=
          declareLayer(model.layers[indexLayer]) + computingLayer(model.layers[indexLayer]) + "\n";
      } else {
        ans += declareLayer(model.layers[indexLayer]) + "\n";
      }
    });
    ans += declareModel(model) + "\n";
  } else if (style === 2) {
    ans += "class MyModel(keras.Model):\n";

    ans += "\tdef __init__(self):\n";
    ans += "\t\tsuper(MyModel, self).__init__()\n";
    model.layers.forEach((layer) => {
      if (layer.class_name !== "Input") {
        ans += `\t\tself.${declareLayer(layer)}\n`;
      }
    });

    ans += "\tdef call(self, inputs):\n";
    let inputs: string[] = [];
    model.layers.forEach((layer) => {
      if (layer.class_name === "Input") {
        inputs.push(layer.config.name);
      }
    });
    ans += `\t\t${inputs.join(", ")} = inputs\n`;

    topoOrder.forEach((indexLayer) => {
      let layer: LayerInstance = model.layers[indexLayer];
      if (layer.class_name !== "Input") {
        ans += `\t\t${layer.config.name} = self.${layer.config.name}${computingLayer(layer)}\n`;
      }
    });

    let outputs: string[] = [];
    model.layers.forEach((layer) => {
      if (checkOutputLayer(layer.config.name, model)) {
        outputs.push(layer.config.name);
      }
    });

    ans += `\t\treturn ${outputs.join(", ")}\n`;
  }
  return ans;
}

function Model2Tensorflow(model: Model, style = 1): string {
  let DAG: boolean;
  let topoOrder: number[];

  [DAG, topoOrder] = topo(model);
  if (!DAG) {
    return "Error: Đồ thị không phải DAG";
  }
  if (!checkInputLayer(model)) {
    return "Error: Layer xuất phát không phải layer input";
  }

  return toTensorflowCode(model, topoOrder, style);
}

//let model = new Model(modelJson);

//console.log(Model2Tensorflow(model));
//console.log(Model2Tensorflow(model, 2));

export { Model2Tensorflow, topo };
