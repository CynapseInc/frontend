import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, Package, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import ClientListModal from '../modals-global/ClientListModal';
import ClientFormModal from '../modals-global/ClientFormModal';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from '../ui/FeedbackModal';

import { clienteService } from '../../services/ClienteService';
import { produtoService } from '../../services/ProdutoService';
import { statusPedidoService } from '../../services/StatusPedidoService';
import { pedidoService } from '../../services/PedidoService';

import './index-cad-pedido.css';

interface EnderecoCliente {
  id?: number;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
}

interface Cliente {
  id?: number;
  nome: string;
  telefone: string;
  email?: string;
  enderecos: EnderecoCliente[];
}

interface Product {
  id: string; title: string; description: string; imageUrl: string;
  category: string; theme: string; item: string;
  unitPrice: number; promotionalPrice: number; unitWeight: number; productionDays: number;
}

interface SelectedProduct {
  product: Product; quantity: number; unitPrice: number;
  totalPrice: number; unitWeight: number; totalWeight: number;
}

interface StatusType {
  id: string; status: string;
}

export default function App() {
  const navigate = useNavigate();
  
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

  const [clients, setClients] = useState<Cliente[]>([]);  
  const [products, setProducts] = useState<Product[]>([]);
  const [statusTypes, setStatusTypes] = useState<StatusType[]>([]);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [observations, setObservations] = useState('');
  const [statusId, setStatusId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchProduct]);

  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);

  // ==========================================
  // BUSCAR DADOS INICIAIS DA API
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesData, produtosData, statusData] = await Promise.all([
          clienteService.listarTodos(),
          produtoService.listarTodos(),
          statusPedidoService.listarTodos()
        ]);

        setClients(clientesData);

        const produtosFormatados = produtosData.map((p: any) => ({
          id: p.id?.toString(),
          title: p.titulo,
          description: p.descricao,
          imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0].foto : '',
          category: 'Diversos', 
          theme: p.tema?.descricao || 'Sem Tema',
          item: p.item?.descricao || 'Sem Item',
          unitPrice: p.item?.precoVenda || 0,
          promotionalPrice: p.item?.precoPromocional || 0,
          unitWeight: p.item?.peso || 0,
          productionDays: p.item?.prazoProducao || 0
        }));
        setProducts(produtosFormatados);

        setStatusTypes(statusData);
        if (statusData.length > 0) {
          setStatusId(statusData[0].id.toString());
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchData();
  }, []);

  const selectedClient = clients.find(c => c.id?.toString() === selectedClientId);
  const selectedAddress = selectedClient?.enderecos?.find(a => a.id?.toString() === selectedAddressId);

  const filteredProducts = products.filter(product => {
    const search = searchProduct.toLowerCase();
    return (
      product.title.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.theme.toLowerCase().includes(search) ||
      product.item.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // ==========================================
  // GERENCIAMENTO DE PRODUTOS NO PEDIDO
  // ==========================================
  const handleSelectProduct = (product: Product) => {
    if (selectedProducts.find(sp => sp.product.id === product.id)) {
      showFeedback('Este produto já foi adicionado ao pedido.', 'error');
      return;
    }

    const activePrice = product.promotionalPrice > 0 && product.promotionalPrice < product.unitPrice 
      ? product.promotionalPrice 
      : product.unitPrice;

    const newSelected: SelectedProduct = {
      product,
      quantity: 1,
      unitPrice: activePrice,
      totalPrice: activePrice,
      unitWeight: product.unitWeight,
      totalWeight: product.unitWeight,
    };
    setSelectedProducts([...selectedProducts, newSelected]);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts(selectedProducts.map(sp => {
      if (sp.product.id === productId) {
        return { ...sp, quantity, totalPrice: sp.unitPrice * quantity, totalWeight: sp.unitWeight * quantity };
      }
      return sp;
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(sp => sp.product.id !== productId));
  };

  const calculateTotalPrice = () => selectedProducts.reduce((sum, sp) => sum + sp.totalPrice, 0);
  const calculateTotalWeight = () => selectedProducts.reduce((sum, sp) => sum + sp.totalWeight, 0);

  const calculateDeliveryDate = () => {
    if (selectedProducts.length === 0) return '-';
    const maxDays = Math.max(...selectedProducts.map(sp => sp.product.productionDays));
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + maxDays);
    return deliveryDate.toLocaleDateString('pt-BR');
  };

  // ==========================================
  // SALVAR O PEDIDO NA API
  // ==========================================
  const handleConfirmOrder = async () => {
    if (!selectedClientId || selectedProducts.length === 0) {
      showFeedback('Por favor, selecione um cliente e adicione pelo menos um produto.', 'error');
      return;
    }

    try {
      const payloadPedido = {
        observacoes: observations,
        origem: "Sistema/Balcão",
        clienteId: parseInt(selectedClientId),
        usuarioId: 1, 
        produtos: selectedProducts.map(sp => ({
          idProduto: parseInt(sp.product.id),
          quantidade: sp.quantity
        }))
      };

      const novoPedido = await pedidoService.criar(payloadPedido);

      if (statusId && novoPedido.id) {
        await pedidoService.mudarStatus(novoPedido.id, parseInt(statusId));
      }

      showFeedback('Pedido confirmado e cadastrado com sucesso!', 'success');
      setTimeout(() => {
        navigate('/kanban');
      }, 1500);

    } catch (error) {
      console.error('Erro ao cadastrar pedido:', error);
      showFeedback('Não foi possível cadastrar o pedido no momento. Verifique os dados ou tente novamente mais tarde.', 'error');
    }
  };

  // ==========================================
  // CLIENTES (Funções visuais dos modais)
  // ==========================================
  // ==========================================
  // SALVAR / ATUALIZAR CLIENTE NA API
  // ==========================================
  const handleSaveClient = async (clientData: any) => {
    try {
      if (clientData.id) {
        await clienteService.atualizar(clientData.id, clientData);
        showFeedback("Cliente atualizado com sucesso!", "success");
      } else {
        await clienteService.criar(clientData);
        showFeedback("Cliente cadastrado com sucesso!", "success");
      }

      setIsClientFormOpen(false);
      setEditingClient(null);

      const clientesAtualizados = await clienteService.listarTodos();
      setClients(clientesAtualizados);
      
      if (!clientData.id && clientesAtualizados.length > 0) {
        const novoId = clientesAtualizados[clientesAtualizados.length - 1].id;
        setSelectedClientId(novoId.toString());
      }
      
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      showFeedback("Não foi possível salvar o cliente. Verifique se os dados estão corretos.", "error");
    }
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
    setIsClientListOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="mb-10">
          <button className="flex items-center gap-2 mb-4 text-[15px] transition-colors hover:opacity-80" style={{ color: '#9D8189' }} onClick={() => navigate('/kanban')}>
            <ArrowLeft className="size-5" /> Voltar para Pedidos
          </button>
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Novo Pedido</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Preencha as informações abaixo para cadastrar um novo pedido</p>
        </div>

        {/* 1. Informações do Cliente */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <h2 className="text-[22px] mb-5" style={{ color: '#F4ACB7' }}><strong>Informações do Cliente</strong></h2>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 mb-5">
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}><strong>Cliente</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
              <select
                value={selectedClientId}
                onChange={(e) => { setSelectedClientId(e.target.value); setSelectedAddressId(''); }}
                className="w-full h-12 px-4 rounded-md text-[15px] border focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.nome} - {client.telefone}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => setIsClientListOpen(true)} className="h-12 px-5 gap-2 text-[15px]" style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}>
                <Users className="size-4" /> Listar Clientes
              </Button>
            </div>
            <div className="flex items-end">
              <Button onClick={() => { setEditingClient(null); setIsClientFormOpen(true); }} className="h-12 px-5 gap-2 text-[15px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>
                <Plus className="size-4" /> Novo Cliente
              </Button>
            </div>
          </div>

          {selectedClient && selectedClient.enderecos && selectedClient.enderecos.length > 0 && (
            <div className="mb-5">
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}><strong>Endereço de Entrega</strong></label>
              <select
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="w-full h-12 px-4 rounded-md text-[15px] border focus:outline-none focus:border-[#F4ACB7]"
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

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}><strong>Observações do Pedido</strong></label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: Cliente solicitou embalagem especial..."
                rows={4}
                className="w-full px-4 py-3 rounded-md text-[15px] border focus:outline-none focus:border-[#F4ACB7] resize-none"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              />
            </div>
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}><strong>Status Inicial do Pedido</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="w-full h-12 px-4 rounded-md text-[15px] border focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                {statusTypes.map(status => (
                  <option key={status.id} value={status.id}>{status.status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Seleção de Produto */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <h2 className="text-[22px] mb-5" style={{ color: '#F4ACB7' }}><strong>Selecionar Produtos</strong></h2>
          <div className="mb-5 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
            <input
              type="text"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              placeholder="Pesquisar produto por nome, tema ou item..."
              className="w-full h-12 pl-12 pr-4 rounded-md text-[15px] border focus:outline-none focus:border-[#F4ACB7]"
              style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {paginatedProducts.map(product => {
              const temDesconto = product.promotionalPrice > 0 && product.promotionalPrice < product.unitPrice;

              return (
              <div key={product.id} className="border rounded-xl overflow-hidden transition-all hover:shadow-md flex flex-col bg-white aspect-square" style={{ borderColor: '#D8E2DC' }}>
                
                <div className="relative flex-1 w-full overflow-hidden bg-gray-50">
                  {product.imageUrl ? (
                    <ImageWithFallback 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sem Foto</span>
                    </div>
                  )}  
                  
                  {temDesconto && (
                     <div className="absolute top-1.5 left-1.5 bg-[#FFE5D9] text-[#F4ACB7] px-2 py-0.5 rounded text-[9px] flex items-center shadow-sm font-bold">
                       Promo
                     </div>
                  )}
                </div>
                
                <div className="p-3 flex flex-col justify-between shrink-0 bg-white">
                  <div>
                    <h3 className="text-[9px] font-bold mb-1 line-clamp-1 leading-tight" style={{ color: '#6D6875' }} title={product.title}>
                      {product.title}
                    </h3>
                    <p className="text-[12px] mb-0 line-clamp-2 leading-tight" style={{ color: '#9D8189' }}>
                      {product.description}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      {temDesconto ? (
                        <>
                          <span className="text-[#9D8189] line-through text-[9px]">
                            R$ {product.unitPrice.toFixed(2)}
                          </span>
                          <span className="text-[#F4ACB7] font-bold text-[9px]">
                            R$ {product.promotionalPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] font-bold" style={{ color: '#F4ACB7' }}>
                          R$ {product.unitPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handleSelectProduct(product)}
                      disabled={selectedProducts.some(sp => sp.product.id === product.id)}
                      className="w-full h-7 text-[9px] uppercase tracking-wide font-bold disabled:opacity-40 rounded"
                      style={{ backgroundColor: '#F4ACB7', color: 'white' }}
                    >
                      {selectedProducts.some(sp => sp.product.id === product.id) ? 'Selecionado' : 'Selecionar'}
                    </Button>
                  </div>
                </div>
              </div>
            )})}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-4 text-center py-12">
                <p className="text-[15px]" style={{ color: '#9D8189' }}>Nenhum produto encontrado com "{searchProduct}"</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: '#D8E2DC' }}>
              <p className="text-sm" style={{ color: '#9D8189' }}>
                Mostrando <strong>{startIndex + 1}</strong> a <strong>{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</strong> de <strong>{filteredProducts.length}</strong> produtos
              </p>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#D8E2DC', color: '#6D6875' }}
                >
                  Anterior
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 1)
                    .map((p, index, array) => {
                      if (index > 0 && array[index - 1] !== p - 1) {
                        return <span key={`ellipsis-${p}`} className="px-2 py-1 text-[#9D8189]">...</span>;
                      }
                      return (
                        <button 
                          key={p} 
                          onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-colors ${currentPage === p ? 'font-bold' : ''}`}
                          style={{ 
                            backgroundColor: currentPage === p ? '#F4ACB7' : 'transparent', 
                            color: currentPage === p ? 'white' : '#6D6875',
                            border: currentPage === p ? 'none' : '1px solid #D8E2DC'
                          }}
                        >
                          {p}
                        </button>
                      );
                  })}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#D8E2DC', color: '#6D6875' }}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Produtos Selecionados */}
        {selectedProducts.length > 0 && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
            <h2 className="text-[22px] mb-5" style={{ color: '#F4ACB7' }}><strong>Produtos Selecionados</strong></h2>
            <div className="space-y-4">
              {selectedProducts.map(sp => (
                <div key={sp.product.id} className="border rounded-lg p-5" style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="size-20 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border" style={{ borderColor: '#D8E2DC' }}>
                       {sp.product.imageUrl ? 
                       <ImageWithFallback 
                       src={sp.product.imageUrl} 
                       alt={sp.product.title} 
                       className="w-full h-full object-cover" 
                       /> : <span className="text-gray-300 text-xs">Sem foto</span>}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[17px] mb-1" style={{ color: '#6D6875' }}><strong>{sp.product.title}</strong></h3>
                    </div>
                    <Button onClick={() => handleRemoveProduct(sp.product.id)} className="h-9 px-4 text-[14px] border" style={{ backgroundColor: 'white', color: '#F4ACB7', borderColor: '#F4ACB7' }}>Remover</Button>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Quantidade</strong></label>
                      <input type="number" min="1" value={sp.quantity} onChange={(e) => handleUpdateQuantity(sp.product.id, parseInt(e.target.value) || 1)} className="w-full h-10 px-3 rounded-md border focus:outline-none focus:border-[#F4ACB7]" style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }} />
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Preço Unit.</strong></label>
                      <div className="w-full h-10 px-3 rounded-md border flex items-center" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#9D8189' }}>R$ {sp.unitPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Preço Total</strong></label>
                      <div className="w-full h-10 px-3 rounded-md border flex items-center" style={{ backgroundColor: '#D8E2DC', borderColor: '#D8E2DC', color: '#6D6875' }}><strong>R$ {sp.totalPrice.toFixed(2)}</strong></div>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Peso Unit. (kg)</strong></label>
                      <div className="w-full h-10 px-3 rounded-md border flex items-center" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#9D8189' }}>{sp.unitWeight} kg</div>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}><strong>Peso Total (kg)</strong></label>
                      <div className="w-full h-10 px-3 rounded-md border flex items-center" style={{ backgroundColor: '#D8E2DC', borderColor: '#D8E2DC', color: '#6D6875' }}><strong>{sp.totalWeight.toFixed(2)} kg</strong></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Resumo e Confirmação */}
        {selectedProducts.length > 0 && selectedClient && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
            <h2 className="text-[22px] mb-5" style={{ color: '#F4ACB7' }}><strong>Resumo do Pedido</strong></h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFCAD4' }}>
                <p className="text-[14px] mb-1" style={{ color: '#6D6875' }}>Previsão de Entrega</p>
                <p className="text-[18px]" style={{ color: '#6D6875' }}><strong>{calculateDeliveryDate()}</strong></p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFCAD4' }}>
                <p className="text-[14px] mb-1" style={{ color: '#6D6875' }}>Peso Total</p>
                <p className="text-[18px]" style={{ color: '#6D6875' }}><strong>{calculateTotalWeight().toFixed(2)} kg</strong></p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F4ACB7' }}>
                <p className="text-[14px] mb-1" style={{ color: 'white' }}>Valor Total</p>
                <p className="text-[20px]" style={{ color: 'white' }}><strong>R$ {calculateTotalPrice().toFixed(2)}</strong></p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleConfirmOrder}
                disabled={!selectedClientId || selectedProducts.length === 0}
                className="px-12 py-4 h-14 text-[17px] gap-3 disabled:opacity-40"
                style={{ backgroundColor: '#F4ACB7', color: 'white' }}
              >
                <Package className="size-5" /> Confirmar Pedido
              </Button>
            </div>
          </div>
        )}
      </div>

      <ClientListModal 
        isOpen={isClientListOpen} 
        onClose={() => setIsClientListOpen(false)} 
        clients={clients}
        onEdit={handleEditClient} 
      />
      <ClientFormModal 
        isOpen={isClientFormOpen} 
        onClose={() => { setIsClientFormOpen(false); setEditingClient(null); }} 
        onSave={handleSaveClient} 
        client={editingClient}
      />
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        message={feedback.message}
        type={feedback.type}
      />
    </div>
  );
}