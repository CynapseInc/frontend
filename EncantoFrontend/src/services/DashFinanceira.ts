import api from '../provider/api';

export const dashFinanceiraService = {

    listarDashFinanceiros: async (inicio: string, fim: string) => {
        const { data } = await api.get(`/dashfinanceiros?inicio=${inicio}&fim=${fim}`);
        
        

        return data;
    }

}