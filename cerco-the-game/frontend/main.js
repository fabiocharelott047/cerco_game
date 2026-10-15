
let estado = null;

async function iniciarJogo(chave, nickname) {
  const dados = escolherPersonagem(chave);

  // Troca a tela de seleção pela tela de batalha
  document.getElementById("selectionScreen").classList.add("hidden");
  document.getElementById("battleContainer").classList.remove("hidden");

  // Ajusta o sprite do jogador conforme o personagem escolhido
  const playerSprite = document.getElementById("playerSprite");
  const spritesPorPersonagem = {
    kael: "zKael.png",
    lyra: "zLyra.png",
    armstrong: "zArmstrong.png",
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
    // IDs preenchidos após o registro no back-end (ver abaixo)
    id_partida: null,
    id_personagem_jogador: null,
    id_personagem_inimigo: null,
  };

  titulo("CERCO");
  escrever(`Bem-vindo, ${nickname}.`);
  escrever("Hoje as muralhas ainda resistem, mas as forças inimigas avançam.")
  escrever("Seu dever é enfrentar todo inimigo que ousar romper a defesa do reino.")
  escrever("...")
  escrever("Que sua espada permaneça firme.")
  escrever("A batalha começa agora.");
  escrever("...")
  escrever("Prepare-se para o combate.");

  // Integração com o back-end: registra jogador+personagens+partida
  const emailJogador = `${nickname.toLowerCase().trim().replace(/\s+/g, "_") || "jogador"}@cerco.local`;
  const infoPartida = await apiIniciarPartida({
    jogador: { nome: nickname, email: emailJogador },
    personagem: {
      nome_batalha: dados.nome,
      classe: "Guerreiro",
      nivel: 1,
      hp_maximo: dados.hp,
      ataque_basico: dados.dmg,
      defesa: 10,
    },
    inimigo: {
      nome_batalha: "Inimigo",
      classe: "Monstro",
      nivel: 1,
      hp_maximo: CONFIG.INIMIGO_HP,
      ataque_basico: CONFIG.INIMIGO_DANO,
      defesa: 0,
    },
  });

  if (infoPartida && infoPartida.id_partida) {
    estado.id_partida = infoPartida.id_partida;
    estado.id_personagem_jogador = infoPartida.id_personagem_jogador;
    estado.id_personagem_inimigo = infoPartida.id_personagem_inimigo;

    // Requisito 4: no início da partida, consulta nome, vida e itens dos dois personagens
    const [infoJogador, infoInimigo] = await Promise.all([
      apiConsultarPersonagem(estado.id_personagem_jogador),
      apiConsultarPersonagem(estado.id_personagem_inimigo),
    ]);

    if (infoJogador) {
      estado.itensJogador = infoJogador.itens || [];
      escrever(`Servidor confirmou: ${infoJogador.nome_batalha} - ${infoJogador.hp_atual}/${infoJogador.hp_maximo} HP.`);
    }
    if (infoInimigo) {
      escrever(`Servidor confirmou: ${infoInimigo.nome_batalha} - ${infoInimigo.hp_atual}/${infoInimigo.hp_maximo} HP.`);
    }
  } else {
    escrever("Aviso: não foi possível conectar ao servidor. Jogando em modo local.");
  }

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

  const efeitosAntes = { ...estado.efeitos };

  const funcaoAtaque = FUNCOES_ATAQUE[estado.personagem];
  const resultado = funcaoAtaque(numero, estado.dmg, estado.hp, estado.inimigoHp, estado.inimigoDano, estado.efeitos);

  estado.hp = resultado.hp;
  estado.inimigoHp = resultado.inimigoHp;
  estado.efeitos = resultado.efeitos;

  // Requisito 2: se um efeito persistente novo foi aplicado neste ataque, avisa o back-end
  notificarEfeitoPersistenteSeHouver(efeitosAntes, estado.efeitos);

  finalizarAcao(false);
}


function notificarEfeitoPersistenteSeHouver(antes, depois) {
  const campos = ["ferida_profunda_turnos", "espiral_turnos", "marca_turnos"];
  campos.forEach((campo) => {
    if (depois[campo] > 0 && antes[campo] !== depois[campo]) {
      apiEnviarEfeitoPersistente(estado.id_partida, estado.turno, estado.id_personagem_inimigo, depois[campo]);
    }
  });
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

  // Requisito 3: avisa o back-end qual item foi usado, para remover/decrementar no inventário
  apiUsarItem(estado.id_personagem_jogador, CONFIG.ID_ITEM_POCAO);

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

  
  apiEnviarStatusTurno(estado.id_partida, estado.id_personagem_jogador, estado.hp, estado.id_personagem_inimigo, estado.inimigoHp);

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
  document.getElementById("btnReiniciar").classList.remove("hidden");

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

  document.getElementById("btnReiniciar").addEventListener("click", () => {
    location.reload();
  });
}
