# Deploy do NutriTrack Pro

## ✅ Build Concluído com Sucesso!

O projeto foi compilado e está pronto para deploy. Os arquivos estão na pasta `dist/`.

## 🚀 Opções de Deploy

### 1. Netlify (Recomendado - Gratuito)

#### Opção A: Netlify Drop (Mais Simples)
1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `dist` para a área de upload
3. Seu site será publicado automaticamente
4. Você receberá uma URL como: `https://random-name.netlify.app`

#### Opção B: Netlify CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login no Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### 2. Vercel (Alternativa Gratuita)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

### 3. GitHub Pages
1. Crie um repositório no GitHub
2. Faça push do código
3. Configure GitHub Actions para build automático
4. Ative GitHub Pages nas configurações

### 4. Cloudflare Pages
1. Acesse: https://pages.cloudflare.com
2. Conecte seu repositório GitHub
3. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `18`

## 🔧 Configurações Importantes

### Variáveis de Ambiente
Configure estas variáveis no seu provedor de hospedagem:

```env
VITE_SUPABASE_URL=https://oyczywzidgztnckvwaph.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Y3p5d3ppZGd6dG5ja3Z3YXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjQ5NzYsImV4cCI6MjA3MzEwMDk3Nn0.2_ubN7b87y1H7HVL-Ue9h8hceN6-gz7A7qi8TSvX418
```

### Redirects (Para SPAs)
Crie um arquivo `dist/_redirects` com:
```
/*    /index.html   200
```

## 📋 Checklist de Deploy

- [x] ✅ Build concluído (`dist/` criada)
- [x] ✅ Supabase configurado
- [ ] 🔄 Escolher provedor de hospedagem
- [ ] 🔄 Configurar variáveis de ambiente
- [ ] 🔄 Configurar redirects para SPA
- [ ] 🔄 Testar aplicação em produção
- [ ] 🔄 Configurar domínio personalizado (opcional)

## 🌐 URLs de Deploy

Após o deploy, anote aqui as URLs:

- **Produção**: `https://seu-site.netlify.app`
- **Preview**: `https://preview-seu-site.netlify.app`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/oyczywzidgztnckvwaph`

## 🔄 Próximos Deploys

Para futuros deploys, execute:

```bash
# 1. Build
npm run build

# 2. Deploy (escolha uma opção)
netlify deploy --prod --dir=dist
# ou
vercel --prod
# ou arraste dist/ para netlify.com/drop
```

## 🚨 Troubleshooting

### Erro 404 em rotas
- Certifique-se de configurar redirects para SPA
- Adicione `_redirects` na pasta `dist`

### Erro de CORS
- Verifique as configurações do Supabase
- Adicione o domínio de produção nas URLs permitidas

### Variáveis de ambiente não funcionam
- Certifique-se de usar o prefixo `VITE_`
- Reconfigure as variáveis no painel do provedor

---

**Status**: ✅ Pronto para Deploy  
**Última atualização**: Janeiro 2025