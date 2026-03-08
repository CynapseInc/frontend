// src/interfaces/Pedido.ts

// Espelha o StatusPedidoResponseDto do Java
export interface StatusPedidoResponse {
  id: number;
  status: string;
  cor: string;
  ordemKanban: number;
  created_at?: string;
  updated_at?: string;
}

// Espelha o ProdutosPedidoResponseDto do Java
export interface ProdutosPedidoResponse {
  id: number;
  idProduto: number;
  idPedido: number;
  quantidade: number;
  pesoTotal: number;
  pesoUnitario: number;
  precoUnitario: number;
  precoTotal: number;
  createdAt?: string;
  updatedAt?: string;
}

// Interface auxiliar baseada na estrutura do PedidoStatusPedidoResponseDto 
// (que guarda o histórico e qual o status do pedido naquele momento)
export interface PedidoStatusPedidoResponse {
  id?: number;
  status: StatusPedidoResponse; // O status em si (A Fazer, Em Andamento...)
  dataMudanca?: string;
}

// Espelha o PedidoResponseDto do Java
export interface PedidoResponse {
  id: number;
  observacoes: string;
  origem: string;
  dataLimite: string; // Vem como ISO string do LocalDateTime
  precoTotal: number;
  pesoTotal: number;
  cliente: {
    id: number;
    nome: string;
    telefone?: string;
    email?: string;
  };
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  produtos: ProdutosPedidoResponse[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  statusAtual: PedidoStatusPedidoResponse;
  historicoStatus: PedidoStatusPedidoResponse[];
}