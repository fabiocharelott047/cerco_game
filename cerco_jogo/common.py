import random
from utils import escrever
import config


def usar_pocao(hp, hp_max, efeitos):
    """
    Usa uma Poção de Cura, se houver estoque disponível.
    Retorna (hp, efeitos, valido)
    """

    if efeitos["pocoes"] <= 0:
        escrever("\nVocê não tem mais Poções de Cura!", config.VELOCIDADE_EFEITO)
        return hp, efeitos, False

    cura = random.randint(*config.POCAO_CURA)
    hp = min(hp_max, hp + cura)
    efeitos["pocoes"] -= 1

    escrever(f"\nVocê bebeu uma Poção de Cura e recuperou {cura} de vida!", config.VELOCIDADE_EFEITO)
    print(f"Poções restantes: {efeitos['pocoes']}")

    return hp, efeitos, True


def pular_vez(hp, inimigo_dano):
    """
    Passa a vez: o personagem não ataca, mas ainda recebe o dano do inimigo.
    Retorna hp atualizado.
    """

    hp -= inimigo_dano
    escrever("\nVocê recua e observa o inimigo, pulando sua vez.", config.VELOCIDADE_EFEITO)

    return hp


def tentar_fuga(hp, inimigo_dano):
    """
    Tenta fugir do combate. Se falhar, o personagem ainda leva o dano do inimigo.
    Retorna (hp, fugiu)
    """

    if random.random() <= config.CHANCE_FUGA:
        escrever("\nVocê conseguiu fugir do combate!", config.VELOCIDADE_EFEITO)
        return hp, True

    hp -= inimigo_dano
    escrever("\nVocê tentou fugir, mas o inimigo bloqueou sua saída!", config.VELOCIDADE_EFEITO)

    return hp, False
