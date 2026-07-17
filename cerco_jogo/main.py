import time
import random

from utils import escrever, titulo, status_jogador, status_inimigo
from personagens import escolher_personagem
from efeitos import criar_efeitos, aplicar_efeitos
from ataques import ataque_kael, ataque_lyra, ataque_armstrong
import config

# INTRODUÇÃO
titulo("CERCO")

nickname = input("\nDigite seu nickname: ")

escrever(f"\nBem-vindo, {nickname}.", config.VELOCIDADE_INTRO)
escrever("Sistema CERCO inicializado.", config.VELOCIDADE_INTRO)
escrever("Prepare-se para o combate.\n", config.VELOCIDADE_INTRO)
time.sleep(1)

# ESCOLHA DE PERSONAGEM
personagem, hp, dmg, opcao = escolher_personagem()
hp_max = hp  # guarda a vida máxima para limitar a cura das poções

time.sleep(1)

# INIMIGO
titulo("UM INIMIGO APARECEU")

inimigo_hp = config.INIMIGO_HP
inimigo_dano = config.INIMIGO_DANO

num_turno = 1

# EFEITOS CONTÍNUOS E STATUS (inclui poções)
efeitos = criar_efeitos()

# MAPA DE FUNÇÕES DE ATAQUE POR PERSONAGEM
ATAQUES = {
    1: ataque_kael,
    2: ataque_lyra,
    3: ataque_armstrong,
}

fugiu = False

# LOOP PRINCIPAL
while hp > 0 and inimigo_hp > 0:

    titulo(f"TURNO {num_turno}")
    status_jogador(personagem, hp, dmg)
    status_inimigo(inimigo_hp, inimigo_dano)
    print(f"Poções: {efeitos['pocoes']}")

    # EFEITOS POR TURNO
    inimigo_hp = aplicar_efeitos(efeitos, inimigo_hp)

    # AÇÃO DO PERSONAGEM ESCOLHIDO
    funcao_ataque = ATAQUES[opcao]
    hp, inimigo_hp, efeitos, valido, fugiu = funcao_ataque(dmg, hp, hp_max, inimigo_hp, inimigo_dano, efeitos)

    if not valido:
        continue

    if fugiu:
        break

    # LIMITES
    hp = max(0, hp)
    inimigo_hp = max(0, inimigo_hp)

    print(f"\nVIDA PLAYER  : {hp}")
    print(f"VIDA INIMIGO : {inimigo_hp}")
    num_turno += 1

    time.sleep(1.5)

# FINAL
if fugiu:
    titulo("FUGA BEM-SUCEDIDA")
    escrever("Você escapou do combate com vida.", config.VELOCIDADE_INTRO)
elif hp <= 0:
    titulo("VOCÊ MORREU")
    escrever("Sua vida chegou a zero.", config.VELOCIDADE_INTRO)
else:
    titulo("VITÓRIA")
    escrever("O inimigo foi derrotado.", config.VELOCIDADE_INTRO)
    status_jogador(personagem, hp, dmg)
