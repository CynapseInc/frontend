import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '../../ui/input';

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
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function ItemListModal({ isOpen, onClose, items, onEdit, onDelete }: ItemListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Buscar item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 text-[15px]"
              style={{ 
                borderColor: '#D8E2DC',
                backgroundColor: '#F9F9F9',
                color: '#6D6875'
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
