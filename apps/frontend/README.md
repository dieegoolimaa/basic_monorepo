# 🎨 Basic Studio - Frontend

Plataforma web moderna para gestão e consumo de cursos online, construída com Angular 18 e Ng-Zorro.

## 🚀 Tecnologias

- **Angular 18** - Framework web progressivo
- **Ng-Zorro** - Biblioteca de componentes UI baseada em Ant Design
- **TypeScript** - Superset JavaScript com tipagem estática
- **RxJS** - Programação reativa
- **SCSS** - Pré-processador CSS
- **Angular Signals** - Gerenciamento de estado reativo
- **Angular Router** - Roteamento SPA

## 📋 Pré-requisitos

- Node.js >= 18.x
- npm ou yarn
- Angular CLI 18.x

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/dieegoolimaa/basic_frontend.git
cd basic_frontend

# Instale as dependências
npm install

# Instale o Angular CLI globalmente (se não tiver)
npm install -g @angular/cli
```

## ⚙️ Configuração

### Variáveis de Ambiente

Configure a URL da API em `src/environments/`:

**environment.ts** (Desenvolvimento):

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api",
};
```

**environment.prod.ts** (Produção):

```typescript
export const environment = {
  production: true,
  apiUrl: "https://sua-api.com/api",
};
```

## 🏃 Executando o Projeto

```bash
# Desenvolvimento (porta 4200)
ng serve
# ou
npm start

# Build para produção
ng build --configuration production

# Testes
ng test

# Linting
ng lint
```

A aplicação estará disponível em: `http://localhost:4200`

## 🎯 Funcionalidades

### 🌐 Área Pública

- **Home** - Landing page com banners e destaques
- **Lista de Cursos** - Catálogo completo de formações
- **Detalhes do Curso** - Informações completas, módulos e avaliações
- **Login/Registro** - Autenticação com código de convite

### 👨‍🎓 Área do Aluno

- **Dashboard** - Visão geral dos cursos matriculados
- **Player de Curso** - Interface para assistir aulas
  - Vídeos com controles
  - Conteúdo de texto e procedimentos
  - Quizzes interativos
  - Acompanhamento de progresso
- **Avaliações** - Sistema de reviews e ratings

### 👨‍💼 Área Administrativa

- **Gestão de Home** - Upload e gerenciamento de banners
- **Gestão de Cursos** - CRUD completo de cursos
  - Criação de módulos e aulas
  - Upload de vídeos
  - Configuração de quizzes
  - Gerenciamento de conteúdo
- **Gestão de Usuários** - Administração de alunos
  - Criar códigos de convite
  - Atribuir cursos
  - Ativar/desativar contas

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── components/           # Componentes da aplicação
│   │   ├── home/            # Página inicial
│   │   ├── course-list/     # Lista de cursos
│   │   ├── course-detail/   # Detalhes do curso
│   │   ├── course-player/   # Player de vídeo/conteúdo
│   │   ├── login/           # Autenticação
│   │   ├── register/        # Registro de usuário
│   │   ├── student-dashboard/ # Dashboard do aluno
│   │   ├── admin-home-manager/    # Admin - Home
│   │   ├── admin-course-manager/  # Admin - Cursos
│   │   └── admin-user-manager/    # Admin - Usuários
│   ├── layouts/             # Layouts da aplicação
│   │   ├── main-layout/     # Layout público
│   │   └── admin-layout/    # Layout administrativo
│   ├── services/            # Serviços Angular
│   │   ├── api.service.ts   # Serviço HTTP base
│   │   ├── auth.service.ts  # Autenticação
│   │   ├── course.service.ts # Gestão de cursos
│   │   ├── review.service.ts # Avaliações
│   │   └── loading.service.ts # Estado de loading
│   ├── guards/              # Guards de roteamento
│   │   └── auth.guard.ts    # Proteção de rotas
│   ├── interceptors/        # HTTP Interceptors
│   │   ├── error.interceptor.ts    # Tratamento de erros
│   │   └── loading.interceptor.ts  # Loading state
│   ├── models/              # Interfaces TypeScript
│   │   └── index.ts         # Modelos de dados
│   ├── app.routes.ts        # Configuração de rotas
│   └── app.config.ts        # Configuração da aplicação
├── environments/            # Variáveis de ambiente
└── styles.scss             # Estilos globais
```

## 🛣️ Rotas

### Públicas

- `/` - Home
- `/formacoes` - Lista de cursos
- `/formacoes/:id` - Detalhes do curso
- `/login` - Login
- `/registro` - Registro

### Protegidas (Autenticação)

- `/meus-cursos` - Dashboard do aluno
- `/player/:id` - Player de curso

### Administrativas (Admin)

- `/admin/home` - Gestão de home
- `/admin/courses` - Gestão de cursos
- `/admin/users` - Gestão de usuários

## 🔐 Autenticação

O sistema utiliza JWT armazenado em `localStorage`:

```typescript
// Login
authService.login(email, password).subscribe({
  next: (response) => {
    // Token e usuário salvos automaticamente
    router.navigate(["/meus-cursos"]);
  },
});

// Verificar autenticação
const isAuthenticated = authService.isAuthenticated();
const isAdmin = authService.isAdmin();
```

### Guards

- `authGuard` - Protege rotas que requerem autenticação
- `adminGuard` - Protege rotas administrativas
- `guestGuard` - Redireciona usuários logados (login/registro)

## 🎨 UI/UX

### Ng-Zorro Components

- Tables, Modals, Forms
- Messages e Notifications
- Upload de arquivos
- Tabs, Cards, Layouts
- Icons (Ant Design)

### Temas e Estilos

- Design responsivo
- Tema customizável
- Paleta de cores consistente
- Componentes reutilizáveis

## 📡 Integração com API

### Interceptors

**Error Interceptor**: Tratamento global de erros HTTP

- Mensagens de erro amigáveis
- Logout automático em 401
- Feedback visual de erros

**Loading Interceptor**: Estado de carregamento

- Loading automático em requisições
- Indicador visual de progresso

### Services

Todos os serviços utilizam Observables (RxJS):

```typescript
// Exemplo de uso
courseService.getAllCourses().subscribe({
  next: (courses) => console.log(courses),
  error: (error) => console.error(error),
});
```

## 🧪 Testes

```bash
# Testes unitários
ng test

# Testes com cobertura
ng test --code-coverage

# Testes e2e
ng e2e
```

## 📦 Build e Deploy

```bash
# Build de produção
ng build --configuration production

# Os arquivos serão gerados em /dist/basic-frontend
```

### Deploy Estático (Netlify, Vercel, Firebase)

```bash
# Netlify
netlify deploy --prod --dir=dist/basic-frontend

# Vercel
vercel --prod

# Firebase
firebase deploy
```

### Configuração de SPA

Adicione um arquivo `_redirects` ou configure seu servidor para redirecionar todas as rotas para `index.html`:

```
/*    /index.html   200
```

## 🔒 Segurança

- Sanitização automática de HTML
- Guards para proteção de rotas
- Token JWT em headers HTTP
- Validação de formulários
- Proteção contra XSS

## 📱 Responsividade

- Design mobile-first
- Breakpoints otimizados
- Componentes adaptáveis
- Suporte a tablets e desktops

## 📝 Melhorias Implementadas

✅ Interceptors para error handling e loading  
✅ Estrutura modular e escalável  
✅ Guards de autenticação e autorização  
✅ Signals para gerenciamento de estado  
✅ Ng-Zorro para UI consistente  
✅ Código limpo e bem documentado  
✅ TypeScript strict mode  
✅ Standalone components (Angular 18+)

## 🚀 Performance

- Lazy loading de módulos
- Standalone components
- OnPush change detection
- Otimização de bundles
- Tree shaking automático

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Diego Lima**

- GitHub: [@dieegoolimaa](https://github.com/dieegoolimaa)

## 🆘 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato.

---

**Desenvolvido com ❤️ usando Angular e Ng-Zorro**
