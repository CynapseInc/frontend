import api from '../provider/api';
import type { PedidoPageResponse } from '../interfaces/Pedido';

interface ListarPedidosPaginadoParams {
  page?: number;
  size?: number;
  ativa?: boolean;
  search?: string;
  inicio?: string;
  fim?: string;
}

export const pedidoService = {
  listarTodos: async (page = 0, size = 500, ativa = true, search = '', inicio?: string, fim?: string) => {
    let url = `/pedidos?page=${page}&size=${size}&ativa=${ativa}`; // Adicione &size=${size} na URL
    if (search) url += `&search=${search}`;
    if (inicio) url += `&inicio=${inicio}`;
    if (fim) url += `&fim=${fim}`;
    
    const { data } = await api.get(url);
    return data && data.content && Array.isArray(data.content) ? data.content : [];
  },

  listarPaginado: async ({
    page = 0,
    size = 10,
    ativa = true,
    search = '',
    inicio,
    fim,
  }: ListarPedidosPaginadoParams): Promise<PedidoPageResponse> => {
    const { data } = await api.get('/pedidos', {
      params: {
        page,
        size,
        ativa,
        search: search || undefined,
        inicio,
        fim,
      },
    });

    return data;
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
