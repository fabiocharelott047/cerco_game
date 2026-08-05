
// Dados de cada personagem puxado da config
const PERSONAGENS = {
  kael: { nome: "Kael", hp: CONFIG.KAEL_HP, dmg: CONFIG.KAEL_DMG },
  lyra: { nome: "Lyra", hp: CONFIG.LYRA_HP, dmg: CONFIG.LYRA_DMG },
  armstrong: { nome: "Armstrong", hp: CONFIG.ARMSTRONG_HP, dmg: CONFIG.ARMSTRONG_DMG },
};


function escolherPersonagem(chave) {
  return PERSONAGENS[chave];
}

// Liga o clique de cada card de personagem na tela de seleção ao iniciarJogo()
document.querySelectorAll(".character-card").forEach((card) => {
  card.addEventListener("click", () => {
    const chave = card.dataset.personagem; // "kael", "lyra" ou "armstrong"
    const nicknameInput = document.getElementById("nicknameInput");
    const nickname = nicknameInput.value.trim() || "Jogador";
    iniciarJogo(chave, nickname);
  });
});
