/**
 * Diagnóstico das credenciais Z-API (confirmações / avisos).
 *
 * Lê ZAPI_INSTANCE_ID, ZAPI_TOKEN e ZAPI_CLIENT_TOKEN do .env e:
 *   1) consulta o status da instância (conectada ao WhatsApp?);
 *   2) opcionalmente envia uma mensagem de teste.
 *
 *   node testar-zapi.js                  → só checa o status
 *   node testar-zapi.js 5581989047832    → checa status e envia teste p/ esse número
 *
 * Onde achar os valores: painel z-api.io → sua instância →
 *   ID da instância, Token, e (aba Segurança) o Client-Token.
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const instanceId  = process.env.ZAPI_INSTANCE_ID;
const token       = process.env.ZAPI_TOKEN;
const clientToken = process.env.ZAPI_CLIENT_TOKEN;
const destino     = process.argv[2];

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (clientToken) h['Client-Token'] = clientToken;
  return h;
}

async function main() {
  console.log('=== Diagnóstico Z-API ===');
  console.log('ZAPI_INSTANCE_ID :', instanceId ? 'OK' : '❌ VAZIO');
  console.log('ZAPI_TOKEN       :', token ? 'OK' : '❌ VAZIO');
  console.log('ZAPI_CLIENT_TOKEN:', clientToken ? 'OK' : '⚠️  vazio (pode ser exigido)');

  if (!instanceId || !token) {
    console.log('\n❌ Faltam credenciais. Preencha no .env e rode de novo.');
    process.exit(1);
  }

  // 1) Status da instância
  const statusUrl = `https://api.z-api.io/instances/${instanceId}/token/${token}/status`;
  console.log('\n→ Consultando status da instância...');
  try {
    const r = await fetch(statusUrl, { headers: headers() });
    const data = await r.json().catch(() => ({}));
    console.log('  HTTP', r.status, JSON.stringify(data));

    if (r.status === 401 || r.status === 403) {
      console.log('  ❌ Não autorizado — INSTANCE_ID/TOKEN/CLIENT-TOKEN errados ou expirados.');
    } else if (data.connected === true) {
      console.log('  ✅ Instância CONECTADA ao WhatsApp. Credenciais válidas.');
    } else if (data.connected === false) {
      console.log('  ⚠️  Credenciais OK, mas o WhatsApp NÃO está conectado nessa instância.');
      console.log('     → Reconecte no painel z-api.io (escaneie o QR da instância).');
    } else {
      console.log('  ⚠️  Resposta inesperada — verifique no painel z-api.io.');
    }
  } catch (err) {
    console.log('  ❌ Erro de rede:', err.message);
  }

  // 2) Envio de teste (opcional)
  if (destino) {
    const sendUrl = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;
    console.log(`\n→ Enviando mensagem de teste para ${destino}...`);
    try {
      const r = await fetch(sendUrl, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ phone: destino, message: '✅ Teste Z-API — Agendamento APMP funcionando.' })
      });
      const data = await r.json().catch(() => ({}));
      console.log('  HTTP', r.status, JSON.stringify(data));
      console.log(r.ok ? '  ✅ Enviado.' : '  ❌ Falhou — veja o erro acima.');
    } catch (err) {
      console.log('  ❌ Erro de rede:', err.message);
    }
  } else {
    console.log('\nDica: passe um número para testar o envio → node testar-zapi.js 5581989047832');
  }
}

main();
