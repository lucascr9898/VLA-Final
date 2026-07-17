# Mini VLA — Visual Link Analysis

Componente Angular que representa uma pequena rede de entidades e relações, com seleção de entidade, filtros por tipo e painel de detalhes. Desenvolvido como desafio técnico da Via Appia.

## Como instalar as dependências

```bash
npm install
```

## Como executar o projeto localmente

```bash
ng serve
```

Depois acesse `http://localhost:4200` no navegador.

## Componentes criados

- **`VlaViewer`** — componente orquestrador. Guarda o estado (entidade selecionada, filtro de tipo ativo) e calcula, a partir dele, o que cada componente filho deve exibir.
- **`EntityList`** — lista lateral com todas as entidades visíveis, com busca textual local.
- **`EntityTypeFilter`** — botões de filtro por tipo de entidade (pessoa, empresa, telefone, e-mail, endereço, veículo, documento, cargo).
- **`EntityDetails`** — painel de detalhes da entidade selecionada: dados da entidade, quantidade de relações e lista de vínculos diretos.
- **`GraphView`** — visualização em grafo usando a biblioteca **GoJS**, com nós e arestas navegáveis, destaque da entidade selecionada e clique para seleção.

## Como os dados mockados estão organizados

Os dados ficam em `src/app/assets/json/vlaDados.json`, com dois arrays: `entidades` e `relacoes`, seguindo as interfaces `Entidade` (`models/entidade.model.ts`) e `Relacao` (`models/relacao.model.ts`).

O serviço `ServicoVla` (`services/vla-data.service.ts`) busca esse JSON via `HttpClient` e expõe um único `Observable<{ entidades, relacoes }>`. Nenhum componente acessa o arquivo diretamente — todos recebem os dados já processados a partir do `VlaViewer`.

## Estratégia usada para filtrar relações diretas

Quando uma entidade é selecionada, o `VlaViewer`:

1. Filtra as relações onde a entidade selecionada aparece em `source` ou `target`.
2. A partir dessas relações, monta um `Set` com os ids de todas as entidades conectadas (incluindo a própria selecionada, para garantir que ela nunca seja removida por um filtro de tipo).
3. Filtra as entidades originais para manter só as que estão nesse `Set`.

Esse recálculo é centralizado no método `recalcularEstadoDerivado()`, disparado sempre que o estado bruto (entidade selecionada ou filtro de tipo) muda, para evitar esquecer de atualizar alguma variável derivada em um dos vários pontos de entrada.

## Funcionalidades entregues no nível obrigatório

- RF01 — Exibição inicial da rede completa.
- RF02 — Lista lateral com nome e tipo de cada entidade.
- RF03 — Seleção de entidade pela lista ou pelo grafo.
- RF04 — Filtro por entidade selecionada (mostra só ela e seus vínculos diretos).
- RF05 — Botão para limpar seleção e restaurar a rede completa.
- RF06 — Filtro por tipo de entidade.
- RF07 — Painel de detalhes com quantidade de relações e vínculos.
- RF08 — Estado vazio quando filtro/busca não retorna resultados.
- RF09 — Dados vindos de um serviço Angular mockado (`ServicoVla`), não espalhados pelo template.

## Funcionalidades entregues como bônus (Nível 3)

- Visualização em grafo com **GoJS** (nós, arestas, ícones e cores por tipo de entidade).
- Destaque visual da entidade selecionada no grafo.

### Por que GoJS

O desafio permite tanto uma visualização simples em cards quanto uma com biblioteca de grafo, sendo a segunda o diferencial do nível bônus. Optei pelo GoJS porque ele renderiza nós e arestas de forma nativa e navegável, o que deixa mais claro visualmente quais entidades estão conectadas — o próprio objetivo central de uma ferramenta de Visual Link Analysis. Também permitiu aplicar ícone, cor e forma por tipo de entidade diretamente no nó do grafo, reforçando a leitura da rede sem depender só do painel de detalhes.

## Limitações conhecidas

- [preencher: ex. responsividade parcial, sem testes automatizados, etc.]
