# Como Obter Google OAuth Client ID e Client Secret

Este guia explica passo a passo como criar e configurar as credenciais do Google OAuth necessárias para o login no NutriTrack Pro.

---

## 🎯 Pré-requisitos

- Conta Google (Gmail)
- Acesso ao [Google Cloud Console](https://console.cloud.google.com)
- Projeto NutriTrack Pro configurado no Supabase

---

## 📋 Passo a Passo Completo

### 1. Acessar o Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Faça login com sua conta Google
3. Aceite os termos de serviço se solicitado

### 2. Criar um Novo Projeto (ou Selecionar Existente)

#### Opção A: Criar Novo Projeto
1. Clique no **seletor de projeto** no topo da página
2. Clique em **"Novo Projeto"**
3. Configure:
   - **Nome do projeto**: `NutriTrack Pro`
   - **Organização**: Deixe como está (opcional)
   - **Local**: Deixe como está (opcional)
4. Clique em **"Criar"**
5. Aguarde a criação (pode levar alguns minutos)
6. Selecione o projeto criado

#### Opção B: Usar Projeto Existente
1. Clique no **seletor de projeto** no topo
2. Selecione um projeto existente

### 3. Habilitar a API do Google+

1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Pesquise por **"Google+ API"** ou **"Google Identity"**
3. Clique em **"Google+ API"**
4. Clique em **"Ativar"**
5. Aguarde a ativação

### 4. Configurar a Tela de Consentimento OAuth

1. No menu lateral, vá em **"APIs e Serviços"** → **"Tela de consentimento OAuth"**
2. Selecione **"Externo"** (para usuários públicos)
3. Clique em **"Criar"**

#### Configurar Informações do App:
- **Nome do aplicativo**: `NutriTrack Pro`
- **Email de suporte do usuário**: Seu email
- **Logo do aplicativo**: (opcional)
- **Domínio do aplicativo**: (deixe em branco por enquanto)
- **Domínios autorizados**: (deixe em branco por enquanto)
- **Email de contato do desenvolvedor**: Seu email

4. Clique em **"Salvar e Continuar"**

#### Configurar Escopos:
1. Clique em **"Adicionar ou Remover Escopos"**
2. Selecione:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
3. Clique em **"Atualizar"**
4. Clique em **"Salvar e Continuar"**

#### Usuários de Teste (Desenvolvimento):
1. Adicione seu email como usuário de teste
2. Clique em **"Salvar e Continuar"**

#### Resumo:
1. Revise as configurações
2. Clique em **"Voltar ao Painel"**

### 5. Criar Credenciais OAuth 2.0

1. No menu lateral, vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"+ Criar Credenciais"**
3. Selecione **"ID do cliente OAuth 2.0"**

#### Configurar o Cliente OAuth:
- **Tipo de aplicativo**: `Aplicativo da Web`
- **Nome**: `NutriTrack Pro Web Client`

#### URLs de Redirecionamento Autorizadas:
Adicione estas URLs (uma por linha):

**Para Desenvolvimento:**
```
http://localhost:5173/auth/callback
http://127.0.0.1:5173/auth/callback
```

**Para Produção (substitua pelo seu domínio):**
```
https://seu-dominio.netlify.app/auth/callback
https://seu-dominio.vercel.app/auth/callback
https://seu-dominio-personalizado.com/auth/callback
```

4. Clique em **"Criar"**

### 6. Obter as Credenciais

Após criar, você verá um popup com:

```
🔑 Client ID: 123456789-abcdefghijklmnop.apps.googleusercontent.com
🔐 Client Secret: GOCSPX-abcdefghijklmnopqrstuvwxyz
```

**⚠️ IMPORTANTE**: 
- Copie e salve essas credenciais em local seguro
- O Client Secret não será mostrado novamente
- Se perder, precisará gerar novas credenciais

---

## 🔧 Configurar no Supabase

### 1. Acessar o Painel do Supabase

1. Acesse: https://supabase.com/dashboard/project/oyczywzidgztnckvwaph
2. Faça login na sua conta Supabase

### 2. Configurar Google Provider

1. No menu lateral, vá em **"Authentication"** → **"Providers"**
2. Encontre **"Google"** na lista
3. Clique no toggle para **habilitar**
4. Configure:

```
Client ID: [Cole o Client ID obtido do Google]
Client Secret: [Cole o Client Secret obtido do Google]
```

5. Clique em **"Save"**

### 3. Configurar URLs de Redirecionamento

1. Ainda em **"Authentication"**, vá em **"URL Configuration"**
2. Configure:

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs:**
```
http://localhost:5173/auth/callback
https://seu-dominio-producao.com/auth/callback
```

3. Clique em **"Save"**

---

## 🧪 Testar a Configuração

### 1. Testar Localmente

1. Acesse: http://localhost:5173
2. Clique em **"Entrar"**
3. Deve abrir popup do Google
4. Faça login com sua conta Google
5. Autorize o aplicativo
6. Deve ser redirecionado para o Dashboard

### 2. Verificar no Console

Abra o DevTools (F12) e verifique:
- Não deve haver erros no Console
- Na aba Network, deve ver requisições para o Supabase
- No Application → Local Storage, deve ver tokens do Supabase

---

## 🚨 Troubleshooting

### Erro: "redirect_uri_mismatch"
**Causa**: URL de redirecionamento não configurada
**Solução**: 
1. Volte ao Google Cloud Console
2. Vá em Credenciais → Editar cliente OAuth
3. Adicione a URL exata mostrada no erro

### Erro: "access_denied"
**Causa**: Usuário não autorizado ou app não verificado
**Solução**:
1. Adicione seu email como usuário de teste
2. Ou publique o app (processo de verificação)

### Erro: "invalid_client"
**Causa**: Client ID ou Secret incorretos
**Solução**:
1. Verifique se copiou corretamente
2. Regenere as credenciais se necessário

### Login não funciona
**Verificações**:
1. ✅ Google+ API habilitada?
2. ✅ Tela de consentimento configurada?
3. ✅ URLs de redirecionamento corretas?
4. ✅ Credenciais copiadas corretamente?
5. ✅ Supabase configurado corretamente?

---

## 📝 Checklist Final

- [ ] ✅ Projeto criado no Google Cloud Console
- [ ] ✅ Google+ API habilitada
- [ ] ✅ Tela de consentimento OAuth configurada
- [ ] ✅ Credenciais OAuth 2.0 criadas
- [ ] ✅ URLs de redirecionamento adicionadas
- [ ] ✅ Client ID e Secret copiados
- [ ] ✅ Google Provider habilitado no Supabase
- [ ] ✅ Credenciais configuradas no Supabase
- [ ] ✅ URLs de redirecionamento configuradas no Supabase
- [ ] ✅ Login testado e funcionando

---

## 🔐 Segurança

### Boas Práticas:
1. **Nunca** commite Client Secret no código
2. **Sempre** use HTTPS em produção
3. **Configure** apenas URLs necessárias
4. **Monitore** logs de autenticação
5. **Revogue** credenciais não utilizadas

### Variáveis de Ambiente:
```env
# Não adicione estas no código!
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
```

---

## 📞 Suporte

**Documentação Oficial:**
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

**Em caso de problemas:**
1. Verifique o checklist acima
2. Consulte os logs do navegador
3. Teste com conta Google diferente
4. Regenere as credenciais se necessário

---

**Última atualização**: Janeiro 2025  
**Status**: ✅ Pronto para configuração