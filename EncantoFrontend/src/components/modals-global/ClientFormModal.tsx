import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: Address[];
}

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  client?: Client | null;
}

export default function ClientFormModal({ isOpen, onClose, onSave, client }: ClientFormModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Campos do endereço
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [complement, setComplement] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setEmail(client.email);
      setAddresses(client.addresses);
    } else {
      resetForm();
    }
  }, [client, isOpen]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAddresses([]);
    resetAddressForm();
    setShowAddressForm(false);
    setEditingAddressIndex(null);
  };

  const resetAddressForm = () => {
    setCep('');
    setStreet('');
    setNumber('');
    setNeighborhood('');
    setCity('');
    setState('');
    setComplement('');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, preencha nome e telefone');
      return;
    }

    if (addresses.length === 0) {
      alert('Por favor, adicione pelo menos um endereço');
      return;
    }

    onSave({
      id: client?.id || '',
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      addresses,
    });

    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddAddress = () => {
    if (!cep.trim() || !street.trim() || !number.trim() || !neighborhood.trim() || !city.trim() || !state.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios do endereço');
      return;
    }

    const newAddress: Address = {
      id: editingAddressIndex !== null ? addresses[editingAddressIndex].id : Date.now().toString(),
      cep: cep.trim(),
      street: street.trim(),
      number: number.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim(),
      complement: complement.trim(),
    };

    if (editingAddressIndex !== null) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editingAddressIndex] = newAddress;
      setAddresses(updatedAddresses);
      setEditingAddressIndex(null);
    } else {
      setAddresses([...addresses, newAddress]);
    }

    resetAddressForm();
    setShowAddressForm(false);
  };

  const handleEditAddress = (index: number) => {
    const address = addresses[index];
    setCep(address.cep);
    setStreet(address.street);
    setNumber(address.number);
    setNeighborhood(address.neighborhood);
    setCity(address.city);
    setState(address.state);
    setComplement(address.complement);
    setEditingAddressIndex(index);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (index: number) => {
    if (confirm('Deseja realmente excluir este endereço?')) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  };

  const handleCancelAddress = () => {
    resetAddressForm();
    setShowAddressForm(false);
    setEditingAddressIndex(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: '#D8E2DC' }}
        >
          <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}>
            <strong>{client ? 'Editar' : 'Cadastrar'} Cliente</strong>
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="size-6" style={{ color: '#9D8189' }} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            
            {/* Informações Básicas */}
            <div>
              <h3 className="text-[18px] mb-4" style={{ color: '#6D6875' }}>
                <strong>Informações Básicas</strong>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}>
                    <strong>Nome</strong> <span style={{ color: '#F4ACB7' }}>*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo do cliente"
                    className="h-11 text-[15px]"
                    style={{ 
                      borderColor: '#D8E2DC',
                      color: '#6D6875'
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}>
                    <strong>Telefone</strong> <span style={{ color: '#F4ACB7' }}>*</span>
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="h-11 text-[15px]"
                    style={{ 
                      borderColor: '#D8E2DC',
                      color: '#6D6875'
                    }}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}>
                    <strong>Email</strong>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    className="h-11 text-[15px]"
                    style={{ 
                      borderColor: '#D8E2DC',
                      color: '#6D6875'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Endereços */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px]" style={{ color: '#6D6875' }}>
                  <strong>Endereços</strong>
                </h3>
                {!showAddressForm && (
                  <Button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="h-9 px-4 gap-2 text-[14px]"
                    style={{
                      backgroundColor: '#F4ACB7',
                      color: 'white'
                    }}
                  >
                    <Plus className="size-4" />
                    Adicionar Endereço
                  </Button>
                )}
              </div>

              {/* Lista de Endereços */}
              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((address, index) => (
                    <div
                      key={address.id}
                      className="p-4 rounded-lg border flex items-start justify-between"
                      style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}
                    >
                      <div>
                        <p className="text-[15px] mb-1" style={{ color: '#6D6875' }}>
                          <strong>{address.street}, {address.number}</strong>
                          {address.complement && ` - ${address.complement}`}
                        </p>
                        <p className="text-[14px]" style={{ color: '#9D8189' }}>
                          {address.neighborhood}, {address.city}/{address.state}
                        </p>
                        <p className="text-[13px]" style={{ color: '#9D8189' }}>
                          CEP: {address.cep}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => handleEditAddress(index)}
                          className="h-8 px-3 gap-1 text-[13px]"
                          style={{
                            backgroundColor: 'white',
                            color: '#6D6875',
                            border: '1px solid #D8E2DC'
                          }}
                        >
                          <Edit2 className="size-3" />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDeleteAddress(index)}
                          className="h-8 px-3 gap-1 text-[13px]"
                          style={{
                            backgroundColor: 'white',
                            color: '#F4ACB7',
                            border: '1px solid #F4ACB7'
                          }}
                        >
                          <Trash2 className="size-3" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulário de Endereço */}
              {showAddressForm && (
                <div 
                  className="p-5 rounded-lg border"
                  style={{ borderColor: '#F4ACB7', backgroundColor: '#FFE5D9' }}
                >
                  <h4 className="text-[16px] mb-4" style={{ color: '#6D6875' }}>
                    <strong>{editingAddressIndex !== null ? 'Editar' : 'Novo'} Endereço</strong>
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}>
                        <strong>CEP</strong> <span style={{ color: '#F4ACB7' }}>*</span>
                      </label>
                      <Input
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="00000-000"
                        className="h-10 text-[14px]"
                        style={{ 
                          borderColor: '#D8E2DC',
                          color: '#6D6875',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}>
                        <strong>Rua</strong> <span style={{ color: '#F4ACB7' }}>*</span>
                      </label>
                      <Input
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Nome da rua"
                        className="h-10 text-[14px]"
                        style={{ 
                          borderColor: '#D8E2DC',
                          color: '#6D6875',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}>
                        <strong>Número</strong> <span style={{ color: '#F4ACB7' }}>*</span>
                      </label>
                      <Input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="123"
                        className="h-10 text-[14px]"
                        style={{ 
                          borderColor: '#D8E2DC',
                          color: '#6D6875',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}>
                        <strong>Bairro</strong> <span style={{ color: '#F4ACB7' }}>*</span>
                      </label>
                      <Input
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Nome do bairro"
                        className="h-10 text-[14px]"
                        style={{ 
                          borderColor: '#D8E2DC',
                          color: '#6D6875',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}>
                        <strong>Cidade</strong> <span style={{ color: '#F4ACB7' }}>*</span>
                      </label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Cidade"
                        className="h-10 text-[14px]"
                        style={{ 
                          borderColor: '#D8E2DC',
                          color: '#6D6875',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}>
                        <strong>Estado</strong> <span style={{ color: '#F4ACB7' }}>*</span>
                      </label>
                      <Input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="SP"
                        maxLength={2}
                        className="h-10 text-[14px]"
                        style={{ 
                          borderColor: '#D8E2DC',
                          color: '#6D6875',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}>
                        <strong>Complemento</strong>
                      </label>
                      <Input
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Apto, bloco, etc."
                        className="h-10 text-[14px]"
                        style={{ 
                          borderColor: '#D8E2DC',
                          color: '#6D6875',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      type="button"
                      onClick={handleCancelAddress}
                      className="h-9 px-4 text-[14px]"
                      style={{
                        backgroundColor: 'white',
                        color: '#9D8189',
                        border: '1px solid #D8E2DC'
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddAddress}
                      className="h-9 px-4 text-[14px]"
                      style={{
                        backgroundColor: '#F4ACB7',
                        color: 'white'
                      }}
                    >
                      {editingAddressIndex !== null ? 'Salvar Alterações' : 'Adicionar'}
                    </Button>
                  </div>
                </div>
              )}

              {addresses.length === 0 && !showAddressForm && (
                <div 
                  className="p-6 rounded-lg border-2 border-dashed text-center"
                  style={{ borderColor: '#D8E2DC' }}
                >
                  <p className="text-[14px]" style={{ color: '#9D8189' }}>
                    Nenhum endereço cadastrado. Clique em "Adicionar Endereço" para começar.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div 
            className="flex justify-end gap-3 p-6 border-t"
            style={{ borderColor: '#D8E2DC' }}
          >
            <Button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 h-11 text-[15px]"
              style={{
                backgroundColor: 'white',
                color: '#9D8189',
                border: '1px solid #D8E2DC'
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 h-11 text-[15px]"
              style={{
                backgroundColor: '#F4ACB7',
                color: 'white'
              }}
            >
              {client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
