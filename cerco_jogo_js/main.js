
let estado = null;

function iniciarJogo(chave, nickname) {
  const dados = escolherPersonagem(chave);

  // Troca a tela de seleção pela tela de batalha
  document.getElementById("selectionScreen").classList.add("hidden");
  document.getElementById("battleContainer").classList.remove("hidden");

  // Ajusta o sprite do jogador conforme o personagem escolhido
  const playerSprite = document.getElementById("playerSprite");
  // OBS: só temos a imagem do Kael (zkael.png). Para Lyra/Armstrong,
  // troque o caminho abaixo pela imagem correspondente quando tiver.
  const spritesPorPersonagem = {
    kael: "zKael.png",
    lyra: "zLyra.png", // <-- trocar por sprite da Lyra quando disponível
    armstrong: "zArmstrong.png", // <-- trocar por sprite do Armstrong quando disponível
  };
  playerSprite.style.backgroundImage = `url('${spritesPorPersonagem[chave]}')`;

  estado = {
    nickname,
    personagem: chave,
    nomePersonagem: dados.nome,
    dmg: dados.dmg,
    hp: dados.hp,
    hpMax: dados.hp,
    inimigoHp: CONFIG.INIMIGO_HP,
    inimigoHpMax: CONFIG.INIMIGO_HP,
    inimigoDano: CONFIG.INIMIGO_DANO,
    efeitos: criarEfeitos(),
    turno: 1,
  };

  titulo("CERCO");
  escrever(`Bem-vindo, ${nickname}.`);
  escrever("Sistema CERCO inicializado.");
  escrever("Prepare-se para o combate.");

  titulo("PERSONAGEM SELECIONADO");
  statusJogador(estado.nomePersonagem, estado.hp, estado.hpMax, estado.dmg);

  titulo("UM INIMIGO APARECEU");
  statusInimigo(estado.inimigoHp, estado.inimigoHpMax, estado.inimigoDano);

  // Prepara os botões de ação (ATACAR / CURAR / FUGIR / PASSAR A VEZ)
  configurarBotoesAcao();

  novoTurno();
}

function novoTurno() {
  titulo(`TURNO ${estado.turno}`);
  statusJogador(estado.nomePersonagem, estado.hp, estado.hpMax, estado.dmg);
  statusInimigo(estado.inimigoHp, estado.inimigoHpMax, estado.inimigoDano);
  escrever(`Poções: ${estado.efeitos.pocoes}`);

  // EFEITOS POR TURNO (equivalente a aplicar_efeitos)
  estado.inimigoHp = aplicarEfeitos(estado.efeitos, estado.inimigoHp);
  estado.inimigoHp = Math.max(0, estado.inimigoHp);
  statusInimigo(estado.inimigoHp, estado.inimigoHpMax, estado.inimigoDano);

  document.getElementById("dialogueLabel").textContent = `O que ${estado.nomePersonagem} vai fazer?`;
  mostrarMenu("mainMenu");
  habilitarBotoesAcao(true);

  // Monta o submenu de ataques específico do personagem escolhido
  menuAtaques(NOMES_ATAQUES[estado.personagem], executarAtaque);
}

function executarAtaque(numero) {
  habilitarBotoesAcao(false);

  const funcaoAtaque = FUNCOES_ATAQUE[estado.personagem];
  const resultado = funcaoAtaque(numero, estado.dmg, estado.hp, estado.inimigoHp, estado.inimigoDano, estado.efeitos);

  estado.hp = resultado.hp;
  estado.inimigoHp = resultado.inimigoHp;
  estado.efeitos = resultado.efeitos;

  finalizarAcao(false);
}

function executarCurar() {
  habilitarBotoesAcao(false);

  const resultado = usarPocao(estado.hp, estado.hpMax, estado.efeitos);
  estado.hp = resultado.hp;
  estado.efeitos = resultado.efeitos;

  if (!resultado.valido) {
    // Sem poções: não gasta o turno, apenas reabilita os botões (igual ao "return ... False" do Python)
    habilitarBotoesAcao(true);
    return;
  }

  finalizarAcao(false);
}


function executarPassarVez() {
  habilitarBotoesAcao(false);
  estado.hp = pularVez(estado.hp, estado.inimigoDano);
  finalizarAcao(false);
}

function executarFugir() {
  habilitarBotoesAcao(false);
  const resultado = tentarFuga(estado.hp, estado.inimigoDano);
  estado.hp = resultado.hp;
  finalizarAcao(resultado.fugiu);
}

function finalizarAcao(fugiu) {
  estado.hp = Math.max(0, estado.hp);
  estado.inimigoHp = Math.max(0, estado.inimigoHp);

  statusJogador(estado.nomePersonagem, estado.hp, estado.hpMax, estado.dmg);
  statusInimigo(estado.inimigoHp, estado.inimigoHpMax, estado.inimigoDano);

  escrever(`VIDA ${estado.nomePersonagem.toUpperCase()}: ${estado.hp}`);
  escrever(`VIDA INIMIGO: ${estado.inimigoHp}`);

  if (fugiu) {
    fimDeJogo("fuga");
    return;
  }

  if (estado.hp <= 0 || estado.inimigoHp <= 0) {
    fimDeJogo(estado.hp <= 0 ? "derrota" : "vitoria");
    return;
  }

  estado.turno += 1;
  // pequena pausa antes do próximo turno 
  setTimeout(novoTurno, 900);
}


function fimDeJogo(resultado) {
  habilitarBotoesAcao(false);

  if (resultado === "fuga") {
    titulo("FUGA BEM-SUCEDIDA");
    escrever("Você escapou do combate com vida.");
  } else if (resultado === "derrota") {
    titulo("VOCÊ MORREU");
    escrever("Sua vida chegou a zero.");
  } else {
    titulo("VITÓRIA");
    escrever("O inimigo foi derrotado.");
    statusJogador(estado.nomePersonagem, estado.hp, estado.hpMax, estado.dmg);
  }

  document.getElementById("dialogueLabel").textContent = "Fim de jogo. Recarregue a página para jogar novamente.";
}

// CONTROLE DOS MENUS/BOTÕES

function mostrarMenu(idMenuVisivel) {
  const mainMenu = document.getElementById("mainMenu");
  const attackMenu = document.getElementById("attackMenu");

  [mainMenu, attackMenu].forEach((menu) => {
    menu.classList.add("hidden");
    menu.classList.remove("menu-animate");
  });

  const menuAlvo = document.getElementById(idMenuVisivel);
  menuAlvo.classList.remove("hidden");
  void menuAlvo.offsetWidth; // reinicia a animação de entrada
  menuAlvo.classList.add("menu-animate");
}

function habilitarBotoesAcao(habilitado) {
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.disabled = !habilitado;
  });
}

function configurarBotoesAcao() {
  document.getElementById("btnAtacar").addEventListener("click", () => {
    document.getElementById("dialogueLabel").textContent = "Selecione uma habilidade...";
    mostrarMenu("attackMenu");
  });

  document.getElementById("btnVoltar").addEventListener("click", () => {
    document.getElementById("dialogueLabel").textContent = `O que ${estado.nomePersonagem} vai fazer?`;
    mostrarMenu("mainMenu");
  });

  document.getElementById("btnCurar").addEventListener("click", executarCurar);
  document.getElementById("btnFugir").addEventListener("click", executarFugir);
  document.getElementById("btnPassarVez").addEventListener("click", executarPassarVez);
}
