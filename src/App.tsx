import { useEffect } from "react";
import { SongControls } from "./components/SongControls";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { Song } from "./types/song.ts";

// Example song data
const exampleSong: Song.Type = {
  title: "Example",
  artist: "Demo Artist",
  audioUrl: "/song.mp3", // Replace with actual audio URL
  sections: [
    { index: 0, type: "skip", startTime: 0, endTime: 10 },
    {
      index: 1,
      type: "instrumental",
      startTime: 10,
      endTime: 24,
      label: "Intro",
    },
    { index: 2, type: "verse", startTime: 24, endTime: 45, label: "Verse 1" },
    { index: 3, type: "bridge", startTime: 45, endTime: 52, label: "Bridge" },
    {
      index: 4,
      type: "verse",
      startTime: 52,
      endTime: 70,
      label: "Before Chorus",
    },
    {
      index: 5,
      type: "chorus",
      startTime: 70,
      endTime: 84,
      label: "Chorus Part 1",
    },
    {
      index: 6,
      type: "chorus",
      startTime: 84,
      endTime: 98,
      label: "Chorus Part 2",
    },
    {
      index: 7,
      type: "chorus",
      startTime: 98,
      endTime: 144,
      label: "Chorus 2",
    },
    { index: 8, type: "bridge", startTime: 144, endTime: 174, label: "Bridge" },
    {
      index: 9,
      type: "chorus",
      startTime: 174,
      endTime: 204,
      label: "Chorus 3",
    },
    { index: 10, type: "outro", startTime: 204, endTime: 224, label: "Outro" },
  ],
};

function App() {
  const { player, play, pause, jumpToSection, jumpToNextSection, jumpToTime } =
    useAudioPlayer(exampleSong);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case " ":
          event.preventDefault();
          if (player.state.isPlaying) {
            pause();
          } else {
            play();
          }
          break;
        case "n":
          jumpToNextSection();
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8": {
          const index = Number.parseInt(event.key) - 1;
          if (exampleSong.sections[index]) {
            jumpToSection(exampleSong.sections[index]);
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [player, play, pause, jumpToNextSection, jumpToSection]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {exampleSong.title}
          </h1>
          <p className="text-gray-600">{exampleSong.artist}</p>
        </div>

        <div className="mb-8">
          {player.state.section && (
            <div className="text-center mb-4">
              <div className="text-xl font-semibold text-indigo-600">
                {Song.Section.Playable.is(player.state.section)
                  ? player.state.section.label
                  : "Not Playing"}
              </div>
              (Song.Section.Playable.is(player.state.section) && (
              <div className="text-sm text-gray-500">
                Next: {player.state.section.label || "End"}
              </div>
              )
            </div>
          )}

          <SongControls
            song={exampleSong}
            isPlaying={player.state.isPlaying}
            currentSection={player.state.section}
            currentTime={player.state.time}
            onPlay={play}
            onPause={pause}
            onJumpToSection={jumpToSection}
            onJumpToNext={jumpToNextSection}
            onSeek={jumpToTime}
          />
        </div>

        <div className="text-sm text-gray-500 text-center">
          <p className="mb-2">Keyboard Shortcuts:</p>
          <ul className="space-y-1">
            <li>Space: Play/Pause</li>
            <li>N: Next Section</li>
            <li>1-8: Jump to Section</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
