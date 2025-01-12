import { Song } from "../song.ts";
import type { State } from "./state.ts";

export interface Type {
  song: Song.Type;
  state: State;
}

export const songIsNotOverAfterCurrentSection = (player: Type): boolean => {
  return (
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    player.state.section! &&
    Song.hasPlayableSectionAfterCurrent(player.song, player.state.section)
  );
};

export const getNextPlayableSection = (
  player: Type,
): Song.Section.Playable.Type | null => {
  return (
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    player.state.section! &&
    Song.getNextPlayableSection(player.song, player.state.section)
  );
};
