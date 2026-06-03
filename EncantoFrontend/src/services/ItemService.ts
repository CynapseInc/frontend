import api from '../provider/api';

export const itemService = {
  listarTodos: async (params?: 
    {
      search?: string,
      page?: number,
      ativo?: boolean
    }
  ) => {
    const { data } = await api.get(`/itens`, { params });
    
    if(!data){
            return {
                content:[],
                totalElements: 0, 
                totalPages: 0,
                number: 0,
                size: 0
            }
        }

    return data;
  },
  
  criar: async (payload: any) => {
    const { data } = await api.post('/itens', payload);
    return data;
  },
  
  atualizar: async (id: string, payload: any) => {
    const { data } = await api.put(`/itens/${id}`, payload);
    return data;
  },
  
  deletar: async (id: string) => {
    await api.delete(`/itens/${id}`);
  }
};