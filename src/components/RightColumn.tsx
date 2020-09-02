import React from "react";
// import { useCurrentNode } from "../contexts/CurrentNodeContext";
import { layerInfos } from "../utils/layers";
import { useCurrentNode } from "../contexts/CurrentNodeContext";
export default function RightColumn() {
  const currentNode = useCurrentNode();
  // const currentNode: { [key: string]: any } = {
  //   class_name: "Dense",
  // };
  if (!currentNode) return <aside></aside>;

  const nodeLayer = layerInfos[currentNode.class_name];

  function attributeInputProps(attrName: string) {
    return {
      name: attrName,
      value: currentNode[attrName],
      onChange: (event: React.ChangeEvent) => {
        const input = event.target as HTMLInputElement | HTMLSelectElement;
        currentNode[attrName] = input.value;
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
    const inputProps = attributeInputProps(attrName);
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
