const API_BASE = "http://localhost:1880";

async function apiPost(rota, corpo) {
  try {
    const resp = await fetch(`${API_BASE}${rota}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} em ${rota}`);
    return await resp.json();
  } catch (e) {
    console.error("[API]", e);
    return null;
  }
}

function apiIniciarPartida(dados) {
  return apiPost("/api/partida/iniciar", dados);
}

async function apiConsultarPersonagem(idPersonagem) {
  try {
    const resp = await fetch(`${API_BASE}/api/personagem/${idPersonagem}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ao consultar personagem ${idPersonagem}`);
    return await resp.json();
  } catch (e) {
    console.error("[API]", e);
    return null;
  }
}

function apiEnviarStatusTurno(idPartida, idPersonagemJogador, hpJogador, idPersonagemInimigo, hpInimigo) {
  if (!idPartida) return Promise.resolve(null);
  return apiPost("/api/partida/status-turno", {
    id_partida: idPartida,
    id_personagem_jogador: idPersonagemJogador,
    hp_jogador: hpJogador,
    id_personagem_inimigo: idPersonagemInimigo,
    hp_inimigo: hpInimigo,
  });
}

function apiEnviarEfeitoPersistente(idPartida, ordemTurno, idPersonagemAlvo, turnos) {
  if (!idPartida) return Promise.resolve(null);
  return apiPost("/api/personagem/efeito", {
    id_partida: idPartida,
    ordem_turno: ordemTurno,
    id_personagem_alvo: idPersonagemAlvo,
    turnos: turnos,
  });
}

function apiUsarItem(idPersonagem, idItem) {
  if (!idPersonagem) return Promise.resolve(null);
  return apiPost("/api/personagem/usar-item", { id_personagem: idPersonagem, id_item: idItem });
}

function apiFinalizarPartida(idPartida, idVencedor) {
  if (!idPartida) return Promise.resolve(null);
  return apiPost("/api/partida/finalizar", { id_partida: idPartida, id_vencedor: idVencedor });
}
