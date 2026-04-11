// src/interfaces/Produto.ts

export interface CategoriaTema {
  id: number;
  titulo: string;
}

export interface TemaProduto {
  id: number;
  descricao: string;
  categoriaTema?: CategoriaTema;
}

export interface ItemProduto {
  id: number;
  descricao: string;
  precoVenda: number;
  custoProducao: number;
  prazoProducao: number;
  largura: number;
  altura: number;
  peso: number;
  comprimento: number;
  material: string;
  descricaoPadrao?: string;
  precoPromocional: number;
}

export interface FotoProduto {
  id: number;
  foto: string;
}

export interface Produto {
  id: number;
  titulo: string;
  descricao: string;
  tema?: TemaProduto;
  item?: ItemProduto;
  fotos?: FotoProduto[];
  ativo?: boolean;
}

// ==========================================
// ADICIONADO: Tipagens para o Service
// ==========================================

// O Response que vem do Java é exatamente o nosso Produto completo
export type ProdutoResponse = Produto;

// O Request que enviamos para o Java ao criar/editar um produto
export interface ProdutoRequest {
  titulo: string;
  descricao: string;
  temaId: number;
  itemId: number;
  fotos?: any[];
}