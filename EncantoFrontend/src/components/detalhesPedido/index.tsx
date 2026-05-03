import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, Package, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import ClientListModal from '../modals-global/ClientListModal';
import ClientFormModal from '../modals-global/ClientFormModal';
import AddProductModal from '../modals-global/AddProductModal';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackModal from '../ui/FeedbackModal';

// Serviços
import { pedidoService } from '../../services/PedidoService';
import { clienteService } from '../../services/ClienteService';
import { produtoService } from '../../services/ProdutoService';
import { statusPedidoService } from '../../services/StatusPedidoService';
import { produtoPedidoService } from '../../services/ProdutoPedidoService'; 

import './index-det-pedido.css';

interface EnderecoCliente {
  id?: number; cep: string; logradouro: string; numero: string;
  bairro: string; cidade: string; estado: string; complemento: string;
}

interface Cliente {
  id?: number; nome: string; telefone: string; email?: string;
  enderecos: EnderecoCliente[];
}

interface Product {
  id: string; title: string; description: string; imageUrl: string;
  category: string; theme: string; item: string;
  unitPrice: number; unitWeight: number; productionDays: number;
}

interface SelectedProduct {
  idRelacionamento?: number; 
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitWeight: number;
  totalWeight: number;
}

interface StatusType {
  id: string; name: string;
}

export default function App() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // Estados com os dados da API
  const [clients, setClients] = useState<Cliente[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [statusTypes, setStatusTypes] = useState<StatusType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Formulário/Pedido
  const [orderId, setOrderId] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [observations, setObservations] = useState('');
  const [statusId, setStatusId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  // Estados dos Modais
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [feedback, setFeedback] = useState<{
      isOpen: boolean;
      message: string;
      type: 'success' | 'error';
    }>({
      isOpen: false,
      message: '',
      type: 'success'
    });
  
  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ isOpen: true, message, type });
  };

  // ==========================================
  // BUSCAR DADOS DA API COM VALIDAÇÃO SEGURA
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [pedidoData, clientesResponse, produtosData, statusData] = await Promise.all([
          pedidoService.buscarPorId(id),
          clienteService.listarTodos({ page: 0 }),
          produtoService.listarTodos(0, 500),
          statusPedidoService.listarTodos()
        ]);

        if (!pedidoData) throw new Error("Pedido não encontrado na base de dados");

        const listaClientes = clientesResponse?.content || [];
        setClients(listaClientes);

        const listaDeProdutosDoCatalogo = Array.isArray(produtosData) ? produtosData : (produtosData?.content || []);

        const formatProducts = listaDeProdutosDoCatalogo.map((p: any) => ({
          id: p.id ? p.id.toString() : '',
          title: p.titulo || 'Produto sem nome',
          description: p.descricao || '',
          imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0].foto : '',
          category: p.tema?.categoriaTema?.titulo || 'Diversos',
          theme: p.tema?.descricao || 'Diversos',
          item: p.item?.descricao || 'Diversos',
          unitPrice: p.item?.precoVenda || 0,
          unitWeight: p.item?.peso || 0,
          productionDays: p.item?.prazoProducao || 0
        }));
        setAllProducts(formatProducts);

        const listaStatusDaAPI = Array.isArray(statusData) ? statusData : (statusData?.content || []);
        setStatusTypes(listaStatusDaAPI.map((s: any) => ({ 
          id: s.id ? s.id.toString() : '', 
          name: s.status || 'Status Desconhecido' 
        })));

        // Preenchimento seguro de formulário (Garante que nunca seja NaN ou undefined para o layout)
        setOrderId(pedidoData.id ? pedidoData.id.toString() : id.toString());

        if (pedidoData.cliente?.id) {
          setSelectedClientId(pedidoData.cliente.id.toString());
        } else {
          setSelectedClientId('');
        }
        
        if (pedidoData.cliente?.enderecos?.length > 0 && pedidoData.cliente.enderecos[0].id) {
           setSelectedAddressId(pedidoData.cliente.enderecos[0].id.toString());
        } else {
           setSelectedAddressId('');
        }
        
        setObservations(pedidoData.observacoes || '');

        // === CORREÇÃO DO STATUS ===
        // O backend manda "idStatusPedido", se não achar ele tenta achar o "status.id", e por fim tenta achar direto "id"
        let currentStatusId = '';
        if (pedidoData.statusAtual) {
            currentStatusId = pedidoData.statusAtual.idStatusPedido 
                           || pedidoData.statusAtual.status?.id 
                           || pedidoData.statusAtual.id 
                           || '';
        }
        setStatusId(currentStatusId ? currentStatusId.toString() : '');
        // ==========================
        
        setCreatedAt(pedidoData.createdAt ? new Date(pedidoData.createdAt).toLocaleString('pt-BR') : 'Data não definida');
        setUpdatedAt(pedidoData.updatedAt ? new Date(pedidoData.updatedAt).toLocaleString('pt-BR') : 'Data não definida');

        // Preenchimento Seguro dos Produtos
        if (pedidoData.produtos && Array.isArray(pedidoData.produtos)) {
          const mapOrderProducts = pedidoData.produtos.map((prodRel: any) => {
            const idProduto = prodRel.idProduto || prodRel.produto?.id;
            const idProdutoStr = idProduto ? idProduto.toString() : '';
            
            const catalogoProd = formatProducts.find((p: any) => p.id === idProdutoStr);
            
            return {
              idRelacionamento: prodRel.id,
              product: catalogoProd || { 
                id: idProdutoStr, 
                title: prodRel.produto?.titulo || 'Produto Indisponível/Excluído', 
                unitPrice: prodRel.precoUnitario || 0, 
                unitWeight: prodRel.pesoUnitario || 0 
              },
              quantity: prodRel.quantidade || 1,
              unitPrice: prodRel.precoUnitario || 0,
              totalPrice: prodRel.precoTotal || 0,
              unitWeight: prodRel.pesoUnitario || 0,
              totalWeight: prodRel.pesoTotal || 0
            };
          });
          setSelectedProducts(mapOrderProducts);
        } else {
          setSelectedProducts([]);
        }

      } catch (error) {
        console.error("Erro ao carregar dados do pedido:", error);
        showFeedback('Erro ao carregar os detalhes do pedido.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const selectedClient = clients.find(c => c.id?.toString() === selectedClientId);
  const selectedAddress = selectedClient?.enderecos?.find(a => a.id?.toString() === selectedAddressId);

  // ==========================================
  // FUNÇÕES DE PRODUTOS
  // ==========================================
  const handleUpdateQuantity = async (idRelacionamento: number | undefined, quantity: number, productId: string) => {
    if (quantity < 1) return;
    
    try {
      if (idRelacionamento) {
        await produtoPedidoService.atualizarQuantidadeProduto(idRelacionamento, quantity);
      }

      setSelectedProducts(selectedProducts.map(sp => {
        if (sp.product.id === productId) {
          return {
            ...sp,
            quantity,
            totalPrice: sp.unitPrice * quantity,
            totalWeight: sp.unitWeight * quantity,
          };
        }
        return sp;
      }));
      updateLastModified();
    } catch (error) {
      console.error("Erro ao atualizar quantidade", error);
      showFeedback('Erro ao atualizar quantidade do produto.', 'error');
    }
  };

  const handleRemoveProduct = async (idRelacionamento: number | undefined, productId: string) => {
    if (confirm('Deseja realmente remover este produto do pedido?')) {
      try {
         if (idRelacionamento) {
           await produtoPedidoService.removerProdutoDoPedido(idRelacionamento);
         }
         setSelectedProducts(selectedProducts.filter(sp => sp.product.id !== productId));
         updateLastModified();
      } catch (error) {
         console.error("Erro ao remover produto", error);
         showFeedback('Erro ao remover o produto do pedido.', 'error');
      }
    }
  };

  const handleAddProduct = async (product: Product) => {
    const exists = selectedProducts.find(sp => sp.product.id === product.id);
    if (exists) {
      showFeedback('Produto já adicionado ao pedido', 'error');
      return;
    }

    try {
      const payload = {
        idProduto: parseInt(product.id),
        idPedido: parseInt(orderId),
        quantidade: 1
      };
      
      const novoRelacionamento = await produtoPedidoService.adicionarProdutoAoPedido(payload);

      const newSelected: SelectedProduct = {
        idRelacionamento: novoRelacionamento.id,
        product,
        quantity: 1,
        unitPrice: product.unitPrice,
        totalPrice: product.unitPrice,
        unitWeight: product.unitWeight,
        totalWeight: product.unitWeight,
      };

      setSelectedProducts([...selectedProducts, newSelected]);
      setIsAddProductModalOpen(false);
      updateLastModified();
    } catch (error) {
       console.error("Erro ao adicionar produto", error);
       showFeedback('Erro ao adicionar o produto ao pedido.', 'error');
    }
  };

  // ==========================================
  // CÁLCULOS E SALVAMENTO
  // ==========================================
  const calculateTotalPrice = () => selectedProducts.reduce((sum, sp) => sum + sp.totalPrice, 0);
  const calculateTotalWeight = () => selectedProducts.reduce((sum, sp) => sum + sp.totalWeight, 0);

  const calculateDeliveryDate = () => {
    if (selectedProducts.length === 0) return '-';
    const maxDays = Math.max(...selectedProducts.map(sp => sp.product.productionDays || 0));
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + maxDays);
    return deliveryDate.toLocaleDateString('pt-BR');
  };

  const updateLastModified = () => {
    setUpdatedAt(new Date().toLocaleString('pt-BR'));
  };

  const handleSaveChanges = async () => {
    if (!selectedClientId) {
      showFeedback('Por favor, selecione um cliente', 'error'); return;
    }
    
    try {
      const pedidoAtualizado = {
        observacoes: observations,
        origem: "Sistema/Balcão",
        clienteId: parseInt(selectedClientId),
        usuarioId: 1, 
        produtos: selectedProducts.map(sp => ({
          idProduto: parseInt(sp.product.id),
          quantidade: sp.quantity
        }))
      };
      
      await pedidoService.atualizar(orderId, pedidoAtualizado);

      if (statusId) {
         await pedidoService.mudarStatus(parseInt(orderId), parseInt(statusId));
      }

      updateLastModified();
      showFeedback('Alterações salvas com sucesso!', 'success');
      
      // Delay pequeno para o feedback ser visto antes de voltar pro Kanban
      setTimeout(() => {
          navigate('/kanban');
      }, 1000); 

    } catch (error) {
      console.error("Erro ao salvar alterações", error);
      showFeedback('Erro ao salvar o pedido.', 'error');
    }
  };

  const handleSaveClient = async (clientData: any) => {
  try {
    if (clientData.id) {
      await clienteService.atualizar(clientData.id, clientData);
    } else {
      await clienteService.criar(clientData);
    }
    
    const clientesAtualizadosResponse = await clienteService.listarTodos({ page: 0 });
    const listaAtualizada = clientesAtualizadosResponse?.content || [];
    setClients(listaAtualizada);
    setIsClientFormOpen(false);
    setEditingClient(null);
  } catch(e) {
      console.error(e);
      showFeedback('Erro ao salvar cliente.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFCAD4] border-t-[#F4ACB7] rounded-full animate-spin mb-4"></div>
        <p className="text-[#9D8189]">A carregar detalhes do pedido...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        
        {/* Cabeçalho */}
        <div className="mb-10">
          <button 
            className="flex items-center gap-2 mb-4 text-[15px] transition-colors hover:opacity-80"
            style={{ color: '#9D8189' }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-5" />
            Voltar
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Detalhes do Pedido</h1>
              <p className="text-[17px]" style={{ color: '#9D8189' }}>
                Código: <strong style={{ color: '#6D6875' }}>PED-{orderId.padStart(3, '0')}</strong>
              </p>
            </div>
            <div className="px-5 py-3 rounded-lg" style={{ backgroundColor: '#FFE5D9', border: '1px solid #D8E2DC' }}>
              <p className="text-[13px] mb-1" style={{ color: '#9D8189' }}>Status Atual</p>
              <p className="text-[18px]" style={{ color: '#6D6875' }}>
                {/* Garantimos que a string será sempre exibida mesmo sem achar um status válido no map */}
                <strong>{statusTypes.find(s => s.id === statusId)?.name || 'Sem status/Não configurado'}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 1. Informações do Cliente */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <h2 className="text-[22px] mb-5" style={{ color: '#F4ACB7' }}><strong>Informações do Cliente</strong></h2>

          <div className="grid grid-cols-[1fr_auto_auto] gap-3 mb-5">
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}><strong>Cliente</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
              <select
                value={selectedClientId}
                onChange={(e) => { setSelectedClientId(e.target.value); setSelectedAddressId(''); updateLastModified(); }}
                className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id?.toString()}>
                    {client.nome} - {client.telefone}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={() => setIsClientListOpen(true)} className="h-12 px-5 gap-2 text-[15px]" style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}>
                <Users className="size-4" /> Listar Clientes
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => { if(selectedClient) { setEditingClient(selectedClient); setIsClientFormOpen(true); } }}
                disabled={!selectedClient}
                className="h-12 px-5 gap-2 text-[15px] disabled:opacity-40"
                style={{ backgroundColor: '#F4ACB7', color: 'white' }}
              >
                <Edit2 className="size-4" /> Editar Cliente
              </Button>
            </div>
          </div>

          {/* Endereço */}
          {selectedClient && selectedClient.enderecos && selectedClient.enderecos.length > 0 && (
            <div className="mb-5">
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}><strong>Endereço de Entrega</strong></label>
              <select
                value={selectedAddressId}
                onChange={(e) => { setSelectedAddressId(e.target.value); updateLastModified(); }}
                className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                <option value="">Selecione um endereço</option>
                {selectedClient.enderecos.map(addr => (
                  <option key={addr.id} value={addr.id?.toString()}>
                    {addr.logradouro}, {addr.numero} - {addr.bairro}, {addr.cidade}/{addr.estado}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}><strong>Observações do Pedido</strong></label>
              <textarea
                value={observations}
                onChange={(e) => { setObservations(e.target.value); updateLastModified(); }}
                rows={4}
                className="w-full px-4 py-3 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7] resize-none"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              />
            </div>

            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}><strong>Status do Pedido</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
              <select
                value={statusId}
                onChange={(e) => { setStatusId(e.target.value); updateLastModified(); }}
                className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                <option value="">Selecione um status...</option>
                {statusTypes.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}>
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>Data de Criação</label>
              <p className="text-[15px]" style={{ color: '#6D6875' }}><strong>{createdAt}</strong></p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFE5D9', border: '1px solid #D8E2DC' }}>
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>Última Atualização</label>
              <p className="text-[15px]" style={{ color: '#6D6875' }}><strong>{updatedAt}</strong></p>
            </div>
          </div>
        </div>

        {/* 2. Produtos do Pedido */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px]" style={{ color: '#F4ACB7' }}><strong>Produtos do Pedido</strong></h2>
            <Button onClick={() => setIsAddProductModalOpen(true)} className="h-10 px-5 gap-2 text-[15px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>
              <Plus className="size-4" /> Adicionar Produto
            </Button>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="text-center py-12 rounded-lg" style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}>
              <p className="text-[16px]" style={{ color: '#9D8189' }}>Nenhum produto adicionado ao pedido</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedProducts.map(sp => (
                <div key={sp.product.id} className="border rounded-lg p-5" style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="size-20 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border" style={{ borderColor: '#D8E2DC' }}>
                      {sp.product.imageUrl ? <ImageWithFallback src={sp.product.imageUrl} alt={sp.product.title} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Sem Foto</span>}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[17px] mb-1" style={{ color: '#6D6875' }}><strong>{sp.product.title}</strong></h3>
                      <p className="text-[14px]" style={{ color: '#9D8189' }}>{sp.product.category} • {sp.product.theme}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => navigate(`/detalhe-produto/${sp.product.id}`)} className="h-9 px-4 gap-2 text-[14px]" style={{ backgroundColor: 'white', color: '#6D6875', border: '1px solid #D8E2DC' }}>
                        <Edit2 className="size-3" /> Ver Produto
                      </Button>
                      <Button onClick={() => handleRemoveProduct(sp.idRelacionamento, sp.product.id)} className="h-9 px-4 gap-2 text-[14px]" style={{ backgroundColor: 'white', color: '#F4ACB7', border: '1px solid #F4ACB7' }}>
                        <Trash2 className="size-3" /> Remover
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Quantidade</strong></label>
                      <input type="number" min="1" value={sp.quantity} onChange={(e) => handleUpdateQuantity(sp.idRelacionamento, parseInt(e.target.value) || 1, sp.product.id)} className="w-full h-10 px-3 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]" style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }} />
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Preço Unitário</strong></label>
                      <div className="w-full h-10 px-3 rounded-md text-[15px] border flex items-center" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#9D8189' }}>R$ {sp.unitPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Preço Total</strong></label>
                      <div className="w-full h-10 px-3 rounded-md text-[15px] border flex items-center" style={{ backgroundColor: '#D8E2DC', borderColor: '#D8E2DC', color: '#6D6875' }}><strong>R$ {sp.totalPrice.toFixed(2)}</strong></div>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Peso Unit. (g)</strong></label>
                      <div className="w-full h-10 px-3 rounded-md text-[15px] border flex items-center" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#9D8189' }}>{sp.unitWeight} g</div>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Peso Total (g)</strong></label>
                      <div className="w-full h-10 px-3 rounded-md text-[15px] border flex items-center" style={{ backgroundColor: '#D8E2DC', borderColor: '#D8E2DC', color: '#6D6875' }}><strong>{sp.totalWeight.toFixed(2)} g</strong></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Resumo Geral */}
        {selectedProducts.length > 0 && selectedClient && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
            <h2 className="text-[22px] mb-5" style={{ color: '#F4ACB7' }}><strong>Resumo Geral do Pedido</strong></h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFCAD4' }}>
                <p className="text-[14px] mb-1" style={{ color: '#6D6875' }}>Previsão de Entrega</p>
                <p className="text-[18px]" style={{ color: '#6D6875' }}><strong>{calculateDeliveryDate()}</strong></p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFCAD4' }}>
                <p className="text-[14px] mb-1" style={{ color: '#6D6875' }}>Peso Total (g)</p>
                <p className="text-[18px]" style={{ color: '#6D6875' }}><strong>{calculateTotalWeight().toFixed(2)} g</strong></p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F4ACB7' }}>
                <p className="text-[14px] mb-1" style={{ color: 'white' }}>Valor Total</p>
                <p className="text-[20px]" style={{ color: 'white' }}><strong>R$ {calculateTotalPrice().toFixed(2)}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3">
          <Button onClick={() => navigate(-1)} className="px-8 py-3 h-12 text-[16px]" style={{ backgroundColor: 'white', color: '#9D8189', border: '1px solid #D8E2DC' }}>
            Voltar
          </Button>
          <Button onClick={handleSaveChanges} disabled={!selectedClientId || selectedProducts.length === 0} className="px-8 py-3 h-12 text-[16px] gap-3 disabled:opacity-40" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>
            <Package className="size-5" /> Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ClientListModal isOpen={isClientListOpen} onClose={() => setIsClientListOpen(false)} onEdit={(c: any) => { setEditingClient(c); setIsClientFormOpen(true); setIsClientListOpen(false); }} />
      <ClientFormModal isOpen={isClientFormOpen} onClose={() => { setIsClientFormOpen(false); setEditingClient(null); }} onSave={handleSaveClient} client={editingClient as any} />
      <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)} products={allProducts as any} selectedProducts={selectedProducts as any} onAddProduct={handleAddProduct} />
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        message={feedback.message}
        type={feedback.type}
      />
    </div>
  );
}