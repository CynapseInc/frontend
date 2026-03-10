import api from '../provider/api';

export const dashFinanceiraService = {

    // exemplo de chamada: dashfinanceiros?inicio=2025-01-01&fim=2026-03-10
    listarDashFinanceiros: async (inicio: string, fim: string) => {
        const { data } = await api.get(`/dashfinanceiros?inicio=${inicio}&fim=${fim}`);
        
        

        return data;
    }

}