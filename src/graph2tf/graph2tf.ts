import Node from "./Node";
import Graph from "./Graph";
import graphJson from "./sample-graph.json";
import { strict } from "assert";

let visiting: boolean[];
let visited: boolean[];
let cnt = 0;

function checkInputLayer(g: Graph) {
  g.nodes.forEach((layer, index) => {
    if (layer.name == "Input" && g.edges[index].length == 0) return false;
    if (layer.name != "Input" && g.edges[index].length != 0) return false;
  });

  return true;
}

function visit(u: number, edges: number[][], ans: number[]): boolean {
  visited[u] = true;
  visiting[u] = true;
  edges[u].forEach((v) => {
    if (!visited[v]) {
      if (!visit(v, edges, ans)) return false;
    } else if (visiting[v]) {
      return false;
    }
  });

  cnt -= 1;
  ans[cnt] = u;
  visiting[u] = false;
  return true;
}

function topo(g: Graph): [boolean, number[]] {
  visited = Array<boolean>(g.N);
  visiting = Array<boolean>(g.N);
  visited.fill(false);
  visiting.fill(false);
  cnt = g.N;

  let ans: number[] = Array<number>(g.N);
  for (let u = 0; u < g.N; u++) {
    if (!visited[u]) {
      if (!visit(u, g.edges, ans)) return [false, []];
    }
  }

  return [true, ans];
}

function assignNameLayer(g: Graph): [number, number, number] {
  let cntInput = 0;
  let cntOutput = 0;
  let cntHidden = 0;

  for (let index = 0; index < g.N; index++) {
    if (g.nodes[index].name == "Input") {
      g.nodes[index].varName = "input" + cntInput.toString();
      cntInput += 1;
    } else if (g.edges[index].length == 0) {
      g.nodes[index].varName = "output" + cntOutput.toString();
      cntOutput += 1;
    } else {
      g.nodes[index].varName = "hidden" + cntHidden.toString();
      cntHidden += 1;
    }
  }

  return [cntInput, cntHidden, cntOutput];
}

function getAttributeLayer(layer: Node): string {
  let attributeJSON = JSON.stringify(layer.attributes);
  return `${attributeJSON.slice(1, -1)}`;
}

function computingLayer(index: number, g: Graph): string {
  let listNode: string[] = [];
  g.rEdges[index].forEach((indexlayer) => {
    listNode.push(g.nodes[indexlayer].varName);
  });

  return `(${listNode.join(", ")})`;
}

function declareLayer(layer: Node): string {
  return `${layer.varName} = keras.layer.${layer.name}(${getAttributeLayer(layer)})`;
}

function declareModel(cntInput: number, cntOutput: number): string {
  let inputs: string[] = [];
  let outputs: string[] = [];
  for (let i = 0; i < cntInput; i++) {
    inputs.push(`input${i}`);
  }
  for (let i = 0; i < cntOutput; i++) {
    outputs.push(`output${i}`);
  }

  return `model = keras.Model(inputs=[${inputs.join(", ")}], outputs=[${outputs.join(", ")}])`;
}

function toTensorflowCode(
  g: Graph,
  topoOrder: number[],
  cntInput: number,
  cntOutput: number,
  style = 1,
): string {
  let ans = "";
  if (style == 1) {
    topoOrder.forEach((indexLayer) => {
      if (g.nodes[indexLayer].name != "Input") {
        ans += declareLayer(g.nodes[indexLayer]) + computingLayer(indexLayer, g) + "\n";
      } else {
        ans += declareLayer(g.nodes[indexLayer]) + "\n";
      }
    });
    ans += declareModel(cntInput, cntOutput) + "\n";
  } else if (style == 2) {
    ans += "Class MyModel(keras.Model):\n";

    ans += "\tdef __init__(self):\n";
    ans += "\t\tsuper(MyModel, self).__init__()\n";
    for (let index = 0; index < g.N; index++) {
      ans += `\t\t${declareLayer(g.nodes[index])}\n`;
    }

    ans += "\tdef call(self, inputs):\n";
    let inputs: string[] = [];
    for (let i = 0; i < cntInput; i++) {
      inputs.push(`input${i}`);
    }
    ans += `\t\t${inputs.join(", ")} = inputs\n`;

    topoOrder.forEach((indexLayer) => {
      let layer: Node = g.nodes[indexLayer];
      if (layer.name != "Input") {
        ans += `\t\t${layer.varName} = self.${layer.varName}${computingLayer(indexLayer, g)}\n`;
      }
    });

    let outputs: string[] = [];
    for (let i = 0; i < cntOutput; i++) {
      outputs.push(`output${i}`);
    }
    ans += `\t\treturn ${outputs.join(", ")}\n`;
  }
  return ans;
}

function graph2Tensorflow(g: Graph, style = 1): string {
  let DAG: boolean;
  let topoOrder: number[];

  [DAG, topoOrder] = topo(g);
  if (!DAG) {
    return "Error: Đồ thị không phải DAG";
  }
  if (!checkInputLayer(g)) {
    return "Error: Layer xuất phát không phải layer input hoặc layer input có đầu vào";
  }

  let cntInput: number;
  let cntHidden: number;
  let cntOutput: number;
  [cntInput, cntHidden, cntOutput] = assignNameLayer(g);
  return toTensorflowCode(g, topoOrder, cntInput, cntOutput, style);
}

let g = new Graph(graphJson);
console.log(graph2Tensorflow(g));
console.log(graph2Tensorflow(g, 2));
