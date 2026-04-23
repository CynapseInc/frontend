import api from '../provider/api';
import type { Funcionario } from '../interfaces/Funcionario';

export const funcionarioService = {
  listarTodos: async (): Promise<Funcionario[]> => {
    const { data } = await api.get('/usuarios');
    return data ? data : []; 
  },
  
  buscarPorId: async (id: number) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  criar: async (dados: any) => {
    const response = await api.post('/usuarios', dados);
    return response.data;
  },
  mudarSenha: async (id: string | number, oldPassword: string, newPassword: string) => {
    // O backend espera RequestParams, então enviamos na URL
    const response = await api.patch(`/usuarios/${id}?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`);
    return response.data;
  },
  
  atualizar: async (id: string | number, dados: any) => {
    const response = await api.put(`/usuarios/${id}`, dados);
    return response.data;
  },

  deletar: async (id: string | number) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  uploadFoto: async (id: string | number, file: File) => {
    const formData = new FormData();
    formData.append('foto', file);
    
    const response = await api.post(`/usuarios/foto/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletarFoto: async (id: string | number) => {
    const response = await api.delete(`/usuarios/foto/${id}`);
    return response.data;
  }
};