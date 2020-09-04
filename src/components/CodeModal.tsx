import React, { useMemo } from "react";
import { Model2Tensorflow } from "../graph2tf/graph2tf";
import Model from "../graph2tf/Model";
import { engine } from "../utils/globalEngine";

function generateCode() {
  return Model2Tensorflow(new Model(engine.convertToJson()));
}

type CodeModalProps = {
  onClose: () => any;
};

function CodeModal({ onClose }: CodeModalProps) {
  let code = useMemo(function () {
    return generateCode();
  }, []);
  return (
    <div className="code-modal--wrapper">
      <div className="code-modal">
        <div className="code-modal__button-container">
          <button
            type="button"
            className="code-modal__button"
            style={{ backgroundColor: "#FF5F56" }}
            onClick={onClose}
          />
          <button
            type="button"
            className="code-modal__button"
            style={{ backgroundColor: "#FFBD2E" }}
          />
          <button
            type="button"
            className="code-modal__button"
            style={{ backgroundColor: "#27C93F" }}
          />
        </div>
        <pre className="code-modal__content">
          <code>{code}</code>
        </pre>
      </div>
      <div className="code-modal__underlay" onClick={onClose} />
    </div>
  );
}

export default CodeModal;
