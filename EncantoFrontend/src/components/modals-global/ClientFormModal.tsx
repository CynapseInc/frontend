import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import InputMask from 'react-input-mask';

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

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Cliente) => void;
  client?: Cliente | null;
}

export default function ClientFormModal({ isOpen, onClose, onSave, client }: ClientFormModalProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [enderecos, setEnderecos] = useState<EnderecoCliente[]>([]);
  
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Campos do endereço
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [complemento, setComplemento] = useState('');
  const [errorMsgCep, setErrorMsgCep] = useState('');
  const buscarCep = async (cep) => {
      const cepLimpo = cep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) return;

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
          setErrorMsgCep('CEP não encontrado');
          return;
        }

        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setEstado(data.uf);
        setErrorMsgCep('');
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setErrorMsgCep('Erro ao buscar CEP');
      }
  };

  useEffect(() => {
  if (cep.length === 9) { // formato 00000-000
    buscarCep(cep);
  }
}, [cep]);

  useEffect(() => {
    if (client) {
      setNome(client.nome || '');
      setTelefone(client.telefone || '');
      setEmail(client.email || '');
      setEnderecos(client.enderecos || []);
    } else {
      resetForm();
    }
  }, [client, isOpen]);

  const resetForm = () => {
    setNome(''); setTelefone(''); setEmail(''); setEnderecos([]);
    resetAddressForm(); setShowAddressForm(false); setEditingAddressIndex(null);
  };

  const resetAddressForm = () => {
    setCep(''); setLogradouro(''); setNumero(''); setBairro('');
    setCidade(''); setEstado(''); setComplemento('');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim() || !telefone.trim()) {
      alert('Por favor, preencha nome e telefone'); return;
    }
    if (enderecos.length === 0) {
      alert('Por favor, adicione pelo menos um endereço'); return;
    }

    onSave({
      id: client?.id,
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      enderecos,
    });
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleAddAddress = () => {
    if (!cep.trim() || !logradouro.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !estado.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios do endereço'); return;
    }

    const newAddress: EnderecoCliente = {
      cep: cep.trim(), logradouro: logradouro.trim(), numero: numero.trim(),
      bairro: bairro.trim(), cidade: cidade.trim(), estado: estado.trim(),
      complemento: complemento.trim(),
    };

    if (editingAddressIndex !== null) {
      const updatedAddresses = [...enderecos];
      updatedAddresses[editingAddressIndex] = { ...updatedAddresses[editingAddressIndex], ...newAddress };
      setEnderecos(updatedAddresses);
      setEditingAddressIndex(null);
    } else {
      setEnderecos([...enderecos, newAddress]);
    }
    resetAddressForm(); setShowAddressForm(false);
  };

  const handleEditAddress = (index: number) => {
    const address = enderecos[index];
    setCep(address.cep); setLogradouro(address.logradouro); setNumero(address.numero);
    setBairro(address.bairro); setCidade(address.cidade); setEstado(address.estado);
    setComplemento(address.complemento || '');
    setEditingAddressIndex(index); setShowAddressForm(true);
  };

  const handleDeleteAddress = (index: number) => {
    if (confirm('Deseja realmente excluir este endereço?')) {
      setEnderecos(enderecos.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10" style={{ borderColor: '#D8E2DC' }}>
          <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}><strong>{client ? 'Editar' : 'Cadastrar'} Cliente</strong></h2>
          <button onClick={handleClose} className="p-2 rounded-md hover:bg-gray-100"><X className="size-6" style={{ color: '#9D8189' }} /></button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-[18px] mb-4" style={{ color: '#6D6875' }}><strong>Informações Básicas</strong></h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}><strong>Nome</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" className="h-11 text-[15px]" style={{ borderColor: '#D8E2DC', color: '#6D6875' }} required />
                </div>
                <div>
                  <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}><strong>Telefone</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
                  <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Sem traços ex: 5511987654321" className="h-11 text-[15px]" style={{ borderColor: '#D8E2DC', color: '#6D6875' }} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}><strong>Email</strong></label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" className="h-11 text-[15px]" style={{ borderColor: '#D8E2DC', color: '#6D6875' }} />
                </div>
              </div>
            </div>

            {/* Endereços */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px]" style={{ color: '#6D6875' }}><strong>Endereços</strong></h3>
                {!showAddressForm && (
                  <Button type="button" onClick={() => setShowAddressForm(true)} className="h-9 px-4 gap-2 text-[14px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>
                    <Plus className="size-4" /> Adicionar Endereço
                  </Button>
                )}
              </div>

              {enderecos.length > 0 && (
                <div className="space-y-3 mb-4">
                  {enderecos.map((address, index) => (
                    <div key={index} className="p-4 rounded-lg border flex items-start justify-between" style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}>
                      <div>
                        <p className="text-[15px] mb-1" style={{ color: '#6D6875' }}>
                          <strong>{address.logradouro}, {address.numero}</strong> {address.complemento && ` - ${address.complemento}`}
                        </p>
                        <p className="text-[14px]" style={{ color: '#9D8189' }}>{address.bairro}, {address.cidade}/{address.estado}</p>
                        <p className="text-[13px]" style={{ color: '#9D8189' }}>CEP: {address.cep}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" onClick={() => handleEditAddress(index)} className="h-8 px-3 gap-1 text-[13px]" style={{ backgroundColor: 'white', color: '#6D6875', border: '1px solid #D8E2DC' }}><Edit2 className="size-3" /> Editar</Button>
                        <Button type="button" onClick={() => handleDeleteAddress(index)} className="h-8 px-3 gap-1 text-[13px]" style={{ backgroundColor: 'white', color: '#F4ACB7', border: '1px solid #F4ACB7' }}><Trash2 className="size-3" /> Excluir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showAddressForm && (
                <div className="p-5 rounded-lg border" style={{ borderColor: '#F4ACB7', backgroundColor: '#FFE5D9' }}>
                  <h4 className="text-[16px] mb-4" style={{ color: '#6D6875' }}><strong>{editingAddressIndex !== null ? 'Editar' : 'Novo'} Endereço</strong></h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}><strong>CEP</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
                      {/* Adicionar mascara com o react-input-mask */}

                      <Input
                            value={cep}
                            onChange={(e) => {
                              const valor = e.target.value.replace(/\D/g, '');
                              const formatado =
                                valor.length <= 5
                                  ? valor
                                  : valor.slice(0, 5) + '-' + valor.slice(5, 8);

                              setCep(formatado);
                            }}
                            placeholder="00000-000"
                          />
                          <span className="text-[12px] text-red-500">{errorMsgCep}</span>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}><strong>Logradouro (Rua)</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
                      <Input value={logradouro} onChange={(e) => setLogradouro(e.target.value)} placeholder="Nome da rua" className="h-10 text-[14px]" style={{ backgroundColor: 'white' }} />
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}><strong>Número</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
                      <Input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="123" className="h-10 text-[14px]" style={{ backgroundColor: 'white' }} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}><strong>Bairro</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
                      <Input value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Nome do bairro" className="h-10 text-[14px]" style={{ backgroundColor: 'white' }} />
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}><strong>Cidade</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
                      <Input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" className="h-10 text-[14px]" style={{ backgroundColor: 'white' }} />
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}><strong>Estado</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
                      <Input value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="SP" maxLength={2} className="h-10 text-[14px]" style={{ backgroundColor: 'white' }} />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[13px] mb-1" style={{ color: '#6D6875' }}><strong>Complemento</strong></label>
                      <Input value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Apto, bloco, etc." className="h-10 text-[14px]" style={{ backgroundColor: 'white' }} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button type="button" onClick={() => {resetAddressForm(); setShowAddressForm(false);}} className="h-9 px-4 text-[14px]" style={{ backgroundColor: 'white', color: '#9D8189', border: '1px solid #D8E2DC' }}>Cancelar</Button>
                    <Button type="button" onClick={handleAddAddress} className="h-9 px-4 text-[14px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>{editingAddressIndex !== null ? 'Salvar Alterações' : 'Adicionar'}</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: '#D8E2DC' }}>
            <Button type="button" onClick={handleClose} className="px-6 py-2 h-11 text-[15px]" style={{ backgroundColor: 'white', color: '#9D8189', border: '1px solid #D8E2DC' }}>Cancelar</Button>
            <Button type="submit" className="px-6 py-2 h-11 text-[15px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>{client ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}