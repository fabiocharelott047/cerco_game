import random
from utils import titulo, escrever, status_jogador
import config


def escolher_personagem():

    while True:

        titulo("ESCOLHA SEU PERSONAGEM")

        print("1 - Kael")
        print("2 - Lyra")
        print("3 - Armstrong")
        print("0 - Sair do jogo")

        try:
            opcao = int(input("\nEscolha: "))
        except ValueError:
            escrever("Digite apenas números.")
            continue

        if opcao == 1:
            personagem = "Kael"
            hp = config.KAEL_HP
            dmg = config.KAEL_DMG
            break

        elif opcao == 2:
            personagem = "Lyra"
            hp = config.LYRA_HP
            dmg = config.LYRA_DMG
            break

        elif opcao == 3:
            personagem = "Armstrong"
            hp = config.ARMSTRONG_HP
            dmg = config.ARMSTRONG_DMG
            break

        elif opcao == 0:
            escrever("Saindo do jogo...")
            exit()

        else:
            escrever("Escolha inválida.")

    titulo("PERSONAGEM SELECIONADO")
    status_jogador(personagem, hp, dmg)

    return personagem, hp, dmg, opcao
