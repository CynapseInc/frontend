import api from '../provider/api'

import type { Contraparte, PageResponse } from '../interfaces/ContraparteInterface'

export const contraparteService = {
    listar: async (params?:{
        search?: string,
        page?:number
    }): Promise<PageResponse<Contraparte>> =>{
        const {data} = await api.get('/contrapartes', {params});
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
    criar: async (contraparte: Omit<Contraparte, 'id'>): Promise<Contraparte> => {
        const {data} = await api.post('/contrapartes', contraparte);
        return data;
    },
    editar: async (id: number, contraparte: Omit<Contraparte, 'id'>): Promise<Contraparte> => {
        const {data} = await api.put(`/contrapartes/${id}`, contraparte);
        return data;
    }
    ,
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/contrapartes/${id}`);
    }


}