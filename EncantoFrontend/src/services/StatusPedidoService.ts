import api from '../provider/api';

export const statusPedidoService = {
  listarTodos: async (page = 0, ativo = true) => {
    const { data } = await api.get(`/status-pedidos?page=${page}&ativo=${ativo}`);
    return data && data.content && Array.isArray(data.content) ? data.content : [];
  },
  
  criar: async (nome: string, cor: string) => {
    const { data } = await api.post('/status-pedidos', { status: nome, cor: cor }); 
    return data;
  },
  
  atualizar: async (id: string | number, nome: string, cor: string) => {
    const { data } = await api.put(`/status-pedidos/${id}`, { status: nome, cor: cor });
    return data;
  },
  
  desativar: async (id: string | number) => {
    await api.patch(`/status-pedidos/mudar-estado/${id}`);
  },
  
  reordenarKanban: async (novosIdsNaOrdem: any[]) => {
    await api.post('/status-pedidos/reordenar-kanban', novosIdsNaOrdem);
  }
};