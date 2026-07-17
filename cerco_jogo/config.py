import random

# TEXTO (usada em escrever())
VELOCIDADE_PADRAO = 0.02
VELOCIDADE_INTRO = 0.03
VELOCIDADE_EFEITO = 0.05

# =========================================
# PERSONAGENS (vida e dano base - sorteados uma vez por partida)
# =========================================
KAEL_HP = random.randint(200, 300)
KAEL_DMG = random.randint(25, 50)

LYRA_HP = random.randint(200, 250)
LYRA_DMG = random.randint(30, 50)

ARMSTRONG_HP = random.randint(220, 350)
ARMSTRONG_DMG = random.randint(27, 70)

# INIMIGO
INIMIGO_HP = random.randint(120, 350)
INIMIGO_DANO = random.randint(10, 50)

# =========================================
# KAEL
# =========================================
KAEL_ESTOCADAS_HIT = (5, 15)          # cada um dos 4 golpes de Estocadas Múltiplas
KAEL_FERIDA_PROFUNDA_TURNOS = 3

# =========================================
# LYRA
# =========================================
LYRA_RUIDO_QUANTICO_HIT = (8, 18)     # cada um dos 4 pulsos
LYRA_ESPIRAL_TURNOS = 3

# =========================================
# ARMSTRONG
# =========================================
ARMSTRONG_GOLPE_GUARDA_BONUS = 10     # bônus somado ao dmg base
ARMSTRONG_GUARDA_COSTAS_HIT = (10, 20)  # cada um dos 4 golpes
ARMSTRONG_MARCA_TURNOS = 3

# =========================================
# EFEITOS CONTÍNUOS (dano por turno)
# =========================================
FERIDA_PROFUNDA_DANO = 20
ESPIRAL_DANO = 20
MARCA_DANO = 25

# =========================================
# AÇÕES COMUNS (Poção, Pular Vez, Fuga)
# =========================================
POCAO_CURA = (20, 40)      # quanto de vida a Poção de Cura recupera
POCOES_INICIAIS = 3        # quantidade de poções no início da partida
CHANCE_FUGA = 0.5          # 50% de chance de fugir com sucesso
