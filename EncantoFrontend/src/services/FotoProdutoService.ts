import api from '../provider/api';

export const fotoProdutoService = {
  uploadFoto: async (produtoId: number | string, arquivo: File) => {
    const formData = new FormData();
    formData.append('file', arquivo); 

    const { data } = await api.post(`/produtos/${produtoId}/fotos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deletarFoto: async (produtoId: number | string, fotoId: number | string) => {
    await api.delete(`/produtos/${produtoId}/fotos/${fotoId}`);
  }
};