import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface ProductCategory {
  id: string;
  description: string;
}

interface Theme {
  id: string;
  description: string;
  categoryId: string;
}

interface ThemeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  themes: Theme[];
  categories: ProductCategory[];
  onEdit: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
}

export default function ThemeListModal({ isOpen, onClose, themes, categories, onEdit, onDelete }: ThemeListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredThemes = themes.filter(theme =>
    theme.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.description || '-';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 gap-0 [&>button]:hidden"
        style={{ 
          backgroundColor: 'white', 
          border: '1px solid #D8E2DC',
          maxWidth: '1000px'
        }}
      >
        <DialogTitle className="sr-only">
          Gerenciar temas
        </DialogTitle>
        <DialogDescription className="sr-only">
          Lista de todos os temas cadastrados
        </DialogDescription>
        
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#F4ACB7' }}>
              Temas
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
              placeholder="Buscar tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          {filteredThemes.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#9D8189' }}>
              <p className="text-[15px]">Nenhum tema encontrado</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#D8E2DC' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                    <th className="text-left px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>
                      Tema
                    </th>
                    <th className="text-left px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>
                      Categoria
                    </th>
                    <th className="text-right px-6 py-4 text-[15px]" style={{ color: '#6D6875' }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredThemes.map((theme, index) => (
                    <tr
                      key={theme.id}
                      className="border-b transition-colors hover:bg-opacity-50"
                      style={{
                        borderColor: '#D8E2DC',
                        backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-[15px]" style={{ color: '#6D6875' }}>
                          {theme.description}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-[14px]"
                          style={{
                            backgroundColor: '#FFCAD4',
                            color: '#6D6875'
                          }}
                        >
                          {getCategoryName(theme.categoryId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => onEdit(theme)}
                            className="p-2 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#D8E2DC' }}
                            title="Editar"
                          >
                            <Pencil className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                          <button
                            onClick={() => onDelete(theme)}
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
