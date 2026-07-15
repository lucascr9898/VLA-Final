import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Entidade } from '../../models/entidade.model';
import { CORES_POR_TIPO, ICONE_POR_TIPO } from '../../shared/entidade-visual';

export interface Vinculo {
  rotuloRelacao: string;
  entidadeConectada: Entidade;
  icone: string;
}

@Component({
  selector: 'app-entity-details',
  imports: [],
  templateUrl: './entity-details.html',
  styleUrl: './entity-details.css',
})
export class EntityDetails {
  @Input() selecaoDetalhes: { entidadeDetalhada: Entidade, quantidade: number, vinculos: Vinculo[] } | null = null;

  @Output() entidadeSelecionada = new EventEmitter<string>();

  readonly cores = CORES_POR_TIPO;
  readonly icones = ICONE_POR_TIPO;

  selecionarVinculo(id: string) {
    this.entidadeSelecionada.emit(id);
  }
}
