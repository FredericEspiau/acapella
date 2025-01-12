import type { Type as Playable } from "./playable.ts";
import type { Skip } from "./skip.ts";

export type Type = Skip | Playable;

export * as Skip from "./skip.ts";
export * as Playable from "./playable.ts";
