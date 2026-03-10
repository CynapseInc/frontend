import api from '../provider/api';

export const fotoProdutoService = {
  uploadFoto: async (produtoId: number | string, file: File) => {
    const formData = new FormData();
    formData.append('foto', file); 

    const { data } = await api.post(`/produtos/${produtoId}/fotos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  deletarFoto: async (fotoId: number | string) => {
    await api.delete(`/produtos/fotos/${fotoId}`);
  }
};