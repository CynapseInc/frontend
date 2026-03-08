export interface TemaProduto {
  id?: number;
  descricao: string;
}

export interface ItemProduto {
  id?: number;
  descricao: string;
  precoVenda?: number;
  peso?: number;
}

export interface FotoProduto {
  foto: string; 
}

export interface ProdutoResponse {
  id: number;
  titulo: string;
  descricao: string;
  fotos: FotoProduto[];
  tema: TemaProduto;
  item: ItemProduto;
}

export interface ProdutoRequest {
  titulo: string;
  descricao: string;
  temaId: number;
  itemId: number;
  fotos: FotoProduto[];
}

export interface ProdutoFrontend {
  id: string;
  name: string;
  category: string;
  theme: string;
  item: string;
  imageUrl: string;
}