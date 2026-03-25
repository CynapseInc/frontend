import api from "../provider/api";
import type { CategoriaMovResponse, PageResponse } from "../interfaces/CategoriaMovInterface";

export const categoriaMovService = {
    listar: async (params?: 
        {
            search?: string;
            page?: number;
        }
    ): Promise<PageResponse<CategoriaMovResponse>> => {
        
        const { data } = await api.get('/categoria-movimentacoes', { params });

        if(!data) {
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

    cadastrar: async ({descricao}: { descricao: string }): Promise<CategoriaMovResponse> => {
        const { data } = await api.post('/categoria-movimentacoes', { descricao });
        return data;
    },

    deletar: async (id: number): Promise<void> => {
        await api.delete(`/categoria-movimentacoes/${id}`);
    },

    editar: async (id: number, {descricao}: { descricao: string }): Promise<CategoriaMovResponse> => {
        const { data } = await api.put(`/categoria-movimentacoes/${id}`, { descricao });
        return data;
    }
}