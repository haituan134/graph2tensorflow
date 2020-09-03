import { useCurrentNode } from "../contexts/CurrentNodeContext";
import { useState, useCallback, useEffect } from "react";

function useCurrentNodeArrayAttribute(attributeName: string, targetLength: number) {
  let currentNode = useCurrentNode();
  let isLengthFlexible = targetLength === -1;

  let [values, setValues] = useState<number[]>(function () {
    if (!currentNode) {
      return [];
    }
    if (!currentNode.data.config[attributeName]) {
      if (isLengthFlexible) {
        currentNode.data.config[attributeName] = [];
      } else {
        currentNode.data.config[attributeName] = Array.from({ length: targetLength }, () => 0);
      }
    }
    return currentNode.data.config[attributeName];
  });

  useEffect(
    function () {
      if (currentNode) {
        currentNode.data.config[attributeName] = values;
      }
    },
    [currentNode, attributeName, values],
  );

  let set = useCallback(function (index: number, value: number) {
    setValues(function (prev) {
      if (index >= prev.length) {
        return prev;
      }
      let next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  let push = useCallback(function (newValue: number) {
    setValues((prev) => prev.concat(newValue));
  }, []);

  let pop = useCallback(function () {
    setValues((prev) => prev.slice(0, -1));
  }, []);

  return {
    values,
    set,
    push,
    pop,
  };
}

export { useCurrentNodeArrayAttribute };
