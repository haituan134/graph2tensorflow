import { Action, ActionEvent, InputType } from "@projectstorm/react-canvas-core";
import { KeyboardEvent, MouseEvent, WheelEvent } from "react";
import { LayerModel } from "./LayerModel";
interface CustomDeleteModelsActionOptions {
  keyCodes?: number[];
}

export class CustomDeleteModelsAction extends Action {
  constructor(options: CustomDeleteModelsActionOptions = {}) {
    const keyCodes = options.keyCodes || [46];
    super({
      type: InputType.KEY_DOWN,
      fire: (event: ActionEvent<KeyboardEvent | MouseEvent | WheelEvent>) => {
        const { keyCode } = event.event as KeyboardEvent;
        if (keyCodes.indexOf(keyCode) !== -1) {
          this.engine
            .getModel()
            .getSelectedEntities()
            .forEach((model) => {
              // only delete items which are not locked
              if (!model.isLocked()) {
                if (!(model instanceof LayerModel)) model.remove();
              }
            });
          this.engine.repaintCanvas();
        }
      },
    });
  }
}
