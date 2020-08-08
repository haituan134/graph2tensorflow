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
  constructor(json: GraphJson) {
    this.N = json.nodes.length;
    this.nodes = json.nodes.map(function ({ name, ...attributes }) {
      return new Node(name, attributes);
    });
    this.edges = json.edges;
  }
  toString() {
    return JSON.stringify(this);
  }
}

export default Graph;
