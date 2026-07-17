from utils import escrever
import config


def criar_efeitos():
    """Cria o dicionário inicial de efeitos/status, incluindo as poções."""
    return {
        "ferida_profunda_turnos": 0,
        "espiral_turnos": 0,
        "marca_turnos": 0,
        "pocoes": config.POCOES_INICIAIS,
    }


def aplicar_efeitos(efeitos, inimigo_hp):
    """
    Aplica os efeitos contínuos ativos no inimigo, reduz os contadores
    e retorna o novo inimigo_hp.
    """

    if efeitos["ferida_profunda_turnos"] > 0:
        inimigo_hp = max(0, inimigo_hp - config.FERIDA_PROFUNDA_DANO)
        efeitos["ferida_profunda_turnos"] -= 1

        print(f"Ferida Profunda causou {config.FERIDA_PROFUNDA_DANO} dano!")
        print(f"Turnos restantes: {efeitos['ferida_profunda_turnos']}\n")

    if efeitos["espiral_turnos"] > 0:
        inimigo_hp -= config.ESPIRAL_DANO
        efeitos["espiral_turnos"] -= 1
        escrever(f"\nEspiral Fantasma causou {config.ESPIRAL_DANO} de dano.", config.VELOCIDADE_EFEITO)

    if efeitos["marca_turnos"] > 0:
        inimigo_hp -= config.MARCA_DANO
        efeitos["marca_turnos"] -= 1
        escrever(f"\nMarca da Execução causou {config.MARCA_DANO} de dano.", config.VELOCIDADE_EFEITO)

    return inimigo_hp
