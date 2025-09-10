# NutriTrack Pro 🥗💪

> Plataforma web progressiva para acompanhamento nutricional e físico entre treinadores e alunos

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1.3-purple.svg)](https://vitejs.dev/)

## 📋 Sobre o Projeto

O **NutriTrack Pro** é uma solução completa para digitalizar e otimizar o processo de acompanhamento nutricional. A plataforma oferece uma experiência integrada para profissionais da área de nutrição e seus clientes, com foco na praticidade, organização e visualização de resultados.

### 🎯 Funcionalidades Principais

- **🔐 Sistema de Autenticação**: Login seguro com email/senha e seleção de perfil
- **📋 Anamnese Digital Completa**: Questionário abrangente com 8 seções especializadas
- **📏 Acompanhamento de Medidas**: Registro quinzenal com gráficos de evolução
- **🍎 Planos Alimentares**: Criação e gestão de dietas personalizadas
- **👥 Gestão de Alunos**: Interface para treinadores gerenciarem seus clientes
- **📚 Materiais Educativos**: Biblioteca de conteúdos com controle de acesso
- **📊 Relatórios e Analytics**: Dashboards interativos com métricas de progresso
- **📱 PWA**: Aplicativo web progressivo com suporte offline

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19.0.0** com TypeScript
- **Vite 7.1.3** para build e desenvolvimento
- **Tailwind CSS 3.4.17** para estilização
- **React Router v7.5.3** para roteamento
- **Lucide React** para ícones
- **Recharts** para gráficos

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage)
- **Row Level Security (RLS)** para segurança
- **Real-time subscriptions** para atualizações em tempo real

### Infraestrutura
- **Cloudflare Pages** para deploy
- **PWA** com Service Worker
- **Responsive Design** para mobile e desktop

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/nutritrack-pro.git
cd nutritrack-pro
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

### 4. Configure o banco de dados
```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login no Supabase
supabase login

# Conecte ao projeto
supabase link --project-ref seu-project-ref

# Execute as migrações
supabase db push
```

### 5. Execute o projeto
```bash
npm run dev
```

Acesse: http://localhost:5173

## 📁 Estrutura do Projeto

```
src/
├── react-app/           # Aplicação React principal
│   ├── components/      # Componentes reutilizáveis
│   ├── hooks/          # Hooks personalizados
│   ├── pages/          # Páginas da aplicação
│   └── App.tsx         # Componente principal
├── shared/             # Código compartilhado
│   ├── supabase.ts     # Configuração do Supabase
│   ├── types.ts        # Tipos TypeScript
│   └── supabase-types.ts # Tipos gerados do Supabase
supabase/
├── migrations/         # Migrações do banco de dados
└── config.toml        # Configuração do Supabase
```

## 👥 Tipos de Usuário

### 🎓 Aluno/Cliente
- Preenchimento de anamnese completa
- Registro de medidas corporais
- Visualização de planos alimentares
- Acompanhamento de evolução
- Acesso a materiais educativos

### 👨‍🏫 Treinador/Nutricionista
- Gestão de alunos
- Criação de planos alimentares
- Análise de evolução dos clientes
- Upload de materiais educativos
- Geração de relatórios

## 🔐 Segurança

- **Autenticação**: Supabase Auth com confirmação de email
- **Autorização**: Row Level Security (RLS) no banco de dados
- **Validação**: Validação de dados no frontend e backend
- **HTTPS**: Comunicação segura em produção

## 📱 PWA Features

- **Instalável**: Pode ser instalado como app nativo
- **Offline**: Funcionalidade básica offline
- **Responsivo**: Otimizado para mobile e desktop
- **Fast**: Carregamento rápido com cache inteligente

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Deploy no Netlify (Recomendado)
1. Conecte seu repositório GitHub ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Deploy Manual
```bash
# Build
npm run build

# Deploy para Netlify
netlify deploy --prod --dir=dist
```

## 📊 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificação de código
npm run type-check   # Verificação de tipos

# Scripts do Supabase
npm run supabase:start    # Inicia Supabase local
npm run supabase:stop     # Para Supabase local
npm run supabase:reset    # Reset do banco local
npm run supabase:types    # Gera tipos TypeScript
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Documentação**: Consulte os arquivos `.md` na raiz do projeto
- **Issues**: Reporte bugs e solicite features via GitHub Issues
- **Discussões**: Use GitHub Discussions para perguntas gerais

## 🎯 Roadmap

- [ ] Integração com wearables (smartwatches)
- [ ] Notificações push
- [ ] Chat em tempo real treinador-aluno
- [ ] Integração com APIs de nutrição
- [ ] App mobile nativo (React Native)
- [ ] Inteligência artificial para sugestões

---

**Desenvolvido com ❤️ para profissionais da nutrição e seus clientes**

*NutriTrack Pro - Transformando o acompanhamento nutricional* 🚀
