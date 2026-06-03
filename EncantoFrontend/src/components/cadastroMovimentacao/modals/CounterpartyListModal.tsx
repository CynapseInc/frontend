import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Pencil, Trash2, Search, Users } from 'lucide-react';
import { Input } from '../../ui/input';
import { contraparteService } from '../../../services/Contraparte';

interface Counterparty {
  id: string;
  name: string;
  contractType: string;
  segment: string;
  description: string;
}

interface CounterpartyListModalProps {
  isOpen: boolean;
  onClose: () => void;
  counterparties?: Counterparty[]; // Pode ser opcional já que o componente faz o fetch
  onCreate: () => void;
  onEdit: (counterparty: Counterparty) => void;
  onDelete: (counterparty: Counterparty) => void;
}

export default function CounterpartyListModal({ isOpen, onClose, onCreate, onEdit, onDelete }: CounterpartyListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localCounterparties, setLocalCounterparties] = useState<Counterparty[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Corrigido de 1 para 10
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
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

  const carregarContrapartes = async () => {
    try {
      const response = await contraparteService.listar({
        search: searchTerm || undefined,
        page: currentPage - 1
      });
      setLocalCounterparties(response.content.map((contraparte: any) => ({
        id: contraparte.id.toString(), // Garantir que o ID é uma string
        name: contraparte.nome,
        contractType: contraparte.tipoContrato,
        segment: contraparte.segmento,
        description: contraparte.descricao
      })));
      setTotalPages(response.totalPages);
      setItemsPerPage(response.size || 10);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erro ao carregar contrapartes:', error);
    }
  }

  // Volta à página 1 sempre que o termo de pesquisa é alterado
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen) {
      carregarContrapartes();
    }
  }, [searchTerm, currentPage, isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-none p-0 gap-0 [&>button]:hidden overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: 'white', 
          border: '1px solid #D8E2DC',
          width: 'calc(100vw - 160px)',
          maxWidth: '1480px',
          minWidth: '1180px',
          maxHeight: 'calc(100vh - 120px)'
        }}
      >
        <DialogTitle className="sr-only">
          Gerenciar contrapartes
        </DialogTitle>
        <DialogDescription className="sr-only">
          Lista de todas as contrapartes cadastradas
        </DialogDescription>
        
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[28px] leading-tight flex-1 min-w-0" style={{ color: '#6D6875' }}>
              Contrapartes
            </h2>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onCreate}
                className="h-11 px-5 rounded-md text-[15px] transition-all inline-flex items-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
              >
                <Users className="size-4" />
                Nova Contraparte
              </button>
              <button 
                onClick={onClose} 
                className="size-10 rounded-md transition-colors hover:bg-gray-100 inline-flex items-center justify-center"
                style={{ color: '#9D8189' }}
              >
                <X className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="px-8 pt-6 pb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
            <Input
              placeholder="Buscar por nome, tipo ou segmento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Tabela */}
        <div className="px-8 pb-6 overflow-y-auto overflow-x-hidden flex-1 min-h-0">
          {localCounterparties.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#9D8189' }}>
              <p className="text-[16px]">Nenhuma contraparte encontrada</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#D8E2DC' }}>
              <table className="w-full table-fixed">
                <thead>
                  <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                    <th className="text-left px-4 py-4 text-[15px]" style={{ color: '#6D6875', width: '22%' }}>
                      Nome
                    </th>
                    <th className="text-left px-4 py-4 text-[15px]" style={{ color: '#6D6875', width: '18%' }}>
                      Tipo de Contrato
                    </th>
                    <th className="text-left px-4 py-4 text-[15px]" style={{ color: '#6D6875', width: '17%' }}>
                      Segmento
                    </th>
                    <th className="text-left px-4 py-4 text-[15px]" style={{ color: '#6D6875', width: '31%' }}>
                      Descrição
                    </th>
                    <th className="text-right px-4 py-4 text-[15px]" style={{ color: '#6D6875', width: '12%' }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {localCounterparties.map((counterparty, index) => (
                    <tr
                      key={counterparty.id}
                      className="border-b transition-colors hover:bg-opacity-50"
                      style={{
                        borderColor: '#D8E2DC',
                        backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                      }}
                    >
                      <td className="px-4 py-4 align-middle">
                        <span className="text-[15px] break-words" style={{ color: '#6D6875' }}>
                          {counterparty.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <span className="text-[14px] break-words" style={{ color: '#9D8189' }}>
                          {counterparty.contractType}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <span 
                          className="inline-flex max-w-full items-center px-3 py-1.5 rounded-full text-[14px] break-words"
                          style={{
                            backgroundColor: '#D8E2DC',
                            color: '#6D6875'
                          }}
                        >
                          {counterparty.segment}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <span className="text-[14px] leading-5 break-words" style={{ color: '#9D8189' }}>
                          {counterparty.description || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => onEdit(counterparty)}
                            className="p-2.5 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#D8E2DC' }}
                            title="Editar"
                          >
                            <Pencil className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                          <button
                            onClick={() => onDelete(counterparty)}
                            className="p-2.5 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#FFCAD4' }}
                            title="Excluir"
                          >
                            <Trash2 className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-8 pb-5 flex items-center justify-end gap-2 flex-wrap">
            
            {/* Anterior */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md text-[15px] transition-all disabled:opacity-40"
              style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
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
              style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
            >
              Próximo
            </button>

          </div>
        )}

        {/* Footer */}
        <div
          className="px-8 border-t flex justify-end shrink-0"
          style={{
            backgroundColor: '#F9F9F9',
            borderColor: '#D8E2DC',
            paddingTop: '16px',
            paddingBottom: '28px'
          }}
        >
          <button
            onClick={onClose}
            className="h-11 px-7 rounded-md text-[16px] border transition-all hover:bg-white"
            style={{
              backgroundColor: 'white',
              borderColor: '#D8E2DC',
              color: '#9D8189'
            }}
          >
            Fechar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}