import { useState, useMemo, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Pencil, Trash2, Search, Box } from 'lucide-react';
import { Input } from '../../ui/input';
import { itemService } from '../../../services/ItemService';

interface Item {
  id: string;
  description: string;
  salePrice: number;
  productionCost: number;
  productionDeadline: string;
  width: string;
  height: string;
  weight: string;
  length: string;
  material: string;
  promotionalPrice: number;
  unitPrice: number;
  minimumQuantity: number;
}

interface ItemListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onCreate: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function ItemListModal({ isOpen, onClose, items, onCreate, onEdit, onDelete }: ItemListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [totalPages, setTotalPages] = useState(1);
  const searchTimeoutRef = useRef<number | null>(null);

  const itemsPerPage = 10;

    useEffect(() => {
         
           
           if(searchTimeoutRef.current) {
             window.clearTimeout(searchTimeoutRef.current);
           }
     
           searchTimeoutRef.current = window.setTimeout(async () => {
     
           try {
             const data = await itemService.listarTodos({ search: searchTerm, page: currentPage - 1 });
             setTotalPages(data.totalPages);
             
             // mapear os nomes da resposta para o formato esperado
              console.log('Resposta da API:', data);
              const mappedItems = data.content.map((item: any) => ({
                id: item.id,
                description: item.descricao,
                salePrice:  item.precoVenda || 0,
                productionCost: item.custoProducao || 0,
                productionDeadline: item.prazoProducao || '',
                width: item.largura || '',
                height: item.altura || '',
                weight: item.peso || '',
                length: item.comprimento || '',
                material: item.material || '',
                descricaoPadrao: item.descricaoPadrao || '',
                promotionalPrice: item.precoPromocional || 0,
                unitPrice: item.precoUnitario || 0,
                minimumQuantity: item.quantidadeMinima || 0
              }));
             
              setFilteredItems(mappedItems);
           } catch (error) {
             console.error('Erro ao buscar itens:', error);
           }
         },
         500)
        
         
       }, [searchTerm, currentPage])
             
           
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

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
          width: '90vw',
          maxWidth: '1400px',
          maxHeight: '90vh'
        }}
      >
        <DialogTitle className="sr-only">
          Gerenciar itens
        </DialogTitle>
        <DialogDescription className="sr-only">
          Lista de todos os itens cadastrados
        </DialogDescription>
        
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#F4ACB7' }}>
              Itens
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCreate}
                className="h-10 px-4 rounded-md text-[15px] transition-all inline-flex items-center gap-2"
                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
              >
                <Box className="size-4" />
                Novo Item
              </button>
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
              placeholder="Buscar item..."
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
        <div className="px-8 pb-6 overflow-y-auto" style={{ maxHeight: '500px' }}>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#9D8189' }}>
              <p className="text-[15px]">Nenhum item encontrado</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#D8E2DC' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                    <th className="text-left px-4 py-3 text-[14px]" style={{ color: '#6D6875' }}>
                      Descrição
                    </th>
                    <th className="text-left px-4 py-3 text-[14px]" style={{ color: '#6D6875' }}>
                      Preço Venda
                    </th>
                    <th className="text-left px-4 py-3 text-[14px]" style={{ color: '#6D6875' }}>
                      Custo
                    </th>
                    <th className="text-left px-4 py-3 text-[14px]" style={{ color: '#6D6875' }}>
                      Prazo
                    </th>
                    <th className="text-left px-4 py-3 text-[14px]" style={{ color: '#6D6875' }}>
                      Material
                    </th>
                    <th className="text-left px-4 py-3 text-[14px]" style={{ color: '#6D6875' }}>
                      Qtd. Mín.
                    </th>
                    <th className="text-right px-4 py-3 text-[14px]" style={{ color: '#6D6875' }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b transition-colors hover:bg-opacity-50"
                      style={{
                        borderColor: '#D8E2DC',
                        backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                      }}
                    >
                      <td className="px-4 py-3">
                        <span className="text-[15px]" style={{ color: '#6D6875' }}>
                          {item.description}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[15px]" style={{ color: '#4CAF50' }}>
                          R$ {item.salePrice.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[15px]" style={{ color: '#9D8189' }}>
                          R$ {item.productionCost.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[15px]" style={{ color: '#9D8189' }}>
                          {item.productionDeadline || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-[13px]"
                          style={{
                            backgroundColor: '#D8E2DC',
                            color: '#6D6875'
                          }}
                        >
                          {item.material || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[15px]" style={{ color: '#9D8189' }}>
                          {item.minimumQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#D8E2DC' }}
                            title="Editar"
                          >
                            <Pencil className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                          <button
                            onClick={() => onDelete(item)}
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
