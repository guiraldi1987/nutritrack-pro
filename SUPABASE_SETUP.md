# Configuração do Supabase - NutriTrack Pro

Este guia explica como configurar e integrar o Supabase ao projeto NutriTrack Pro.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com)
- Docker Desktop (para desenvolvimento local)

## 🚀 Configuração Inicial

### 1. Instalação das Dependências

As dependências já foram instaladas:

```bash
npm install @supabase/supabase-js
npm install -D supabase
```

### 2. Configuração Local (Desenvolvimento)

#### Inicializar Supabase Local

```bash
# Iniciar containers locais do Supabase
npm run supabase:start

# Verificar status
npm run supabase:status
```

#### Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Para desenvolvimento local, use as credenciais do Supabase local:
```env
# Supabase Local (após rodar supabase:start)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### 3. Configuração de Produção

#### Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a chave anônima do projeto

#### Configurar Variáveis de Produção

```env
# Supabase Produção
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

#### Executar Migrações em Produção

```bash
# Conectar ao projeto remoto
supabase link --project-ref seu-projeto-ref

# Aplicar migrações
npm run supabase:migrate
```

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza as seguintes tabelas principais:

### Tabelas Principais

- **user_profiles**: Perfis de usuários (treinadores e alunos)
- **students**: Dados específicos de alunos
- **anamnesis**: Questionários de saúde completos
- **body_measurements**: Histórico de medidas corporais
- **diet_plans**: Planos alimentares
- **materials**: Materiais educativos
- **material_student_access**: Controle de acesso aos materiais

### Segurança (RLS)

Todas as tabelas possuem Row Level Security (RLS) habilitado com políticas que garantem:

- Alunos só acessam seus próprios dados
- Treinadores só acessam dados de seus alunos
- Controle granular de permissões

## 🔧 Uso no Código

### Cliente Supabase

```typescript
import { supabase } from '@/shared/supabase';

// Exemplo de uso
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId);
```

### Hooks Personalizados

O projeto inclui hooks personalizados para facilitar o uso:

```typescript
import { useSupabaseAuth, useUserProfile, useStudent } from '@/react-app/hooks/useSupabase';

// Hook de autenticação
const { user, loading, error } = useSupabaseAuth();

// Hook de perfil
const { profile, createProfile, updateProfile } = useUserProfile();

// Hook de estudante
const { student, createStudent, updateStudent } = useStudent();
```

### Upload de Arquivos

```typescript
import { useSupabaseStorage } from '@/react-app/hooks/useSupabase';

const { uploadFile, deleteFile, uploading } = useSupabaseStorage('materials');

// Upload de arquivo
const fileUrl = await uploadFile(file, `${userId}/${fileName}`);
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento local
npm run supabase:start      # Iniciar Supabase local
npm run supabase:stop       # Parar Supabase local
npm run supabase:status     # Ver status dos serviços
npm run supabase:reset      # Resetar banco local

# Migrações
npm run supabase:migrate    # Aplicar migrações

# Geração de tipos
npm run supabase:generate-types  # Gerar tipos TypeScript
```

## 🔐 Autenticação

### Configuração do Google OAuth

1. No painel do Supabase, vá em Authentication > Providers
2. Habilite o Google Provider
3. Configure as credenciais do Google OAuth
4. Adicione as URLs de redirect autorizadas

### Fluxo de Autenticação

```typescript
// Login com Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});

// Logout
const { error } = await supabase.auth.signOut();
```

## 🚀 Deploy

### Variáveis de Ambiente no Deploy

Configure as seguintes variáveis no seu provedor de deploy:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Cloudflare Pages

Para deploy no Cloudflare Pages, adicione as variáveis no painel de configuração do projeto.

## 🔍 Monitoramento

### Logs e Métricas

- Acesse o painel do Supabase para ver logs em tempo real
- Monitore performance das queries
- Acompanhe uso de storage e bandwidth

### Debugging

```typescript
// Habilitar logs detalhados (apenas desenvolvimento)
if (import.meta.env.DEV) {
  supabase.realtime.setAuth(process.env.VITE_SUPABASE_ANON_KEY);
}
```

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/reference/cli)
- [Realtime](https://supabase.com/docs/guides/realtime)

## 🆘 Troubleshooting

### Problemas Comuns

1. **Erro de conexão local**:
   ```bash
   # Verificar se Docker está rodando
   docker ps
   
   # Reiniciar Supabase local
   npm run supabase:stop
   npm run supabase:start
   ```

2. **Erro de RLS**:
   - Verifique se o usuário está autenticado
   - Confirme as políticas de RLS
   - Use o SQL Editor para testar queries

3. **Tipos TypeScript desatualizados**:
   ```bash
   npm run supabase:generate-types
   ```

4. **Problemas de migração**:
   ```bash
   # Ver status das migrações
   supabase migration list
   
   # Aplicar migração específica
   supabase migration up --target 20240101000001
   ```

## 🔄 Migração do Sistema Atual

Para migrar do sistema atual (Cloudflare D1) para Supabase:

1. **Backup dos dados atuais**
2. **Executar migrações no Supabase**
3. **Migrar dados** (script de migração necessário)
4. **Atualizar configurações de produção**
5. **Testar funcionalidades**
6. **Deploy gradual**

---

**Nota**: Este setup mantém compatibilidade com o sistema atual, permitindo uma migração gradual e segura para o Supabase.