// Função de login / escolha de personagem
// funcao nome da funcao (nome dos parametros) { corpo da funcao }

// Aqui guardamos os dados de cada personagem disponível: faixa de vida (hp) e dano (dmg).
// Isso é parecido com um "dicionário" do Python, só que em JS chamamos de objeto.
const PERSONAGENS = {
    kael:      { nome: "Kael",      hpMin: 200, hpMax: 300, dmgMin: 25, dmgMax: 50, sprite: "zkael.png" },
    lyra:      { nome: "Lyra",      hpMin: 200, hpMax: 250, dmgMin: 30, dmgMax: 50, sprite: null },
    armstrong: { nome: "Armstrong", hpMin: 220, hpMax: 350, dmgMin: 27, dmgMax: 70, sprite: null },
};

// variável que guarda qual personagem foi clicado (começa sem nenhum selecionado)
let personagemEscolhido = null;

// pegando os elementos da tela assim que o script carrega
let input_nickname = document.getElementById("nickname");
let char_grid = document.getElementById("charGrid");
let btn_entrar = document.getElementById("btnEntrar");

// deixa o card clicado com destaque (classe "selected") e desmarca os outros
function selecionarPersonagem(card) {
    let todosOsCards = char_grid.querySelectorAll(".char-card");

    for (let c of todosOsCards) {
        c.classList.remove("selected");
    }

    card.classList.add("selected");
    personagemEscolhido = card.dataset.char; // dataset.char lê o atributo data-char do html

    atualizarBotaoEntrar();
}

// liga o clique de cada card de personagem na função acima
let cards = char_grid.querySelectorAll(".char-card");
for (let card of cards) {
    card.addEventListener("click", () => selecionarPersonagem(card));
}

// habilita o botão "Iniciar Batalha" só quando tiver nickname digitado E personagem escolhido
function atualizarBotaoEntrar() {
    let temNickname = input_nickname.value.trim().length > 0;

    if (temNickname && personagemEscolhido) {
        btn_entrar.classList.remove("desabilitado");
    } else {
        btn_entrar.classList.add("desabilitado");
    }
}

input_nickname.addEventListener("input", atualizarBotaoEntrar);
atualizarBotaoEntrar(); // já deixa o botão desabilitado assim que a página abre

// sorteia um número inteiro entre min e max (os dois incluídos)
function sortearEntre(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// função assíncrona: dá pra usar "await" dentro dela caso precise esperar uma resposta no futuro
async function onLogin(event) {
    event.preventDefault(); // previne o padrão do botão de submit, que é recarregar a página

    let nickname = input_nickname.value.trim();

    if (!nickname || !personagemEscolhido) {
        alert("Digite um nickname e escolha um personagem antes de continuar.");
        return;
    }

    let dados = PERSONAGENS[personagemEscolhido];

    // monta o "pacote" de dados do jogador para a tela de batalha
    let jogador = {
        nickname: nickname,
        personagem: dados.nome,
        sprite: dados.sprite,
        vidaMax: sortearEntre(dados.hpMin, dados.hpMax),
        dano: sortearEntre(dados.dmgMin, dados.dmgMax),
    };

    console.log("Jogador pronto para a batalha:", jogador);

    // window.localStorage guarda informação no navegador para a próxima página conseguir ler.
    // como só dá para guardar texto, usamos JSON.stringify para transformar o objeto em texto.
    window.localStorage.setItem("cerco_jogador", JSON.stringify(jogador));

    window.location.href = "./batalha.html"; // redirecionando para a tela de batalha

    //-----------------------\\

    /*
    * implementar comunicação com um back-end/node-red no futuro, se quiser salvar em servidor:
    let resposta = await fetch("http://localhost:1880/login", {
        method: "POST",
        body: JSON.stringify(jogador),
        headers: {
            "Content-Type": "application/json"
        },
    })

    if (!resposta.ok) {
        console.log(resposta.status)
        return;
    }
    */
}
