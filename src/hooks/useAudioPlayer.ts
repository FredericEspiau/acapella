import { useEffect, useRef, useState } from "react";
import { Player } from "../types/player.ts";
import { Song } from "../types/song.ts";

export const useAudioPlayer = (song: Song.Type) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [player, setPlayer] = useState<Player.Type>({
    state: {
      isPlaying: false,
      time: 0,
      section: null,
    },
    song,
  });

  useEffect(() => {
    audioRef.current = new Audio(song.audioUrl);

    const updateTime = () => {
      if (!audioRef.current) return;

      const currentTime = audioRef.current.currentTime;
      const currentSection =
        song.sections.find(
          (section) =>
            currentTime >= section.startTime && currentTime <= section.endTime,
        ) || null;

      const nextSection =
        (song.sections.find(
          (section) =>
            section.startTime > (currentSection?.endTime || 0) &&
            !Song.Section.Skip.is(section),
        ) as Song.Section.Playable.Type) || null;

      setPlayer((prev) => ({
        ...prev,
        time: currentTime,
        section: currentSection,
        nextSection,
      }));
    };

    audioRef.current.addEventListener("timeupdate", updateTime);
    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateTime);
    };
  }, [song]);

  const play = () => {
    if (audioRef.current) {
      const nextPlayableSection = Player.getNextPlayableSection(player);
      if (nextPlayableSection) {
        jumpToSection(nextPlayableSection);
      } else {
        audioRef.current.play().then(() => {
          setPlayer((prev) => ({ ...prev, isPlaying: true }));
        });
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayer((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  const jumpToSection = (section: Song.Section.Type) => {
    if (audioRef.current) {
      // Add a small fade out before jumping
      const currentVolume = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.1) {
          audioRef.current.volume -= 0.1;
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.currentTime = section.startTime;
            audioRef.current.volume = currentVolume;
          }
        }
      }, 50);
    }
  };

  const jumpToTime = (time: number) => {
    if (audioRef.current) {
      const currentVolume = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.1) {
          audioRef.current.volume -= 0.1;
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.currentTime = time;
            audioRef.current.volume = currentVolume;
          }
        }
      }, 50);
    }
  };

  const jumpToNextSection = () => {
    const nextPlayableSection = Player.getNextPlayableSection(player);
    if (nextPlayableSection) {
      jumpToSection(nextPlayableSection);
    }
  };

  return {
    player: player,
    play,
    pause,
    jumpToSection,
    jumpToNextSection,
    jumpToTime,
  };
};
