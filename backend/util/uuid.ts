import { v4, V4Options } from "uuid";

export function uuid(opts?: V4Options) {
  return v4(opts);
}
