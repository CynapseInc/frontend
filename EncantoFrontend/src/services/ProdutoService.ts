import api from '../provider/api';
import type { ProdutoResponse, ProdutoRequest } from '../interfaces/Produto';

export const produtoService = {
  listarTodos: async () => {
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
  

  atualizar: async (id: string | number, dados: any): Promise<any> => {
    const { data } = await api.put(`/produtos/${id}`, dados);
    return data;
  },

  deletar: async (id: string | number): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  }
};