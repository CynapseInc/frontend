import api from '../provider/api';
import type { MovimentacaoResponse, PageResponse } from '../interfaces/MovimentacaoResponseInterface';

export const movimentacaoService = {
  listar: async (params?: {
    search?: string;
    tipo?: string;
    valor?: number;
    categoria?: string;
    contraparte?: string;
    nome?: string;
    status?: boolean;
    statusPagamento?: string;
    dataVencInicio?: string;
    dataVencFim?: string;
    dataPagInicio?: string;
    dataPagFim?: string;
    page?: number;
  }): Promise<PageResponse<MovimentacaoResponse>> => {

    const { data } = await api.get('/movimentacoes', {
      params
    });
    console.log('URL chamada:', api.getUri({ url: '/movimentacoes', params }));

    // printar a url que esta chamando acima com os parametros



    console.log('Resposta da API:', data);
    console.log(params)
    // caso venha 204 (sem conteúdo)
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
  cadastrar: async (data: any) => {
    console.log("mandando:" , data)
    const response = await api.post('/movimentacoes', data);
    return response.data;
  },

  atualizar: async (id: number, data: any) => {
    const response = await api.put(`/movimentacoes/${id}`, data);
    return response.data;
  },
  deletar: async (id: number) => {
    await api.delete(`/movimentacoes/${id}`);
  }

  
};