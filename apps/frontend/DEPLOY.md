# 🚀 Deploy Frontend no Vercel

## ❓ Preciso de Docker?

**NÃO!** O Vercel cuida de tudo automaticamente. Você só precisa conectar seu GitHub e pronto. Docker **não é necessário**.

---

## 📋 Pré-requisitos

- Conta gratuita no GitHub (já tem ✓)
- Conta gratuita no Vercel
- Backend já deployado no Render (com URL da API)
- Código enviado para GitHub (já feito ✓)

---

## 🌐 PASSO 1: Preparar o Código

### 1.1 Atualizar URL da API

Antes de fazer deploy, atualize a URL da API de produção:

1. Abra o arquivo: `src/environments/environment.prod.ts`

2. Substitua a URL pelo endereço do seu backend no Render:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://basic-studio-api.onrender.com/api",
};
```

**⚠️ IMPORTANTE:** Use a URL exata do seu backend Render (copie do dashboard do Render)

3. Commit e push:

```bash
git add src/environments/environment.prod.ts
git commit -m "Update production API URL"
git push
```

---

## 🎨 PASSO 2: Deploy no Vercel

### 2.1 Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (recomendado)
4. Autorize o Vercel a acessar seus repositórios GitHub
5. Clique em **"Authorize Vercel"**

### 2.2 Importar Projeto

1. No Dashboard do Vercel, clique em **"Add New..."**
2. Selecione **"Project"**
3. Você verá seus repositórios GitHub
   - Se não aparecer, clique em **"Adjust GitHub App Permissions"**
   - Selecione o repositório `basic_frontend`
4. Encontre: **`dieegoolimaa/basic_frontend`**
5. Clique em **"Import"**

### 2.3 Configurar o Projeto

**Framework Preset:**

```
Angular
```

(O Vercel detecta automaticamente, mas confirme)

**Project Name:**

```
basic-studio
```

(ou o nome que preferir - isso será parte da URL)

**Root Directory:**

```
./
```

(deixe como está)

**Build and Output Settings:**

Clique em **"Override"** se necessário e configure:

- **Build Command:**

  ```
  npm run build
  ```

- **Output Directory:**

  ```
  dist/basic-frontend/browser
  ```

  **⚠️ IMPORTANTE:** Para Angular 18+, o output está em `/browser`

- **Install Command:**
  ```
  npm install
  ```

### 2.4 Environment Variables (Opcional)

Por enquanto, não precisa adicionar variáveis. Clique em **"Deploy"**

### 2.5 Deploy!

1. Clique em **"Deploy"**
2. Aguarde o build (3-5 minutos)
3. Você verá:
   - **Building...** (instalando dependências)
   - **Compiling...** (compilando Angular)
   - **Deploying...** (enviando para CDN)
4. Quando aparecer **"Congratulations! 🎉"**, está pronto!

### 2.6 Acessar sua Aplicação

1. Copie a URL que aparece (ex: `https://basic-studio.vercel.app`)
2. Clique em **"Visit"** ou acesse a URL
3. Você deve ver sua aplicação funcionando!

---

## 🔗 PASSO 3: Conectar Backend e Frontend

### 3.1 Atualizar CORS no Backend

Agora que você tem a URL do Vercel, precisa permitir que o frontend acesse a API:

1. **No seu computador**, abra: `basic_backend/src/main.ts`

2. Encontre a seção `enableCors` e adicione a URL do Vercel:

```typescript
app.enableCors({
  origin: [
    "http://localhost:4200",
    "https://basic-studio.vercel.app", // ← Adicione sua URL aqui
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});
```

3. Commit e push:

```bash
cd basic_backend
git add src/main.ts
git commit -m "Add Vercel URL to CORS"
git push
```

4. O Render vai fazer **redeploy automático** do backend!
5. Aguarde 2-3 minutos para o redeploy concluir

### 3.2 Testar a Integração

1. Acesse sua aplicação no Vercel
2. Tente fazer login com as credenciais padrão:
   - **Email:** `admin@basic.com`
   - **Password:** `admin123`
3. Se funcionar, SUCESSO! 🎉

---

## 🔄 Deploys Futuros (Automático)

Agora, **toda vez** que você fizer `git push` no GitHub:

- ✅ Vercel faz deploy automático do frontend
- ✅ Render faz deploy automático do backend
- ✅ Você não precisa fazer nada!

Para ver os deploys:

- **Frontend:** https://vercel.com/dashboard
- **Backend:** https://dashboard.render.com

---

## 🌍 Domínio Customizado (Opcional)

### Se você tem um domínio próprio:

1. No Vercel, vá em **Settings** → **Domains**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `meusite.com`)
4. Siga as instruções para configurar DNS
5. Aguarde propagação (até 48h, geralmente 1h)

**Não esqueça:**

- Atualize CORS no backend com o novo domínio
- Teste após propagação DNS

---

## ✅ Checklist Final

- [ ] `environment.prod.ts` atualizado com URL do backend
- [ ] Projeto importado no Vercel
- [ ] Build concluído com sucesso
- [ ] Aplicação acessível via URL do Vercel
- [ ] CORS do backend atualizado com URL do Vercel
- [ ] Login funcionando corretamente
- [ ] Upload de arquivos testado

---

## 🐛 Troubleshooting (Problemas Comuns)

### Erro 404 ao recarregar a página

**Causa:** SPA routing não configurado

**Solução:**

1. Verifique se existe `vercel.json` na raiz do projeto
2. Conteúdo deve ser:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

3. Commit e push se não existir

### Build falha: "Output directory not found"

**Causa:** Caminho de output incorreto

**Solução:**

1. No Vercel, vá em **Settings** → **General**
2. Em **Build & Development Settings**
3. Output Directory: `dist/basic-frontend/browser`
4. Trigger redeploy

### CORS Error no browser

**Causa:** Backend não permite acesso do Vercel

**Solução:**

1. Abra console do browser (F12)
2. Copie a URL exata do erro CORS
3. Adicione essa URL no `main.ts` do backend
4. Commit e push backend

### Login não funciona / Token inválido

**Causa:** URL da API incorreta em `environment.prod.ts`

**Solução:**

1. Verifique a URL em `environment.prod.ts`
2. Deve terminar com `/api` (sem barra final)
3. Exemplo correto: `https://seu-app.onrender.com/api`
4. Commit, push e aguarde redeploy

### Aplicação carrega muito devagar

**Causa:** Backend no Render "dormiu" (free tier)

**Solução:**

- Primeira requisição após 15min sempre demora
- É comportamento normal do plano free
- Aguarde 30-60 segundos
- Use UptimeRobot para pingar a cada 5min (opcional)

---

## 📊 Preview Deployments

O Vercel cria **preview deployments** automáticos para cada Pull Request:

1. Crie uma branch: `git checkout -b nova-feature`
2. Faça alterações e commit
3. Push: `git push origin nova-feature`
4. Abra Pull Request no GitHub
5. Vercel cria URL de preview automático!
6. Teste antes de fazer merge

---

## 💰 Custos

- **Vercel Hobby (Free):** R$ 0,00/mês
  - 100GB bandwidth
  - Deployments ilimitados
  - HTTPS automático
  - CDN global
  - Domínio customizado (1 por projeto)

**Limitações:**

- Máximo de 100GB/mês de bandwidth
- Execução: 100h/mês
- Suficiente para maioria dos projetos pessoais

**Quando atualizar?**

- Tráfego > 100GB/mês → Vercel Pro $20/mês
- Precisa de analytics avançado
- Precisa de mais domínios customizados

---

## 🔐 Segurança

1. Vercel adiciona **HTTPS automático** (SSL/TLS)
2. CDN global protege contra DDoS básico
3. Variáveis de ambiente são **privadas**
4. Nunca commite senhas ou secrets no código

---

## 🆘 Precisa de Ajuda?

1. **Build Logs:** Veja erros detalhados no Vercel
2. **Runtime Logs:** Vá em "Functions" → "Logs"
3. **Vercel Docs:** https://vercel.com/docs
4. **GitHub Issues:** Abra issue no repositório

---

## 🎯 Próximos Passos

1. [ ] Configure domínio customizado (opcional)
2. [ ] Configure analytics do Vercel
3. [ ] Teste em diferentes dispositivos
4. [ ] Compartilhe com amigos! 🎉
