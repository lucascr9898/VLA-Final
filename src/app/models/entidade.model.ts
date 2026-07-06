export type TipoEntidade =
  | 'person'
  | 'company'
  | 'phone'
  | 'email'
  | 'address'
  | 'vehicle'
  | 'document';

export interface Entidade {
  id: string;
  label:string;
  type: TipoEntidade;
}
