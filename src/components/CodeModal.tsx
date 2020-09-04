import React, { useMemo, useRef, useEffect } from "react";
import CodeMirror, { EditorFromTextArea } from "codemirror";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/seti.css";

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

  let codeRef = useRef<HTMLTextAreaElement | null>(null);
  let editor = useRef<EditorFromTextArea | null>(null);

  useEffect(function () {
    if (codeRef.current) {
      editor.current = CodeMirror.fromTextArea(codeRef.current, {
        theme: "seti",
        mode: "text/x-python",
      });
    }
  }, []);

  useEffect(
    function () {
      if (editor.current) {
        editor.current.setValue(code);
      }
    },
    [code],
  );

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
        <textarea ref={codeRef} />
        {/* <pre className="code-modal__content">
          <code>{code}</code>
        </pre> */}
      </div>
      <div className="code-modal__underlay" onClick={onClose} />
    </div>
  );
}

export default CodeModal;
