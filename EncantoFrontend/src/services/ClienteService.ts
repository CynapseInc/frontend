import api from '../provider/api';

export const clienteService = {
  listarTodos: async (page = 0) => {
    const { data } = await api.get(`/clientes?page=${page}`);
    return data && data.content && Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
  },
  
  criar: async (payload: any) => {
    const { data } = await api.post('/clientes', payload);
    return data;
  },

  atualizar: async (id: string | number, payload: any) => {
    const { data } = await api.put(`/clientes/${id}`, payload);
    return data;
  }
};