import api from '../provider/api';
import type { ProdutoResponse, ProdutoRequest } from '../interfaces/Produto';

export const produtoService = {
  // Retorna um array de ProdutoResponse
  listarTodos: async (): Promise<ProdutoResponse[]> => {
    const { data } = await api.get('/produtos');
    
    if (data && data.content && Array.isArray(data.content)) {
      return data.content;
    }
    
    return Array.isArray(data) ? data : [];
  },
  
  buscarPorId: async (id: string | number): Promise<ProdutoResponse> => {
    const { data } = await api.get(`/produtos/${id}`);
    return data;
  },

  criar: async (dados: ProdutoRequest): Promise<ProdutoResponse> => {
    const { data } = await api.post('/produtos', dados);
    return data;
  },
  
  // Tipado com ProdutoRequest e ProdutoResponse
  atualizar: async (id: string | number, dados: ProdutoRequest): Promise<ProdutoResponse> => {
    const { data } = await api.put(`/produtos/${id}`, dados);
    return data;
  },

  deletar: async (id: string | number): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  }
};