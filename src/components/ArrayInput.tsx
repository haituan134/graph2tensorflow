import React, { useState, useEffect } from "react";

export default function ArrayInput({
  values,
  onElementChanged,
  onPopLastElement,
  length,
}: {
  values?: number[];
  onElementChanged: any;
  onPopLastElement?: any;
  length: number;
}) {
  if (length !== -1 && values?.length !== length) throw Error("Must be same length");
  const [defaultValues, setDefaultValues] = useState<number[]>([]);

  useEffect(() => {
    const tmp = [];
    for (let i = 0; i < (values?.length || length); i++) {
      tmp.push(values ? values[i] || 0 : 0);
    }
    setDefaultValues(tmp);
  }, [values, length]);

  function elementInput(value: number, index: number) {
    return (
      <input
        key={index}
        type="number"
        defaultValue={value}
        onChange={onElementChanged(value, index)}></input>
    );
  }
  return (
    <div className="array_input">
      <div>{defaultValues.map((value, index) => elementInput(value, index))}</div>

      <div>
        {length === -1 && (
          <button
            onClick={(event) => {
              setDefaultValues((defaultValues) => defaultValues.concat([0]));
              // TODO: Fix this illegal shit @ramu_kun
              onElementChanged(0, defaultValues.length)({ target: { value: 0 } });
            }}>
            +
          </button>
        )}
        {length === -1 && defaultValues.length > 0 && (
          <button
            onClick={() => {
              onPopLastElement();
              setDefaultValues((defaultValues) => defaultValues.slice(0, -1));
            }}>
            -
          </button>
        )}
      </div>
    </div>
  );
}
