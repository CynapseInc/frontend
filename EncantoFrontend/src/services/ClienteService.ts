import api from '../provider/api';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const clienteService = {
  listarTodos: async (
    {
      search = '',
      page = 0
    }: {
      search?: string;
      page?: number;  
    }
  ) => {
    const { data } = await api.get('/clientes', {
      params: {
        search: search || undefined,
        page: page || undefined
      }
    });

    console.log(data, "printando ")
    return data;
  },
  
  criar: async (payload: any) => {
    const { data } = await api.post('/clientes', payload);
    return data;
  },

  atualizar: async (id: string | number, payload: any) => {
    const { data } = await api.put(`/clientes/${id}`, payload);
    return data;
  },
  excluir: async (id: string | number) => {
    const { data } = await api.patch(`/clientes/${id}/mudar-estado`);
    return data;
  }
};