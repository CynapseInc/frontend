import api from '../provider/api';

export const categoriaTemaService = {
    listarTodos: async (params?:{
        search?: string,
        page?:number
    }) => {
    const { data } = await api.get('/categoria-temas', { params });
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
  criar: async (titulo: string) => {
    const { data } = await api.post('/categoria-temas', { titulo });
    return data;
  },
  atualizar: async (id: string, titulo: string) => {
    const { data } = await api.put(`/categoria-temas/${id}`, { titulo });
    return data;
  },
  deletar: async (id: string) => {
    await api.patch(`/categoria-temas/mudar-estado/${id}`);
  }
};