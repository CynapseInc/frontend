import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '../../ui/input';
import { categoriaMovService } from '../../../services/CategoriaMov';
interface Category {
  id: string;
  name: string;
}

interface CategoryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryListModal({ isOpen, onClose,onEdit, onDelete }: CategoryListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
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

  const carregarCategorias = async () => {
    const response = await categoriaMovService.listar({
      search: searchTerm || undefined,
      page: currentPage - 1
    });
    setCategories(response.content.map((cat) => ({
      id: cat.id.toString(),
      name: cat.descricao
     })));
    setTotalPages(response.totalPages);
    setTotalElements(response.totalElements);
  }

  useEffect(() => {
    // setCurrentPage(1);
    carregarCategorias();
  }, [searchTerm, currentPage, isOpen]);

 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[900px] p-0 gap-0 [&>button]:hidden max-h-[80vh]"
        style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}
      >
        <DialogTitle className="sr-only">
          Gerenciar categorias
        </DialogTitle>
        <DialogDescription className="sr-only">
          Lista de todas as categorias de movimentação
        </DialogDescription>
        
        {/* Header */}
        <div className="px-10 py-7 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[32px]" style={{ color: '#6D6875' }}>
              Categorias de Movimentação
            </h2>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: '#9D8189' }}
            >
              <X className="size-6" />
            </button>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="px-10 pt-7 pb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
            <Input
              placeholder="Buscar categoria..."
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

        {/* Lista */}
        <div className="px-10 pb-7 overflow-y-auto" style={{ maxHeight: '450px' }}>
          {categories.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#9D8189' }}>
              <p className="text-[16px]">Nenhuma categoria encontrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-5 rounded-md border transition-colors hover:bg-opacity-50"
                  style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9',
                    borderColor: '#D8E2DC'
                  }}
                >
                  <span className="text-[17px]" style={{ color: '#6D6875' }}>
                    {category.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2.5 rounded-md transition-all hover:bg-opacity-80"
                      style={{ backgroundColor: '#D8E2DC' }}
                      title="Editar"
                    >
                      <Pencil className="size-4" style={{ color: '#6D6875' }} />
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="p-2.5 rounded-md transition-all hover:bg-opacity-80"
                      style={{ backgroundColor: '#FFCAD4' }}
                      title="Excluir"
                    >
                      <Trash2 className="size-4" style={{ color: '#6D6875' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
  <div className="flex items-center gap-2">
    
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
        <div className="px-10 py-6 border-t flex justify-end" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
          <button
            onClick={onClose}
            className="px-7 py-3 rounded-md text-[16px] border transition-all hover:bg-white"
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