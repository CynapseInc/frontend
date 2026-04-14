export interface Funcionario {
  id?: number | string;
  name: string;
  email: string;
  cpf: string;
  dataNasc: string;
  cargo: string;
  foto?: string;
  senha?: string;
  status?: 'Ativo' | 'Inativo';
}