# Guia de Migração: Garagem do Frank - Do GitHub Pages para Full-Stack

## Visão Geral

Seu site foi transformado de um **projeto estático HTML** hospedado no GitHub Pages para uma **aplicação web full-stack moderna** com autenticação, banco de dados e área de membros exclusiva. Este guia orienta você através de cada etapa da migração.

---

## 📋 Pré-Requisitos

Antes de começar, você precisará de:

- **Node.js 18+** instalado em sua máquina local
- **pnpm** (gerenciador de pacotes) - instale com `npm install -g pnpm`
- **Git** para versionamento
- **Conta Manus** para hospedagem (recomendado) ou alternativas como Railway, Render, Vercel
- **Domínio personalizado** (seu `frankturbo-br.com.br` via Registro.br)

---

## 🚀 Passo 1: Configuração Local

### 1.1 Clonar o Novo Repositório

```bash
git clone https://github.com/seu-usuario/frankturbo-br-fullstack.git
cd frankturbo-br-fullstack
```

### 1.2 Instalar Dependências

```bash
pnpm install
```

### 1.3 Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=mysql://usuario:senha@host:porta/banco_dados

# OAuth (Manus)
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Owner Info
OWNER_NAME=Frank
OWNER_OPEN_ID=seu_open_id

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
```

### 1.4 Executar Localmente

```bash
pnpm dev
```

Acesse `http://localhost:3000` no navegador.

---

## 📦 Passo 2: Estrutura do Projeto

A nova estrutura é organizada da seguinte forma:

```
frankturbo-br-fullstack/
├── client/                    # Frontend React
│   ├── public/               # Arquivos estáticos
│   │   └── assets/          # Logos, imagens, rádio MP3s
│   └── src/
│       ├── pages/           # Páginas (Home, Members, NotFound)
│       ├── components/      # Componentes reutilizáveis (RadioPlayer)
│       ├── lib/            # Configurações (tRPC client)
│       └── App.tsx         # Rotas principais
├── server/                   # Backend Express + tRPC
│   ├── routers.ts          # Definição de rotas (videos, members, auth)
│   ├── db.ts               # Helpers de banco de dados
│   └── _core/              # Infraestrutura (OAuth, context, etc)
├── drizzle/                 # Banco de dados
│   └── schema.ts           # Tabelas (users, videos, members, logs)
├── storage/                 # S3 helpers (para upload de arquivos)
└── package.json            # Dependências
```

---

## 🔐 Passo 3: Configuração de Segurança

### 3.1 HTTPS e Certificado SSL

Para resolver o aviso de "site não seguro", você precisa de HTTPS. Se usar Manus:

- Manus fornece certificado SSL automaticamente
- Seu domínio será `seu-projeto.manus.space`
- Para domínio personalizado, configure no painel Manus

Se usar outra plataforma (Railway, Render, Vercel):

- Elas fornecem HTTPS gratuito automaticamente
- Configure seu domínio personalizado nas configurações

### 3.2 Proteção de Dados Sensíveis

**Nunca** commite arquivos `.env` ou `.env.local`:

```bash
# Adicione ao .gitignore (já incluído)
.env
.env.local
.env.*.local
```

### 3.3 Proteção Anti-Hack na Área de Membros

A área de membros implementa várias camadas de proteção:

| Proteção | Implementação | Resultado |
|----------|---------------|-----------|
| **Bloqueio de Inspect** | Detecta F12, Ctrl+Shift+I | Mostra vídeo de zoação |
| **Bloqueio de Context Menu** | Desabilita clique direito no player | Impede cópia de links |
| **Verificação de Autenticação** | Requer login e membresia ativa | Acesso negado sem credenciais |
| **Logging de Tentativas** | Registra todas as tentativas de acesso | Auditoria de segurança |

---

## 🎥 Passo 4: Adicionar Seus Vídeos Privados

### 4.1 Substituir Links de Teste

No arquivo `client/src/pages/Members.tsx`, encontre:

```typescript
const YOUTUBE_VIDEOS = [
  "https://www.youtube.com/embed/tmjy_DEl-K0",  // Substitua por seu vídeo
  "https://www.youtube.com/embed/tmjy_DEl-K0",  // Substitua por seu vídeo
  // ... mais 8 vídeos
];
```

Para cada vídeo do YouTube que deseja adicionar:

1. Abra o vídeo no YouTube
2. Copie o ID do vídeo da URL (ex: `dQw4w9WgXcQ` de `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Substitua o link: `https://www.youtube.com/embed/SEU_ID_AQUI`

### 4.2 Vídeo de "Pegadinha Anti-Hack"

Altere também o vídeo de zoação em `Members.tsx`:

```typescript
const PRANK_VIDEO = "https://www.youtube.com/embed/SEU_VIDEO_ZOACAO";
```

---

## 🎵 Passo 5: Configurar Rádio LIL FRANK

### 5.1 Adicionar Músicas MP3

Coloque seus arquivos MP3 em:

```
client/public/assets/radio/
├── musica1.mp3
├── musica2.mp3
├── ... (até musica12.mp3)
```

Os nomes devem ser exatamente `musica1.mp3` até `musica12.mp3`.

### 5.2 Verificar Carregamento

O rádio carregará automaticamente as músicas. Se não aparecer, verifique:

- Arquivos estão em `client/public/assets/radio/`
- Nomes dos arquivos são exatamente `musica1.mp3`, `musica2.mp3`, etc
- Formato é MP3 válido

---

## 🗄️ Passo 6: Banco de Dados

### 6.1 Criar Banco de Dados

Se usar MySQL/TiDB:

```sql
CREATE DATABASE frankturbo_br;
CREATE USER 'frank'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON frankturbo_br.* TO 'frank'@'localhost';
FLUSH PRIVILEGES;
```

### 6.2 Aplicar Migrações

```bash
pnpm db:push
```

Isso criará automaticamente as tabelas:
- `users` - Usuários autenticados
- `videos` - Vídeos públicos e privados
- `members` - Status de membresia
- `videoAccessLogs` - Logs de acesso

---

## 👥 Passo 7: Gerenciar Membros

### 7.1 Promover Usuário a Admin

Acesse o banco de dados e execute:

```sql
UPDATE users SET role = 'admin' WHERE openId = 'seu_open_id';
```

### 7.2 Criar Membro

Após um usuário fazer login, crie um registro de membro:

```sql
INSERT INTO members (userId, tier, isActive) 
VALUES (1, 'premium', 1);
```

Tiers disponíveis: `basic`, `premium`, `vip`

---

## 🚢 Passo 8: Deployment

### Opção A: Manus (Recomendado)

1. Crie uma conta em [manus.im](https://manus.im)
2. Conecte seu repositório GitHub
3. Configure variáveis de ambiente no painel
4. Clique em "Deploy"
5. Configure domínio personalizado nas configurações

### Opção B: Railway

1. Crie conta em [railway.app](https://railway.app)
2. Conecte GitHub
3. Configure `DATABASE_URL` e outras variáveis
4. Deploy automático

### Opção C: Render

1. Crie conta em [render.com](https://render.com)
2. Novo "Web Service" do GitHub
3. Configure variáveis de ambiente
4. Deploy automático

### Opção D: Vercel + Servidor Separado

1. Deploy frontend no Vercel
2. Deploy backend em Railway/Render
3. Configure `VITE_FRONTEND_FORGE_API_URL` para apontar ao backend

---

## 🔄 Passo 9: Migrar do GitHub Pages

### 9.1 Atualizar Domínio

Se seu domínio está apontando para GitHub Pages, altere os registros DNS:

**Antiga configuração (GitHub Pages):**
```
A    185.199.108.153
A    185.199.109.153
A    185.199.110.153
A    185.199.111.153
```

**Nova configuração (Manus/Railway/Render):**
- Manus: `CNAME seu-projeto.manus.space`
- Railway: `CNAME seu-projeto.railway.app`
- Render: `CNAME seu-projeto.onrender.com`

Consulte seu provedor de domínio (Registro.br) para instruções específicas.

### 9.2 Desativar GitHub Pages

1. Vá para Settings do repositório
2. Desça até "GitHub Pages"
3. Mude "Source" para "None"

---

## 📝 Passo 10: Manutenção

### 10.1 Backup do Banco de Dados

```bash
# MySQL
mysqldump -u frank -p frankturbo_br > backup.sql

# Restaurar
mysql -u frank -p frankturbo_br < backup.sql
```

### 10.2 Atualizar Dependências

```bash
pnpm update
```

### 10.3 Monitorar Logs

Verifique logs de erro no painel da sua plataforma de hospedagem.

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| **"Site não seguro"** | Verifique se está usando HTTPS. Configure SSL no painel. |
| **Rádio não toca** | Verifique se arquivos MP3 estão em `client/public/assets/radio/` |
| **Vídeos não carregam** | Verifique IDs do YouTube. Teste links no navegador. |
| **Erro de autenticação** | Verifique `VITE_APP_ID` e `OAUTH_SERVER_URL` em `.env` |
| **Banco de dados vazio** | Execute `pnpm db:push` para criar tabelas |
| **Erro 404 em páginas** | Verifique rotas em `client/src/App.tsx` |

---

## 📞 Suporte

Para dúvidas sobre:

- **Manus**: https://help.manus.im
- **Railway**: https://railway.app/support
- **Render**: https://render.com/support
- **Vercel**: https://vercel.com/support

---

## ✅ Checklist de Migração

- [ ] Dependências instaladas (`pnpm install`)
- [ ] Variáveis de ambiente configuradas (`.env.local`)
- [ ] Banco de dados criado e migrações aplicadas (`pnpm db:push`)
- [ ] Rádio com 12 músicas MP3 em `client/public/assets/radio/`
- [ ] Vídeos YouTube substituídos em `Members.tsx`
- [ ] Vídeo de zoação configurado
- [ ] Projeto testado localmente (`pnpm dev`)
- [ ] Testes passando (`pnpm test`)
- [ ] Domínio DNS atualizado
- [ ] Projeto deployado em produção
- [ ] HTTPS funcionando
- [ ] Autenticação testada
- [ ] Área de membros acessível

---

## 🎉 Próximos Passos

Após a migração bem-sucedida:

1. **Promova-se a Admin** para gerenciar membros
2. **Crie membros de teste** para validar acesso
3. **Teste a proteção anti-hack** (F12, clique direito)
4. **Configure analytics** para monitorar uso
5. **Divulgue para seus inscritos** do YouTube

Bem-vindo ao futuro da Garagem do Frank! 🚀
