import type { Base } from "./base.ts";

export interface Type {
  type: "instrumental" | "verse" | "chorus" | "bridge" | "outro";
  index: number;
  startTime: number;
  endTime: number;
  label: string;
}

export const is = (section: Base): section is Type => {
  return "label" in section && section.label != null;
};
