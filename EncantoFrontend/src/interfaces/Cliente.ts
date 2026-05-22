export interface EnderecoCliente {
  id?: number;
  logradouro: string;
  numLogradouro?: string;
  numero?: string;
  bairro: string;
  cep: string;
  uf?: string;
  cidade: string;
  estado: string;
  municipio?: string;
  complemento?: string;
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  telefone: string;
  enderecos: EnderecoCliente[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClienteFormPayload extends Cliente {
  enderecosRemovidos?: number[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ClienteListParams {
  search?: string;
  page?: number;
  size?: number;
}
