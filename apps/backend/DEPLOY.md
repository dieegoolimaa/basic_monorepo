# 🚀 Deploy Backend no Render.com

## ❓ Preciso de Docker?

**NÃO!** O Render.com já possui Node.js instalado e cuida de todo o ambiente para você. Docker é **opcional** e não é necessário para este deploy.

---

## 📋 Pré-requisitos

- Conta gratuita no GitHub (já tem ✓)
- Conta gratuita no Render.com
- Conta gratuita no MongoDB Atlas
- Código enviado para GitHub (já feito ✓)

---

## 🗄️ PASSO 1: Configurar MongoDB Atlas (Banco de Dados Gratuito)

### 1.1 Criar Conta e Organização

1. Acesse: https://cloud.mongodb.com
2. Clique em **"Try Free"** ou **"Sign Up"**
3. Crie conta com:
   - Email e senha, OU
   - Login com Google/GitHub
4. Preencha o formulário inicial:
   - **Goal:** Aprenda e explore
   - **Experience:** Iniciante (ou sua preferência)
5. Clique em **"Finish"**

### 1.2 Criar Cluster Gratuito (M0)

1. Você será levado para a tela de criação de cluster
2. Selecione o plano **M0 (FREE)**
   - Storage: 512MB
   - Shared RAM
   - **CUSTO: R$ 0,00**
3. Escolha a região:
   - **Provider:** AWS (recomendado)
   - **Region:** São Paulo (sa-east-1) ou Virginia (us-east-1)
4. **Cluster Name:** deixe como está ou mude para `basic-studio`
5. Clique em **"Create Deployment"**
6. Aguarde 3-5 minutos para criação

### 1.3 Criar Usuário do Banco de Dados

Após criar o cluster, você verá uma tela de segurança:

1. **Username:** escolha um nome (ex: `admin`)
2. **Password:** escolha uma senha FORTE
   - ⚠️ **IMPORTANTE:** Anote esta senha! Você vai precisar dela.
   - Evite caracteres especiais como `@`, `#`, `/` na senha
3. Clique em **"Create Database User"**

### 1.4 Configurar Acesso de Rede (Whitelist)

Ainda na mesma tela de segurança:

1. Em **"Where would you like to connect from?"**
2. Selecione **"Cloud Environment"**
3. Clique em **"Add IP Address"**
4. Digite: `0.0.0.0/0`
   - Isso permite acesso de qualquer IP (necessário para Render)
5. Clique em **"Add Entry"**
6. Clique em **"Finish and Close"**

### 1.5 Obter String de Conexão

1. Na dashboard do cluster, clique em **"Connect"**
2. Escolha **"Drivers"**
3. Selecione:
   - **Driver:** Node.js
   - **Version:** 6.7 ou superior
4. Copie a connection string que aparece:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. **EDITE a string:**
   - Substitua `<username>` pelo usuário que criou
   - Substitua `<password>` pela senha que criou
   - Exemplo final:

   ```
   mongodb+srv://admin:MinhaSenh@123@cluster0.xxxxx.mongodb.net/basic_studio?retryWrites=true&w=majority
   ```

6. **SALVE** esta string! Você vai usar no Render.

---

## 🌐 PASSO 2: Deploy no Render.com

### 2.1 Criar Conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started"**
3. Faça login com **GitHub** (recomendado)
4. Autorize o Render a acessar seus repositórios

### 2.2 Criar Web Service

1. No Dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Você verá seus repositórios GitHub
   - Se não aparecer, clique em **"Configure account"**
   - Autorize acesso ao repositório `basic_backend`
4. Encontre e selecione: **`dieegoolimaa/basic_backend`**
5. Clique em **"Connect"**

### 2.3 Configurar o Web Service

Preencha os campos:

**Name:**

```
basic-studio-api
```

(ou qualquer nome que preferir)

**Region:**

```
Oregon (US West) ou Frankfurt (Europe Central)
```

(escolha o mais próximo dos seus usuários)

**Branch:**

```
main
```

**Root Directory:**

```
(deixe em branco)
```

**Runtime:**

```
Node
```

**Build Command:**

```
npm install && npm run build
```

**Start Command:**

```
npm run start:prod
```

### 2.4 Escolher Plano

1. Role a página até **"Instance Type"**
2. Selecione: **Free** (R$ 0,00/mês)
   - ⚠️ Limitações do plano free:
   - Dorme após 15min de inatividade
   - 512MB RAM
   - CPU compartilhada
   - Primeira requisição após sleep: 30-60 segundos

### 2.5 Configurar Variáveis de Ambiente

Role até **"Environment Variables"** e clique em **"Add Environment Variable"**

Adicione **CADA UMA** destas variáveis:

**1. MONGODB_URI**

```
Key: MONGODB_URI
Value: mongodb+srv://admin:suasenha@cluster0.xxxxx.mongodb.net/basic_studio?retryWrites=true&w=majority
```

(cole a string que você salvou do MongoDB Atlas)

**2. JWT_SECRET**

```
Key: JWT_SECRET
Value: meu-super-segredo-jwt-2024-basic-studio-xyz
```

(crie uma string aleatória e longa - pode usar geradores online)

**3. JWT_EXPIRES_IN**

```
Key: JWT_EXPIRES_IN
Value: 7d
```

**4. NODE_ENV**

```
Key: NODE_ENV
Value: production
```

**5. PORT**

```
Key: PORT
Value: 3000
```

**6. FRONTEND_URL** (vamos atualizar depois)

```
Key: FRONTEND_URL
Value: http://localhost:4200
```

### 2.6 Deploy!

1. Role até o final da página
2. Clique em **"Create Web Service"**
3. Aguarde o build (5-10 minutos na primeira vez)
4. Você verá logs em tempo real
5. Quando ver **"Your service is live 🎉"**, está pronto!

### 2.7 Testar a API

1. Copie a URL do seu serviço (ex: `https://basic-studio-api.onrender.com`)
2. Acesse no navegador:
   ```
   https://basic-studio-api.onrender.com/api/docs
   ```
3. Você deve ver a documentação Swagger!

---

## 🔄 PASSO 3: Atualizar CORS (Depois de Deploy do Frontend)

### 4. Deploy

- Click "Create Web Service"
- Wait for deployment to complete
- Your API will be available at: `https://your-service-name.onrender.com/api`

### Important Notes:

- Free tier on Render spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for production use
- Update CORS settings in main.ts with your frontend URL

### CORS Configuration

After deployment, update `src/main.ts`:

```typescript
app.enableCors({
  origin: ['http://localhost:4200', 'https://your-frontend-url.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});
```

Depois de fazer o deploy do frontend, volte aqui e:

1. Edite `src/main.ts` no seu código local
2. Na seção `enableCors`, adicione a URL do Vercel:

```typescript
app.enableCors({
  origin: [
    'http://localhost:4200',
    'https://seu-app.vercel.app'  // ← URL do seu frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});
```

3. Commit e push:
```bash
git add src/main.ts
git commit -m "Update CORS for production frontend"
git push
```

4. O Render vai fazer redeploy automaticamente!

---

## ✅ Checklist Final

- [ ] MongoDB Atlas criado e configurado
- [ ] String de conexão salva
- [ ] Render Web Service criado
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Deploy concluído com sucesso
- [ ] Swagger acessível em `/api/docs`
- [ ] CORS atualizado com URL do frontend (após deploy frontend)

---

## 🐛 Troubleshooting (Problemas Comuns)

### Erro: "Application failed to respond"

**Causa:** Variáveis de ambiente incorretas ou MongoDB não acessível

**Solução:**
1. Verifique os logs no Render
2. Confirme MONGODB_URI está correto
3. Confirme que IP 0.0.0.0/0 está whitelisted no MongoDB Atlas

### Erro: "Connection refused" no MongoDB

**Causa:** String de conexão incorreta

**Solução:**
1. Verifique usuário e senha na string
2. Confirme que substituiu `<username>` e `<password>`
3. Teste a conexão no MongoDB Compass localmente primeiro

### Build falha com "npm ERR!"

**Causa:** Dependências desatualizadas ou node version incompatível

**Solução:**
1. No Render, vá em Settings
2. Adicione variável: `NODE_VERSION` = `18.x`
3. Trigger manual redeploy

### API muito lenta após inatividade

**Causa:** Free tier do Render "dorme" após 15 minutos

**Solução:**
- É comportamento normal do plano free
- Use serviços como UptimeRobot para pingar a cada 5 minutos (opcional)
- Ou upgrade para plano pago ($7/mês)

---

## 🔐 Segurança em Produção

1. **Nunca** compartilhe suas variáveis de ambiente
2. Use senhas **fortes** no MongoDB
3. Gere JWT_SECRET **aleatório** e longo
4. Mantenha CORS restrito apenas ao seu frontend
5. Ative 2FA no MongoDB Atlas e Render

---

## 💰 Custos

- **Render Free Tier:** R$ 0,00/mês
- **MongoDB Atlas M0:** R$ 0,00/mês
- **Total:** R$ 0,00/mês

**Limitações:**
- Render: Sleep após inatividade, 512MB RAM
- MongoDB: 512MB storage, conexões limitadas

**Quando atualizar?**
- App com tráfego constante → Render $7/mês
- Mais de 512MB de dados → MongoDB $9/mês

---

## 🆘 Precisa de Ajuda?

1. **Logs do Render:** Vá em "Logs" no dashboard para ver erros
2. **MongoDB Metrics:** Veja uso de storage e conexões
3. **Swagger Docs:** Teste endpoints em `/api/docs`
4. **GitHub Issues:** Abra uma issue no repositório
