import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Entidade } from "../models/entidade.model";
import { Relacao } from "../models/relacao.model";

@Injectable({ providedIn: 'root' })
export class ServicoVla {
  constructor(private http: HttpClient) {
  }

  getJson(): Observable<{ entidades: Entidade[]; relacoes: Relacao[] }> {
    return this.http.get<{ entidades: Entidade[]; relacoes: Relacao[] }>(this.localJson);
  }

  private localJson = 'vlaDados.json';
}
