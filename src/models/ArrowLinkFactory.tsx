import React from "react";
import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import { ArrowLinkModel } from "./ArrowLinkModel";
import ArrowLinkWidget from "../components/ArrowLinkWidget";

export class ArrowLinkFactory extends DefaultLinkFactory {
  constructor() {
    super("arrow-link");
  }

  generateModel() {
    return new ArrowLinkModel();
  }

  generateReactWidget(event: any) {
    return <ArrowLinkWidget link={event.model} diagramEngine={this.engine} />;
  }
}
