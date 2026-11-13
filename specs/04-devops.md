# 04 - DevOps, Infraestrutura e CI/CD

## 1. Estratégia de Deploy e Hospedagem
A aplicação **AeroSearch** adota o modelo de aplicação moderna full-stack sobre o ecossistema Next.js, aproveitando a infraestrutura Serverless/Edge da **Vercel** para hospedar tanto o Frontend (SSR / SSG / Client components) quanto o Backend for Frontend (BFF via Next.js Route Handlers / Serverless Functions Node.js).

### Arquitetura de Hospedagem (Vercel)
- **Frontend**: Servido via Edge Network / CDN global da Vercel para entrega de alta performance, caching de assets estáticos e baixa latência de renderização.
- **BFF (Backend for Frontend)**: Executado como Serverless Functions em runtime Node.js na Vercel (ex: `/api/flights/*`), isolando o processamento do servidor e eliminando a necessidade de gerenciar servidores dedicados.
- **Ambientes**:
  - `Production`: Deploy automático a partir da branch `main`.
  - `Preview`: Deploy efetuado automaticamente para cada Pull Request aberto, gerando uma URL temporária de teste isolada.
  - `Development`: Ambiente local em execução via `npm run dev`.

---

## 2. Gerenciamento de Variáveis de Ambiente e Segredos

As variáveis são segmentadas entre o ambiente de desenvolvimento local e os ambientes de nuvem na Vercel.

### Variáveis Obrigatórias no Painel da Vercel (Settings -> Environment Variables)
- **Credenciais de Voo (BFF - Servidor)**:
  - `FLIGHT_PROVIDER`: Provedor padrão ativo (`amadeus`, `duffel` ou `rapidapi_skyscanner`).
  - `AMADEUS_CLIENT_ID`: Client ID obtido no portal de desenvolvedores da Amadeus.
  - `AMADEUS_CLIENT_SECRET`: Segredo de autenticação OAuth2 da Amadeus.
  - `AMADEUS_ENV`: Ambiente da API (`test` ou `production`).
  - `DUFFEL_API_TOKEN`: Token de acesso à API da Duffel (caso seja utilizado).
- **Configurações de Segurança e Rate Limiting**:
  - `RATE_LIMIT_SEARCH_MAX`: Limite de buscas por minuto por IP (padrão: `15`).
  - `RATE_LIMIT_WINDOW_MS`: Janela de rate limiting em milissegundos (padrão: `60000`).
  - `CACHE_TTL_SECONDS`: Tempo de cache de buscas idênticas em segundos (padrão: `600`).
- **Configurações Gerais**:
  - `NODE_ENV`: `production` ou `development`.
  - `APP_URL`: URL base da aplicação (ex: `https://aerosearch.vercel.app`).

> **Regra de Ouro**: Nenhuma das variáveis de credenciais acima possui o prefixo `NEXT_PUBLIC_`. Elas existem exclusivamente no escopo de execução do Node.js Serverless.

---

## 3. Pipeline de Integração Contínua (CI/CD)

Todo ciclo de entrega deve validar a Definition of Done (DoD) de forma automatizada (ex: via GitHub Actions e Vercel Checks).

### Etapas do Pipeline (CI):
1. **Instalação de Dependências**:
   - `npm ci` com trava de versões no `package-lock.json`.
2. **Linting e Tipagem**:
   - `npm run lint` (ESLint) para conformidade com regras estáticas de código.
   - `npx tsc --noEmit` para validação estrita de tipos TypeScript.
3. **Testes Automatizados**:
   - `npm run test` (Jest / Vitest) para testes unitários e de integração do BFF (validadores de IATA, mapeadores de dados da API parceira, lógica de rate limit e cache).
4. **Build Check**:
   - `npm run build` para garantir que a geração de rotas e compilação do bundle passe sem erros.

---

## 4. Observabilidade, Monitoramento e Logs

- **Vercel Runtime Logs**: Monitoramento em tempo real de invocações do BFF, status HTTP (200, 400, 429, 500) e tempos de resposta.
- **Tratamento e Redação de Logs**:
  - Proibido imprimir chaves de API, tokens bearer ou dados privados nos logs do servidor.
  - Erros capturados em chamadas upstream devem logar apenas o status code e código de erro retornado pela Amadeus/Duffel.
