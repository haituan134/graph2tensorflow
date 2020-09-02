import React from "react";
import { layerInfos, LayerInstance } from "../utils/layers";
import { useCurrentNode } from "../contexts/CurrentNodeContext";

function RightColumn({ data: currentNode }: { data: LayerInstance }) {
  const nodeLayer = layerInfos[currentNode.class_name];

  function attributeInputProps(attrName: string, attrValue: any) {
    return {
      name: attrName,
      defaultValue: (currentNode.config[attrName] || "").toString(),
      onChange: (event: React.ChangeEvent) => {
        const input = event.target as HTMLInputElement | HTMLSelectElement;
        let newValue: any = input.value;
        if (attrValue === "number") {
          newValue = Number(input.value);
        } else if (Array.isArray(attrValue) && typeof attrValue[0] === "boolean") {
          newValue = input.value === "true" ? true : false;
        } else if (!Array.isArray(attrValue)) {
          newValue = JSON.parse(input.value);
        }
        currentNode.config[attrName] = newValue;
      },
    };
  }

  function addLabelToInput(input: JSX.Element, attrName: string) {
    const label = attrName.replace(/-/g, " ");
    return (
      <label key={attrName} className="params-editor__item">
        <span className="params-editor__item-name">{label}</span>
        {input}
      </label>
    );
  }

  function attributeInput(attrName: string, attrValue: any) {
    const inputProps = attributeInputProps(attrName, attrValue);
    if (attrValue === "number") {
      return addLabelToInput(<input type="number" {...inputProps} />, attrName);
    } else if (Array.isArray(attrValue)) {
      return addLabelToInput(
        <select {...inputProps}>
          {attrValue.map((value) => (
            <option key={value} value={value}>
              {value.toString()}
            </option>
          ))}
        </select>,
        attrName,
      );
    } else {
      return addLabelToInput(<input type="text" {...inputProps} />, attrName);
    }
  }

  function attributeInputs() {
    const inputs = Object.entries(nodeLayer.attributes).map(([attrName, attrValue]) => {
      return attributeInput(attrName, attrValue);
    });
    return inputs;
  }

  return (
    <aside id="params-editor">
      <h3 className="params-editor__layer-name">Properties of {currentNode.config.name}</h3>
      <section>
        <h4 className="params-editor__section-title">Parameters</h4>
        <div className="params-editor__section-content">{attributeInputs()}</div>
      </section>
      <section>
        <h4 className="params-editor__section-title">Other configurations</h4>
        <div className="params-editor__section-content">
          {addLabelToInput(
            <input
              key={currentNode.config.name}
              type="text"
              defaultValue={currentNode.config.name}
              onChange={(e) => (currentNode.config.name = e.target.value)}
            />,
            "Layer name",
          )}
        </div>
      </section>
    </aside>
  );
}

function RightColumnWrapper() {
  const currentNode = useCurrentNode();
  if (!currentNode) {
    return <aside id="params-editor">Nothing yet!</aside>;
  }
  return <RightColumn data={currentNode.data} />;
}

export default RightColumnWrapper;
