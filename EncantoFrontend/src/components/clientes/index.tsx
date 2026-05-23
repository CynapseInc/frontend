import { useEffect, useState } from 'react';
import { Search, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FeedbackModal from '../ui/FeedbackModal';
import ClientModal from './modals/ClientModal';
import DeleteClientDialog from './modals/DeleteClientDialog';
import { clienteService } from '../../services/ClienteService';
import type { Cliente, ClienteFormPayload, EnderecoCliente } from '../../interfaces/Cliente';

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

const normalizeAddress = (address: EnderecoCliente): EnderecoCliente => ({
  ...address,
  numLogradouro: address.numLogradouro ?? address.numero ?? '',
  uf: address.uf ?? address.estado ?? '',
  municipio: address.municipio ?? address.cidade ?? '',
  complemento: address.complemento ?? ''
});

const toAddressPayload = (address: EnderecoCliente): EnderecoCliente => {
  const normalized = normalizeAddress(address);

  return {
    logradouro: normalized.logradouro,
    numLogradouro: normalized.numLogradouro,
    bairro: normalized.bairro,
    cep: normalized.cep,
    uf: normalized.uf,
    cidade: normalized.cidade,
    estado: normalized.estado,
    municipio: normalized.municipio,
    complemento: normalized.complemento
  };
};

const formatAddressSummary = (addresses: EnderecoCliente[]) => {
  const activeAddresses = addresses.filter((address) => address.ativo !== false).map(normalizeAddress);
  if (activeAddresses.length === 0) return 'Nenhum endereço cadastrado';

  const [firstAddress] = activeAddresses;
  const firstSummary = `${firstAddress.logradouro}, ${firstAddress.numLogradouro} - ${firstAddress.bairro}`;
  if (activeAddresses.length === 1) return firstSummary;

  return `${firstSummary} (+${activeAddresses.length - 1})`;
};

const gerarPaginas = (currentPage: number, totalPages: number) => {
  const maxPages = 7;

  if (totalPages <= maxPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];
  const start = Math.max(2, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  if (start > 2) pages.push('...');

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push('...');
  pages.push(totalPages);

  return pages;
};

export default function Clientes() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [deleteClient, setDeleteClient] = useState<Cliente | null>(null);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const itemsPerPage = 8;

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ isOpen: true, message, type });
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clienteService.listarTodos({
        search: searchTerm,
        page: currentPage - 1,
        size: itemsPerPage
      });

      setClients(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      setClients([]);
      setTotalPages(1);
      setTotalElements(0);
      showFeedback('Erro ao carregar clientes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchTerm, currentPage]);

  const handleAddClient = async (client: ClienteFormPayload) => {
    try {
      await clienteService.criar({
        nome: client.nome,
        telefone: onlyDigits(client.telefone),
        enderecos: (client.enderecos || []).map(toAddressPayload)
      });

      setIsModalOpen(false);
      setCurrentPage(1);
      await fetchClients();
      showFeedback('Cliente criado com sucesso.', 'success');
    } catch (error) {
      showFeedback('Erro ao criar cliente.', 'error');
    }
  };

  const handleEditClient = async (client: ClienteFormPayload) => {
    if (!client.id) return;

    try {
      await clienteService.atualizar(client.id, {
        nome: client.nome,
        telefone: onlyDigits(client.telefone),
        enderecos: []
      });

      await Promise.all((client.enderecosRemovidos || []).map((id) => clienteService.excluirEndereco(id)));

      await Promise.all((client.enderecos || []).map((address) => {
        const payload = toAddressPayload(address);
        if (address.id) return clienteService.atualizarEndereco(address.id, payload);
        return clienteService.criarEndereco(client.id as number, payload);
      }));

      setIsModalOpen(false);
      setEditingClient(null);
      await fetchClients();
      showFeedback('Cliente atualizado com sucesso.', 'success');
    } catch (error) {
      showFeedback('Erro ao atualizar cliente.', 'error');
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteClient?.id) return;

    try {
      await clienteService.excluir(deleteClient.id);
      setDeleteClient(null);
      await fetchClients();
      showFeedback('Cliente excluído com sucesso.', 'success');
    } catch (error) {
      showFeedback('Erro ao excluir cliente.', 'error');
    }
  };

  const openEditModal = (client: Cliente) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const paginas = gerarPaginas(currentPage, totalPages);
  const startIndex = totalElements === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalElements);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="w-full max-w-[1600px] mx-auto px-8 py-10 box-border">
        <div className="mb-10">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Clientes</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie todos os clientes num só lugar</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 max-w-md relative">
              <Search
                className="absolute top-1/2 -translate-y-1/2"
                style={{ color: '#9D8189', left: '1vw', width: '1.2vw', height: '1.2vw', pointerEvents: 'none' }}
              />
              <Input
                placeholder="Procurar por cliente..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 text-[0.9vw]"
                style={{ paddingLeft: '3.5vw', borderColor: '#D8E2DC', backgroundColor: '#F9F9F9', color: '#6D6875' }}
              />
            </div>

            <Button
              onClick={openAddModal}
              className="gap-2 h-11 px-6 text-[15px]"
              style={{ backgroundColor: '#F4ACB7', color: 'white' }}
            >
              <Plus className="size-5" />
              Adicionar Cliente
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D8E2DC' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Nome</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Telefone</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Endereços</th>
                <th className="text-right px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12">
                    <div className="flex items-center justify-center">
                      <Loader2 className="size-6 animate-spin" style={{ color: '#F4ACB7' }} />
                    </div>
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[16px]" style={{ color: '#9D8189' }}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                clients.map((client, index) => (
                  <tr
                    key={client.id}
                    className="border-b transition-colors hover:bg-opacity-50"
                    style={{ borderColor: '#D8E2DC', backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: '#FFE5D9' }}>
                          <span className="text-[17px]" style={{ color: '#F4ACB7' }}>
                            {client.nome.charAt(0)}
                          </span>
                        </div>
                        <span className="text-[16px]" style={{ color: '#6D6875' }}>
                          {client.nome}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[15px]" style={{ color: '#9D8189' }}>
                        {formatPhone(client.telefone)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px]" style={{ color: '#9D8189' }}>
                        {formatAddressSummary(client.enderecos || [])}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEditModal(client)}
                          className="p-2 rounded-md transition-all hover:bg-opacity-80"
                          style={{ backgroundColor: '#D8E2DC' }}
                          title="Editar"
                        >
                          <Pencil className="size-4" style={{ color: '#6D6875' }} />
                        </button>
                        <button
                          onClick={() => setDeleteClient(client)}
                          className="p-2 rounded-md transition-all hover:bg-opacity-80"
                          style={{ backgroundColor: '#FFCAD4' }}
                          title="Excluir"
                        >
                          <Trash2 className="size-4" style={{ color: '#6D6875' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex items-center justify-between mt-6 bg-white rounded-lg p-4 shadow-sm"
          style={{ border: '1px solid #D8E2DC' }}
        >
          <p className="text-[14px]" style={{ color: '#9D8189' }}>
            Mostrando {startIndex} a {endIndex} de {totalElements} clientes
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 rounded-md text-[14px] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#F9F9F9', color: '#6D6875', border: '1px solid #D8E2DC' }}
              >
                Anterior
              </button>

              {paginas.map((page, index) => (
                <button
                  key={`${page}-${index}`}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={loading || page === '...'}
                  className="px-4 py-2 rounded-md text-[14px] transition-all disabled:opacity-40"
                  style={{
                    backgroundColor: currentPage === page ? '#F4ACB7' : 'white',
                    color: currentPage === page ? 'white' : '#6D6875',
                    border: `1px solid ${currentPage === page ? '#F4ACB7' : '#D8E2DC'}`,
                    cursor: page === '...' ? 'default' : 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 rounded-md text-[14px] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#F9F9F9', color: '#6D6875', border: '1px solid #D8E2DC' }}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSave={editingClient ? handleEditClient : handleAddClient}
        client={editingClient}
      />

      <DeleteClientDialog
        isOpen={!!deleteClient}
        onClose={() => setDeleteClient(null)}
        onConfirm={handleDeleteClient}
        clientName={deleteClient?.nome || ''}
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
