import api from '../provider/api';

export const pedidoService = {
  listarTodos: async (page = 0, ativa = true, search = '') => {
    let url = `/pedidos?page=${page}&ativa=${ativa}`;
    if (search) url += `&search=${search}`;
    
    const { data } = await api.get(url);
    return data && data.content && Array.isArray(data.content) ? data.content : [];
  },
  
  buscarPorId: async (id: string | number) => {
    const { data } = await api.get(`/pedidos/${id}`);
    return data;
  },

  criar: async (payload: any) => {
    const { data } = await api.post('/pedidos', payload);
    return data;
  },

  atualizar: async (id: string | number, payload: any) => {
    const { data } = await api.put(`/pedidos/${id}`, payload);
    return data;
  },

  mudarStatus: async (pedidoId: number, statusId: number) => {
    const { data } = await api.patch('/pedidos/mudar-status', { 
      idPedido: pedidoId, 
      idStatusPedido: statusId 
    });
    return data;
  },
  
  mudarEstado: async (id: string | number) => {
     await api.patch(`/pedidos/mudar-estado/${id}`);
  }
};