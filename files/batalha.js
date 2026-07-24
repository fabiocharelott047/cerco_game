// JS da tela de batalha
// Aqui a gente lê os dados do jogador (salvos na tela de login) e roda o combate.

// sorteia um número inteiro entre min e max (os dois incluídos)
function sortearEntre(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ======================================================
// VARIÁVEIS GLOBAIS DE VIDA / COMBATE
// ======================================================
let vida_jogador = 100;
let vida_jogador_max = 100;
let dano_jogador = 25;

let vida_inimigo = 200;
let vida_inimigo_max = 200;
let dano_inimigo = 15;

let chance_fuga = 0.5; // 50% de chance de fugir com sucesso
let batalha_encerrada = false;

// pegando os elementos da tela (igual pegar valor de input, só que aqui é pra exibir dados)
let barra_inimigo = document.getElementById("barraInimigo");
let numero_inimigo = document.getElementById("numeroInimigo");
let barra_jogador = document.getElementById("barraJogador");
let numero_jogador = document.getElementById("numeroJogador");
let nome_jogador_el = document.getElementById("nomeJogador");
let sprite_jogador = document.getElementById("spriteJogador");

let dialogo_box = document.getElementById("dialogoBox");
let historico_lista = document.getElementById("historicoLista");

let menu_principal = document.getElementById("menuPrincipal");
let menu_ataque = document.getElementById("menuAtaque");

// ======================================================
// CARREGANDO OS DADOS DO JOGADOR (vindos da tela de login)
// ======================================================
window.onload = () => {
    let dados_salvos = window.localStorage.getItem("cerco_jogador");

    // se o jogador entrou direto nessa página sem passar pelo login, manda ele de volta
    if (!dados_salvos) {
        alert("Escolha um personagem antes de entrar na batalha.");
        window.location.href = "./index.html";
        return;
    }

    let jogador = JSON.parse(dados_salvos); // transforma o texto salvo de volta em objeto

    vida_jogador_max = jogador.vidaMax;
    vida_jogador = vida_jogador_max;
    dano_jogador = jogador.dano;

    nome_jogador_el.textContent = jogador.personagem.toUpperCase();

    if (jogador.sprite) {
        sprite_jogador.style.backgroundImage = `url('${jogador.sprite}')`;
    }

    // sorteia o inimigo desta partida
    vida_inimigo_max = sortearEntre(120, 350);
    vida_inimigo = vida_inimigo_max;
    dano_inimigo = sortearEntre(10, 50);

    atualizarStatusJogador();
    atualizarStatusInimigo();

    adicionarHistorico(`${jogador.personagem} entrou em combate!`);
    adicionarHistorico("Um inimigo apareceu!");
};

// ======================================================
// FUNÇÕES DE ATUALIZAÇÃO DE TELA
// ======================================================
function atualizarStatusInimigo() {
    if (vida_inimigo < 0) vida_inimigo = 0;

    let porcentagem = (vida_inimigo / vida_inimigo_max) * 100;
    barra_inimigo.style.width = porcentagem + "%";
    numero_inimigo.textContent = `${vida_inimigo}/${vida_inimigo_max}`;
}

function atualizarStatusJogador() {
    if (vida_jogador < 0) vida_jogador = 0;

    let porcentagem = (vida_jogador / vida_jogador_max) * 100;
    barra_jogador.style.width = porcentagem + "%";
    numero_jogador.textContent = `${vida_jogador}/${vida_jogador_max}`;
}

// adiciona uma linha no histórico. o painel tem altura fixa (não cresce):
// a linha nova entra por baixo e as antigas "sobem" até saírem de vista (scroll automático).
function adicionarHistorico(texto) {
    let item = document.createElement("li");
    item.textContent = texto;
    historico_lista.appendChild(item);

    // mantém só um número razoável de linhas guardadas na memória
    while (historico_lista.children.length > 30) {
        historico_lista.removeChild(historico_lista.firstChild);
    }

    // rola pro final, empurrando o texto antigo pra cima/fora do painel
    historico_lista.scrollTop = historico_lista.scrollHeight;
}

// desabilita todos os botões de ação (usado quando a batalha termina)
function encerrarBatalha() {
    batalha_encerrada = true;

    let botoes = document.querySelectorAll(".btn-acao");
    for (let botao of botoes) {
        botao.classList.remove("habilitado");
        botao.disabled = true;
    }
}

// ======================================================
// MENU: ATACAR / VOLTAR
// ======================================================
document.getElementById("btnAtacar").addEventListener("click", () => {
    menu_principal.classList.add("escondido");
    menu_ataque.classList.remove("escondido");
    dialogo_box.textContent = "Selecione uma habilidade...";
});

document.getElementById("btnVoltar").addEventListener("click", () => {
    menu_ataque.classList.add("escondido");
    menu_principal.classList.remove("escondido");
    dialogo_box.textContent = "O que você vai fazer?";
});

// ======================================================
// FUNÇÃO GENÉRICA DE ATAQUE
// ======================================================
function atacarInimigo(nome_ataque, dano) {
    if (batalha_encerrada) return;

    vida_inimigo -= dano;
    if (vida_inimigo < 0) vida_inimigo = 0;

    atualizarStatusInimigo();
    adicionarHistorico(`${nome_ataque} causou ${dano} de dano ao inimigo.`);

    if (vida_inimigo === 0) {
        adicionarHistorico("O inimigo foi derrotado!");
        dialogo_box.textContent = "Vitória!";
        encerrarBatalha();
        return;
    }

    // volta pro menu principal depois do ataque
    menu_ataque.classList.add("escondido");
    menu_principal.classList.remove("escondido");
    dialogo_box.textContent = "O que você vai fazer?";
}

// ======================================================
// CADA ATAQUE DISPONÍVEL
// ======================================================
function ataqueSobrecargaOmega() {
    atacarInimigo("Sobrecarga Ômega", dano_jogador);
}

function ataqueFacasMultiplas() {
    // soma 4 golpes aleatórios (como no jogo original em Python)
    let hit1 = sortearEntre(5, 15);
    let hit2 = sortearEntre(5, 15);
    let hit3 = sortearEntre(5, 15);
    let hit4 = sortearEntre(5, 15);

    atacarInimigo("Facas Múltiplas", hit1 + hit2 + hit3 + hit4);
}

function ataqueVeneno() {
    atacarInimigo("Veneno", 20);
}

document.getElementById("btnSobrecarga").addEventListener("click", ataqueSobrecargaOmega);
document.getElementById("btnFacas").addEventListener("click", ataqueFacasMultiplas);
document.getElementById("btnVeneno").addEventListener("click", ataqueVeneno);

// ======================================================
// FUGIR
// ======================================================
function tentarFuga() {
    if (batalha_encerrada) return;

    let conseguiu_fugir = Math.random() <= chance_fuga;

    if (conseguiu_fugir) {
        adicionarHistorico("Você fugiu do combate com sucesso!");
        dialogo_box.textContent = "Você fugiu da batalha.";
        encerrarBatalha();
        return;
    }

    // a fuga falhou: o jogador ainda leva o dano do inimigo
    vida_jogador -= dano_inimigo;
    atualizarStatusJogador();
    adicionarHistorico(`Fuga falhou! Você sofreu ${dano_inimigo} de dano.`);

    if (vida_jogador === 0) {
        adicionarHistorico("Você foi derrotado...");
        dialogo_box.textContent = "Derrota...";
        encerrarBatalha();
        return;
    }

    dialogo_box.textContent = "O que você vai fazer?";
}

document.getElementById("btnFugir").addEventListener("click", tentarFuga);

// ======================================================
// PASSAR A VEZ
// ======================================================
function passarVez() {
    if (batalha_encerrada) return;

    vida_jogador -= dano_inimigo;
    atualizarStatusJogador();
    adicionarHistorico(`Você recuou e observou o inimigo. Sofreu ${dano_inimigo} de dano.`);

    if (vida_jogador === 0) {
        adicionarHistorico("Você foi derrotado...");
        dialogo_box.textContent = "Derrota...";
        encerrarBatalha();
    }
}

document.getElementById("btnPassar").addEventListener("click", passarVez);
