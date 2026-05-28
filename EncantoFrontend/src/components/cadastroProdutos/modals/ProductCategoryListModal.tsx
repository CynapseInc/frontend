import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface ProductCategory {
  id: string;
  description: string;
}

interface ProductCategoryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProductCategory[];
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
}

export default function ProductCategoryListModal({ isOpen, onClose, categories, onEdit, onDelete }: ProductCategoryListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCategories = useMemo(() =>
    categories.filter(cat =>
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [categories, searchTerm]
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 gap-0 [&>button]:hidden"
        style={{ 
          backgroundColor: 'white', 
          border: '1px solid #D8E2DC',
          maxWidth: '900px'
        }}
      >
        <DialogTitle className="sr-only">
          Gerenciar categorias
        </DialogTitle>
        <DialogDescription className="sr-only">
          Lista de todas as categorias cadastradas
        </DialogDescription>
        
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#F4ACB7' }}>
              Categorias
            </h2>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: '#9D8189' }}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="px-8 pt-6 pb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
            <Input
              placeholder="Buscar categoria..."
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
          {paginatedCategories.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#9D8189' }}>
              <p className="text-[15px]">Nenhuma categoria encontrada</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#D8E2DC' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                    <th className="text-left px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>
                      Descrição
                    </th>
                    <th className="text-right px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="border-b transition-colors hover:bg-opacity-50"
                      style={{
                        borderColor: '#D8E2DC',
                        backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-[15px]" style={{ color: '#6D6875' }}>
                          {category.description}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => onEdit(category)}
                            className="p-2 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#D8E2DC' }}
                            title="Editar"
                          >
                            <Pencil className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                          <button
                            onClick={() => onDelete(category)}
                            className="p-2 rounded-md transition-all hover:bg-opacity-80"
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

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-8 py-4 border-t flex items-center gap-2 flex-wrap" style={{ borderColor: '#D8E2DC' }}>
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
        <div className="px-8 py-5 border-t flex justify-end" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md text-[15px] border transition-all hover:bg-white"
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
