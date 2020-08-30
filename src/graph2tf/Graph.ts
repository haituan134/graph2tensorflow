import Node from "./Node";

type GraphJson = {
  nodes: Array<{
    name: string;
    [attribute: string]: any;
  }>;
  edges: number[][];
};

class Graph {
  N: number;
  nodes: Node[];
  edges: number[][];
  rEdges: number[][];
  constructor(json: GraphJson) {
    this.N = json.nodes.length;
    this.nodes = json.nodes.map(function ({ name, ...attributes }) {
      return new Node(name, attributes);
    });

    this.edges = [];
    this.rEdges = [];
    for (let i = 0; i < this.N; i++) {
      this.edges[i] = [];
      this.rEdges[i] = [];
    }

    json.edges.forEach((x) => {
      let u = x[0];
      let v = x[1];
      this.edges[u].push(v);
      this.rEdges[v].push(u);
    });
  }
  toString() {
    return JSON.stringify(this);
  }
}

export default Graph;
