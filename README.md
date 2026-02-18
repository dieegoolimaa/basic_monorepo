# 🎓 Basic Studio — Monorepo

> Plataforma de cursos online premium com frontend Angular e backend NestJS, gerida num monorepo com **Turborepo**.

---

## 📁 Estrutura

```
basic_monorepo/
├── apps/
│   ├── backend/      ← NestJS API (porta 3000)
│   └── frontend/     ← Angular SPA (porta 4200)
├── turbo.json        ← Configuração do Turborepo
├── render.yaml       ← Blueprint de deploy no Render
├── package.json      ← Root workspace
└── .gitignore
```

## 🚀 Quick Start

### Pré-requisitos
- **Node.js** ≥ 18
- **npm** ≥ 10

### Instalação
```bash
# Clona o monorepo
git clone https://github.com/dieegoolimaa/basic_monorepo.git
cd basic_monorepo

# Instala tudo (turbo + todas as dependências dos apps)
npm install
```

### Desenvolvimento
```bash
# Inicia ambos os apps em paralelo
npm run dev

# Ou individualmente:
npm run dev:backend    # NestJS em http://localhost:3000
npm run dev:frontend   # Angular em http://localhost:4200
```

### Build
```bash
# Build de tudo (com cache do Turbo)
npm run build

# Ou individualmente:
npm run build:backend
npm run build:frontend
```

---

## 🌐 Deploy no Render

Este monorepo usa um **Blueprint** (`render.yaml`) que provisiona ambos os serviços automaticamente.

### Setup Inicial

1. Vai ao [Render Dashboard](https://dashboard.render.com)
2. Clica em **New** → **Blueprint**
3. Conecta o repositório `dieegoolimaa/basic_monorepo`
4. O Render detecta o `render.yaml` e cria:
   - **basic-backend** — Web Service (Node)
   - **basic-frontend** — Static Site

### Variáveis de Ambiente (Backend)

Após o deploy, configura as variáveis marcadas com `sync: false` no painel do Render:

| Variável | Descrição |
|----------|-----------|
| `MONGODB_URI` | Connection string do MongoDB Atlas |
| `JWT_SECRET` | Chave secreta para tokens JWT |
| `FRONTEND_URL` | URL do frontend no Render (ex: `https://basic-frontend-xxx.onrender.com`) |
| `SMTP_USER` | Email para envio SMTP |
| `SMTP_PASS` | App password do Gmail |

### Variáveis de Ambiente (Frontend)

O frontend usa `environment.prod.ts` para definir a URL da API. Actualiza antes do deploy:

```typescript
// apps/frontend/src/environments/environment.prod.ts
export const environment = {
    production: true,
    apiUrl: 'https://SEU-BACKEND.onrender.com/api',
};
```

---

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia backend + frontend em paralelo |
| `npm run build` | Build de produção de ambos |
| `npm run dev:backend` | Apenas o backend em modo watch |
| `npm run dev:frontend` | Apenas o frontend em modo dev |
| `npm run build:backend` | Build de produção do backend |
| `npm run build:frontend` | Build de produção do frontend |
| `npm run clean` | Limpa todos os artefactos de build |

---

## 🏗️ Tecnologias

- **Turborepo** — Orquestração de monorepo com cache inteligente
- **Angular 18** — Frontend SPA com Ng-Zorro
- **NestJS 11** — Backend API REST
- **MongoDB** — Base de dados (via Mongoose)
- **Render** — Hosting (Web Service + Static Site)
