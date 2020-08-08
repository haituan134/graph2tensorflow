class Node {
  name: string;
  attributes: Record<string, any>;
  constructor(name: string, attributes: Record<string, any>) {
    this.name = name;
    this.attributes = attributes;
  }
}

export default Node;
