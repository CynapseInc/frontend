export interface MovimentacaoResponse {
  id: number;
  descricao: string;
  tipo: string;
  valor: number;
  status: boolean;
  statusPagamento: string;
  dataVencimento: string;
  dataPagamento: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}