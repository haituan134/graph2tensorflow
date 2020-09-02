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
      <div key={attrName}>
        <label>{label}: </label>
        {input}
      </div>
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

  return <aside>{attributeInputs()}</aside>;
}

function RightColumnWrapper() {
  const currentNode = useCurrentNode();
  if (!currentNode) {
    return <aside>Nothing yet!</aside>;
  }
  return <RightColumn data={currentNode.data} />;
}

export default RightColumnWrapper;
