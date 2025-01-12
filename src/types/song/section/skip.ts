import type { Base } from "./base.ts";

export interface Skip extends Base {
  type: "skip";
  index: number;
  startTime: number;
  endTime: number;
}

export const is = (section: Base): section is Skip =>
  "type" in section && section.type === "skip";
