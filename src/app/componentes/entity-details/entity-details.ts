import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Entidade } from '../../models/entidade.model';
import { obterCorPorTipo, obterIconePorTipo } from '../../shared/entidade-visual';

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

  obterCor = obterCorPorTipo;
  obterIcone = obterIconePorTipo;

 
}