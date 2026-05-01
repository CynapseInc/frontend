import api from '../provider/api';

export const statusPedidoService = {
  listarTodos: async (page = 0, ativo = true) => {
    const { data } = await api.get(`/status-pedidos?page=${page}&ativo=${ativo}`);
    return data && data.content && Array.isArray(data.content) ? data.content : [];
  },
  
  async criar(status: string, cor: string, ordemKanban: number) { 
    const response = await api.post('/status-pedidos', { 
       status, 
       cor, 
       ordemKanban 
    });
    return response.data;
  },
  
  atualizar: async (id: string | number, nome: string, cor: string) => {
    const { data } = await api.put(`/status-pedidos/${id}`, { status: nome, cor: cor });
    return data;
  },
  
  desativar: async (id: string | number) => {
    await api.patch(`/status-pedidos/mudar-estado/${id}`);
  },
  
  async reordenarKanban(novosIdsNaOrdem: { id: number, novaOrdemKanban: number }[]) {
    const response = await api.post('/status-pedidos/reordenar-kanban', novosIdsNaOrdem);
    return response.data;
  }
};