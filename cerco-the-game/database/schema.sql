drop table if exists turno cascade;
drop table if exists partida cascade;
drop table if exists inventario cascade;
drop table if exists item cascade;
drop table if exists personagem cascade;
drop table if exists jogador cascade;

create table jogador (
    id_jogador      serial primary key,
    nome            varchar(100) not null,
    email           varchar(150) not null unique,
    data_cadastro   timestamp not null default current_timestamp
);

create table personagem (
    id_personagem   serial primary key,
    id_jogador      integer not null,
    nome_batalha    varchar(100) not null,
    classe          varchar(50) not null,
    nivel           integer not null default 1 check (nivel > 0),
    hp_maximo       integer not null check (hp_maximo > 0),
    hp_atual        integer not null check (hp_atual >= 0),
    ataque_basico   integer not null check (ataque_basico >= 0),
    defesa          integer not null check (defesa >= 0),
    constraint fk_personagem_jogador
        foreign key (id_jogador) references jogador (id_jogador)
        on delete cascade on update cascade,
    constraint chk_hp_atual_maximo check (hp_atual <= hp_maximo)
);

create table item (
    id_item         serial primary key,
    nome            varchar(100) not null unique,
    descricao       varchar(255) not null,
    tipo            varchar(50) not null
        check (tipo in ('Cura Instantanea', 'Bonus Temporario de Ataque',
                         'Protecao Escudo', 'Dano em Area')),
    valor_efeito    integer not null check (valor_efeito >= 0)
);

create table inventario (
    id_personagem   integer not null,
    id_item         integer not null,
    quantidade      integer not null default 0 check (quantidade >= 0),
    primary key (id_personagem, id_item),
    constraint fk_inventario_personagem
        foreign key (id_personagem) references personagem (id_personagem)
        on delete cascade on update cascade,
    constraint fk_inventario_item
        foreign key (id_item) references item (id_item)
        on delete restrict on update cascade
);

create table partida (
    id_partida      serial primary key,
    id_desafiante   integer not null,
    id_oponente     integer not null,
    id_vencedor     integer null,
    inicio          timestamp not null default current_timestamp,
    fim             timestamp null,
    status          varchar(20) not null default 'Em Andamento'
        check (status in ('Em Andamento', 'Finalizada', 'Cancelada')),
    constraint fk_partida_desafiante
        foreign key (id_desafiante) references personagem (id_personagem)
        on delete restrict on update cascade,
    constraint fk_partida_oponente
        foreign key (id_oponente) references personagem (id_personagem)
        on delete restrict on update cascade,
    constraint fk_partida_vencedor
        foreign key (id_vencedor) references personagem (id_personagem)
        on delete set null on update cascade,
    constraint chk_combatentes_distintos check (id_desafiante <> id_oponente),
    constraint chk_vencedor_participante check (
        id_vencedor is null
        or id_vencedor = id_desafiante
        or id_vencedor = id_oponente
    ),
    constraint chk_fim_apos_inicio check (fim is null or fim >= inicio),
    constraint chk_status_vencedor check (
        (status <> 'Finalizada') or (id_vencedor is not null)
    )
);

create table turno (
    id_turno        serial primary key,
    id_partida      integer not null,
    ordem_turno     integer not null check (ordem_turno > 0),
    id_personagem   integer not null,
    tipo_acao       varchar(30) not null
        check (tipo_acao in ('Ataque Basico', 'Habilidade Especial',
                              'Uso de Item', 'Passar a Vez', 'Fuga',
                              'Efeito Persistente')),
    id_item         integer null,
    valor_impacto   integer not null default 0,
    constraint fk_turno_partida
        foreign key (id_partida) references partida (id_partida)
        on delete cascade on update cascade,
    constraint fk_turno_personagem
        foreign key (id_personagem) references personagem (id_personagem)
        on delete restrict on update cascade,
    constraint fk_turno_item
        foreign key (id_item) references item (id_item)
        on delete set null on update cascade,
    constraint uq_ordem_por_partida unique (id_partida, ordem_turno),
    constraint chk_item_condizente check (
        (tipo_acao = 'Uso de Item' and id_item is not null)
        or (tipo_acao <> 'Uso de Item' and id_item is null)
    )
);

insert into jogador (nome, email, data_cadastro) values
('Rafael Menezes',  'rafael.menezes@cerco.com',  '2026-01-10 09:15:00'),
('Camila Duarte',   'camila.duarte@cerco.com',   '2026-02-03 18:40:00'),
('Bruno Salgado',   'bruno.salgado@cerco.com',   '2026-03-21 21:05:00'),
('Sistema (Inimigos)', 'sistema@cerco.com', current_timestamp);

insert into personagem (id_jogador, nome_batalha, classe, nivel, hp_maximo, hp_atual, ataque_basico, defesa) values
((select id_jogador from jogador where email = 'rafael.menezes@cerco.com'), 'Kael',          'Guerreiro',  5, 260, 260, 38, 18),
((select id_jogador from jogador where email = 'rafael.menezes@cerco.com'), 'Armstrong',     'Guerreiro',  6, 300, 300, 45, 25),
((select id_jogador from jogador where email = 'camila.duarte@cerco.com'),  'Lyra',          'Feiticeira', 4, 230, 230, 42, 12),
((select id_jogador from jogador where email = 'bruno.salgado@cerco.com'),  'Armstrong Jr.', 'Guerreiro',  3, 240, 180, 30, 20);

insert into item (nome, descricao, tipo, valor_efeito) values
('Pocao de Cura',        'Restaura pontos de vida instantaneamente.',        'Cura Instantanea',            30),
('Elixir de Forca',      'Aumenta temporariamente o poder de ataque.',       'Bonus Temporario de Ataque',  15),
('Escudo Arcano',        'Cria uma barreira que absorve parte do dano.',     'Protecao Escudo',             20),
('Bomba de Fragmentacao','Causa dano explosivo ao alvo.',                    'Dano em Area',                25);

insert into inventario (id_personagem, id_item, quantidade) values
(1, 1, 3),
(1, 2, 1),
(2, 1, 2),
(2, 4, 1),
(3, 1, 3),
(3, 3, 2),
(4, 1, 1);

insert into partida (id_desafiante, id_oponente, id_vencedor, inicio, fim, status) values
(1, 3, 1, '2026-04-05 20:00:00', '2026-04-05 20:12:00', 'Finalizada'),
(2, 4, 4, '2026-04-06 19:30:00', '2026-04-06 19:41:00', 'Finalizada');

insert into turno (id_partida, ordem_turno, id_personagem, tipo_acao, id_item, valor_impacto) values
(1, 1, 1, 'Ataque Basico',       null, 38),
(1, 2, 3, 'Habilidade Especial', null, 20),
(1, 3, 1, 'Habilidade Especial', null, 45),
(1, 4, 3, 'Uso de Item',         1,    30),
(1, 5, 1, 'Ataque Basico',       null, 38),
(1, 6, 3, 'Ataque Basico',       null, 42);

insert into turno (id_partida, ordem_turno, id_personagem, tipo_acao, id_item, valor_impacto) values
(2, 1, 2, 'Ataque Basico',       null, 55),
(2, 2, 4, 'Habilidade Especial', null, 25),
(2, 3, 2, 'Uso de Item',         4,    25),
(2, 4, 4, 'Habilidade Especial', null, 60),
(2, 5, 2, 'Passar a Vez',        null, 0),
(2, 6, 4, 'Ataque Basico',       null, 30);

select * from jogador;
select * from personagem;
select * from item;
select * from inventario;
select * from partida;
select * from turno;

select
    j.nome                        as jogador,
    p.nome_batalha                as personagem,
    p.classe                      as classe,
    count(distinct pa.id_partida) as total_vitorias,
    count(distinct t.id_turno)    as total_turnos_executados
from personagem p
inner join jogador j
        on j.id_jogador = p.id_jogador
left join partida pa
        on pa.id_vencedor = p.id_personagem
       and pa.status = 'Finalizada'
left join turno t
        on t.id_personagem = p.id_personagem
where p.nivel >= 4
group by j.nome, p.nome_batalha, p.classe
order by total_vitorias desc, p.nome_batalha asc;

select j.nome as jogador, p.nome_batalha as personagem, p.classe as classe
from personagem p
join jogador j on j.id_jogador = p.id_jogador
where p.nivel > 1
  and p.hp_atual < p.hp_maximo
order by p.nivel desc;

select p.nome_batalha as personagem, i.nome as item, i.tipo as tipo, inv.quantidade
from inventario inv
join personagem p on p.id_personagem = inv.id_personagem
join item i on i.id_item = inv.id_item
where i.tipo in ('Cura Instantanea', 'Bonus Temporario de Ataque', 'Protecao Escudo', 'Dano em Area')
  and inv.quantidade <= 2
order by inv.quantidade asc;

select pa.id_partida, pa.fim, p.nome_batalha as personagem_vencedor, (pa.fim - pa.inicio) as duracao
from partida pa
join personagem p on p.id_personagem = pa.id_vencedor
where pa.status = 'Finalizada'
  and pa.id_vencedor is not null
order by pa.fim desc;
