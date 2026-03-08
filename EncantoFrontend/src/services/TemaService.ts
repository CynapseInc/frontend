import api from '../provider/api';

export const temaService = {
  listarTodos: async () => {
    const { data } = await api.get('/temas');
    if (data && data.content && Array.isArray(data.content)) {
      return data.content;
    }
    return Array.isArray(data) ? data : [];
  },
  criar: async (descricao: string, categoriaTemaId: number) => {
    const { data } = await api.post('/temas', { descricao, categoriaTemaId });
    return data;
  },
  atualizar: async (id: string, descricao: string, categoriaTemaId: number) => {
    const { data } = await api.put(`/temas/${id}`, { descricao, categoriaTemaId });
    return data;
  },
  deletar: async (id: string) => {
    await api.delete(`/temas/${id}`);
  }
};