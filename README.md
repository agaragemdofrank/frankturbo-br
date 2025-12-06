# Garagem do Frank - Turbo & Performance

Uma plataforma web full-stack moderna com área de membros exclusiva, vídeos privados, rádio interativa e proteção anti-hack.

## 🎯 Características

- **Autenticação OAuth** integrada com Manus
- **Área de Membros** com acesso a vídeos exclusivos do YouTube
- **Rádio Interativa** com playlist do LIL FRANK (12 músicas)
- **Proteção Anti-Hack** contra inspect element e cópia de links
- **Banco de Dados** MySQL/TiDB com Drizzle ORM
- **Backend tRPC** para comunicação type-safe
- **Frontend React 19** com Tailwind CSS 4
- **Testes Vitest** para validação de funcionalidades
- **Design Dark Premium** com tema customizado

## 🚀 Quick Start

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/frankturbo-br-fullstack.git
cd frankturbo-br-fullstack

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Aplicar migrações do banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000` no navegador.

### Desenvolvimento

```bash
# Executar testes
pnpm test

# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

## 📁 Estrutura do Projeto

```
├── client/                 # Frontend React + Vite
│   ├── public/            # Arquivos estáticos (assets, rádio MP3s)
│   ├── src/
│   │   ├── pages/         # Páginas (Home, Members, NotFound)
│   │   ├── components/    # Componentes (RadioPlayer, etc)
│   │   ├── contexts/      # Contextos React (Theme)
│   │   ├── lib/          # Configurações (tRPC client)
│   │   ├── App.tsx       # Rotas e layout principal
│   │   └── main.tsx      # Entry point
│   └── index.html        # Template HTML
├── server/                # Backend Express + tRPC
│   ├── routers.ts        # Definição de rotas tRPC
│   ├── db.ts             # Helpers de banco de dados
│   └── _core/            # Infraestrutura (OAuth, context, etc)
├── drizzle/              # Banco de dados
│   ├── schema.ts         # Definição de tabelas
│   └── migrations/       # Histórico de migrações
├── storage/              # S3 helpers
├── shared/               # Código compartilhado
├── MIGRATION_GUIDE.md    # Guia de migração do GitHub Pages
└── package.json          # Dependências e scripts
```

## 🗄️ Banco de Dados

### Tabelas

- **users** - Usuários autenticados via OAuth
- **videos** - Vídeos públicos e privados
- **members** - Status de membresia dos usuários
- **videoAccessLogs** - Logs de tentativas de acesso

### Migrações

```bash
# Gerar nova migração após alterar schema.ts
pnpm db:push

# Ver histórico de migrações
ls drizzle/migrations/
```

## 🔐 Segurança

### Autenticação

- OAuth 2.0 via Manus
- JWT para sessões
- Cookies HTTP-only

### Proteção da Área de Membros

- Bloqueio de F12 (Inspect Element)
- Bloqueio de Ctrl+Shift+I
- Bloqueio de clique direito no player
- Redirecionamento para vídeo de zoação ao tentar burlar
- Logging de todas as tentativas de acesso

### Variáveis de Ambiente

Nunca commite `.env` ou `.env.local`:

```bash
# .gitignore (já configurado)
.env
.env.local
.env.*.local
```

## 📝 Configuração

### Variáveis Obrigatórias

```env
# Database
DATABASE_URL=mysql://usuario:senha@host:porta/banco

# OAuth
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# JWT
JWT_SECRET=sua_chave_secreta

# Owner
OWNER_NAME=Frank
OWNER_OPEN_ID=seu_open_id
```

### Variáveis Opcionais

```env
# Manus APIs (fornecidas automaticamente)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave

# Analytics
VITE_ANALYTICS_ENDPOINT=seu_endpoint
VITE_ANALYTICS_WEBSITE_ID=seu_id
```

## 🎥 Adicionar Vídeos

### Substituir Links de Teste

Em `client/src/pages/Members.tsx`:

```typescript
const YOUTUBE_VIDEOS = [
  "https://www.youtube.com/embed/SEU_ID_1",
  "https://www.youtube.com/embed/SEU_ID_2",
  // ... até 10 vídeos
];
```

### Vídeo de Zoação

```typescript
const PRANK_VIDEO = "https://www.youtube.com/embed/SEU_VIDEO_ZOACAO";
```

## 🎵 Configurar Rádio

Coloque 12 arquivos MP3 em:

```
client/public/assets/radio/
├── musica1.mp3
├── musica2.mp3
├── ... (até musica12.mp3)
```

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test -- --watch

# Executar teste específico
pnpm test -- videos.test.ts
```

### Cobertura de Testes

- ✅ Autenticação (login/logout)
- ✅ Rotas de vídeos (list, getById)
- ✅ Proteção de acesso (membros vs públicos)
- ✅ Logs de acesso

## 🚢 Deployment

### Manus (Recomendado)

1. Crie conta em [manus.im](https://manus.im)
2. Conecte seu repositório GitHub
3. Configure variáveis de ambiente
4. Deploy automático

### Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render

1. Crie conta em [render.com](https://render.com)
2. Novo "Web Service" do GitHub
3. Configure variáveis de ambiente
4. Deploy automático

## 📚 Documentação

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guia completo de migração do GitHub Pages
- **[Manus Docs](https://help.manus.im)** - Documentação da plataforma
- **[tRPC Docs](https://trpc.io)** - Documentação do tRPC
- **[Drizzle Docs](https://orm.drizzle.team)** - Documentação do Drizzle ORM

## 🆘 Troubleshooting

### Erro: "Site não seguro"

Verifique se está usando HTTPS. Configure SSL no painel de hospedagem.

### Rádio não toca

Verifique se arquivos MP3 estão em `client/public/assets/radio/` com nomes corretos.

### Vídeos não carregam

Verifique IDs do YouTube. Teste links diretamente no navegador.

### Erro de autenticação

Verifique `VITE_APP_ID` e `OAUTH_SERVER_URL` em `.env.local`.

### Banco de dados vazio

Execute `pnpm db:push` para criar tabelas.

## 📞 Suporte

- **Issues**: Abra uma issue no GitHub
- **Manus Help**: https://help.manus.im
- **Email**: seu-email@example.com

## 📄 Licença

MIT - Veja LICENSE para detalhes

---

**Garagem do Frank - Acelerando o Rap Nacional 🔥**
