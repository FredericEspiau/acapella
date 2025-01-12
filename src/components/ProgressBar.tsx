import type React from "react";
import { useCallback, useRef } from "react";
import type { Player } from "../types/player";
import { Song } from "../types/song";

interface ProgressBarProps {
  player: Player.Type;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ player, onSeek }) => {
  const progressRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current) return;

      const rect = progressRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * player.song.duration;
      onSeek(Math.max(0, Math.min(newTime, player.song.duration)));
    },
    [player, onSeek],
  );

  const handleSectionClick = (section: Song.Section.Type) => {
    onSeek(section.startTime);
  };

  return (
    <div className="w-full space-y-1">
      {/* Main progress bar */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        ref={progressRef}
        className="relative w-full h-3 bg-gray-100 rounded-full cursor-pointer"
        onClick={handleClick}
      >
        {/* Progress overlay */}
        <div
          className="absolute h-full bg-indigo-600 rounded-full pointer-events-none"
          style={{
            width: `${(player.state.time / player.song.duration) * 100}%`,
          }}
        />

        {/* Progress handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 aspect-square -ml-2 flex items-center justify-center pointer-events-none"
          style={{
            left: `${(player.state.time / player.song.duration) * 100}%`,
          }}
        >
          <div className="w-4 h-4 bg-indigo-600 rounded-full shadow-lg border-2 border-white" />
        </div>
      </div>

      {/* Section markers */}
      <div className="relative h-12 flex">
        {player.song.sections
          .filter(Song.Section.Playable.is)
          .map((section) => {
            const width =
              ((section.endTime - section.startTime) / player.song.duration) *
              100;
            const left = (section.startTime / player.song.duration) * 100;

            return (
              <button
                type="button"
                key={section.index}
                onClick={() => handleSectionClick(section)}
                className={`
                absolute h-full flex flex-col items-center justify-between py-1
                transition-colors duration-200 hover:bg-indigo-50 rounded
                ${section.index === player.state.section?.index ? "bg-indigo-100" : "bg-transparent"}
              `}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                }}
              >
                <div className="text-xs font-medium text-gray-600 truncate w-full text-center px-1">
                  {section.label}
                </div>
                <div className="text-[10px] text-gray-400">
                  {formatTime(section.startTime)}
                </div>
                <div
                  className={`absolute top-0 h-1 w-full
                  ${section.index === player.state.section?.index ? "bg-indigo-400" : "bg-gray-300"}
                `}
                />
              </button>
            );
          })}
      </div>
    </div>
  );
};
