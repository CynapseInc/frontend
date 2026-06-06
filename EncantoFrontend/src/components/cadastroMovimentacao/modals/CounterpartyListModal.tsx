import { useEffect, useState, useRef } from 'react';
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
  counterparties?: Counterparty[];
  onCreate: () => void;
  onEdit: (counterparty: Counterparty) => void;
  onDelete?: (counterparty: Counterparty) => void; // Tornou-se opcional já que faremos o refresh local
}

export default function CounterpartyListModal({ isOpen, onClose, onCreate, onEdit }: CounterpartyListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localCounterparties, setLocalCounterparties] = useState<Counterparty[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mostrarInativos, setMostrarInativos] = useState(false);
  
  // Estados para gerenciar as confirmações locais com Refresh automático
  const [counterpartyToReactivate, setCounterpartyToReactivate] = useState<Counterparty | null>(null);
  const [counterpartyToDelete, setCounterpartyToDelete] = useState<Counterparty | null>(null);
  
  const searchTimeoutRef = useRef<number | null>(null);

  // Função Centralizada de Busca
  const buscarDados = async (termo = searchTerm, pagina = currentPage, inativos = mostrarInativos) => {
    try {
      const response = await contraparteService.listar({
        search: termo || undefined,
        page: pagina - 1,
        status: inativos ? false : true
      });

      if (response && response.content) {
        setLocalCounterparties(
          response.content.map((item: any) => ({
            id: item.id.toString(),
            name: item.nome,
            contractType: item.tipo,
            segment: item.segmento,
            description: item.descricao || '',
          }))
        );
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Erro ao carregar contrapartes:', error);
    }
  };

  // Carrega os dados quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setMostrarInativos(false);
      setCurrentPage(1);
      setSearchTerm('');
      buscarDados('', 1, false);
    }
  }, [isOpen]);

  // Input de Pesquisa com Debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = window.setTimeout(() => {
      buscarDados(value, 1, mostrarInativos);
    }, 500);
  };

  // Alternar entre aba de Ativos e Removidos
  const handleAlternarAba = () => {
    const novoEstadoAba = !mostrarInativos;
    setMostrarInativos(novoEstadoAba);
    setCurrentPage(1);
    buscarDados(searchTerm, 1, novoEstadoAba);
  };

  // Troca de Página
  const handleMudarPagina = (novaPagina: number) => {
    setCurrentPage(novaPagina);
    buscarDados(searchTerm, novaPagina, mostrarInativos);
  };

  // Função para executar a alteração de estado (Deletar/Reativar) e atualizar a lista
  const handleAlterarStatusContraparte = async (id: string, tipoAcao: 'deletar' | 'reativar') => {
    try {
      // Ambas as ações usam a mesma rota de delete que inverte o status no back-end
      await contraparteService.deletar(Number(id));
      
      // Reseta os modais de confirmação
      setCounterpartyToReactivate(null);
      setCounterpartyToDelete(null);
      
      // REFRESH NA HORA: Recarrega a tabela mantendo os filtros atuais
      buscarDados(searchTerm, currentPage, mostrarInativos);
    } catch (error) {
      console.error(`Erro ao ${tipoAcao} contraparte:`, error);
    }
  };

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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="p-0 gap-0 [&>button]:hidden modal-lista-larga flex flex-col"
          style={{
            backgroundColor: 'white',
            border: '1px solid #D8E2DC',
            maxWidth: '1000px',
            maxHeight: '85vh',
          }}
        >
          <DialogTitle className="sr-only">Gerenciar contrapartes</DialogTitle>
          <DialogDescription className="sr-only">
            Lista de todas as contrapartes cadastradas no sistema
          </DialogDescription>

          {/* Header */}
          <div className="px-8 py-6 border-b shrink-0" style={{ borderColor: '#D8E2DC' }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[28px] flex-1 min-w-0 modal-titulo" style={{ color: '#F4ACB7' }}>
                Contrapartes
              </h2>
              <div className="flex items-center gap-3 shrink-0 modal-header-actions">
                <button
                  type="button"
                  onClick={handleAlternarAba}
                  className="px-4 py-2 rounded-md text-[14px] transition-all hover:opacity-90 inline-flex items-center gap-2"
                  style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}
                >
                  {mostrarInativos ? 'Ver ativos' : 'Ver removidos'}
                </button>
                {!mostrarInativos && (
                  <button
                    type="button"
                    onClick={onCreate}
                    className="h-10 px-4 rounded-md text-[15px] transition-all inline-flex items-center gap-2"
                    style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
                  >
                    <Users className="size-4" />
                    Nova Contraparte
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md transition-colors hover:bg-gray-100"
                  style={{ color: '#9D8189' }}
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Pesquisa */}
          <div className="px-8 pt-6 pb-5 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
              <Input
                placeholder="Buscar contraparte..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-11 text-[15px]"
                style={{
                  borderColor: '#D8E2DC',
                  backgroundColor: '#F9F9F9',
                  color: '#6D6875',
                  paddingLeft: '40px',
                }}
              />
            </div>
          </div>

          {/* Tabela */}
          <div className="px-8 pb-6 overflow-y-auto flex-1">
            {localCounterparties.length === 0 ? (
              <div className="text-center py-12" style={{ color: '#9D8189' }}>
                <p className="text-[15px]">Nenhuma contraparte encontrada</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden modal-tabela-container" style={{ borderColor: '#D8E2DC' }}>
                <table className="w-full min-w-[800px] whitespace-nowrap">
                  <thead>
                    <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                      <th className="text-left px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>Nome</th>
                      <th className="text-left px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>Tipo</th>
                      <th className="text-left px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>Segmento</th>
                      <th className="text-right px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localCounterparties.map((counterparty, index) => (
                      <tr
                        key={counterparty.id}
                        className="border-b transition-colors hover:bg-opacity-50"
                        style={{
                          borderColor: '#D8E2DC',
                          backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9',
                        }}
                      >
                        <td className="px-6 py-4">
                          <span className="text-[15px] font-medium" style={{ color: '#6D6875' }}>
                            {counterparty.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[15px]" style={{ color: '#6D6875' }}>
                            {counterparty.contractType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[15px]" style={{ color: '#6D6875' }}>
                            {counterparty.segment}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {mostrarInativos ? (
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setCounterpartyToReactivate(counterparty)}
                                className="px-3 py-1 rounded-md text-[13px] text-white bg-[#F4ACB7] hover:opacity-90 transition-all font-medium"
                              >
                                Reativar
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => onEdit(counterparty)}
                                className="p-2 rounded-md transition-all hover:bg-opacity-80"
                                style={{ backgroundColor: '#D8E2DC' }}
                                title="Editar"
                              >
                                <Pencil className="size-4" style={{ color: '#6D6875' }} />
                              </button>
                              <button
                                type="button"
                                // CORRIGIDO: Agora o botão de deletar abre a confirmação local igual ao reativar!
                                onClick={() => setCounterpartyToDelete(counterparty)}
                                className="p-2 rounded-md transition-all hover:bg-opacity-80"
                                style={{ backgroundColor: '#FFCAD4' }}
                                title="Excluir"
                              >
                                <Trash2 className="size-4" style={{ color: '#6D6875' }} />
                              </button>
                            </div>
                          )}
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
            <div className="px-8 py-4 border-t flex items-center gap-2 flex-wrap shrink-0" style={{ borderColor: '#D8E2DC' }}>
              <button
                type="button"
                onClick={() => handleMudarPagina(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md text-[15px] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
              >
                Anterior
              </button>

              {paginas.map((page, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => typeof page === 'number' && handleMudarPagina(page)}
                  disabled={page === '...'}
                  className="px-4 py-2 rounded-md text-[15px] transition-all"
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
                type="button"
                onClick={() => handleMudarPagina(Math.min(totalPages, currentPage + 1))}
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
              paddingBottom: '16px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-7 rounded-md text-[16px] border transition-all hover:bg-white"
              style={{
                backgroundColor: 'white',
                borderColor: '#D8E2DC',
                color: '#9D8189',
              }}
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Reativação */}
      {counterpartyToReactivate && (
        <Dialog open={true} onOpenChange={() => setCounterpartyToReactivate(null)}>
          <DialogContent className="max-w-[400px]">
            <DialogTitle>Reativar contraparte?</DialogTitle>
            <p className="py-4 text-[15px] text-[#6D6875]">
              A contraparte <strong>{counterpartyToReactivate.name}</strong> voltará a aparecer na lista.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCounterpartyToReactivate(null)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[#F4ACB7] text-white rounded font-medium"
                onClick={() => handleAlterarStatusContraparte(counterpartyToReactivate.id, 'reativar')}
              >
                Confirmar
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* NOVO: Modal de Confirmação de Exclusão Direta com Refresh */}
      {counterpartyToDelete && (
        <Dialog open={true} onOpenChange={() => setCounterpartyToDelete(null)}>
          <DialogContent className="max-w-[400px]">
            <DialogTitle>Excluir contraparte?</DialogTitle>
            <p className="py-4 text-[15px] text-[#6D6875]">
              Tem certeza de que deseja remover a contraparte <strong>{counterpartyToDelete.name}</strong>? Ela será movida para a lista de removidos.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCounterpartyToDelete(null)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[#FFCAD4] text-[#6D6875] border border-[#D8E2DC] hover:opacity-90 rounded font-medium"
                onClick={() => handleAlterarStatusContraparte(counterpartyToDelete.id, 'deletar')}
              >
                Confirmar Exclusão
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}