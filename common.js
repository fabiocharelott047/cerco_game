
function usarPocao(hp, hpMax, efeitos) {
  if (efeitos.pocoes <= 0) {
    escrever("Você não tem mais Poções de Cura!");
    return { hp, efeitos, valido: false };
  }

  const cura = randInt(...CONFIG.POCAO_CURA);
  hp = Math.min(hpMax, hp + cura);
  efeitos.pocoes -= 1;

  escrever(`Você bebeu uma Poção de Cura e recuperou ${cura} de vida!`);
  escrever(`Poções restantes: ${efeitos.pocoes}`);

  return { hp, efeitos, valido: true };
}


function pularVez(hp, inimigoDano) {
  hp -= inimigoDano;
  escrever("Você recua e observa o inimigo, pulando sua vez.");
  return hp;
}

function tentarFuga(hp, inimigoDano) {
  if (Math.random() <= CONFIG.CHANCE_FUGA) {
    escrever("Você conseguiu fugir do combate!");
    return { hp, fugiu: true };
  }

  hp -= inimigoDano;
  escrever("Você tentou fugir, mas o inimigo bloqueou sua saída!");

  return { hp, fugiu: false };
}
