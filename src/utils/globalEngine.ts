import { Engine } from "../models/Engine";

export let engine: Engine;
export function initialiseEngine(_engine: Engine) {
  engine = _engine;
}
