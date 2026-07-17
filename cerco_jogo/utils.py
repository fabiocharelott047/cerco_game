import time
import sys


def escrever(texto, velocidade=0.02):
    for letra in texto:
        sys.stdout.write(letra)
        sys.stdout.flush()
        time.sleep(velocidade)
    print()


def linha():
    print("─" * 40)


def titulo(texto):
    print()
    linha()
    print(texto.center(40))
    linha()


def status_jogador(nome, hp, dmg):
    print(f"\nPERSONAGEM : {nome}")
    print(f"VIDA       : {hp}")
    print(f"DANO BASE  : {dmg}")


def status_inimigo(hp, dano):
    print(f"\nINIMIGO")
    print(f"VIDA : {hp}")
    print(f"DANO : {dano}")


def menu_ataques(lista):
    print("\nATAQUES")
    for i, ataque in enumerate(lista, start=1):
        print(f"{i}. {ataque}")
