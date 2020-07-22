# Recuperação de senha

**Requisitos Funcionais**

- O usuario deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um email com instrucoes de recuperação de senha;
- O usuário deve poder resetar sua senha.

**Requisitos Nao Funcionais**

- Utilizar MailTrap para testar envios em ambiente de dev;
- Utilizar Amazon SES para envios em produção
- O Envio de e-mail deve acontecer em segundo plano (background job)

**Regras de Negocio**

- O link enviado por email para o reset de senha deve expirar em 2 horas.
- O usuário precisa confirmar a nova senha no reset.


# Atualizacao do perfil

**Requisitos Funcionais**

- O usuário dede poder atualizar seu nome, email, senha

**Requisitos Nao Funcionais**

**Regras de negócio**

- O usuário não pode alterar seu email para um email já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

# Painel do Prestador
**Requisitos funcionais**
- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestadore deve poder visualizar as notificações não lidas;

**Requisitos nao funcionais**

- Os agendamentos do prestador em um dia deve ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no mongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando socket.io;

**Regras de negócio**

- A notificação deve ter um status de lida / nao lida controlável


# Agendamento de servicos

**Requisitos Funcionais**

- O usuário deve poder listas todos os prestadores de serviços cadastrados
- O usuário deve poder visualizar os dias de um mes disponiveis de um prestador;
- O usuário deve poder listar horários disponíveis em um dia especifico de um prestador;
- O usuário deve poder realizar um agendamento

**Requisitos Nao Funcionais**

- A listagem de prestadores deve ser armazenada em cache;
-

**Regras de negócio**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponiveis entre 8h às 17h;
- O usuário nao pode agendar um horário já marcado;
- O usuário nao pode agendar um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;
