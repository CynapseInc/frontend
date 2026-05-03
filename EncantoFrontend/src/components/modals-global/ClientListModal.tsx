import { X, Edit2, Loader2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { clienteService } from '../../services/ClienteService';

interface EnderecoCliente {
  id?: number; cep: string; logradouro: string; numero: string;
  bairro: string; cidade: string; estado: string; complemento: string;
}

interface Cliente {
  id?: number; nome: string; telefone: string;
  enderecos: EnderecoCliente[];
}

interface ClientListModalProps {
  isOpen: boolean; onClose: () => void;
  onEdit: (client: Cliente) => void;
}

export default function ClientListModal({ isOpen, onClose, onEdit }: ClientListModalProps) {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const gerarPaginas = (currentPage: number, totalPages: number) => {
    const maxPages = 7;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    pages.push(1);

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  const paginas = gerarPaginas(currentPage, totalPages);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen, searchTerm, currentPage]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clienteService.listarTodos({
        search: searchTerm || undefined,
        page: currentPage - 1
      });
      setClients(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[900px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white" style={{ borderColor: '#D8E2DC' }}>
          <div>
            <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}><strong>Clientes Cadastrados</strong></h2>
            <p className="text-[14px] mt-1" style={{ color: '#9D8189' }}>{totalElements} cliente(s) cadastrado(s)</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100"><X className="size-6" style={{ color: '#9D8189' }} /></button>
        </div>

        {/* Pesquisa */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
            <Input
              placeholder="Buscar cliente por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-12 text-[16px]"
              style={{ 
                borderColor: '#D8E2DC',
                backgroundColor: '#F9F9F9',
                color: '#6D6875',
                paddingLeft: '40px'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin" style={{ color: '#F4ACB7' }} />
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12"><p className="text-[16px]" style={{ color: '#9D8189' }}>Nenhum cliente encontrado.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F9F9F9' }}>
                    <th className="text-left p-4 text-[14px]" style={{ color: '#6D6875', borderBottom: '1px solid #D8E2DC' }}><strong>Nome</strong></th>
                    <th className="text-left p-4 text-[14px]" style={{ color: '#6D6875', borderBottom: '1px solid #D8E2DC' }}><strong>Telefone</strong></th>
                    <th className="text-left p-4 text-[14px]" style={{ color: '#6D6875', borderBottom: '1px solid #D8E2DC' }}><strong>Endereços</strong></th>
                    <th className="text-center p-4 text-[14px]" style={{ color: '#6D6875', borderBottom: '1px solid #D8E2DC' }}><strong>Ações</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #D8E2DC' }}>
                      <td className="p-4 text-[15px]" style={{ color: '#6D6875' }}><strong>{client.nome}</strong></td>
                      <td className="p-4 text-[15px]" style={{ color: '#9D8189' }}>{client.telefone}</td>
                      <td className="p-4 text-[14px]" style={{ color: '#9D8189' }}>{client.enderecos?.length || 0} endereço(s)</td>
                      <td className="p-4 text-center">
                        <Button onClick={() => onEdit(client)} className="h-9 px-4 gap-2 text-[14px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>
                          <Edit2 className="size-4" /> Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center gap-2 flex-wrap" style={{ borderColor: '#D8E2DC' }}>
            {/* Anterior */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md text-[15px] transition-all disabled:opacity-40"
            >
              Anterior
            </button>

            {/* Páginas */}
            {paginas.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className="px-4 py-2 rounded-md text-[15px] transition-all"
                style={{
                  backgroundColor: currentPage === page ? '#F4ACB7' : 'white',
                  color: currentPage === page ? 'white' : '#6D6875',
                  border: `1px solid ${currentPage === page ? '#F4ACB7' : '#D8E2DC'}`,
                  cursor: page === '...' ? 'default' : 'pointer'
                }}
              >
                {page}
              </button>
            ))}

            {/* Próximo */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md text-[15px] transition-all disabled:opacity-40"
            >
              Próximo
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end p-6 border-t" style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}>
          <Button onClick={onClose} className="px-6 py-2 h-11 text-[15px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}