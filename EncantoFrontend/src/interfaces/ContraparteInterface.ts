
export interface Contraparte {
    id: number;
    nome: string;
    descricao: string;
    segmento: string;
    tipoContrato: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}