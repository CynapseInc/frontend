import api from '../provider/api';

export const categoriaTemaService = {
  listarTodos: async () => {
    const { data } = await api.get('/categoria-temas');
    if (data && data.content && Array.isArray(data.content)) {
      return data.content;
    }
    return Array.isArray(data) ? data : [];
  },
  criar: async (titulo: string) => {
    const { data } = await api.post('/categoria-temas', { titulo });
    return data;
  },
  atualizar: async (id: string, titulo: string) => {
    const { data } = await api.put(`/categoria-temas/${id}`, { titulo });
    return data;
  },
  deletar: async (id: string) => {
    await api.delete(`/categoria-temas/${id}`);
  }
};