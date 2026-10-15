 

function ataqueKael(acao, dmg, hp, inimigoHp, inimigoDano, efeitos) {
  if (acao === 1) {
    const dano = dmg;
    inimigoHp -= dano;
    hp -= inimigoDano;
    escrever(`Corte Básico causou ${dano} dano!`);
  } else if (acao === 2) {
    hp -= inimigoDano;

    const hits = [
      randInt(...CONFIG.KAEL_ESTOCADAS_HIT),
      randInt(...CONFIG.KAEL_ESTOCADAS_HIT),
      randInt(...CONFIG.KAEL_ESTOCADAS_HIT),
      randInt(...CONFIG.KAEL_ESTOCADAS_HIT),
    ];
    const danoTotal = hits.reduce((a, b) => a + b, 0);
    inimigoHp = Math.max(0, inimigoHp - danoTotal);

    escrever("Estocadas Múltiplas!");
    hits.forEach((hit, i) => escrever(`...hit ${hit}`));
    escrever(`Dano total: ${danoTotal}`);
  } else if (acao === 3) {
    efeitos.ferida_profunda_turnos = CONFIG.KAEL_FERIDA_PROFUNDA_TURNOS;
    hp -= inimigoDano;
    escrever("O inimigo foi ferido!");
  }

  return { hp, inimigoHp, efeitos };
}

function ataqueLyra(acao, dmg, hp, inimigoHp, inimigoDano, efeitos) {
  if (acao === 1) {
    const dano = dmg;
    inimigoHp -= dano;
    hp -= inimigoDano;
    escrever(`Eco Neural causou ${dano} de dano.`);
  } else if (acao === 2) {
    hp -= inimigoDano;

    const hits = [
      randInt(...CONFIG.LYRA_RUIDO_QUANTICO_HIT),
      randInt(...CONFIG.LYRA_RUIDO_QUANTICO_HIT),
      randInt(...CONFIG.LYRA_RUIDO_QUANTICO_HIT),
      randInt(...CONFIG.LYRA_RUIDO_QUANTICO_HIT),
    ];
    const danoTotal = hits.reduce((a, b) => a + b, 0);
    inimigoHp -= danoTotal;

    escrever("Ruído Quântico iniciado.");
    hits.forEach((hit, i) => escrever(`Pulso ${i + 1}: ${hit} dano`));
    escrever(`Dano total: ${danoTotal}`);
  } else if (acao === 3) {
    efeitos.espiral_turnos = CONFIG.LYRA_ESPIRAL_TURNOS;
    hp -= inimigoDano;
    escrever("Espiral Fantasma ativada.");
  }

  return { hp, inimigoHp, efeitos };
}

function ataqueArmstrong(acao, dmg, hp, inimigoHp, inimigoDano, efeitos) {
  if (acao === 1) {
    const dano = dmg + CONFIG.ARMSTRONG_GOLPE_GUARDA_BONUS;
    inimigoHp -= dano;
    escrever(`Golpe de Guarda causou ${dano} dano!`);
  } else if (acao === 2) {
    hp -= inimigoDano;

    const hits = [
      randInt(...CONFIG.ARMSTRONG_GUARDA_COSTAS_HIT),
      randInt(...CONFIG.ARMSTRONG_GUARDA_COSTAS_HIT),
      randInt(...CONFIG.ARMSTRONG_GUARDA_COSTAS_HIT),
      randInt(...CONFIG.ARMSTRONG_GUARDA_COSTAS_HIT),
    ];
    const danoTotal = hits.reduce((a, b) => a + b, 0);
    inimigoHp = Math.max(0, inimigoHp - danoTotal);

    escrever("Guarda Costas!");
    hits.forEach((hit, i) => escrever(`...hit ${hit}`));
    escrever(`Dano total: ${danoTotal}`);
  } else if (acao === 3) {
    efeitos.marca_turnos = CONFIG.ARMSTRONG_MARCA_TURNOS;
    hp -= inimigoDano;
    escrever("Marca da Execução ativada.");
  }

  return { hp, inimigoHp, efeitos };
}

// Nomes dos 3 ataques usados para montar o submenu
const NOMES_ATAQUES = {
  kael: ["Corte Básico", "Estocadas Múltiplas", "Ferida Profunda"],
  lyra: ["Eco Neural", "Ruído Quântico", "Espiral Fantasma"],
  armstrong: ["Golpe de Guarda", "Guarda Costas", "Marca da Execução"],
};

const FUNCOES_ATAQUE = {
  kael: ataqueKael,
  lyra: ataqueLyra,
  armstrong: ataqueArmstrong,
};
