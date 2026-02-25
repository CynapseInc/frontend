import { useState } from 'react';
import { ArrowLeft, Plus, Users, Package, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import ClientListModal from '../modals-global/ClientListModal';
import ClientFormModal from '../modals-global/ClientFormModal';
import AddProductModal from '../modals-global/AddProductModal';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: Address[];
}

interface Address {
  id: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  theme: string;
  item: string;
  unitPrice: number;
  unitWeight: number;
  productionDays: number;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitWeight: number;
  totalWeight: number;
}

interface StatusType {
  id: string;
  name: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    phone: '(11) 98765-4321',
    email: 'maria@email.com',
    addresses: [
      {
        id: '1',
        cep: '01310-100',
        street: 'Av. Paulista',
        number: '1578',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        complement: 'Apto 501',
      },
    ],
  },
  {
    id: '2',
    name: 'João Santos',
    phone: '(11) 91234-5678',
    email: 'joao@email.com',
    addresses: [
      {
        id: '2',
        cep: '04567-890',
        street: 'Rua da Consolação',
        number: '234',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        complement: '',
      },
    ],
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Caneca do Ben 10',
    description: 'Caneca personalizada com estampa do Ben 10 em cerâmica',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
    category: 'Herói',
    theme: 'Ben 10',
    item: 'Caneca',
    unitPrice: 35.00,
    unitWeight: 0.35,
    productionDays: 3,
  },
  {
    id: '2',
    title: 'Caderno da Frozen',
    description: 'Caderno universitário com capa personalizada da Frozen',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
    category: 'Princesa',
    theme: 'Frozen',
    item: 'Caderno',
    unitPrice: 45.00,
    unitWeight: 0.50,
    productionDays: 5,
  },
  {
    id: '3',
    title: 'Caneca do Spider-Man',
    description: 'Caneca personalizada com estampa do Spider-Man',
    imageUrl: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=400',
    category: 'Herói',
    theme: 'Spider-Man',
    item: 'Caneca',
    unitPrice: 35.00,
    unitWeight: 0.35,
    productionDays: 3,
  },
  {
    id: '4',
    title: 'Caderno do Corinthians',
    description: 'Caderno escolar com tema do Corinthians',
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400',
    category: 'Time',
    theme: 'Corinthians',
    item: 'Caderno',
    unitPrice: 40.00,
    unitWeight: 0.45,
    productionDays: 4,
  },
];

const mockStatusTypes: StatusType[] = [
  { id: '1', name: 'A Fazer' },
  { id: '2', name: 'Em Andamento' },
  { id: '3', name: 'Para Enviar' },
  { id: '4', name: 'Enviados' },
];

// Dados mockados do pedido existente
const mockOrder = {
  id: 'PED-001',
  clientId: '1',
  addressId: '1',
  observations: 'Cliente pediu para caprichar na embalagem',
  statusId: '2',
  createdAt: '10/11/2025 14:30',
  updatedAt: '13/11/2025 16:20',
  products: [
    {
      product: mockProducts[0],
      quantity: 2,
      unitPrice: 35.00,
      totalPrice: 70.00,
      unitWeight: 0.35,
      totalWeight: 0.70,
    },
  ],
};

export default function App() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClientId, setSelectedClientId] = useState(mockOrder.clientId);
  const [selectedAddressId, setSelectedAddressId] = useState(mockOrder.addressId);
  const [observations, setObservations] = useState(mockOrder.observations);
  const [statusId, setStatusId] = useState(mockOrder.statusId);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(mockOrder.products);
  const [createdAt] = useState(mockOrder.createdAt);
  const [updatedAt, setUpdatedAt] = useState(mockOrder.updatedAt);
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const selectedAddress = selectedClient?.addresses.find(a => a.id === selectedAddressId);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

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
  };

  const handleUpdateUnitPrice = (productId: string, unitPrice: number) => {
    if (unitPrice < 0) return;

    setSelectedProducts(selectedProducts.map(sp => {
      if (sp.product.id === productId) {
        return {
          ...sp,
          unitPrice,
          totalPrice: unitPrice * sp.quantity,
        };
      }
      return sp;
    }));
    updateLastModified();
  };

  const handleRemoveProduct = (productId: string) => {
    if (confirm('Deseja realmente remover este produto do pedido?')) {
      setSelectedProducts(selectedProducts.filter(sp => sp.product.id !== productId));
      updateLastModified();
    }
  };

  const handleAddProduct = (product: Product) => {
    const exists = selectedProducts.find(sp => sp.product.id === product.id);
    if (exists) {
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
    setIsAddProductModalOpen(false);
    updateLastModified();
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce((sum, sp) => sum + sp.totalPrice, 0);
  };

  const calculateTotalWeight = () => {
    return selectedProducts.reduce((sum, sp) => sum + sp.totalWeight, 0);
  };

  const calculateDeliveryDate = () => {
    if (selectedProducts.length === 0) return '-';
    
    const maxDays = Math.max(...selectedProducts.map(sp => sp.product.productionDays));
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + maxDays);
    
    return deliveryDate.toLocaleDateString('pt-BR');
  };

  const updateLastModified = () => {
    setUpdatedAt(new Date().toLocaleString('pt-BR'));
  };

  const handleSaveChanges = () => {
    if (!selectedClientId) {
      alert('Por favor, selecione um cliente');
      return;
    }
    if (!selectedAddressId) {
      alert('Por favor, selecione um endereço de entrega');
      return;
    }
    if (selectedProducts.length === 0) {
      alert('Por favor, adicione pelo menos um produto');
      return;
    }

    updateLastModified();
    alert('Alterações salvas com sucesso!');
    console.log({
      orderId: mockOrder.id,
      client: selectedClient,
      address: selectedAddress,
      observations,
      status: statusId,
      products: selectedProducts,
      totalPrice: calculateTotalPrice(),
      totalWeight: calculateTotalWeight(),
      deliveryDate: calculateDeliveryDate(),
      updatedAt,
    });
  };

  const handleSaveClient = (client: Client) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === client.id ? client : c));
    } else {
      setClients([...clients, { ...client, id: Date.now().toString() }]);
    }
    setIsClientFormOpen(false);
    setEditingClient(null);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
    setIsClientListOpen(false);
  };

  const handleEditCurrentClient = () => {
    if (selectedClient) {
      handleEditClient(selectedClient);
    }
  };

  const handleViewProduct = (productId: string) => {
    alert(`Navegando para detalhes do produto ID: ${productId} (tela a ser implementada)`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Navbar */}
      

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        
        {/* Cabeçalho */}
        <div className="mb-10">
          <button 
            className="flex items-center gap-2 mb-4 text-[15px] transition-colors hover:opacity-80"
            style={{ color: '#9D8189' }}
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-5" />
            Voltar para Pedidos
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Detalhes do Pedido</h1>
              <p className="text-[17px]" style={{ color: '#9D8189' }}>
                Código: <strong style={{ color: '#6D6875' }}>{mockOrder.id}</strong>
              </p>
            </div>
            <div 
              className="px-5 py-3 rounded-lg"
              style={{ backgroundColor: '#FFE5D9', border: '1px solid #D8E2DC' }}
            >
              <p className="text-[13px] mb-1" style={{ color: '#9D8189' }}>Status Atual</p>
              <p className="text-[18px]" style={{ color: '#6D6875' }}>
                <strong>{mockStatusTypes.find(s => s.id === statusId)?.name}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 1. Informações do Cliente */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <h2 className="text-[22px] mb-5" style={{ color: '#F4ACB7' }}>
            <strong>Informações do Cliente</strong>
          </h2>

          <div className="grid grid-cols-[1fr_auto_auto] gap-3 mb-5">
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Cliente</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setSelectedAddressId('');
                  updateLastModified();
                }}
                className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setIsClientListOpen(true)}
                className="h-12 px-5 gap-2 text-[15px]"
                style={{
                  backgroundColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              >
                <Users className="size-4" />
                Listar Clientes
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleEditCurrentClient}
                disabled={!selectedClient}
                className="h-12 px-5 gap-2 text-[15px] disabled:opacity-40"
                style={{
                  backgroundColor: '#F4ACB7',
                  color: 'white'
                }}
              >
                <Edit2 className="size-4" />
                Editar Cliente
              </Button>
            </div>
          </div>

          {/* Endereço */}
          {selectedClient && selectedClient.addresses.length > 0 && (
            <div className="mb-5">
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Endereço de Entrega</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <select
                value={selectedAddressId}
                onChange={(e) => {
                  setSelectedAddressId(e.target.value);
                  updateLastModified();
                }}
                className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              >
                <option value="">Selecione um endereço</option>
                {selectedClient.addresses.map(address => (
                  <option key={address.id} value={address.id}>
                    {address.street}, {address.number} - {address.neighborhood}, {address.city}/{address.state}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Observações do Pedido</strong>
              </label>
              <textarea
                value={observations}
                onChange={(e) => {
                  setObservations(e.target.value);
                  updateLastModified();
                }}
                placeholder="Ex: Cliente solicitou embalagem especial..."
                rows={4}
                className="w-full px-4 py-3 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7] resize-none"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              />
            </div>

            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Status do Pedido</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <select
                value={statusId}
                onChange={(e) => {
                  setStatusId(e.target.value);
                  updateLastModified();
                }}
                className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              >
                {mockStatusTypes.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-5">
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}
            >
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                Data de Criação
              </label>
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                <strong>{createdAt}</strong>
              </p>
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#FFE5D9', border: '1px solid #D8E2DC' }}
            >
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                Última Atualização
              </label>
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                <strong>{updatedAt}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Produtos do Pedido */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px]" style={{ color: '#F4ACB7' }}>
              <strong>Produtos do Pedido</strong>
            </h2>
            <Button
              onClick={() => setIsAddProductModalOpen(true)}
              className="h-10 px-5 gap-2 text-[15px]"
              style={{
                backgroundColor: '#F4ACB7',
                color: 'white'
              }}
            >
              <Plus className="size-4" />
              Adicionar Produto
            </Button>
          </div>

          {selectedProducts.length === 0 ? (
            <div 
              className="text-center py-12 rounded-lg"
              style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}
            >
              <p className="text-[16px]" style={{ color: '#9D8189' }}>
                Nenhum produto adicionado ao pedido
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedProducts.map(sp => (
                <div
                  key={sp.product.id}
                  className="border rounded-lg p-5"
                  style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="size-20 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid #D8E2DC' }}>
                      <ImageWithFallback
                        src={sp.product.imageUrl}
                        alt={sp.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[17px] mb-1" style={{ color: '#6D6875' }}>
                        <strong>{sp.product.title}</strong>
                      </h3>
                      <p className="text-[14px]" style={{ color: '#9D8189' }}>
                        {sp.product.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewProduct(sp.product.id)}
                        className="h-9 px-4 gap-2 text-[14px]"
                        style={{
                          backgroundColor: 'white',
                          color: '#6D6875',
                          border: '1px solid #D8E2DC'
                        }}
                      >
                        <Edit2 className="size-3" />
                        Ver Produto
                      </Button>
                      <Button
                        onClick={() => handleRemoveProduct(sp.product.id)}
                        className="h-9 px-4 gap-2 text-[14px]"
                        style={{
                          backgroundColor: 'white',
                          color: '#F4ACB7',
                          border: '1px solid #F4ACB7'
                        }}
                      >
                        <Trash2 className="size-3" />
                        Remover
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                        <strong>Quantidade</strong>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={sp.quantity}
                        onChange={(e) => handleUpdateQuantity(sp.product.id, parseInt(e.target.value) || 1)}
                        className="w-full h-10 px-3 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                        style={{
                          backgroundColor: 'white',
                          borderColor: '#D8E2DC',
                          color: '#6D6875'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                        <strong>Preço Unitário</strong>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={sp.unitPrice}
                        onChange={(e) => handleUpdateUnitPrice(sp.product.id, parseFloat(e.target.value) || 0)}
                        className="w-full h-10 px-3 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                        style={{
                          backgroundColor: 'white',
                          borderColor: '#D8E2DC',
                          color: '#6D6875'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                        <strong>Preço Total</strong>
                      </label>
                      <div
                        className="w-full h-10 px-3 rounded-md text-[15px] border flex items-center"
                        style={{
                          backgroundColor: '#D8E2DC',
                          borderColor: '#D8E2DC',
                          color: '#6D6875'
                        }}
                      >
                        <strong>R$ {sp.totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                        <strong>Peso Unit. (kg)</strong>
                      </label>
                      <div
                        className="w-full h-10 px-3 rounded-md text-[15px] border flex items-center"
                        style={{
                          backgroundColor: '#F9F9F9',
                          borderColor: '#D8E2DC',
                          color: '#9D8189'
                        }}
                      >
                        {sp.unitWeight} kg
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                        <strong>Peso Total (kg)</strong>
                      </label>
                      <div
                        className="w-full h-10 px-3 rounded-md text-[15px] border flex items-center"
                        style={{
                          backgroundColor: '#D8E2DC',
                          borderColor: '#D8E2DC',
                          color: '#6D6875'
                        }}
                      >
                        <strong>{sp.totalWeight.toFixed(2)} kg</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Resumo Geral do Pedido */}
        {selectedProducts.length > 0 && selectedClient && selectedAddress && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
            <h2 className="text-[22px] mb-5" style={{ color: '#F4ACB7' }}>
              <strong>Resumo Geral do Pedido</strong>
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Cliente */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFE5D9' }}>
                <h3 className="text-[16px] mb-3" style={{ color: '#6D6875' }}>
                  <strong>Cliente</strong>
                </h3>
                <p className="text-[15px] mb-1" style={{ color: '#6D6875' }}>
                  <strong>{selectedClient.name}</strong>
                </p>
                <p className="text-[14px]" style={{ color: '#9D8189' }}>
                  {selectedClient.phone}
                </p>
              </div>

              {/* Status */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFE5D9' }}>
                <h3 className="text-[16px] mb-3" style={{ color: '#6D6875' }}>
                  <strong>Status Atual</strong>
                </h3>
                <div 
                  className="inline-flex items-center px-4 py-2 rounded-full text-[15px]"
                  style={{
                    backgroundColor: '#FFCAD4',
                    color: '#6D6875'
                  }}
                >
                  <strong>{mockStatusTypes.find(s => s.id === statusId)?.name}</strong>
                </div>
              </div>

              {/* Endereço */}
              <div className="p-4 rounded-lg col-span-2" style={{ backgroundColor: '#FFE5D9' }}>
                <h3 className="text-[16px] mb-3" style={{ color: '#6D6875' }}>
                  <strong>Endereço de Entrega</strong>
                </h3>
                <p className="text-[14px]" style={{ color: '#6D6875' }}>
                  {selectedAddress.street}, {selectedAddress.number}
                  {selectedAddress.complement && ` - ${selectedAddress.complement}`}
                </p>
                <p className="text-[14px]" style={{ color: '#9D8189' }}>
                  {selectedAddress.neighborhood}, {selectedAddress.city}/{selectedAddress.state}
                </p>
                <p className="text-[14px]" style={{ color: '#9D8189' }}>
                  CEP: {selectedAddress.cep}
                </p>
              </div>
            </div>

            {/* Observações */}
            {observations && (
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}>
                <h3 className="text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  <strong>Observações</strong>
                </h3>
                <p className="text-[14px]" style={{ color: '#9D8189' }}>
                  {observations}
                </p>
              </div>
            )}

            {/* Produtos */}
            <div className="mb-6">
              <h3 className="text-[16px] mb-3" style={{ color: '#6D6875' }}>
                <strong>Produtos</strong>
              </h3>
              <div className="space-y-2">
                {selectedProducts.map(sp => (
                  <div
                    key={sp.product.id}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="size-5" style={{ color: '#F4ACB7' }} />
                      <div>
                        <p className="text-[15px]" style={{ color: '#6D6875' }}>
                          <strong>{sp.product.title}</strong>
                        </p>
                        <p className="text-[13px]" style={{ color: '#9D8189' }}>
                          {sp.quantity} {sp.quantity === 1 ? 'unidade' : 'unidades'} × R$ {sp.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px]" style={{ color: '#6D6875' }}>
                        <strong>R$ {sp.totalPrice.toFixed(2)}</strong>
                      </p>
                      <p className="text-[13px]" style={{ color: '#9D8189' }}>
                        {sp.totalWeight.toFixed(2)} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totais */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFCAD4' }}>
                <p className="text-[14px] mb-1" style={{ color: '#6D6875' }}>Previsão de Entrega</p>
                <p className="text-[18px]" style={{ color: '#6D6875' }}>
                  <strong>{calculateDeliveryDate()}</strong>
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFCAD4' }}>
                <p className="text-[14px] mb-1" style={{ color: '#6D6875' }}>Peso Total</p>
                <p className="text-[18px]" style={{ color: '#6D6875' }}>
                  <strong>{calculateTotalWeight().toFixed(2)} kg</strong>
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F4ACB7' }}>
                <p className="text-[14px] mb-1" style={{ color: 'white' }}>Valor Total</p>
                <p className="text-[20px]" style={{ color: 'white' }}>
                  <strong>R$ {calculateTotalPrice().toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => window.history.back()}
            className="px-8 py-3 h-12 text-[16px]"
            style={{
              backgroundColor: 'white',
              color: '#9D8189',
              border: '1px solid #D8E2DC'
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={!selectedClientId || !selectedAddressId || selectedProducts.length === 0}
            className="px-8 py-3 h-12 text-[16px] gap-3 disabled:opacity-40"
            style={{
              backgroundColor: '#F4ACB7',
              color: 'white'
            }}
          >
            <Package className="size-5" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ClientListModal
        isOpen={isClientListOpen}
        onClose={() => setIsClientListOpen(false)}
        clients={clients}
        onEdit={handleEditClient}
      />

      <ClientFormModal
        isOpen={isClientFormOpen}
        onClose={() => {
          setIsClientFormOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        client={editingClient}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        products={mockProducts}
        selectedProducts={selectedProducts}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
