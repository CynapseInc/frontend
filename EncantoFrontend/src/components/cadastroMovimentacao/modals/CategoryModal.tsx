import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category?: Category | null;
}

export default function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: '',
      });
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name) {
      onSave(formData as Category);
      setFormData({ name: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[600px] p-0 gap-0 [&>button]:hidden"
        style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}
      >
        <DialogTitle className="sr-only">
          {category ? 'Editar categoria' : 'Adicionar categoria'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados da categoria de movimentação
        </DialogDescription>
        
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#6D6875' }}>
              {category ? 'Editar Categoria' : 'Cadastrar Categoria'}
            </h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: '#9D8189' }}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6">
            {/* Nome da categoria */}
            <div>
              <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                Título da categoria
              </label>
              <input
                type="text"
                placeholder="Ex: Pagamento de funcionário, Fornecedor, Venda..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                style={{ 
                  backgroundColor: '#F9F9F9', 
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              />
            </div>
          </div>

          {/* Footer com botões */}
          <div className="px-8 py-5 border-t flex justify-end gap-3" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-md text-[15px] border transition-all hover:bg-white"
              style={{
                backgroundColor: 'white',
                borderColor: '#D8E2DC',
                color: '#9D8189'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-md text-[15px] text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#F4ACB7' }}
            >
              {category ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
