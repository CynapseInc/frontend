export interface Funcionario {
  id?: number | string; // Opcional na criação, pode ser number do back ou string do grid
  name: string;         // Alterado de 'nome' para 'name' para bater com o DTO
  email: string;
  cpf: string;
  dataNasc: string;
  cargo: string;
  foto?: string;        // Adicionado para bater com o DTO
  senha?: string;       // Usado apenas no momento de criar/editar
  status?: 'Ativo' | 'Inativo'; // Usado pelo frontend
}