# 03 - Segurança e Conformidade (Security Spec)

## 1. Princípios Gerais de Segurança
A segurança no **AeroSearch** é orientada pelos princípios de privilégio mínimo, defesa em profundidade, validação rigorosa de borda (boundary validation) e proteção ativa contra exaustão de cotas de APIs externas.

---

## 2. Proteção Rigorosa de Segredos e Chaves de API

- **Isolamento de Credenciais Upstream**:
  - Chaves de API, credenciais de autenticação (ex: `API_KEY`, `API_SECRET` de Amadeus, Duffel ou RapidAPI) **NUNCA** devem ser expostas ou compiladas no bundle do Next.js voltado ao cliente.
  - É expressamente proibido prefixar variáveis de ambiente sensíveis com `NEXT_PUBLIC_`.
  - Todas as chamadas para as APIs de companhias aéreas ou agregadores devem ser orquestradas exclusivamente pelo Backend (BFF) em tempo de execução no servidor Node.js.
- **Gerenciamento de Segredos**:
  - Em ambiente local: armazenamento em arquivo `.env` (ignorado expressamente pelo `.gitignore`).
  - Em ambiente de produção: injeção via variáveis de ambiente seguras da plataforma de hospedagem ou Secrets Manager.
  - Rotação regular de tokens OAuth2 efetuada em memória no servidor/BFF (ex: tokens Amadeus têm expiração curta e devem ser cacheados e renovados apenas no backend).

---

## 3. Rate Limiting e Proteção de Cotas (BFF)

Para prevenir ataques de negação de serviço (DoS), abusos automatizados e custos surpresa decorrentes de estourar a cota de requisições de provedores pagos/freemium:

- **Estratégia de Rate Limit por IP**:
  - O BFF deve interceptar as rotas de busca (ex: `/api/flights/search`) aplicando limitadores de taxa baseados no IP do cliente (`X-Forwarded-For` ou socket IP confiável).
  - **Limite Padrão Recomendado**:
    - Busca de voos: Máximo de **10 a 20 requisições por minuto por IP**.
    - Auto-complete de aeroportos/cidades: Máximo de **30 a 60 requisições por minuto por IP** (com debounce no frontend e cache no servidor).
- **Resposta ao Exceder o Limite**:
  - Retornar status HTTP `429 Too Many Requests`.
  - Incluir cabeçalho padrão `Retry-After` indicando o tempo de espera até o desbloqueio.
  - Resposta padronizada em JSON com mensagem amigável para o cliente:
    ```json
    {
      "error": "TOO_MANY_REQUESTS",
      "message": "Você atingiu o limite de buscas temporário. Por favor, aguarde alguns instantes."
    }
    ```
- **Proteção por Camada de Cache**:
  - O BFF deve cachear resultados idênticos de busca por um intervalo de curta duração (ex: 5 a 15 minutos), reduzindo consultas redundantes enviadas à API upstream e economizando cotas.

---

## 4. Validação Rigorosa e Sanitização de Entrada (Input Validation)

Nenhuma requisição deve ser repassada à API de voos externa sem passar por validação estrita no BFF:

- **Validação de Códigos IATA**:
  - Padrão obrigatório: Exatamente 3 caracteres alfabéticos maiúsculos (`^[A-Z]{3}$`).
  - Rejeição imediata de strings malformadas, caracteres especiais ou injeções de parâmetros.
  - Origem e Destino não podem ser idênticos.
- **Validação de Datas**:
  - Formato estrito: Padrão ISO 8601 (`YYYY-MM-DD`).
  - Data de partida (`departureDate`): Não pode ser anterior à data atual (`departureDate >= hoje`).
  - Data de volta (`returnDate`, caso informada): Deve ser igual ou posterior à data de partida (`returnDate >= departureDate`).
  - Janela máxima de antecedência: Limite de até 365 dias no futuro.
- **Validação de Passageiros e Classes**:
  - Passageiros totais: Mínimo de 1 passageiro (adulto), máximo configurável (ex: até 9 passageiros).
  - Número de bebês (`infants`) não pode exceder o número de adultos (`infants <= adults`).
  - Classe de cabine restrita a valores válidos: `ECONOMY`, `PREMIUM_ECONOMY`, `BUSINESS`, `FIRST`.
- **Tratamento de Falha de Validação**:
  - Respostas imediatas com HTTP `400 Bad Request`, sem acionar a API externa:
    ```json
    {
      "error": "INVALID_INPUT",
      "details": [
        { "field": "origin", "message": "Código IATA inválido. Deve conter 3 letras maiúsculas." }
      ]
    }
    ```

---

## 5. Headers de Segurança e Higiene Web

- Aplicação de cabeçalhos de segurança via BFF/Next.js:
  - `Content-Security-Policy` (CSP) configurado adequadamente.
  - `X-Content-Type-Options: nosniff`.
  - `X-Frame-Options: DENY`.
  - `Strict-Transport-Security` (HSTS) para conexões HTTPS.
- Sanitização de URLs de redirecionamento (deep links):
  - Garantir que deep links gerados apontem unicamente para domínios autorizados (whitelist de OTAs e provedores oficiais), mitigando ataques de Open Redirect.
