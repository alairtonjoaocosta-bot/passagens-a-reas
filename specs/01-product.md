# 01 - Especificação de Produto: AeroSearch

## 1. Visão do Produto
O **AeroSearch** é uma plataforma agregadora e comparadora de passagens aéreas projetada para fornecer aos usuários pesquisas transparentes, rápidas e em tempo real sobre voos comerciais. A plataforma soluciona a fricção de encontrar tarifas e opções de voo consolidadas, garantindo que o usuário seja direcionado de forma segura e direta (via deep links de parceiros/APIs) para a finalização da compra na companhia aérea ou OTA (Online Travel Agency) emissora, sem intermediar transações financeiras de bilhetagem localmente e sem recorrer a técnicas instáveis e ilegais de web scraping.

---

## 2. Personas

### Persona 1: O Viajante a Lazer Sensível a Preço ("Lucas, 29 anos")
- **Perfil**: Planeja viagens com antecedência ou flexibilidade, priorizando o menor custo.
- **Necessidades**: Visualizar facilmente combinações de preço mais baixas, filtrar por número de paradas/escalas e comparar companhias aéreas sem pegadinhas.
- **Dores**: Preços que mudam na hora do clique e falta de clareza sobre taxas embutidas.

### Persona 2: O Viajante a Negócios ("Mariana, 38 anos")
- **Perfil**: Foco em eficiência de tempo, voos diretos e horários convenientes.
- **Necessidades**: Filtragem ágil por horário de partida/chegada, voos sem escala e seleção de companhias de preferência.
- **Dores**: Perda de tempo em interfaces lentas ou confusas que exigem cadastro antes de ver o preço real.

---

## 3. Requisitos Funcionais (RF)

- **RF01 - Motor de Busca de Voos**:
  - O usuário pode selecionar o tipo de rota: Ida e Volta (Round-Trip) ou Somente Ida (One-Way).
  - O usuário deve informar Aeroporto de Origem e Aeroporto de Destino (com suporte a busca por código IATA ou nome da cidade/aeroporto com auto-complete).
  - O usuário deve selecionar a Data de Ida e, se aplicável, Data de Volta.
  - O usuário deve informar o número de passageiros por faixa etária: Adultos (12+), Crianças (2-11) e Bebês (0-2), além da classe de cabine (Econômica, Premium Economy, Executiva, Primeira Classe).

- **RF02 - Listagem de Resultados**:
  - Apresentar lista clara de voos disponíveis retornados pela API parceira com:
    - Preço total consolidado e moeda.
    - Companhia(s) aérea(s) operadora(s) e logos/nomes.
    - Horários de saída/chegada e duração total da viagem.
    - Quantidade e duração das escalas (caso existam) e aeroportos de conexão.
  - Indicação do status da tarifa (se inclui bagagem de mão/despachada, caso provido pela API).

- **RF03 - Filtros Dinâmicos e Ordenação**:
  - **Filtros**:
    - Número de paradas (Direto, 1 parada, 2+ paradas).
    - Faixa de preço (slider dinâmico min/max).
    - Companhias aéreas (checkbox por companhia presente nos resultados).
    - Horários de partida e chegada (faixas horárias: manhã, tarde, noite, madrugada).
  - **Ordenação**:
    - Mais barato primeiro.
    - Mais rápido primeiro (menor duração).
    - Melhor custo-benefício (equilíbrio entre duração e preço).

- **RF04 - Redirecionamento Direto para Compra (Deep Link / Handoff)**:
  - Para cada opção listada, haverá um botão explícito "Comprar" ou "Ir para a Companhia".
  - O clique abre em uma nova aba o deep link oficial fornecido pela API para a página de checkout/revisão na respectiva OTA ou companhia aérea.
  - Não há checkout ou processamento de cartão de crédito no AeroSearch.

---

## 4. Requisitos Não Funcionais (RNF)

- **RNF01 - Desempenho e Latência**:
  - Respostas agregadas do BFF devem ser retornadas em até 3 segundos (sujeito aos SLAs da API upstream de voos).
  - Implementação de cache temporário inteligente em nível de BFF para requisições idênticas recentes (respeitando as regras de expiração e validade de tarifas da API parceira).
- **RNF02 - Usabilidade e Responsividade**:
  - Interface moderna, acessível e 100% responsiva (Mobile First e Desktop).
  - Estado de carregamento elegante (skeletons e feedback visual) durante consultas às APIs upstream.
- **RNF03 - Arquitetura Segura e Limpa**:
  - Separação estrita de camadas: Frontend em Next.js e Backend (BFF) em Node.js.
  - O cliente web nunca acessa chaves privadas de APIs de voos; todas as chamadas de terceiros são encapsuladas e autenticadas no BFF.
- **RNF04 - Disponibilidade e Resiliência**:
  - Tratamento gracioso de erros para falhas de timeout, limite de taxa (rate limit) ou indisponibilidade da API externa parceira, exibindo mensagens claras ao usuário.

---

## 5. Restrições de Negócio e Técnicas

- **REST01 - Sem Web Scraping**: Proibição terminante de web scraping, crawlers não autorizados ou automações não documentadas de sites de terceiros. Todos os dados devem originar-se de APIs oficiais (ex: Amadeus for Developers, Duffel Flight API ou provedores via RapidAPI/Skyscanner).
- **REST02 - Sem Transação Financeira Local**: O AeroSearch atua exclusivamente como agregador e motor de busca com redirecionamento de afiliados/deep links; não há armazenamento de dados sensíveis de pagamento (PCI-DSS out-of-scope).
- **REST03 - Licenciamento e Conformidade de Dados**: Todas as diretrizes de branding e exibição de preços das companhias aéreas e provedores de API devem ser estritamente seguidas.

