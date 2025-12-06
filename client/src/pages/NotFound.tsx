import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="w-full max-w-lg mx-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/20 rounded-full animate-pulse" />
            <AlertCircle className="relative h-16 w-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-white mb-2">404</h1>

        <h2 className="text-2xl font-bold text-white mb-4">
          Página não encontrada
        </h2>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Desculpe, a página que você procura não existe.
          <br />
          Pode ter sido movida ou deletada.
        </p>

        <Button
          onClick={handleGoHome}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Voltar para Home
        </Button>
      </div>
    </div>
  );
}
