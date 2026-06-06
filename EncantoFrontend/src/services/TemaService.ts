import api from '../provider/api';

export const temaService = {
  listarTodos: async ( params?:
    {
      search?: string,
      page?: number
    }
  ) => {
    const { data } = await api.get('/temas', { params });

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
  criar: async (descricao: string, categoriaTemaId: number) => {
    const { data } = await api.post('/temas', { descricao, categoriaTemaId });
    return data;
  },
  atualizar: async (id: string, descricao: string, categoriaTemaId: number) => {
    const { data } = await api.put(`/temas/${id}`, { descricao, categoriaTemaId });
    return data;
  },
  deletar: async (id: string) => {
    await api.patch(`/temas/mudar-estado/${id}`);
  }
};