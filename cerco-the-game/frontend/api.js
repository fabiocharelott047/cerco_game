
const API_BASE = "http://localhost:1880";


async function apiIniciarPartida(dados) {
  try {
    const resp = await fetch(`${API_BASE}/api/partida/iniciar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!resp.ok) throw new Error("Falha ao iniciar partida no servidor");
    return await resp.json();
  } catch (e) {
    console.error("[API] iniciar partida:", e);
    return null;
  }
}

async function apiConsultarPersonagem(idPersonagem) {
  try {
    const resp = await fetch(`${API_BASE}/api/personagem/${idPersonagem}`);
    if (!resp.ok) throw new Error("Personagem não encontrado no servidor");
    return await resp.json();
  } catch (e) {
    console.error("[API] consultar personagem:", e);
    return null;
  }
}

async function apiEnviarStatusTurno(idPartida, idPersonagemJogador, hpJogador, idPersonagemInimigo, hpInimigo) {
  try {
    await fetch(`${API_BASE}/api/partida/status-turno`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_partida: idPartida,
        id_personagem_jogador: idPersonagemJogador,
        hp_jogador: hpJogador,
        id_personagem_inimigo: idPersonagemInimigo,
        hp_inimigo: hpInimigo,
      }),
    });
  } catch (e) {
    console.error("[API] status do turno:", e);
  }
}

async function apiEnviarEfeitoPersistente(idPartida, ordemTurno, idPersonagemAlvo, turnos) {
  try {
    await fetch(`${API_BASE}/api/personagem/efeito`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_partida: idPartida,
        ordem_turno: ordemTurno,
        id_personagem_alvo: idPersonagemAlvo,
        turnos: turnos,
      }),
    });
  } catch (e) {
    console.error("[API] efeito persistente:", e);
  }
}


async function apiUsarItem(idPersonagem, idItem) {
  try {
    await fetch(`${API_BASE}/api/personagem/usar-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_personagem: idPersonagem, id_item: idItem }),
    });
  } catch (e) {
    console.error("[API] usar item:", e);
  }
}
