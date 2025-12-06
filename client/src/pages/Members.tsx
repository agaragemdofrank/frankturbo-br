import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Play, Lock, AlertCircle } from "lucide-react";

const YOUTUBE_VIDEOS = [
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
  "https://www.youtube.com/embed/tmjy_DEl-K0",
];

const PRANK_VIDEO = "https://www.youtube.com/embed/RX7SnWIlJMo";

export default function Members() {
  const { user, isAuthenticated } = useAuth();
  const { data: member, isLoading: memberLoading } = trpc.members.me.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: videos, isLoading: videosLoading } = trpc.videos.list.useQuery();
  
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [showPrank, setShowPrank] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Prevent inspect element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
        setBlockMessage("🚫 Tentativa de inspecionar bloqueada! Vídeo de zoação carregando...");
        setShowPrank(true);
        setTimeout(() => setBlockMessage(""), 3000);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Only block on video iframe
      if ((e.target as HTMLElement).closest(".video-player")) {
        e.preventDefault();
        setBlockMessage("🚫 Cópia de link bloqueada! Vídeo de zoação carregando...");
        setShowPrank(true);
        setTimeout(() => setBlockMessage(""), 3000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Área Restrita</h2>
          <p className="text-gray-400 mb-8">Você precisa estar logado para acessar esta área.</p>
          <Link href="/">
            <Button className="btn-primary">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (memberLoading || videosLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando conteúdo exclusivo...</p>
        </div>
      </div>
    );
  }

  if (!member || !member.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Membresia Inativa</h2>
          <p className="text-gray-400 mb-8">
            Sua membresia expirou ou está inativa. Entre em contato para reativar.
          </p>
          <Link href="/">
            <Button className="btn-primary">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white cursor-pointer hover:text-red-500">
              Garagem do Frank
            </h1>
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-gray-300">
              {user?.name} • <span className="text-red-500 font-bold">{member.tier?.toUpperCase()}</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Block Message */}
      {blockMessage && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 text-center">
          {blockMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-white mb-12">Conteúdo Exclusivo para Membros</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="glass-card p-0 overflow-hidden">
              <div className="video-player relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
                {showPrank ? (
                  <iframe
                    ref={iframeRef}
                    src={PRANK_VIDEO}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={YOUTUBE_VIDEOS[selectedVideo]}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="p-6 bg-slate-900">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {showPrank ? "🎬 Você foi pegado!" : `Vídeo ${selectedVideo + 1}`}
                </h3>
                <p className="text-gray-400">
                  {showPrank
                    ? "Tentou burlar o sistema? Aqui está seu prêmio! 😄"
                    : "Conteúdo exclusivo para membros da Garagem do Frank"}
                </p>
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="glass-card">
            <h3 className="text-xl font-bold text-white mb-4">Playlist</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {YOUTUBE_VIDEOS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedVideo(index);
                    setShowPrank(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedVideo === index
                      ? "bg-red-600 text-white"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span>Vídeo {index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card">
            <h4 className="text-lg font-bold text-white mb-2">Seu Plano</h4>
            <p className="text-gray-300 text-2xl font-bold text-red-500">
              {member.tier?.toUpperCase()}
            </p>
          </div>
          <div className="glass-card">
            <h4 className="text-lg font-bold text-white mb-2">Membro Desde</h4>
            <p className="text-gray-300">
              {new Date(member.joinedAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="glass-card">
            <h4 className="text-lg font-bold text-white mb-2">Status</h4>
            <p className="text-green-400 font-bold">✓ Ativo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
