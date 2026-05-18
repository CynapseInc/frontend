import api from '../provider/api';
import type { ProdutoResponse, ProdutoRequest } from '../interfaces/Produto';

export const produtoService = {
  listarTodos: async (
    page: number = 0, 
    size: number = 10, 
    search?: string,
    categoria?: string,
    tema?: string,
    item?: string
  ): Promise<any> => {
    
    // Monta os parâmetros, ignorando os que forem 'Todos' ou nulos
    const params: any = { page, size };
    if (search) params.search = search;
    if (categoria && categoria !== 'Todos') params.categoria = categoria;
    if (tema && tema !== 'Todos') params.tema = tema;
    if (item && item !== 'Todos') params.item = item;

    const { data } = await api.get('/produtos', { params });
    
    return data; 
  },
  
  buscarPorId: async (id: string | number): Promise<ProdutoResponse> => {
    const { data } = await api.get(`/produtos/${id}`);
    return data;
  },

  criar: async (dados: ProdutoRequest): Promise<ProdutoResponse> => {
    const { data } = await api.post('/produtos', dados);
    return data;
  },
  
  atualizar: async (id: string | number, dados: ProdutoRequest): Promise<ProdutoResponse> => {
    const { data } = await api.put(`/produtos/${id}`, dados);
    return data;
  },

  deletar: async (id: string | number): Promise<void> => {
    await api.patch(`/produtos/mudar-estado/${id}`);
  }
};