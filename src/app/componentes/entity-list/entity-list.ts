import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Entidade } from '../../models/entidade.model';
import { CORES_POR_TIPO, ICONE_POR_TIPO } from '../../shared/entidade-visual';

@Component({
  selector: 'app-entity-list',
  imports: [],
  templateUrl: './entity-list.html',
  styleUrl: './entity-list.css',
})
export class EntityList {
  @Input() entidades: Entidade[] = [];
  @Input() idEntidade: string | null = null;

  @Output() entidadeSelecionada = new EventEmitter<string>();

  textoBusca: string = '';

  readonly cores = CORES_POR_TIPO;
  readonly icones = ICONE_POR_TIPO;

  get entidadesVisiveis(): Entidade[] {
    if (this.textoBusca === '') {
      return this.entidades;
    }
    return this.entidades.filter(entidade => entidade.label.toLowerCase().includes(this.textoBusca.toLowerCase()));
  }

  selecionarEntidade(id: string) {
    this.entidadeSelecionada.emit(id);
  }

  buscarTexto(valor: string) {
    this.textoBusca = valor;
  }
}
