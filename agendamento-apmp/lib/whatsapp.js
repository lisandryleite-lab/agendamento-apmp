async function enviarMensagem(telefone, mensagem) {
  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;

  if (!instanceId || !token) {
    console.log('[WhatsApp] Z-API não configurada. Para ativar, defina ZAPI_INSTANCE_ID e ZAPI_TOKEN no .env');
    return { ok: false, motivo: 'Z-API não configurada' };
  }

  const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;

  const headers = { 'Content-Type': 'application/json' };
  if (clientToken) headers['Client-Token'] = clientToken;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone: telefone, message: mensagem })
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error('[WhatsApp] Erro Z-API:', resp.status, data);
    }
    return { ok: resp.ok, status: resp.status, data };
  } catch (err) {
    console.error('[WhatsApp] Erro de rede:', err.message);
    return { ok: false, motivo: err.message };
  }
}

module.exports = { enviarMensagem };
