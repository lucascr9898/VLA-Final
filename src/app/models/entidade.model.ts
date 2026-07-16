export type TipoEntidade =
  | 'Pessoa'
  | 'Empresa'
  | 'Telefone'
  | 'E-mail'
  | 'Endereço'
  | 'Veículo'
  | 'Documento'
  | 'Cargo';

export interface Entidade {
  id: string;
  label:string;
  type: string;
}
