import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TipoEntidade } from '../../models/entidade.model';
import { CORES_POR_TIPO, ICONE_POR_TIPO, TODOS_OS_TIPOS } from '../../shared/entidade-visual';

@Component({
  selector: 'app-entity-type-filter',
  imports: [],
  templateUrl: './entity-type-filter.html',
  styleUrl: './entity-type-filter.css'
})
export class EntityTypeFilter {
  @Input() selecionaveis: TipoEntidade[] = TODOS_OS_TIPOS as TipoEntidade[];

  @Input() filtroAtual: TipoEntidade | null = null;

  @Output() filtroAlterado = new EventEmitter<TipoEntidade | null>();

  readonly cores = CORES_POR_TIPO;
  readonly icones = ICONE_POR_TIPO;

  filtrarPorTipo(tipo: TipoEntidade): void {
    const novoFiltro = this.filtroAtual === tipo ? null : tipo;
    this.filtroAlterado.emit(novoFiltro);
  }
}