import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface ProductCategory {
  id: string;
  description: string;
}

interface ProductCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: ProductCategory) => void;
  category?: ProductCategory | null;
}

export default function ProductCategoryModal({ isOpen, onClose, onSave, category }: ProductCategoryModalProps) {
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setDescription(category.description);
    } else {
      setDescription('');
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSave({
      id: category?.id || '',
      description: description.trim(),
    });

    setDescription('');
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="p-0 gap-0 [&>button]:hidden"
        style={{ 
          backgroundColor: 'white', 
          border: '1px solid #D8E2DC',
          maxWidth: '600px'
        }}
      >
        <DialogTitle className="sr-only">
          {category ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados da categoria do produto
        </DialogDescription>

        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#F4ACB7' }}>
              {category ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <button 
              onClick={handleClose} 
              className="p-1.5 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: '#9D8189' }}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-5">
            {/* Descrição */}
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                Descrição da Categoria <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Herói, Princesa, Times..."
                className="h-11 text-[15px]"
                style={{ 
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t flex justify-end gap-3" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
            <Button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 h-11 text-[15px]"
              style={{
                backgroundColor: 'white',
                color: '#9D8189',
                border: '1px solid #D8E2DC'
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 h-11 text-[15px]"
              style={{
                backgroundColor: '#F4ACB7',
                color: 'white'
              }}
            >
              {category ? 'Salvar Alterações' : 'Cadastrar Categoria'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
