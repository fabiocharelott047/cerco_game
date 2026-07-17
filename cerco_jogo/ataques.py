import time
import random
from utils import escrever, menu_ataques
from common import usar_pocao, pular_vez, tentar_fuga
import config


def ataque_kael(dmg, hp, hp_max, inimigo_hp, inimigo_dano, efeitos):

    print("\n1 - Corte Básico")
    print("2 - Estocadas Múltiplas")
    print("3 - Ferida Profunda")
    print("4 - Poção de Cura")
    print("5 - Pular Vez")
    print("6 - Rota de Fuga")

    try:
        acao = int(input("\nAtaque: "))
    except ValueError:
        escrever("Digite apenas números.")
        return hp, inimigo_hp, efeitos, False, False

    if acao == 1:
        dano = dmg

        inimigo_hp -= dano
        hp -= inimigo_dano

        print(f"\n Corte Básico causou {dano} dano!")

    elif acao == 2:
        hp -= inimigo_dano

        dmg_one = random.randint(*config.KAEL_ESTOCADAS_HIT)
        dmg_two = random.randint(*config.KAEL_ESTOCADAS_HIT)
        dmg_three = random.randint(*config.KAEL_ESTOCADAS_HIT)
        dmg_four = random.randint(*config.KAEL_ESTOCADAS_HIT)
        dano_total = dmg_one + dmg_two + dmg_three + dmg_four

        inimigo_hp = max(0, inimigo_hp - dano_total)

        print("\n Estocadas Múltiplas!")
        print(f"...hit {dmg_one}")
        time.sleep(0.5)
        print(f"...hit {dmg_two}")
        time.sleep(0.5)
        print(f"...hit {dmg_three}")
        time.sleep(0.5)
        print(f"...hit {dmg_four}")
        time.sleep(0.5)
        print(f"\nDano total: {dano_total}")

    elif acao == 3:
        efeitos["ferida_profunda_turnos"] = config.KAEL_FERIDA_PROFUNDA_TURNOS
        hp -= inimigo_dano

        print("\n O inimigo foi ferido!")

    elif acao == 4:
        hp, efeitos, valido = usar_pocao(hp, hp_max, efeitos)
        if not valido:
            return hp, inimigo_hp, efeitos, False, False

    elif acao == 5:
        hp = pular_vez(hp, inimigo_dano)

    elif acao == 6:
        hp, fugiu = tentar_fuga(hp, inimigo_dano)
        return hp, inimigo_hp, efeitos, True, fugiu

    else:
        escrever("Ataque inválido.")
        return hp, inimigo_hp, efeitos, False, False

    return hp, inimigo_hp, efeitos, True, False


def ataque_lyra(dmg, hp, hp_max, inimigo_hp, inimigo_dano, efeitos):
    """
    Turno de ação da Lyra.
    Retorna (hp, inimigo_hp, efeitos, valido, fugiu)
    """

    menu_ataques([
        "Eco Neural",
        "Ruído Quântico",
        "Espiral Fantasma",
        "Poção de Cura",
        "Pular Vez",
        "Rota de Fuga",
    ])

    try:
        acao = int(input("\nAtaque: "))
    except ValueError:
        escrever("Digite apenas números.")
        return hp, inimigo_hp, efeitos, False, False

    if acao == 1:
        dano = dmg

        inimigo_hp -= dano
        hp -= inimigo_dano

        escrever(f"\nEco Neural causou {dano} de dano.", config.VELOCIDADE_EFEITO)

    elif acao == 2:
        hp -= inimigo_dano

        hits = [random.randint(*config.LYRA_RUIDO_QUANTICO_HIT) for _ in range(4)]
        dano_total = sum(hits)

        inimigo_hp -= dano_total

        escrever("\nRuído Quântico iniciado.", config.VELOCIDADE_EFEITO)

        for i, hit in enumerate(hits):
            escrever(f"Pulso {i+1}: {hit} dano", config.VELOCIDADE_EFEITO)

        escrever(f"\nDano total: {dano_total}", config.VELOCIDADE_EFEITO)

    elif acao == 3:
        efeitos["espiral_turnos"] = config.LYRA_ESPIRAL_TURNOS
        hp -= inimigo_dano

        escrever("\nEspiral Fantasma ativada.", config.VELOCIDADE_EFEITO)

    elif acao == 4:
        hp, efeitos, valido = usar_pocao(hp, hp_max, efeitos)
        if not valido:
            return hp, inimigo_hp, efeitos, False, False

    elif acao == 5:
        hp = pular_vez(hp, inimigo_dano)

    elif acao == 6:
        hp, fugiu = tentar_fuga(hp, inimigo_dano)
        return hp, inimigo_hp, efeitos, True, fugiu

    else:
        escrever("Ataque inválido.")
        return hp, inimigo_hp, efeitos, False, False

    return hp, inimigo_hp, efeitos, True, False


def ataque_armstrong(dmg, hp, hp_max, inimigo_hp, inimigo_dano, efeitos):
    """
    Turno de ação do Armstrong.
    Retorna (hp, inimigo_hp, efeitos, valido, fugiu)
    """

    print("\n1 - Golpe de Guarda")
    print("2 - Guarda Costas")
    print("3 - Marca da Execução")
    print("4 - Poção de Cura")
    print("5 - Pular Vez")
    print("6 - Rota de Fuga")

    try:
        acao = int(input("\nAtaque: "))
    except ValueError:
        escrever("Digite apenas números.")
        return hp, inimigo_hp, efeitos, False, False

    if acao == 1:
        dano = dmg + config.ARMSTRONG_GOLPE_GUARDA_BONUS

        inimigo_hp -= dano

        print(f"\n Golpe de Guarda causou {dano} dano!")
        escrever(f"\nShotgun Estrondosa causou {dano} de dano.", config.VELOCIDADE_EFEITO)

    elif acao == 2:
        hp -= inimigo_dano

        dmg_one = random.randint(*config.ARMSTRONG_GUARDA_COSTAS_HIT)
        dmg_two = random.randint(*config.ARMSTRONG_GUARDA_COSTAS_HIT)
        dmg_three = random.randint(*config.ARMSTRONG_GUARDA_COSTAS_HIT)
        dmg_four = random.randint(*config.ARMSTRONG_GUARDA_COSTAS_HIT)
        dano_total = dmg_one + dmg_two + dmg_three + dmg_four
        inimigo_hp = max(0, inimigo_hp - dano_total)

        print("\n Guarda Costas!")
        print(f"...hit {dmg_one}")
        time.sleep(0.5)
        print(f"...hit {dmg_two}")
        time.sleep(0.5)
        print(f"...hit {dmg_three}")
        time.sleep(0.5)
        print(f"...hit {dmg_four}")
        time.sleep(0.5)
        print(f"\nDano total: {dano_total}")

    elif acao == 3:
        efeitos["marca_turnos"] = config.ARMSTRONG_MARCA_TURNOS
        hp -= inimigo_dano

        escrever("\nMarca da Execução ativada.", config.VELOCIDADE_EFEITO)

    elif acao == 4:
        hp, efeitos, valido = usar_pocao(hp, hp_max, efeitos)
        if not valido:
            return hp, inimigo_hp, efeitos, False, False

    elif acao == 5:
        hp = pular_vez(hp, inimigo_dano)

    elif acao == 6:
        hp, fugiu = tentar_fuga(hp, inimigo_dano)
        return hp, inimigo_hp, efeitos, True, fugiu

    else:
        escrever("Ataque inválido.")
        return hp, inimigo_hp, efeitos, False, False

    return hp, inimigo_hp, efeitos, True, False