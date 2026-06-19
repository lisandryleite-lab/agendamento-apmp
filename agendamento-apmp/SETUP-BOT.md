# Setup — Bot de Lembretes WhatsApp

O bot envia lembretes automáticos 2 horas antes de cada sessão aprovada.
Ele **não roda na Vercel** (precisa de conexão persistente com o WhatsApp).
Rode em um computador local, VPS ou Raspberry Pi que fique ligado.

---

## Pré-requisitos

- Node.js 18 ou superior
- MongoDB URI (mesma do `.env` da API)
- WhatsApp instalado no celular do responsável que enviará os lembretes

---

## 1. Instalar dependências

Na pasta do projeto:

```bash
npm install
```

Isso instala o Baileys, pino e as demais dependências do bot.

---

## 2. Configurar o .env

O bot usa as mesmas variáveis da API. Certifique-se de que o `.env` existe:

```env
MONGODB_URI=mongodb+srv://...
```

Não são necessárias variáveis extras para o bot.

---

## 3. Primeira execução — vincular WhatsApp

```bash
npm run bot
# ou diretamente:
node bot-whatsapp.js
```

Na primeira vez, um **QR code aparecerá no terminal**.
Abra o WhatsApp no celular → Menu → Aparelhos conectados → Conectar aparelho → escaneie o QR.

A sessão é salva em `./baileys-session/`. Nas próximas execuções, o bot conecta automaticamente sem precisar escanear de novo.

> ⚠️ Não apague a pasta `baileys-session/`. Se apagar, precisará escanear o QR novamente.

---

## 4. Funcionamento

| O que faz | Detalhes |
|---|---|
| Conecta ao WhatsApp | Via QR code ou sessão salva |
| Verifica agendamentos | A cada **30 minutos** |
| Janela de lembrete | Agendamentos **entre 1h50 e 2h10** à frente |
| Mensagem enviada | Para o número do aluno cadastrado no agendamento |
| Marca como avisado | Campo `avisado: true` no MongoDB — não envia duplicatas |
| Logs | Arquivo `bot-whatsapp.log` na raiz do projeto |

---

## 5. Rodar em segundo plano com PM2 (recomendado para VPS)

```bash
npm install -g pm2
pm2 start bot-whatsapp.js --name apmp-bot
pm2 save
pm2 startup   # configura para reiniciar com o servidor
```

Comandos úteis:

```bash
pm2 status          # ver se o bot está rodando
pm2 logs apmp-bot   # ver logs em tempo real
pm2 restart apmp-bot
pm2 stop apmp-bot
```

---

## 6. Sessão desconectada / QR expirou

Se a sessão for desconectada (WhatsApp deslogou o aparelho):

```bash
rm -rf baileys-session/
node bot-whatsapp.js   # escaneie o QR novamente
```

---

## 7. Formato da mensagem enviada

```
⏰ Lembrete — Psicologia APMP

Olá, SILVA! Sua sessão de terapia está agendada para hoje (Quinta, 22/05/2026) às 09:00 às 09:40.

Não esqueça de avisar ao seu Xerife / Auxiliar antes de sair. 🪖

Mensagem automática — APMP · DAS · PMPE
```

---

## 8. Verificar logs

```bash
tail -f bot-whatsapp.log
```

Exemplo de saída normal:

```
[2026-05-20T07:00:05.123Z] [INFO] === Bot Psicologia APMP iniciando ===
[2026-05-20T07:00:05.124Z] [INFO] Intervalo de verificação: 30 min
[2026-05-20T07:00:20.001Z] [INFO] WhatsApp conectado. Bot ativo.
[2026-05-20T07:00:35.002Z] [INFO] Verificando agendamentos...
[2026-05-20T07:00:35.120Z] [INFO] 3 agendamento(s) elegíveis encontrados.
[2026-05-20T07:00:35.310Z] [INFO] Enviando lembrete → SILVA (2026-05-20 09:00)
[2026-05-20T07:00:36.001Z] [INFO] ✓ Lembrete enviado e marcado para SILVA.
```
