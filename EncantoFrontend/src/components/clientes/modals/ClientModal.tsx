import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import type { Cliente, ClienteFormPayload, EnderecoCliente } from '../../../interfaces/Cliente';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: ClienteFormPayload) => void;
  client?: Cliente | null;
}

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatPhone = (value: string) => {
  const digits = onlyDigits(value);

  if (digits.startsWith('55') && digits.length >= 12) {
    const ddd = digits.slice(2, 4);
    const number = digits.slice(4);
    if (number.length > 8) return `+55 (${ddd}) ${number.slice(0, 5)}-${number.slice(5, 9)}`;
    return `+55 (${ddd}) ${number.slice(0, 4)}-${number.slice(4, 8)}`;
  }

  if (digits.length > 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  if (digits.length > 6) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  if (digits.length > 2) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return digits;
};

const emptyAddress: EnderecoCliente = {
  cep: '',
  logradouro: '',
  numLogradouro: '',
  bairro: '',
  cidade: '',
  estado: '',
  uf: '',
  municipio: '',
  complemento: ''
};

const normalizeAddress = (address: EnderecoCliente): EnderecoCliente => ({
  ...address,
  numLogradouro: address.numLogradouro ?? address.numero ?? '',
  numero: address.numLogradouro ?? address.numero ?? '',
  complemento: address.complemento ?? '',
  uf: address.uf ?? address.estado ?? '',
  municipio: address.municipio ?? address.cidade ?? ''
});

export default function ClientModal({ isOpen, onClose, onSave, client }: ClientModalProps) {
  const [formData, setFormData] = useState<Cliente>({
    nome: '',
    telefone: '',
    enderecos: []
  });
  const [addressForm, setAddressForm] = useState<EnderecoCliente>(emptyAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [removedAddressIds, setRemovedAddressIds] = useState<number[]>([]);
  const [cepError, setCepError] = useState('');

  useEffect(() => {
    if (client) {
      setFormData({
        id: client.id,
        nome: client.nome || '',
        telefone: client.telefone || '',
        enderecos: (client.enderecos || [])
          .filter((address) => address.ativo !== false)
          .map(normalizeAddress)
      });
    } else {
      setFormData({
        nome: '',
        telefone: '',
        enderecos: []
      });
    }
    setAddressForm(emptyAddress);
    setShowAddressForm(false);
    setEditingAddressIndex(null);
    setRemovedAddressIds([]);
    setCepError('');
  }, [client, isOpen]);

  useEffect(() => {
    const cep = onlyDigits(addressForm.cep);
    if (!showAddressForm || cep.length !== 8) return;

    const buscarCep = async () => {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError('CEP não encontrado');
          return;
        }

        setAddressForm((currentAddress) => ({
          ...currentAddress,
          cep: `${cep.slice(0, 5)}-${cep.slice(5, 8)}`,
          logradouro: data.logradouro || currentAddress.logradouro,
          bairro: data.bairro || currentAddress.bairro,
          cidade: data.localidade || currentAddress.cidade,
          municipio: data.localidade || currentAddress.municipio,
          estado: data.uf || currentAddress.estado,
          uf: data.uf || currentAddress.uf
        }));
        setCepError('');
      } catch (error) {
        setCepError('Erro ao buscar CEP');
      }
    };

    buscarCep();
  }, [addressForm.cep, showAddressForm]);

  const resetAddressForm = () => {
    setAddressForm(emptyAddress);
    setShowAddressForm(false);
    setEditingAddressIndex(null);
    setCepError('');
  };

  const handleSaveAddress = () => {
    const normalized = normalizeAddress({
      ...addressForm,
      cep: addressForm.cep.trim(),
      logradouro: addressForm.logradouro.trim(),
      numLogradouro: (addressForm.numLogradouro ?? addressForm.numero ?? '').trim(),
      bairro: addressForm.bairro.trim(),
      cidade: addressForm.cidade.trim(),
      estado: addressForm.estado.trim(),
      uf: (addressForm.uf || addressForm.estado).trim(),
      municipio: (addressForm.municipio || addressForm.cidade).trim(),
      complemento: addressForm.complemento?.trim() || ''
    });

    if (!normalized.cep || !normalized.logradouro || !normalized.numLogradouro || !normalized.bairro || !normalized.cidade || !normalized.estado) return;

    if (editingAddressIndex !== null) {
      const updatedAddresses = [...formData.enderecos];
      updatedAddresses[editingAddressIndex] = normalized;
      setFormData({ ...formData, enderecos: updatedAddresses });
    } else {
      setFormData({ ...formData, enderecos: [...formData.enderecos, normalized] });
    }

    resetAddressForm();
  };

  const handleEditAddress = (index: number) => {
    setAddressForm(normalizeAddress(formData.enderecos[index]));
    setEditingAddressIndex(index);
    setShowAddressForm(true);
  };

  const handleRemoveAddress = (index: number) => {
    const address = formData.enderecos[index];
    if (address.id) setRemovedAddressIds([...removedAddressIds, address.id]);
    setFormData({
      ...formData,
      enderecos: formData.enderecos.filter((_, currentIndex) => currentIndex !== index)
    });

    if (editingAddressIndex === index) resetAddressForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.telefone.trim()) return;

    onSave({
      ...formData,
      nome: formData.nome.trim(),
      telefone: onlyDigits(formData.telefone),
      enderecos: (formData.enderecos || []).map(normalizeAddress),
      enderecosRemovidos: removedAddressIds
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[800px] p-0 gap-0 [&>button]:hidden"
        style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}
      >
        <DialogTitle className="sr-only">
          {client ? 'Editar cliente' : 'Adicionar cliente'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados do cliente
        </DialogDescription>

        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#6D6875' }}>
              {client ? 'Editar Cliente' : 'Adicionar Cliente'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: '#9D8189' }}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 modal-grid">
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Nome completo
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{
                    backgroundColor: '#F9F9F9',
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Telefone
                </label>
                <input
                  type="text"
                  placeholder="+55 (11) 98765-4321"
                  value={formatPhone(formData.telefone)}
                  onChange={(e) => setFormData({ ...formData, telefone: onlyDigits(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{
                    backgroundColor: '#F9F9F9',
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-[15px]" style={{ color: '#6D6875' }}>
                    Endereços vinculados
                  </label>
                  {!showAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 rounded-md text-[14px] text-white transition-all hover:opacity-90 inline-flex items-center gap-2"
                      style={{ backgroundColor: '#F4ACB7' }}
                    >
                      <Plus className="size-4" />
                      Adicionar endereço
                    </button>
                  )}
                </div>

                {formData.enderecos.length > 0 ? (
                  <div className="flex flex-col gap-3 mb-4">
                    {formData.enderecos.map((address, index) => {
                      const normalized = normalizeAddress(address);
                      return (
                        <div
                          key={address.id ?? index}
                          className="p-4 rounded-md border flex items-start justify-between gap-4"
                          style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}
                        >
                          <div>
                            <p className="text-[15px] mb-1" style={{ color: '#6D6875' }}>
                              {normalized.logradouro}, {normalized.numLogradouro}
                              {normalized.complemento ? ` - ${normalized.complemento}` : ''}
                            </p>
                            <p className="text-[14px]" style={{ color: '#9D8189' }}>
                              {normalized.bairro}, {normalized.cidade}/{normalized.uf || normalized.estado}
                            </p>
                            <p className="text-[13px]" style={{ color: '#9D8189' }}>
                              CEP: {normalized.cep}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditAddress(index)}
                              className="p-2 rounded-md transition-all hover:bg-opacity-80"
                              style={{ backgroundColor: '#D8E2DC' }}
                              title="Editar endereço"
                            >
                              <Edit2 className="size-4" style={{ color: '#6D6875' }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAddress(index)}
                              className="p-2 rounded-md transition-all hover:bg-opacity-80"
                              style={{ backgroundColor: '#FFCAD4' }}
                              title="Excluir endereço"
                            >
                              <Trash2 className="size-4" style={{ color: '#6D6875' }} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[14px] mb-4" style={{ color: '#9D8189' }}>
                    Nenhum endereço cadastrado para este cliente.
                  </p>
                )}

                {showAddressForm && (
                  <div className="p-5 rounded-md border" style={{ borderColor: '#F4ACB7', backgroundColor: '#FFE5D9' }}>
                    <h3 className="text-[18px] mb-4" style={{ color: '#6D6875' }}>
                      {editingAddressIndex !== null ? 'Editar Endereço' : 'Adicionar Endereço'}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 modal-grid">
                      <div>
                        <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>CEP</label>
                        <input
                          type="text"
                          value={addressForm.cep}
                          onChange={(e) => {
                            const digits = onlyDigits(e.target.value).slice(0, 8);
                            const formattedCep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
                            setAddressForm({ ...addressForm, cep: formattedCep });
                            setCepError('');
                          }}
                          className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                          style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
                          required
                        />
                        {cepError && (
                          <p className="mt-1 text-[13px]" style={{ color: '#F4ACB7' }}>
                            {cepError}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>Número</label>
                        <input
                          type="text"
                          value={addressForm.numLogradouro ?? addressForm.numero ?? ''}
                          onChange={(e) => setAddressForm({ ...addressForm, numLogradouro: e.target.value, numero: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                          style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>Logradouro</label>
                        <input
                          type="text"
                          value={addressForm.logradouro}
                          onChange={(e) => setAddressForm({ ...addressForm, logradouro: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                          style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>Bairro</label>
                        <input
                          type="text"
                          value={addressForm.bairro}
                          onChange={(e) => setAddressForm({ ...addressForm, bairro: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                          style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>Cidade</label>
                        <input
                          type="text"
                          value={addressForm.cidade}
                          onChange={(e) => setAddressForm({ ...addressForm, cidade: e.target.value, municipio: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                          style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>Estado</label>
                        <input
                          type="text"
                          value={addressForm.estado}
                          onChange={(e) => setAddressForm({ ...addressForm, estado: e.target.value, uf: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                          style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>Complemento</label>
                        <input
                          type="text"
                          value={addressForm.complemento || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, complemento: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                          style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <button
                        type="button"
                        onClick={resetAddressForm}
                        className="px-6 py-2.5 rounded-md text-[15px] border transition-all hover:bg-white"
                        style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#9D8189' }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        className="px-6 py-2.5 rounded-md text-[15px] text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#F4ACB7' }}
                      >
                        {editingAddressIndex !== null ? 'Salvar Endereço' : 'Adicionar Endereço'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 py-5 border-t flex justify-end gap-3" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-md text-[15px] border transition-all hover:bg-white"
              style={{
                backgroundColor: 'white',
                borderColor: '#D8E2DC',
                color: '#9D8189'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-md text-[15px] text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#F4ACB7' }}
            >
              {client ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
