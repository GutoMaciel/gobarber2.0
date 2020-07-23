# Testes automatizados

Que a nossa aplicação continue funcionando independente do número de novas funcionalidades e do número de devs no time.

1. Testes unitários (TDD)
Testam funcionalidades específicas da nossa aplicação (precisam ser funções puras).

JAMAIS: Chamada à uma API e efeito colateral.

2. Testes de integração
Testam uma funcionalidade completa, passando por várias camadas da aplicação.

Exemplo:  Criação de um usuário.
Route -> Controller -> Service -> Repositório ....

3. Testes E2E (End to end)
Testes que simulam a ação do usuário dentro da nossa aplicação. Mais para interfaces, simulando o usuário mexendo na nossa aplicação, preenchendo inputs, clicando em botões, etc...


# TDD (Test Driven Development)
- Quando o user se cadastrar na aplicação, ele deve receber um email de boas-vindas;
Isso já da um norte para iniciar o desenvolvimento e verificando se estamos no caminho certo.

