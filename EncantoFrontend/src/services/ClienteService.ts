import api from '../provider/api';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const clienteService = {
  listarTodos: async (page = 0, size = 10, search = ''): Promise<PageResponse<any>> => {
    const { data } = await api.get('/clientes', {
      params: {
        page,
        size,
        search: search || undefined
      }
    });

    if (!data) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 0
      };
    }
    
    return data;
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