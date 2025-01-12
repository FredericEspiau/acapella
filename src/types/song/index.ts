import * as Section from "./section/index.ts";

export interface Type {
  title: string;
  artist: string;
  audioUrl: string;
  duration: number;
  sections: Section.Type[];
}

export const hasPlayableSectionAfterCurrent = (
  song: Type,
  currentSection: Section.Type,
): boolean => {
  return (
    song.sections.find(
      (section) =>
        section.index > currentSection.index && Section.Playable.is(section),
    ) != null
  );
};

export const getNextPlayableSection = (
  song: Type,
  currentSection: Section.Type,
): Section.Playable.Type | null => {
  return song.sections.find(
    (section) =>
      section.index > currentSection.index && Section.Playable.is(section),
  ) as Section.Playable.Type | null;
};

export * as Section from "./section/index.ts";
