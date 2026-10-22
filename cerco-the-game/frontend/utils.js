const logBox = document.getElementById("battleLog");

const filaDeEscrita = [];
let escrevendoNoLog = false;

function enfileirarEscrita(tarefa) {
  filaDeEscrita.push(tarefa);
  processarFilaDeEscrita();
}

async function processarFilaDeEscrita() {
  if (escrevendoNoLog) return;
  escrevendoNoLog = true;

  while (filaDeEscrita.length > 0) {
    const tarefa = filaDeEscrita.shift();
    await tarefa();
  }

  escrevendoNoLog = false;
}

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

      if (texto.length === 0) {
        resolve();
      } else {
        digitarProximaLetra();
      }
    });
  });
}

function linhaEmBranco() {
  escrever("");
}

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

function statusJogador(nome, hp, hpMax, dmg) {
  document.getElementById("playerName").textContent = nome;
  const pct = Math.max(0, Math.min(100, (hp / hpMax) * 100));
  document.getElementById("playerHpFill").style.width = pct + "%";
  document.getElementById("playerHpNumbers").textContent = `${Math.max(0, hp)}/${hpMax}`;
}

function statusInimigo(hp, hpMax, dano) {
  const pct = Math.max(0, Math.min(100, (hp / hpMax) * 100));
  document.getElementById("enemyHpFill").style.width = pct + "%";
  document.getElementById("enemyHpNumbers").textContent = `${Math.max(0, hp)}/${hpMax}`;
}

function menuAtaques(lista, aoClicar) {
  const attackMenu = document.getElementById("attackMenu");

  attackMenu.querySelectorAll(".attack-option").forEach((el) => el.remove());

  const btnVoltar = document.getElementById("btnVoltar");
  lista.forEach((nomeAtaque, index) => {
    const btn = document.createElement("button");
    btn.className = "action-btn enabled attack-option";
    btn.innerHTML = `<span class="arrow">▶</span> ${nomeAtaque}`;
    btn.addEventListener("click", () => aoClicar(index + 1));
    attackMenu.insertBefore(btn, btnVoltar);
  });
}

function numeroFlutuante(alvo, texto, tipo, atraso = 0) {
  const cena = document.querySelector(".battle-scene");
  setTimeout(() => {
    const el = document.createElement("div");
    el.className = `floating-number ${alvo} ${tipo}`;
    el.textContent = texto;
    el.style.marginLeft = `${randInt(-18, 18)}px`;
    el.style.marginBottom = `${randInt(-12, 12)}px`;
    el.addEventListener("animationend", () => el.remove());
    cena.appendChild(el);
  }, atraso);
}
