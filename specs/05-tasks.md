# 05 - Plano de Tarefas (Roadmap & Tasks)

Este documento divide o desenvolvimento do **AeroSearch** em tarefas atômicas, sequenciais e testáveis, seguindo estritamente as diretrizes da Constituição (`00-constitution.md`) e da Definition of Done (DoD).

---

## Fase 1: Scaffold, Configuração e Infraestrutura Base

- [x] **T-001: Inicialização do Projeto e Configuração Base**
  - **Objetivo**: Inicializar o projeto Next.js com TypeScript, Tailwind CSS, ESLint, Prettier e estrutura de pastas em `/src`.
  - **Critérios de Aceite**:
    - Projeto roda com `npm run dev`.
    - Linter e tipagem configurados e passando sem erros (`npm run lint`, `npx tsc`).
    - Configuração de `.env.example` com placeholders das variáveis obrigatórias (sem segredos).
    - `.gitignore` devidamente configurado para ignorar `.env*` locais e `.next`.
  - **DoD**: Build, Lint e Specs atualizados. [CONCLUÍDO]

- [ ] **T-002: Configuração do Framework de Testes Automatizados**
  - **Objetivo**: Instalar e configurar Jest ou Vitest com React Testing Library para execução de testes unitários e de integração.
  - **Critérios de Aceite**:
    - Script `npm run test` configurado e funcional.
    - Teste de exemplo demonstrando execução bem-sucedida.
  - **DoD**: Testes passando, lint ok.

---

## Fase 2: Backend for Frontend (BFF), Segurança e Integração de Voos

- [ ] **T-003: Validação de Entrada e Tipagens Compartilhadas**
  - **Objetivo**: Criar esquemas de validação (ex: Zod) e tipagens TypeScript para busca de voos (códigos IATA, datas ISO, quantidade de passageiros e classes de cabine).
  - **Critérios de Aceite**:
    - Validação de IATA no padrão `^[A-Z]{3}$` com aeroportos de origem/destino distintos.
    - Validação de datas (`departureDate >= hoje`, `returnDate >= departureDate`, limite de 365 dias).
    - Testes unitários cobrindo casos válidos e inválidos com rejeição HTTP 400.
  - **DoD**: Código + Testes + Lint ok.

- [ ] **T-004: Middleware / Módulo de Rate Limiting e Cache em Memória no BFF**
  - **Objetivo**: Implementar limitador de requisições por IP (máx. 15 req/min) e camada de cache local para requisições de busca idênticas.
  - **Critérios de Aceite**:
    - Resposta HTTP 429 com cabeçalho `Retry-After` quando o limite de IP é ultrapassado.
    - Respostas subsequentes com os mesmos parâmetros são servidas a partir do cache durante o TTL.
    - Testes unitários validando o rate limit e o cache.
  - **DoD**: Código + Testes + Lint ok.

- [ ] **T-005: Cliente de Integração com API Externa de Voos (Amadeus / Duffel)**
  - **Objetivo**: Criar serviço isolado no servidor Node.js para autenticação OAuth2 (com cache de token em memória) e chamada ao endpoint de Flight Offers Search.
  - **Critérios de Aceite**:
    - Credenciais consumidas estritamente de variáveis de ambiente (`process.env`).
    - Tratamento de expiração e renovação automática do token OAuth2.
    - Tratamento gracioso de erros de rede, timeout e indisponibilidade upstream.
    - Testes unitários com mocks de resposta da API de voos.
  - **DoD**: Código + Testes + Lint ok.

- [ ] **T-006: Mapeador de Dados de Voos e Rota da API (`/api/flights/search`)**
  - **Objetivo**: Criar o Route Handler do Next.js `/api/flights/search` que conecta validação, rate limit, serviço externo e mapeamento para o contrato interno do AeroSearch (incluindo geração/sanitização do deep link de compra).
  - **Critérios de Aceite**:
    - Normalização das ofertas de voo (preço total, moeda, companhias, escalas, durações e deep link seguro).
    - Nenhum dado confidencial da API upstream vazado no payload de resposta.
    - Testes de integração cobrindo a rota completa com mock do upstream.
  - **DoD**: Código + Testes + Lint ok.

- [ ] **T-007: Endpoint de Auto-complete de Aeroportos / Cidades (`/api/airports/search`)**
  - **Objetivo**: Disponibilizar busca rápida de aeroportos por nome de cidade ou código IATA via BFF.
  - **Critérios de Aceite**:
    - Retorno de nome da cidade, aeroporto e código IATA.
    - Rate limit dedicado e cache local para termos pesquisados.
    - Testes unitários do endpoint.
  - **DoD**: Código + Testes + Lint ok.

---

## Fase 3: Frontend (Interface de Usuário e Integração)

- [ ] **T-008: Componente de Formulário de Busca de Voos**
  - **Objetivo**: Implementar o formulário principal de busca com campos de Origem, Destino (com autocomplete), Tipo de Viagem (Ida e Volta / Só Ida), Seleção de Datas e Passageiros/Classe.
  - **Critérios de Aceite**:
    - Interface 100% responsiva (Mobile e Desktop).
    - Validação interativa no cliente antes do envio.
    - Acessibilidade básica e feedback de validação.
    - Testes unitários de renderização e interação do formulário.
  - **DoD**: Código + Testes + Lint ok.

- [ ] **T-009: Estados de Carregamento e Tratamento de Erros no Cliente**
  - **Objetivo**: Criar componentes de Skeleton Loaders durante a busca de voos e telas/banners de erro (429 Rate Limit, sem voos encontrados, falha de conexão).
  - **Critérios de Aceite**:
    - Exibição de Skeleton durante o fetch no BFF.
    - Mensagens amigáveis para erro 429 ("Aguarde instantes...") e outros erros.
    - Testes unitários de estados de UI.
  - **DoD**: Código + Testes + Lint ok.

- [ ] **T-010: Listagem de Resultados de Voos e Card de Voo**
  - **Objetivo**: Implementar a listagem de opções com exibição de preço total, horários, durações, conexões/escalas, logos de cias aéreas e botão "Comprar".
  - **Critérios de Aceite**:
    - Botão "Comprar" abre o deep link oficial da companhia/OTA em nova aba (`target="_blank"` com `rel="noopener noreferrer"`).
    - Formatação correta de moedas e fusos horários.
    - Testes de renderização com diferentes cenários de voos.
  - **DoD**: Código + Testes + Lint ok.

- [ ] **T-011: Filtros Dinâmicos e Ordenação de Resultados**
  - **Objetivo**: Implementar barra lateral/painel de filtros (escalas, preço min/max, companhias aéreas) e seletor de ordenação (mais barato, mais rápido, melhor custo-benefício) em memória no cliente.
  - **Critérios de Aceite**:
    - Atualização reativa e instantânea da listagem ao alterar filtros/ordenação.
    - Contagem dinâmica de resultados filtrados.
    - Testes unitários dos critérios de filtragem e ordenação.
  - **DoD**: Código + Testes + Lint ok.

---

## Fase 4: Validação Final, Homologação e Preparação para Deploy

- [ ] **T-012: Auditoria de Segurança, Auditoria de Segredos e Verificação de Deploy Vercel**
  - **Objetivo**: Executar varredura completa para garantir ausência de segredos no bundle do cliente, validação do build de produção e documentação de configuração no painel da Vercel.
  - **Critérios de Aceite**:
    - Verificação de bundle analysis (nenhuma chave de API vazada).
    - `npm run build`, `npm run lint` e suíte completa de testes passando 100%.
    - Documentação de setup e README finalizado.
  - **DoD**: Código + Testes + Lint + Specs e STATE.md atualizados.
