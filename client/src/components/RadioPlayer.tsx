import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const PLAYLIST = [
  { id: 1, title: "Música 1", src: "/assets/radio/musica1.mp3" },
  { id: 2, title: "Música 2", src: "/assets/radio/musica2.mp3" },
  { id: 3, title: "Música 3", src: "/assets/radio/musica3.mp3" },
  { id: 4, title: "Música 4", src: "/assets/radio/musica4.mp3" },
  { id: 5, title: "Música 5", src: "/assets/radio/musica5.mp3" },
  { id: 6, title: "Música 6", src: "/assets/radio/musica6.mp3" },
  { id: 7, title: "Música 7", src: "/assets/radio/musica7.mp3" },
  { id: 8, title: "Música 8", src: "/assets/radio/musica8.mp3" },
  { id: 9, title: "Música 9", src: "/assets/radio/musica9.mp3" },
  { id: 10, title: "Música 10", src: "/assets/radio/musica10.mp3" },
  { id: 11, title: "Música 11", src: "/assets/radio/musica11.mp3" },
  { id: 12, title: "Música 12", src: "/assets/radio/musica12.mp3" },
];

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrack(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = PLAYLIST[currentTrack].src;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-red-800/50 z-40">
      <audio ref={audioRef} />
      
      <div className="container mx-auto px-4 py-4">
        {/* Now Playing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider">
              🎙️ LIL FRANK RÁDIO
            </h4>
            <p className="text-white font-bold text-lg">
              {PLAYLIST[currentTrack].title}
            </p>
          </div>
          <div className="text-gray-400 text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleTimeChange}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Anterior"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={handlePlayPause}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
              title={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Próxima"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              title="Volume"
            />
          </div>

          {/* Playlist Toggle */}
          <div className="hidden md:flex items-center gap-2 max-w-xs overflow-x-auto">
            {PLAYLIST.map((track, index) => (
              <button
                key={track.id}
                onClick={() => handleTrackSelect(index)}
                className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-colors ${
                  currentTrack === index
                    ? "bg-red-600 text-white"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                }`}
              >
                {track.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
