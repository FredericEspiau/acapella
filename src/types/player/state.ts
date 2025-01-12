import type { Song } from "../song.ts";

export interface State {
  isPlaying: boolean;
  time: number;
  section: Song.Section.Type | null;
}
