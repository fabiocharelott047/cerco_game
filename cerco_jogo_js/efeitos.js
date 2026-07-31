function criarEfeitos() {
  return {
    ferida_profunda_turnos: 0,
    espiral_turnos: 0,
    marca_turnos: 0,
    pocoes: CONFIG.POCOES_INICIAIS,
  };
}

function aplicarEfeitos(efeitos, inimigoHp) {
  if (efeitos.ferida_profunda_turnos > 0) {
    inimigoHp = Math.max(0, inimigoHp - CONFIG.FERIDA_PROFUNDA_DANO);
    efeitos.ferida_profunda_turnos -= 1;

    escrever(`Ferida Profunda causou ${CONFIG.FERIDA_PROFUNDA_DANO} dano!`);
    escrever(`Turnos restantes: ${efeitos.ferida_profunda_turnos}`);
  }

  if (efeitos.espiral_turnos > 0) {
    inimigoHp -= CONFIG.ESPIRAL_DANO;
    efeitos.espiral_turnos -= 1;
    escrever(`Espiral Fantasma causou ${CONFIG.ESPIRAL_DANO} de dano.`);
  }

  if (efeitos.marca_turnos > 0) {
    inimigoHp -= CONFIG.MARCA_DANO;
    efeitos.marca_turnos -= 1;
    escrever(`Marca da Execução causou ${CONFIG.MARCA_DANO} de dano.`);
  }

  return inimigoHp;
}
