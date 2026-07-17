import { Component, OnInit } from '@angular/core';
import { EntityList } from "../entity-list/entity-list";
import { Entidade, TipoEntidade } from '../../models/entidade.model'; // Adicionado TipoEntidade aqui
import { EntityTypeFilter } from "../entity-type-filter/entity-type-filter";
import { Relacao } from '../../models/relacao.model';
import { ServicoVla } from '../../services/vla-data.service';
import { EntityDetails, Vinculo } from '../entity-details/entity-details';
import { GraphView } from '../graph-view/graph-view';
import { obterIconePorTipo } from '../../shared/entidade-visual';

@Component({
  selector: 'app-vla-viewer',
  imports: [EntityList, EntityTypeFilter, EntityDetails, GraphView],
  templateUrl: './vla-viewer.html',
  styleUrl: './vla-viewer.css',
})
export class VlaViewer implements OnInit {
  entidades: Entidade[] = [];
  relacoes: Relacao[] = [];

  idEntidade: string | null = null;
  
  filtroAtual: TipoEntidade | null = null;

  tiposPresentes: TipoEntidade[] = [];
  tiposDisponiveis: TipoEntidade[] = [];

  entidadesGrafico: Entidade[] = [];
  relacoesGrafico: Relacao[] = [];
  entidadesLista: Entidade[] = [];
  filtroAtivo: boolean = false;
  selecaoDetalhes: { entidadeDetalhada: Entidade, quantidade: number, vinculos: Vinculo[] } | null = null;

  constructor(private servico: ServicoVla) {}

  ngOnInit(): void {
    this.servico.getJson().subscribe({
      next: dados => {
        this.entidades = dados.entidades;
        this.relacoes = dados.relacoes;

        this.tiposPresentes = Array.from(
          new Set(this.entidades.map(entidade => entidade.type as TipoEntidade))
        );

        this.recalcularEstadoDerivado();
      },
      error: erro => console.error('Não foi possível carregar os dados do VLA:', erro)
    });
  }

  selecionarEntidade(id: string) {
    this.idEntidade = id;
    this.filtroAtual = null;
    this.recalcularEstadoDerivado();
  }

  atualizarFiltro(tipo: TipoEntidade | null) {
    this.filtroAtual = tipo;
    this.recalcularEstadoDerivado();
  }

  limparTudo(): void {
    this.idEntidade = null;
    this.filtroAtual = null;
    this.filtroAtivo = false;
    this.selecaoDetalhes = null;
    this.entidadesGrafico = [];
    this.relacoesGrafico = [];
    this.entidadesLista = [];
    this.tiposDisponiveis = this.tiposPresentes;
  }

  limparSelecaoEntidade() {
    this.idEntidade = null;
    this.recalcularEstadoDerivado();
  }

  restaurarRedeCompleta() {
    this.idEntidade = null;
    this.filtroAtual = null;
    this.recalcularEstadoDerivado();
  }

  private obterRelacoesDiretas(idEntidade: string): Relacao[] {
    return this.relacoes.filter(relacao => relacao.source === idEntidade || relacao.target === idEntidade);
  }

  private recalcularEstadoDerivado(): void {
    const { entidadesGrafico, relacoesGrafico } = this.calcularGrafico(this.idEntidade, this.filtroAtual);
    this.entidadesGrafico = entidadesGrafico;
    this.relacoesGrafico = relacoesGrafico;
    this.entidadesLista = this.entidadesGrafico;
    this.tiposDisponiveis = this.calcularTiposDisponiveis(this.idEntidade);
    this.filtroAtivo = this.idEntidade !== null || this.filtroAtual !== null;
    this.selecaoDetalhes = this.calcularSelecaoDetalhes(this.idEntidade);
  }

  private calcularGrafico(idEntidade: string | null, filtroAtual: TipoEntidade | null): { entidadesGrafico: Entidade[], relacoesGrafico: Relacao[] } {
    let entidadesFiltradas = [...this.entidades];
    let relacoesFiltradas = [...this.relacoes];

    if (idEntidade !== null) {
      relacoesFiltradas = this.obterRelacoesDiretas(idEntidade);
      const idsConexao = new Set([idEntidade, ...relacoesFiltradas.flatMap(relacao => [relacao.source, relacao.target])]);
      entidadesFiltradas = this.entidades.filter(entidade => idsConexao.has(entidade.id));
    }

    if (filtroAtual !== null) {
      entidadesFiltradas = entidadesFiltradas.filter(entidade => entidade.type === filtroAtual || entidade.id === idEntidade);
      const idsRestantes = new Set(entidadesFiltradas.map(entidade => entidade.id));
      relacoesFiltradas = relacoesFiltradas.filter(relacao => idsRestantes.has(relacao.source) && idsRestantes.has(relacao.target));
    }

    return { entidadesGrafico: entidadesFiltradas, relacoesGrafico: relacoesFiltradas };
  }

  private calcularTiposDisponiveis(idEntidade: string | null): TipoEntidade[] {
    if (idEntidade === null) {
      return this.tiposPresentes;
    }

    const relacoesDiretas = this.obterRelacoesDiretas(idEntidade);
    const idsConexao = new Set([idEntidade, ...relacoesDiretas.flatMap(relacao => [relacao.source, relacao.target])]);
    const entidadesConectadas = this.entidades.filter(entidade => idsConexao.has(entidade.id));

    return Array.from(new Set(entidadesConectadas.map(entidade => entidade.type as TipoEntidade)));
  }

  private calcularSelecaoDetalhes(idEntidade: string | null): { entidadeDetalhada: Entidade, quantidade: number, vinculos: Vinculo[] } | null {
    if (idEntidade === null) {
      return null;
    }

    const entidadeEncontrada = this.entidades.find(entidade => entidade.id === idEntidade);
    if (!entidadeEncontrada) {
      return null;
    }

    const relacoesDiretas = this.obterRelacoesDiretas(idEntidade);

    const vinculos: Vinculo[] = relacoesDiretas
      .map(relacao => {
        const idConectado = relacao.source === idEntidade ? relacao.target : relacao.source;
        const entidadeConectada = this.entidades.find(entidade => entidade.id === idConectado);
        if (!entidadeConectada) {
          return null;
        }
        return {
          rotuloRelacao: relacao.label,
          entidadeConectada,
          icone: obterIconePorTipo(entidadeConectada.type as TipoEntidade), // Cast preventivo
        };
      })
      .filter((vinculo): vinculo is Vinculo => vinculo !== null);

    return { entidadeDetalhada: entidadeEncontrada, quantidade: relacoesDiretas.length, vinculos };
  }
}