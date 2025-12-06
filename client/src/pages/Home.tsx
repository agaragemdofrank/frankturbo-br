import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Zap, Users, Music, Shield } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white">Garagem do Frank</h1>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300">Bem-vindo, {user?.name}!</span>
                <Link href="/members">
                  <Button className="btn-primary">Minha Área</Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="btn-primary">Entrar</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-glow">
            Bem-vindo à Garagem do Frank
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Sua central de performance automotiva, estilo e conteúdo exclusivo para membros.
            Turbo, rádio e muito mais!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {!isAuthenticated && (
              <>
                <a href={getLoginUrl()}>
                  <Button className="btn-primary">Começar Agora</Button>
                </a>
                <Button className="btn-secondary">Saiba Mais</Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-center text-white mb-16">
          O que você encontra aqui
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="glass-card">
            <Music className="w-12 h-12 text-red-500 mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Rádio LIL FRANK</h4>
            <p className="text-gray-400">
              Ouça as melhores músicas de rap com a playlist exclusiva do LIL FRANK, sempre tocando.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card">
            <Zap className="w-12 h-12 text-red-500 mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Turbo Performance</h4>
            <p className="text-gray-400">
              Conteúdo exclusivo sobre performance automotiva, ajustes e modificações.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card">
            <Users className="w-12 h-12 text-red-500 mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Área de Membros</h4>
            <p className="text-gray-400">
              Acesso a vídeos privados, conteúdo exclusivo e comunidade de fãs.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card">
            <Shield className="w-12 h-12 text-red-500 mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Seguro e Privado</h4>
            <p className="text-gray-400">
              Seus dados protegidos com as melhores práticas de segurança.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-800/50 rounded-lg p-12">
          <h3 className="text-3xl font-bold text-white mb-4">Pronto para entrar?</h3>
          <p className="text-gray-300 mb-8">
            Junte-se à comunidade e tenha acesso a conteúdo exclusivo, vídeos privados e muito mais.
          </p>
          {!isAuthenticated && (
            <a href={getLoginUrl()}>
              <Button className="btn-primary">Criar Conta Agora</Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 Garagem do Frank. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Acelerando o Rap Nacional 🔥</p>
        </div>
      </footer>
    </div>
  );
}
