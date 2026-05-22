import api from '../provider/api';
import type { Cliente, ClienteListParams, EnderecoCliente, PageResponse } from '../interfaces/Cliente';

export const clienteService = {
  listarTodos: async (
    {
      search = '',
      page = 0,
      size = 10
    }: ClienteListParams = {}
  ): Promise<PageResponse<Cliente>> => {
    const { data } = await api.get('/clientes', {
      params: {
        search: search || undefined,
        page,
        size
      }
    });

    return data;
  },
  
  criar: async (payload: Cliente) => {
    const { data } = await api.post('/clientes', payload);
    return data;
  },

  atualizar: async (id: string | number, payload: Cliente) => {
    const { data } = await api.put(`/clientes/${id}`, payload);
    return data;
  },
  excluir: async (id: string | number) => {
    const { data } = await api.patch(`/clientes/${id}/mudar-estado`);
    return data;
  },

  criarEndereco: async (clienteId: string | number, payload: EnderecoCliente) => {
    const { data } = await api.post(`/clientes/${clienteId}/enderecos`, payload);
    return data;
  },

  atualizarEndereco: async (id: string | number, payload: EnderecoCliente) => {
    const { data } = await api.put(`/clientes/enderecos/${id}`, payload);
    return data;
  },

  excluirEndereco: async (id: string | number) => {
    const { data } = await api.patch(`/clientes/enderecos/${id}/mudar-estado`);
    return data;
  }
};
