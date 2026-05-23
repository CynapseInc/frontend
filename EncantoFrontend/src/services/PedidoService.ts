import api from '../provider/api';
import type { PedidoPageResponse } from '../interfaces/Pedido';

interface ListarPedidosPaginadoParams {
  page?: number;
  size?: number;
  ativa?: boolean;
  search?: string;
  inicio?: string;
  fim?: string;
  origem?: string;
  statusId?: number | string;
  createdAtInicio?: string;
  createdAtFim?: string;
  dataLimiteInicio?: string;
  dataLimiteFim?: string;
  valorMin?: number | string;
  valorMax?: number | string;
  sortBy?: string;
  sortDirection?: string;
}

const paramOpcional = (valor?: number | string) => {
  if (valor === undefined || valor === null || valor === '') return undefined;
  return valor;
};

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
    origem,
    statusId,
    createdAtInicio,
    createdAtFim,
    dataLimiteInicio,
    dataLimiteFim,
    valorMin,
    valorMax,
    sortBy,
    sortDirection,
  }: ListarPedidosPaginadoParams): Promise<PedidoPageResponse> => {
    const { data } = await api.get('/pedidos', {
      params: {
        page,
        size,
        ativa,
        search: search || undefined,
        inicio,
        fim,
        origem: origem || undefined,
        statusId: statusId || undefined,
        createdAtInicio: createdAtInicio || undefined,
        createdAtFim: createdAtFim || undefined,
        dataLimiteInicio: dataLimiteInicio || undefined,
        dataLimiteFim: dataLimiteFim || undefined,
        valorMin: paramOpcional(valorMin),
        valorMax: paramOpcional(valorMax),
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
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
