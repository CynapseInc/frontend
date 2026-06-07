import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Pencil, Trash2, Search, Tag } from 'lucide-react';
import { Input } from '../../ui/input';
import { temaService } from '../../../services/TemaService';
import DeleteThemeDialog from './DeleteThemeDialog'; // 1. Importa o seu dialog customizado

interface ProductCategory {
  id: string;
  description: string;
}

interface Theme {
  id: string;
  description: string;
  categoryId: string;
  categoryDescription: string;
}

interface ThemeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  themes: Theme[];
  categories: ProductCategory[];
  onCreate: () => void;
  onEdit: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
}

export default function ThemeListModal({ isOpen, onClose, themes, categories, onCreate, onEdit, onDelete }: ThemeListModalProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [temasFiltrados, setTemasFiltrados] = useState<Theme[]>(themes);
  const [totalPages, setTotalPages] = useState(1);
  const searchTimeoutRef = useRef<number | null>(null);

  // --- ESTADOS PARA OS POPUPS ---
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [ThemeToReactivate, setThemeToReactivate] = useState<Theme | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<Theme | null>(null); // 2. Estado para controlar o tema a ser excluído

  // --- RESETAR ESTADOS AO FECHAR O MODAL ---
  useEffect(() => {
    if (!isOpen) {
      setMostrarInativos(false);
      setThemeToReactivate(null);
      setThemeToDelete(null);
    }
  }, [isOpen]);

  // --- BUSCA PAGINADA E FILTRADA VIA API ---
  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        const data = await temaService.listarTodos({ 
          search: searchTerm, 
          page: currentPage - 1,
          ativo: mostrarInativos ? false : true
        });
        setTotalPages(data.totalPages);

        const mappedThemes = data.content.map((theme: any) => ({
          id: theme.id,
          description: theme.descricao,
          categoryId: theme.categoriaTemaId,
          categoryDescription: theme.categoriaTema?.titulo || '-'
        }));
        setTemasFiltrados(mappedThemes);
      } catch (error) {
        console.error('Erro ao buscar temas:', error);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, currentPage, mostrarInativos, themes]);

  const gerarPaginas = (currentPage: number, totalPages: number) => {
    const maxPages = 7;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);

    return pages;
  };

  const paginas = gerarPaginas(currentPage, totalPages);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="p-0 gap-0 [&>button]:hidden modal-lista-larga"
          style={{
            backgroundColor: 'white',
            border: '1px solid #D8E2DC',
            maxWidth: '1000px'
          }}
        >
          <DialogTitle className="sr-only">Gerenciar temas</DialogTitle>
          <DialogDescription className="sr-only">Lista de todos os temas cadastrados</DialogDescription>

          {/* Header */}
          <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[28px] flex-1 min-w-0 modal-titulo" style={{ color: '#F4ACB7' }}>
                Temas
              </h2>

              <div className="flex items-center gap-3 shrink-0 modal-header-actions">
                <button
                  type="button"
                  onClick={() => { setMostrarInativos(prev => !prev); setCurrentPage(1); }}
                  className="h-10 px-4 rounded-md text-[15px] transition-all inline-flex items-center gap-2"
                  style={{ backgroundColor: '#D8E2DC', color: '#6D6875', border: '1px solid #D8E2DC' }}
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
                    <Tag className="size-4" />
                    Novo Tema
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
          <div className="px-8 pt-6 pb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
              <Input
                placeholder="Buscar tema..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-11 text-[15px]"
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
          <div className="px-8 pb-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
            {temasFiltrados.length === 0 ? (
              <div className="text-center py-12" style={{ color: '#9D8189' }}>
                <p className="text-[15px]">
                  {mostrarInativos ? 'Nenhum tema removido' : 'Nenhum tema encontrado'}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden modal-tabela-container" style={{ borderColor: '#D8E2DC' }}>
                <table className="w-full min-w-[600px] whitespace-nowrap">
                  <thead>
                    <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                      <th className="text-left px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>Tema</th>
                      <th className="text-left px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>Categoria</th>
                      <th className="text-right px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {temasFiltrados.map((theme, index) => (
                      <tr
                        key={theme.id}
                        className="border-b transition-colors hover:bg-opacity-50"
                        style={{
                          borderColor: '#D8E2DC',
                          backgroundColor: mostrarInativos ? '#FFF0F0' : (index % 2 === 0 ? 'white' : '#F9F9F9'),
                          opacity: mostrarInativos ? 0.85 : 1
                        }}
                      >
                        <td className="px-6 py-4">
                          <span className="text-[15px]" style={{ color: '#6D6875' }}>{theme.description}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-[14px]"
                            style={{ backgroundColor: '#FFCAD4', color: '#6D6875' }}
                          >
                            {theme.categoryDescription}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end">
                            {mostrarInativos ? (
                              <button
                                onClick={() => setThemeToReactivate(theme)}
                                className="px-3 py-2 rounded-md text-[14px] transition-all hover:opacity-80"
                                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
                                title="Reativar"
                              >
                                Reativar
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => onEdit(theme)}
                                  className="p-2 rounded-md transition-all hover:bg-opacity-80"
                                  style={{ backgroundColor: '#D8E2DC' }}
                                  title="Editar"
                                >
                                  <Pencil className="size-4" style={{ color: '#6D6875' }} />
                                </button>
                                <button
                                  onClick={() => setThemeToDelete(theme)} // 3. Altera o clique para setar o estado local
                                  className="p-2 rounded-md transition-all hover:bg-opacity-80"
                                  style={{ backgroundColor: '#FFCAD4' }}
                                  title="Excluir"
                                >
                                  <Trash2 className="size-4" style={{ color: '#6D6875' }} />
                                </button>
                              </>
                            )}
                          </div>
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
            <div className="px-8 py-4 border-t flex items-center gap-2 flex-wrap" style={{ borderColor: '#D8E2DC' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md text-[15px] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
              >
                Anterior
              </button>

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
          <div className="px-8 py-5 border-t flex justify-end" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-md text-[15px] border transition-all hover:bg-white"
              style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#9D8189' }}
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG DE CONFIRMAÇÃO DE REATIVAÇÃO --- */}
      {ThemeToReactivate && (
        <Dialog open={true} onOpenChange={() => setThemeToReactivate(null)}>
          <DialogContent
            className="max-w-[400px] p-0 gap-0 [&>button]:hidden"
            style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}
          >
            <DialogTitle className="sr-only">Reativar tema</DialogTitle>
            <DialogDescription className="sr-only">Confirmar reativação</DialogDescription>
            <div className="px-7 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
              <h2 className="text-[22px]" style={{ color: '#6D6875' }}>Reativar tema?</h2>
            </div>
            <div className="px-7 py-5">
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                O tema <strong>{ThemeToReactivate.description}</strong> voltará a aparecer na lista ativa.
              </p>
            </div>
            <div className="px-7 py-5 border-t flex justify-end gap-3" style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}>
              <button
                onClick={() => setThemeToReactivate(null)}
                className="px-5 py-2.5 rounded-md text-[15px] border transition-all hover:bg-white"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#9D8189' }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await temaService.deletar(ThemeToReactivate.id);
                  setThemeToReactivate(null);
                  setCurrentPage(1);
                  setSearchTerm(prev => prev + ' ');
                  setTimeout(() => setSearchTerm(prev => prev.trim()), 10);
                }}
                className="px-5 py-2.5 rounded-md text-[15px] text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#F4ACB7' }}
              >
                Confirmar
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* --- 4. DIALOG CUSTOMIZADO DE EXCLUSÃO INTEGRADO --- */}
      <DeleteThemeDialog
        isOpen={!!themeToDelete}
        themeName={themeToDelete?.description || ''}
        onClose={() => setThemeToDelete(null)}
        onConfirm={async () => {
          if (themeToDelete) {
            await onDelete(themeToDelete); // Dispara a função real de exclusão
            setThemeToDelete(null);        // Fecha o popup
            setSearchTerm('');             // Reseta o termo
            setCurrentPage(1);             // Volta para a primeira página
          }
        }}
      />
    </>
  );
}