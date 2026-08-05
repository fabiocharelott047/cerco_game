function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CONFIG = {
  VELOCIDADE_PADRAO: 40,
  VELOCIDADE_INTRO: 45,
  VELOCIDADE_EFEITO: 50,

  // Personagens - sorteados uma vez ao carregar a página
  KAEL_HP: randInt(200, 300),
  KAEL_DMG: randInt(25, 50),

  LYRA_HP: randInt(200, 250),
  LYRA_DMG: randInt(30, 50),

  ARMSTRONG_HP: randInt(220, 350),
  ARMSTRONG_DMG: randInt(25, 70),

  // Inimigo
  INIMIGO_HP: randInt(200, 350),
  INIMIGO_DANO: randInt(30, 70),

  // Kael
  KAEL_ESTOCADAS_HIT: [5, 15], 
  KAEL_FERIDA_PROFUNDA_TURNOS: 3,

  // Lyra
  LYRA_RUIDO_QUANTICO_HIT: [8, 20], 
  LYRA_ESPIRAL_TURNOS: 3,

  // Armstrong
  ARMSTRONG_GOLPE_GUARDA_BONUS: 10, 
  ARMSTRONG_GUARDA_COSTAS_HIT: [10, 20], 
  ARMSTRONG_MARCA_TURNOS: 3,

  // Dano por turno
  FERIDA_PROFUNDA_DANO: 20,
  ESPIRAL_DANO: 20,
  MARCA_DANO: 25,

  // Ações comuns
  POCAO_CURA: [20, 40], 
  POCOES_INICIAIS: 3,   
  CHANCE_FUGA: 0.5,     // 50% de chance de fuga
};