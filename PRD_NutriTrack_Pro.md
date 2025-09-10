# PRD - NutriTrack Pro
## Product Requirements Document

---

## 1. Visão Geral do Produto

### 1.1 Descrição
O **NutriTrack Pro** é uma plataforma web progressiva (PWA) desenvolvida para facilitar o acompanhamento nutricional e físico entre treinadores e alunos. O sistema oferece uma solução completa para gestão de anamneses, medidas corporais, planos alimentares e evolução física.

### 1.2 Objetivo
Digitalizar e otimizar o processo de acompanhamento nutricional, proporcionando uma experiência integrada para profissionais da área de nutrição e seus clientes, com foco na praticidade, organização e visualização de resultados.

### 1.3 Público-Alvo
- **Primário**: Nutricionistas, Personal Trainers e Profissionais de Educação Física
- **Secundário**: Alunos/Clientes que buscam acompanhamento nutricional e físico

---

## 2. Arquitetura e Stack Tecnológica

### 2.1 Frontend
- **Framework**: React 19.0.0 com TypeScript
- **Roteamento**: React Router v7.5.3
- **Estilização**: Tailwind CSS 3.4.17
- **Ícones**: Lucide React 0.510.0
- **Gráficos**: Recharts 3.1.2
- **Build Tool**: Vite 7.1.3

### 2.2 Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono 4.7.7
- **Validação**: Zod 3.24.3
- **Banco de Dados**: SQLite (Cloudflare D1)
- **Autenticação**: Mocha Users Service

### 2.3 Infraestrutura
- **Deploy**: Cloudflare Pages + Workers
- **CDN**: Cloudflare
- **Armazenamento**: Cloudflare R2 (para arquivos)
- **PWA**: Service Worker implementado

---

## 3. Funcionalidades Principais

### 3.1 Sistema de Autenticação
- **OAuth Google**: Integração com Google para login
- **Gestão de Sessões**: Tokens seguros com expiração de 60 dias
- **Middleware de Autenticação**: Proteção de rotas sensíveis

### 3.2 Gestão de Perfis
- **Tipos de Usuário**: 
  - Treinador/Nutricionista
  - Aluno/Cliente
- **Configuração Inicial**: Setup obrigatório do perfil após primeiro login
- **Vinculação**: Sistema de associação aluno-treinador

### 3.3 Anamnese Digital Completa

#### 3.3.1 Seções da Anamnese
1. **Informações Gerais**
   - Dados pessoais (idade, localização, contato)
   - Medidas corporais iniciais
   - Composição corporal

2. **Rotina e Objetivos**
   - Profissão e horários de trabalho
   - Cronograma de estudos
   - Atividades físicas atuais
   - Objetivos corporais e de consulta

3. **Treinamento**
   - Duração sem descanso
   - Periodização
   - Sensação de estagnação
   - Nível de pump muscular

4. **Substâncias**
   - Medicamentos prescritos
   - Drogas legais/ilegais
   - Anabolizantes/anticoncepcionais
   - Nootrópicos e estimulantes

5. **Dieta Atual**
   - Diário alimentar
   - Frequência intestinal
   - Problemas digestivos
   - Disponibilidade de alimentos
   - Alergias e intolerâncias

6. **Aspectos Neurológicos**
   - Escalas de 1-10 para:
     - Motivação
     - Concentração
     - Memória
     - Iniciativa sexual
     - Prazer
     - Empatia
     - Sociabilidade
     - Fluência verbal

7. **Descanso e Sono**
   - Horários de sono
   - Qualidade do descanso
   - Despertares noturnos
   - Método de respiração
   - Picos de fadiga
   - Dados de smartwatch

8. **Histórico Clínico**
   - Doenças preexistentes
   - Cirurgias
   - Tratamentos dentários
   - Implantes metálicos
   - Vacinação COVID-19
   - Mudanças recentes na saúde
   - Exames clínicos

#### 3.3.2 Características da Anamnese
- **Salvamento Automático**: Progresso salvo a cada seção
- **Navegação por Seções**: Interface intuitiva com indicadores de progresso
- **Upload de Arquivos**: Suporte para fotos e exames
- **Validação**: Campos obrigatórios e validação de dados

### 3.4 Acompanhamento de Medidas

#### 3.4.1 Medidas Corporais
- Peso
- Circunferência da cintura
- Braço direito (contraído/relaxado)
- Braço esquerdo (contraído/relaxado)
- Ponto médio da coxa
- Circunferência do quadril

#### 3.4.2 Funcionalidades
- **Registro Quinzenal**: Lembretes automáticos a cada 15 dias
- **Histórico Completo**: Visualização de todas as medidas anteriores
- **Gráficos de Evolução**: Representação visual do progresso
- **Comparação Temporal**: Análise de períodos específicos

### 3.5 Planos Alimentares

#### 3.5.1 Criação de Dietas
- **Editor Flexível**: Criação de planos personalizados
- **Múltiplos Planos**: Vários planos por aluno
- **Versionamento**: Histórico de alterações
- **Status Ativo/Inativo**: Controle de planos vigentes

#### 3.5.2 Gestão
- **Atribuição**: Treinadores atribuem planos aos alunos
- **Visualização**: Interface clara para consulta
- **Edição**: Modificação de planos existentes

### 3.6 Gestão de Alunos (Para Treinadores)

#### 3.6.1 Lista de Alunos
- **Busca e Filtros**: Localização rápida de alunos
- **Informações Resumidas**: Dados essenciais em cards
- **Status de Anamnese**: Indicador de conclusão
- **Próximas Medidas**: Alertas de medições pendentes

#### 3.6.2 Perfil Individual do Aluno
- **Dados Completos**: Acesso à anamnese completa
- **Histórico de Medidas**: Evolução temporal
- **Planos Ativos**: Dietas em vigor
- **Relatórios**: Geração de documentos

### 3.7 Materiais Educativos

#### 3.7.1 Biblioteca de Materiais
- **Upload de Arquivos**: PDFs, imagens, vídeos
- **Categorização**: Organização por temas
- **Controle de Acesso**: Materiais específicos por aluno
- **Versionamento**: Atualizações de conteúdo

#### 3.7.2 Distribuição
- **Acesso Granular**: Controle individual de permissões
- **Notificações**: Alertas de novos materiais
- **Download**: Acesso offline aos conteúdos

### 3.8 Relatórios e Analytics

#### 3.8.1 Dashboards
- **Visão Geral**: Métricas principais
- **Gráficos Interativos**: Evolução temporal
- **Comparações**: Períodos e objetivos
- **Exportação**: Relatórios em PDF

#### 3.8.2 Métricas
- **Evolução de Peso**: Tendências e variações
- **Medidas Corporais**: Progressão por região
- **Aderência**: Cumprimento de planos
- **Frequência**: Regularidade de medições

---

## 4. Modelo de Dados

### 4.1 Entidades Principais

#### 4.1.1 user_profiles
- Informações básicas do usuário
- Tipo de usuário (student/trainer)
- Dados de contato

#### 4.1.2 students
- Dados específicos de alunos
- Vinculação com treinador
- Medidas básicas e datas de acompanhamento

#### 4.1.3 anamnesis
- Questionário completo de saúde
- 8 seções com campos específicos
- Status de conclusão

#### 4.1.4 body_measurements
- Histórico de medidas corporais
- Registro temporal
- Múltiplas medidas por data

#### 4.1.5 diet_plans
- Planos alimentares
- Conteúdo em JSON
- Controle de ativação

#### 4.1.6 materials
- Biblioteca de materiais educativos
- Metadados de arquivos
- Controle de acesso

#### 4.1.7 material_student_access
- Permissões granulares
- Rastreamento de concessões
- Auditoria de acessos

### 4.2 Relacionamentos
- **1:N** - Treinador : Alunos
- **1:1** - Aluno : Anamnese
- **1:N** - Aluno : Medidas Corporais
- **1:N** - Aluno : Planos Alimentares
- **N:M** - Materiais : Alunos (via access table)

---

## 5. Interface do Usuário

### 5.1 Design System
- **Paleta de Cores**: Gradientes azul/roxo/ciano
- **Tipografia**: Sistema padrão com hierarquia clara
- **Componentes**: Biblioteca consistente de UI
- **Responsividade**: Mobile-first approach

### 5.2 Navegação
- **Dashboard Central**: Hub principal de acesso
- **Menu Lateral**: Navegação contextual por tipo de usuário
- **Breadcrumbs**: Orientação de localização
- **Ações Rápidas**: Botões de acesso direto

### 5.3 Experiência do Usuário
- **Onboarding**: Fluxo guiado para novos usuários
- **Notificações**: Sistema de alertas e lembretes
- **Feedback Visual**: Indicadores de status e progresso
- **Acessibilidade**: Conformidade com padrões WCAG

---

## 6. Funcionalidades Técnicas

### 6.1 Progressive Web App (PWA)
- **Service Worker**: Cache inteligente e offline
- **Manifest**: Instalação como app nativo
- **Push Notifications**: Lembretes e alertas
- **Background Sync**: Sincronização offline

### 6.2 Performance
- **Code Splitting**: Carregamento otimizado
- **Lazy Loading**: Componentes sob demanda
- **CDN**: Distribuição global de assets
- **Caching**: Estratégias de cache multicamada

### 6.3 Segurança
- **HTTPS**: Comunicação criptografada
- **CORS**: Controle de origem cruzada
- **Sanitização**: Validação de inputs
- **Rate Limiting**: Proteção contra abuso

### 6.4 Monitoramento
- **Error Tracking**: Captura de erros em produção
- **Analytics**: Métricas de uso e performance
- **Logs**: Sistema de auditoria
- **Health Checks**: Monitoramento de saúde do sistema

---

## 7. Fluxos de Usuário

### 7.1 Fluxo do Aluno
1. **Registro/Login** → OAuth Google
2. **Setup do Perfil** → Dados básicos + seleção de treinador
3. **Anamnese** → Preenchimento das 8 seções
4. **Medidas Iniciais** → Registro das primeiras medidas
5. **Acompanhamento** → Medidas quinzenais + consulta de planos
6. **Evolução** → Visualização de gráficos e progresso

### 7.2 Fluxo do Treinador
1. **Registro/Login** → OAuth Google
2. **Setup do Perfil** → Dados profissionais
3. **Gestão de Alunos** → Visualização e acompanhamento
4. **Criação de Planos** → Desenvolvimento de dietas personalizadas
5. **Materiais** → Upload e distribuição de conteúdos
6. **Relatórios** → Análise de resultados e progresso

---

## 8. Requisitos Não Funcionais

### 8.1 Performance
- **Tempo de Carregamento**: < 3 segundos (First Contentful Paint)
- **Responsividade**: < 100ms para interações
- **Throughput**: Suporte a 1000+ usuários simultâneos
- **Disponibilidade**: 99.9% uptime

### 8.2 Escalabilidade
- **Arquitetura Serverless**: Auto-scaling automático
- **Database**: Otimização para consultas frequentes
- **CDN**: Distribuição global de conteúdo
- **Caching**: Múltiplas camadas de cache

### 8.3 Usabilidade
- **Intuitividade**: Interface auto-explicativa
- **Acessibilidade**: Conformidade WCAG 2.1 AA
- **Responsividade**: Suporte mobile/tablet/desktop
- **Internacionalização**: Preparado para múltiplos idiomas

### 8.4 Segurança
- **Autenticação**: OAuth 2.0 + JWT tokens
- **Autorização**: Role-based access control
- **Criptografia**: Dados sensíveis criptografados
- **Compliance**: Conformidade com LGPD

---

## 9. Roadmap e Próximos Passos

### 9.1 Fase Atual (MVP)
- ✅ Sistema de autenticação
- ✅ Gestão de perfis
- ✅ Anamnese digital completa
- ✅ Acompanhamento de medidas
- ✅ Planos alimentares básicos
- ✅ Gestão de alunos
- ✅ Materiais educativos

### 9.2 Próximas Funcionalidades
- **Notificações Push**: Lembretes automáticos
- **Integração com Wearables**: Sincronização de dados
- **IA para Recomendações**: Sugestões automáticas de planos
- **Telemedicina**: Consultas virtuais integradas
- **Marketplace**: Loja de planos e materiais

### 9.3 Melhorias Técnicas
- **Testes Automatizados**: Cobertura completa
- **CI/CD**: Pipeline de deploy automatizado
- **Monitoring Avançado**: APM e observabilidade
- **Backup e Recovery**: Estratégia de disaster recovery

---

## 10. Métricas de Sucesso

### 10.1 Métricas de Produto
- **Adoção**: Número de usuários ativos mensais
- **Engajamento**: Frequência de uso por usuário
- **Retenção**: Taxa de retenção em 30/60/90 dias
- **Conversão**: Taxa de conclusão de anamneses

### 10.2 Métricas Técnicas
- **Performance**: Core Web Vitals
- **Disponibilidade**: Uptime e MTTR
- **Qualidade**: Taxa de erros e bugs
- **Segurança**: Incidentes de segurança

### 10.3 Métricas de Negócio
- **Satisfação**: NPS e feedback dos usuários
- **Eficiência**: Redução de tempo em processos manuais
- **ROI**: Retorno sobre investimento para clientes
- **Crescimento**: Taxa de crescimento da base de usuários

---

## 11. Considerações Finais

O **NutriTrack Pro** representa uma solução moderna e completa para o acompanhamento nutricional digital. Com sua arquitetura robusta, interface intuitiva e funcionalidades abrangentes, o sistema está posicionado para revolucionar a forma como profissionais da nutrição e seus clientes interagem e acompanham resultados.

A implementação atual já oferece um MVP funcional e escalável, com uma base sólida para futuras expansões e melhorias. O foco na experiência do usuário, performance e segurança garante que o produto atenda às necessidades tanto de profissionais quanto de clientes finais.

**Data de Criação**: Janeiro 2025  
**Versão**: 1.0  
**Status**: Ativo