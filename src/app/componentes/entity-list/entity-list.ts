import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Entidade } from '../../models/entidade.model';
import { obterCorPorTipo, obterIconePorTipo } from '../../shared/entidade-visual';

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
  @Output() tipoSelecionado = new EventEmitter<string>();

  textoBusca: string = '';

  obterCor = obterCorPorTipo;
  obterIcone = obterIconePorTipo;

  get entidadesVisiveis(): Entidade[] {
    if (this.textoBusca === '') {
      return this.entidades;
    }
    return this.entidades.filter(entidade => entidade.label.toLowerCase().includes(this.textoBusca.toLowerCase()));
  }

  selecionarEntidade(id: string) {
    this.entidadeSelecionada.emit(id);
  }

  filtrarPorTipo(tipo: string, evento: Event) {
    evento.stopPropagation();
    this.tipoSelecionado.emit(tipo);
  }

  buscarTexto(valor: string) {
    this.textoBusca = valor;
  }
}