import { Clock, Music, Pause, Play, SkipForward } from "lucide-react";
import type React from "react";
import type { Player } from "../types/player.ts";
import { Song } from "../types/song";
import { ProgressBar } from "./ProgressBar";

interface SongControlsProps {
  player: Player.Type;
  onPlay: () => void;
  onPause: () => void;
  onJumpToSection: (section: Song.Section.Type) => void;
  onJumpToNext: () => void;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const SongControls: React.FC<SongControlsProps> = ({
  player,
  onPlay,
  onPause,
  onJumpToSection,
  onJumpToNext,
  onSeek,
}) => {
  const totalDuration =
    player.song.sections[player.song.sections.length - 1]?.endTime || 0;

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-2xl">
      <div className="w-full space-y-2">
        <div className="text-lg font-medium text-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="inline-block mr-2" size={18} />
            {formatTime(player.state.time)}
          </div>
          <div className="text-gray-500">{formatTime(totalDuration)}</div>
        </div>

        <ProgressBar player={player} onSeek={onSeek} />
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={player.state.isPlaying ? onPause : onPlay}
          className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          {player.state.isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          type="button"
          onClick={onJumpToNext}
          className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        {player.song.sections
          .filter(Song.Section.Playable.is)
          .map((section) => (
            <button
              type="button"
              key={section.index}
              onClick={() => onJumpToSection(section)}
              className={`
              p-3 rounded-lg flex items-center justify-between
              ${
                player.state.section?.index === section.index
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }
            `}
            >
              <div className="flex items-center space-x-2">
                <Music size={16} />
                <span>{section.label || section.type}</span>
              </div>
              <span className="text-sm opacity-75">
                {formatTime(section.startTime)} - {formatTime(section.endTime)}
              </span>
            </button>
          ))}
      </div>
    </div>
  );
};
