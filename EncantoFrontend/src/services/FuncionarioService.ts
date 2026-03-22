import api from '../provider/api';
import type { Funcionario } from '../interfaces/Funcionario';

export const funcionarioService = {
  listarTodos: async (): Promise<Funcionario[]> => {
    const { data } = await api.get('/usuarios');
    console.log('Dados recebidos da API:', data);
    return data ? data : []; 
  },
  // ... resto do código
  
  buscarPorId: async (id: number) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  criar: async (dados: any) => {
    const response = await api.post('/usuarios', dados);
    return response.data;
  },
  
  atualizar: async (id: string | number, dados: any) => {
    const response = await api.put(`/usuarios/${id}`, dados);
    return response.data;
  },

  deletar: async (id: string | number) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }
};