import { TipoEntidade } from '../models/entidade.model';

export const CORES_POR_TIPO: Record<TipoEntidade, string> = {
  'Pessoa':    '#3B82F6',
  'Empresa':   '#F59E0B',
  'Telefone':  '#10B981',
  'E-mail':    '#8B5CF6',
  'Endereço':  '#EF4444',
  'Veículo':   '#06B6D4',
  'Documento': '#64748B',
  'Cargo':     '#EC4899',
};

export const ICONE_POR_TIPO: Record<TipoEntidade, string> = {
  'Pessoa':    '👤',
  'Empresa':   '🏢',
  'Telefone':  '📞',
  'E-mail':    '✉️',
  'Endereço':  '📍',
  'Veículo':   '🚗',
  'Documento': '📄',
  'Cargo':     '💼',
};

export const FORMA_POR_TIPO: Record<TipoEntidade, string> = {
  'Pessoa':    'Circle',
  'Empresa':   'RoundedRectangle',
  'Telefone':  'Circle',
  'E-mail':    'Diamond',
  'Endereço':  'RoundedRectangle',
  'Veículo':   'RoundedRectangle',
  'Documento': 'Rectangle',
  'Cargo':     'Rectangle',
};

export const TODOS_OS_TIPOS: TipoEntidade[] = [
  'Pessoa', 'Empresa', 'Telefone', 'E-mail', 'Endereço', 'Veículo', 'Documento', 'Cargo',
];

export function escurecerCor(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - 25);
  const g = Math.max(0, ((num >> 8) & 0xff) - 25);
  const b = Math.max(0, (num & 0xff) - 25);
  return `rgb(${r}, ${g}, ${b})`;
}
