import api from '../provider/api';

export const produtoPedidoService = {
  adicionarProdutoAoPedido: async (payload: any) => {
    const { data } = await api.post('/pedidos/produtos', payload);
    return data;
  },
  
  atualizarQuantidadeProduto: async (idRelacionamento: string | number, quantidade: number) => {
    await api.put(`/pedidos/produtos/${idRelacionamento}`, { quantidade });
  },

  removerProdutoDoPedido: async (idRelacionamento: string | number) => {
    await api.delete(`/pedidos/produtos/${idRelacionamento}`);
  }
};