import api from '../provider/api';

export const dashFinanceiraService = {

    listarDashFinanceiros: async (
        inicio: string,
        fim: string,
        tipoPedido?: string,
        produtoId?: number,
        temaId?: number
    ) => {
        const params = new URLSearchParams({ inicio, fim });
        if (tipoPedido) params.append('tipoPedido', tipoPedido);
        if (produtoId)  params.append('produtoId', String(produtoId));
        if (temaId)     params.append('temaId', String(temaId));

        const { data } = await api.get(`/dashgestaopedidos?${params}`);
        return data;
    }

}
