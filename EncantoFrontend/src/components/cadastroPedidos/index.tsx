import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, Package, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import ClientListModal from '../modals-global/ClientListModal';
import ClientFormModal from '../modals-global/ClientFormModal';
import { useNavigate } from 'react-router-dom';

// Serviços
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
  unitPrice: number; unitWeight: number; productionDays: number;
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
  
  // Estados para dados da API
  const [clients, setClients] = useState<Cliente[]>([]);  
  const [products, setProducts] = useState<Product[]>([]);
  const [statusTypes, setStatusTypes] = useState<StatusType[]>([]);

  // Estados do Formulário
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [observations, setObservations] = useState('');
  const [statusId, setStatusId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchProduct, setSearchProduct] = useState('');

  // Estados dos Modais
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

        // Mapear Produtos
        const produtosFormatados = produtosData.map((p: any) => ({
          id: p.id?.toString(),
          title: p.titulo,
          description: p.descricao,
          imageUrl: p.fotos && p.fotos.length > 0 ? p.fotos[0].foto : '',
          category: 'Diversos', // Categoria fica embutida no tema
          theme: p.tema?.descricao || 'Sem Tema',
          item: p.item?.descricao || 'Sem Item',
          unitPrice: p.item?.precoVenda || 0,
          unitWeight: p.item?.peso || 0,
          productionDays: p.item?.prazoProducao || 0
        }));
        setProducts(produtosFormatados);

        // Mapear Status
        setStatusTypes(statusData);
        if (statusData.length > 0) {
          setStatusId(statusData[0].id.toString()); // Seleciona o primeiro por padrão
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchData();
  }, []);

 // Derivados
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

  // ==========================================
  // GERENCIAMENTO DE PRODUTOS NO PEDIDO
  // ==========================================
  const handleSelectProduct = (product: Product) => {
    if (selectedProducts.find(sp => sp.product.id === product.id)) {
      alert('Produto já adicionado ao pedido');
      return;
    }
    const newSelected: SelectedProduct = {
      product,
      quantity: 1,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice,
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
      alert('Por favor, selecione um cliente e adicione pelo menos um produto.');
      return;
    }

    try {
      // 1. Montar payload do pedido principal
      const payloadPedido = {
        observacoes: observations,
        origem: "Sistema/Balcão", // Ajuste para a origem desejada
        clienteId: parseInt(selectedClientId),
        usuarioId: 1, // ATENÇÃO: Hardcoded como 1. O ideal é pegar o ID do utilizador logado no auth token!
        produtos: selectedProducts.map(sp => ({
          idProduto: parseInt(sp.product.id),
          quantidade: sp.quantity
        }))
      };

      // 2. Chamar a API de criação
      const novoPedido = await pedidoService.criar(payloadPedido);

      // 3. Atualizar para o status selecionado (caso exista e não seja o default que o backend já colocou)
      if (statusId && novoPedido.id) {
        await pedidoService.mudarStatus(novoPedido.id, parseInt(statusId));
      }

      alert('Pedido confirmado e cadastrado com sucesso!');
      navigate('/kanban'); // Redireciona para o Kanban

    } catch (error) {
      console.error('Erro ao cadastrar pedido:', error);
      alert('Erro ao cadastrar o pedido. Verifique os dados e tente novamente.');
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
        alert("Cliente atualizado com sucesso!");
      } else {
        await clienteService.criar(clientData);
        alert("Cliente cadastrado com sucesso!");
      }

      setIsClientFormOpen(false);
      setEditingClient(null);

      // Recarrega a lista de clientes para a caixa de seleção e modal
      const clientesAtualizados = await clienteService.listarTodos();
      setClients(clientesAtualizados);
      
      // Auto-seleciona o cliente que acabou de ser salvo (se for novo)
      if (!clientData.id && clientesAtualizados.length > 0) {
        const novoId = clientesAtualizados[clientesAtualizados.length - 1].id;
        setSelectedClientId(novoId.toString());
      }
      
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar o cliente. Verifique se o telefone tem formato correto.");
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
        
        {/* Cabeçalho */}
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

          {/* Endereço - Opcional para a View */}
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

          <div className="grid grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredProducts.map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden transition-all hover:shadow-lg" style={{ borderColor: '#D8E2DC' }}>
                <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                  {product.imageUrl ? (
                    <ImageWithFallback src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">Sem Foto</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-[16px] mb-1 truncate" style={{ color: '#6D6875' }}><strong>{product.title}</strong></h3>
                  <p className="text-[13px] mb-3 line-clamp-2" style={{ color: '#9D8189' }}>{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[15px]" style={{ color: '#6D6875' }}><strong>R$ {product.unitPrice.toFixed(2)}</strong></span>
                  </div>
                  <Button
                    onClick={() => handleSelectProduct(product)}
                    disabled={selectedProducts.some(sp => sp.product.id === product.id)}
                    className="w-full h-9 text-[14px] disabled:opacity-40"
                    style={{ backgroundColor: '#F4ACB7', color: 'white' }}
                  >
                    {selectedProducts.some(sp => sp.product.id === product.id) ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-4 text-center py-12">
                <p className="text-[16px]" style={{ color: '#9D8189' }}>Nenhum produto encontrado com "{searchProduct}"</p>
              </div>
            )}
          </div>
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
                       {sp.product.imageUrl ? <ImageWithFallback src={sp.product.imageUrl} alt={sp.product.title} className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xs">Sem foto</span>}
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
        clients={clients} // <-- Removido o as any
        onEdit={handleEditClient} 
      />
      <ClientFormModal 
        isOpen={isClientFormOpen} 
        onClose={() => { setIsClientFormOpen(false); setEditingClient(null); }} 
        onSave={handleSaveClient} 
        client={editingClient} // <-- Removido o as any
      />
    </div>
  );
}