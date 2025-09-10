# Próximos Passos - Arquitetura NutriTrack Pro

Este documento detalha as três opções de arquitetura disponíveis para o projeto NutriTrack Pro após a integração com Supabase.

---

## 🎯 Opção 1: Reabilitar Cloudflare Workers para Produção

### Descrição
Manter a arquitetura híbrida atual com Supabase para dados e Cloudflare Workers para APIs customizadas.

### Vantagens
- ✅ Melhor performance global (Edge Computing)
- ✅ Menor latência para usuários internacionais
- ✅ Escalabilidade automática
- ✅ Custo otimizado para alto volume
- ✅ Mantém compatibilidade com infraestrutura existente

### Implementação

#### 1. Reabilitar Plugin do Cloudflare

**Arquivo: `vite.config.ts`**
```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [
    ...mochaPlugins(process.env as any), 
    react(),
    // Reabilitar apenas para build de produção
    ...(process.env.NODE_ENV === 'production' ? [cloudflare()] : [])
  ],
  server: {
    allowedHosts: true
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### 2. Atualizar Worker para Usar Supabase

**Arquivo: `src/worker/supabase-worker.ts`** (novo)
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/supabase-types';

// Configuração do Supabase para Worker
export const createSupabaseClient = (env: Env) => {
  return createClient<Database>(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_SERVICE_ROLE_KEY, // Service Role Key para operações server-side
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// Helper para autenticação JWT
export const verifySupabaseJWT = async (token: string, supabase: ReturnType<typeof createSupabaseClient>) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error('Token inválido');
  }
  return user;
};
```

#### 3. Atualizar Worker Principal

**Arquivo: `src/worker/index.ts`** (atualizar)
```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createSupabaseClient, verifySupabaseJWT } from './supabase-worker';

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware de autenticação Supabase
const supabaseAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Token não fornecido' }, 401);
  }

  const token = authHeader.substring(7);
  const supabase = createSupabaseClient(c.env);
  
  try {
    const user = await verifySupabaseJWT(token, supabase);
    c.set('user', user);
    c.set('supabase', supabase);
    await next();
  } catch (error) {
    return c.json({ error: 'Token inválido' }, 401);
  }
};

// Exemplo de endpoint usando Supabase
app.get('/api/profile', supabaseAuth, async (c) => {
  const user = c.get('user');
  const supabase = c.get('supabase');
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (error) {
    return c.json({ error: error.message }, 400);
  }
  
  return c.json({ profile: data });
});

export default app;
```

#### 4. Configurar Variáveis de Ambiente

**Arquivo: `wrangler.toml`** (atualizar)
```toml
name = "nutritrack-pro"
main = "src/worker/index.ts"
compatibility_date = "2024-01-01"

[env.production.vars]
VITE_SUPABASE_URL = "https://oyczywzidgztnckvwaph.supabase.co"
VITE_SUPABASE_SERVICE_ROLE_KEY = "sua-service-role-key"

[env.development.vars]
VITE_SUPABASE_URL = "https://oyczywzidgztnckvwaph.supabase.co"
VITE_SUPABASE_SERVICE_ROLE_KEY = "sua-service-role-key"
```

#### 5. Scripts de Deploy

**Adicionar ao `package.json`:**
```json
{
  "scripts": {
    "deploy:worker": "wrangler deploy",
    "deploy:pages": "npm run build && wrangler pages deploy dist",
    "deploy:full": "npm run deploy:worker && npm run deploy:pages"
  }
}
```

---

## 🚀 Opção 2: Migrar para Supabase Edge Functions

### Descrição
Substituir completamente os Cloudflare Workers por Supabase Edge Functions.

### Vantagens
- ✅ Arquitetura unificada (tudo no Supabase)
- ✅ Melhor integração com banco de dados
- ✅ RLS (Row Level Security) nativo
- ✅ Menos complexidade de configuração
- ✅ Deno runtime (TypeScript nativo)

### Implementação

#### 1. Remover Dependências do Cloudflare

```bash
npm uninstall @cloudflare/vite-plugin wrangler
```

#### 2. Atualizar Vite Config

**Arquivo: `vite.config.ts`**
```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig({
  plugins: [...mochaPlugins(process.env as any), react()],
  server: {
    allowedHosts: true
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### 3. Criar Edge Functions

**Arquivo: `supabase/functions/profile/index.ts`**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ profile: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### 4. Deploy Edge Functions

```bash
# Deploy função específica
npx supabase functions deploy profile

# Deploy todas as funções
npx supabase functions deploy
```

#### 5. Atualizar Frontend para Usar Edge Functions

**Arquivo: `src/shared/api.ts`** (novo)
```typescript
import { supabase } from './supabase';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const callEdgeFunction = async (functionName: string, data?: any) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(`${FUNCTIONS_URL}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  return response.json();
};

// Exemplo de uso
export const getProfile = () => callEdgeFunction('profile');
```

---

## 🔄 Opção 3: Manter Arquitetura Híbrida Atual

### Descrição
Manter o frontend usando Supabase diretamente e Workers apenas para casos específicos.

### Vantagens
- ✅ Simplicidade de desenvolvimento
- ✅ Aproveitamento máximo do Supabase
- ✅ RLS automático
- ✅ Menos código para manter
- ✅ Desenvolvimento mais rápido

### Implementação

#### 1. Configuração Atual (Já Implementada)

A configuração atual já está otimizada para esta abordagem:
- Frontend usa Supabase diretamente
- Hooks personalizados para operações CRUD
- RLS configurado no banco
- Autenticação via Supabase Auth

#### 2. Casos de Uso para Workers (Opcional)

Use Workers apenas para:
- Processamento de pagamentos
- Integração com APIs externas
- Operações que requerem Service Role
- Webhooks

#### 3. Exemplo de Worker Específico

**Arquivo: `src/worker/webhooks.ts`**
```typescript
import { Hono } from "hono";
import { createSupabaseClient } from './supabase-worker';

const app = new Hono<{ Bindings: Env }>();

// Webhook para processamento de pagamento
app.post('/webhook/payment', async (c) => {
  const supabase = createSupabaseClient(c.env);
  const payload = await c.req.json();
  
  // Processar pagamento e atualizar banco
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('payment_id', payload.payment_id);
    
  if (error) {
    return c.json({ error: error.message }, 400);
  }
  
  return c.json({ success: true });
});

export default app;
```

---

## 📊 Comparação das Opções

| Aspecto | Cloudflare + Supabase | Supabase Edge Functions | Híbrida Atual |
|---------|----------------------|------------------------|---------------|
| **Complexidade** | Alta | Média | Baixa |
| **Performance** | Excelente | Boa | Boa |
| **Custo** | Variável | Previsível | Baixo |
| **Manutenção** | Alta | Média | Baixa |
| **Escalabilidade** | Excelente | Boa | Boa |
| **Tempo de Dev** | Alto | Médio | Baixo |
| **Vendor Lock-in** | Baixo | Alto | Alto |

---

## 🎯 Recomendação

### Para Desenvolvimento/MVP: **Opção 3 (Híbrida Atual)**
- Desenvolvimento mais rápido
- Menor complexidade
- Foco no produto, não na infraestrutura

### Para Produção/Escala: **Opção 1 (Cloudflare + Supabase)**
- Melhor performance global
- Maior flexibilidade
- Preparado para escala internacional

### Para Simplicidade Total: **Opção 2 (Supabase Edge Functions)**
- Arquitetura unificada
- Menos pontos de falha
- Manutenção simplificada

---

## 🚀 Próximos Passos Imediatos

1. **Definir Estratégia**: Escolher uma das três opções baseada nos requisitos
2. **Configurar Ambiente**: Implementar a opção escolhida
3. **Testes**: Validar funcionalidades críticas
4. **Deploy**: Configurar pipeline de deploy
5. **Monitoramento**: Implementar observabilidade

---

## 📝 Notas Importantes

- **Service Role Key**: Necessária para operações server-side no Supabase
- **RLS**: Sempre configurar políticas de segurança adequadas
- **CORS**: Configurar corretamente para produção
- **Rate Limiting**: Implementar para APIs públicas
- **Monitoring**: Configurar alertas e métricas

**Última atualização**: Janeiro 2025