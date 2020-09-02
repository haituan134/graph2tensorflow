class Layer {
  class_name: string;
  config: Record<string, any>;
  inbound_nodes: string[];
  constructor(class_name: string, config: Record<string, any>, inbound_nodes: string[]) {
    this.class_name = class_name;
    this.config = config;
    this.inbound_nodes = inbound_nodes;
  }
}

export default Layer;
