import api from '../provider/api';

export const itemService = {
  listarTodos: async () => {
    const { data } = await api.get('/itens');
    if (data && data.content && Array.isArray(data.content)) {
      return data.content;
    }
    return Array.isArray(data) ? data : [];
  },
  criar: async (payload: any) => {
    const { data } = await api.post('/itens', payload);
    return data;
  },
  atualizar: async (id: string, payload: any) => {
    const { data } = await api.put(`/itens/${id}`, payload);
    return data;
  },
  deletar: async (id: string) => {
    await api.delete(`/itens/${id}`);
  }
};