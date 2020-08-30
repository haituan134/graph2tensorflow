class Node {
  name: string;
  varName: string;
  attributes: Record<string, any>;
  constructor(name: string, attributes: Record<string, any>) {
    this.name = name;
    this.varName = "";
    this.attributes = attributes;
  }
}

export default Node;
