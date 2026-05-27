
export type StatusPedidoRole = 'FINALIZADO' | 'ENTREGUE' | 'CANCELADO';

export interface StatusPedidoResponse {
  id: number;
  status: string;
  cor: string;
  ordemKanban: number;
  role?: StatusPedidoRole | null;
  created_at?: string;
  updated_at?: string;
}

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

export interface PedidoStatusPedidoResponse {
  status: any;
  id?: number;
  idPedido?: number;
  idStatusPedido: number;
  statusAtual?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface PedidoResponse {
  id: number;
  observacoes: string;
  origem: string;
  dataLimite: string;
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

export interface PedidoPageResponse {
  content: PedidoResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
