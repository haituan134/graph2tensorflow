import React from "react";
import { useCurrentNodeArrayAttribute } from "../hooks/useCurrentNodeArrayAttribute";

export default function ArrayInput({
  attributeName,
  targetLength,
}: {
  attributeName: string;
  targetLength: number;
}) {
  let { values, set, push, pop } = useCurrentNodeArrayAttribute(attributeName, targetLength);
  let isLengthFlexible = targetLength === -1;

  return (
    <div className="array_input">
      <div>
        {(values || []).map(function (value, index) {
          return (
            <input
              key={index}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={value}
              onChange={function (e) {
                let newValue = parseInt(e.target.value) || 0;
                set(index, newValue);
              }}
            />
          );
        })}
      </div>
      {isLengthFlexible && (
        <div>
          <button type="button" onClick={() => push(0)}>
            +
          </button>
          {values && values.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                pop();
                return false;
              }}>
              -
            </button>
          )}
        </div>
      )}
    </div>
  );
}
