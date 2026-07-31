// Referência da caixa de log (equivalente aos vários print() do Python)
const logBox = document.getElementById("battleLog");

// ------------------------------------------------------
// FILA DE ESCRITA - reproduz o efeito letra por letra do
// escrever() do Python (que usava time.sleep entre caracteres).
// Tudo que entra aqui (escrever ou titulo) é exibido em ORDEM,
// uma linha de cada vez, mesmo que várias chamadas aconteçam
// no mesmo instante do código.
// ------------------------------------------------------
const filaDeEscrita = [];
let escrevendoNoLog = false;

function enfileirarEscrita(tarefa) {
  filaDeEscrita.push(tarefa);
  processarFilaDeEscrita();
}

async function processarFilaDeEscrita() {
  if (escrevendoNoLog) return; // já tem um processamento rodando
  escrevendoNoLog = true;

  while (filaDeEscrita.length > 0) {
    const tarefa = filaDeEscrita.shift();
    await tarefa();
  }

  escrevendoNoLog = false;
}

/**
 * escrever(texto, velocidade) - equivalente à função escrever() do utils.py
 * Escreve letra por letra dentro de uma <div>, com uma pequena pausa
 * entre cada caractere (velocidade em ms, igual ao time.sleep do Python).
 */
function escrever(texto, velocidade = CONFIG.VELOCIDADE_PADRAO) {
  enfileirarEscrita(() => {
    return new Promise((resolve) => {
      const linha = document.createElement("div");
      logBox.appendChild(linha);

      let i = 0;
      function digitarProximaLetra() {
        if (i < texto.length) {
          linha.textContent += texto[i];
          i += 1;
          logBox.scrollTop = logBox.scrollHeight;
          setTimeout(digitarProximaLetra, velocidade);
        } else {
          resolve();
        }
      }

      // Se a linha estiver vazia (linhaEmBranco), resolve na hora
      if (texto.length === 0) {
        resolve();
      } else {
        digitarProximaLetra();
      }
    });
  });
}

/** Adiciona uma linha em branco no log (separador visual) */
function linhaEmBranco() {
  escrever("");
}

/**
 * titulo(texto) - equivalente à função titulo() do utils.py
 * Aparece na hora (sem digitação), igual ao print() do Python usado
 * para os cabeçalhos - mas entra na mesma fila para manter a ordem
 * correta em relação às linhas que estão sendo digitadas.
 */
function titulo(texto) {
  enfileirarEscrita(() => {
    return new Promise((resolve) => {
      const el = document.createElement("div");
      el.className = "log-titulo";
      el.textContent = `── ${texto} ──`;
      logBox.appendChild(el);
      logBox.scrollTop = logBox.scrollHeight;
      resolve();
    });
  });
}

/**
 * statusJogador(nome, hp, hpMax, dmg) - equivalente ao status_jogador() do utils.py
 * Atualiza os elementos visuais de HP do jogador (nome, barra e número).
 */
function statusJogador(nome, hp, hpMax, dmg) {
  document.getElementById("playerName").textContent = nome;
  const pct = Math.max(0, Math.min(100, (hp / hpMax) * 100));
  document.getElementById("playerHpFill").style.width = pct + "%";
  document.getElementById("playerHpNumbers").textContent = `${Math.max(0, hp)}/${hpMax}`;
}

/**
 * statusInimigo(hp, hpMax, dano) - equivalente ao status_inimigo() do utils.py
 * Atualiza os elementos visuais de HP do inimigo.
 */
function statusInimigo(hp, hpMax, dano) {
  const pct = Math.max(0, Math.min(100, (hp / hpMax) * 100));
  document.getElementById("enemyHpFill").style.width = pct + "%";
  document.getElementById("enemyHpNumbers").textContent = `${Math.max(0, hp)}/${hpMax}`;
}

/**
 * menuAtaques(lista) - equivalente ao menu_ataques() do utils.py
 * Em vez de imprimir "1. Nome" no terminal, monta os botões do
 * submenu de ataque dinamicamente (chamado pelo main.js).
 */
function menuAtaques(lista, aoClicar) {
  const attackMenu = document.getElementById("attackMenu");

  // Remove botões de ataque anteriores (mantém o botão VOLTAR fixo no HTML)
  attackMenu.querySelectorAll(".attack-option").forEach((el) => el.remove());

  // Cria um botão para cada ataque da lista, na ordem, antes do botão VOLTAR
  const btnVoltar = document.getElementById("btnVoltar");
  lista.forEach((nomeAtaque, index) => {
    const btn = document.createElement("button");
    btn.className = "action-btn enabled attack-option";
    btn.innerHTML = `<span class="arrow">▶</span> ${nomeAtaque}`;
    btn.addEventListener("click", () => aoClicar(index + 1)); // 1, 2, 3...
    attackMenu.insertBefore(btn, btnVoltar);
  });
}