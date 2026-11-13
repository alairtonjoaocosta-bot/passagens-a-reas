# 00 - Constituição do Projeto AeroSearch

Este documento contém as regras fundamentais e inegociáveis para o desenvolvimento do projeto.

## Regras Inegociáveis

1. **SPEC-FIRST**: Não escreva código sem uma especificação formal aprovada no diretório `/specs`.
2. **FONTE DA VERDADE**: O conteúdo de `/specs` tem precedência sobre qualquer instrução vaga ou ambígua vinda do chat.
3. **MEMÓRIA OBRIGATÓRIA**: No início de TODA tarefa, leia impreterivelmente:
   - `/specs/00-constitution.md`
   - `/specs/STATE.md`
   - As especificações relevantes da tarefa corrente.
4. **ARQUITETURA**: 
   - Frontend: Next.js.
   - Backend (BFF): Node.js para orquestração e consumo de APIs externas de voos (ex: Amadeus, Duffel), garantindo que credenciais/chaves de API nunca sejam expostas ao cliente web.
5. **DEFINITION OF DONE (DoD)**:
   - Código implementado e funcional.
   - Testes automatizados passando.
   - Linter sem erros.
   - Specs e `STATE.md` devidamente atualizados.
6. **INTEGRAÇÃO OFICIAL**: Proibido estritamente web scraping. Todas as integrações com dados de voos devem ser feitas através de APIs oficiais autorizadas.

