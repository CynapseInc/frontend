import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface ProductCategory {
  id: string;
  description: string;
}

interface Theme {
  id: string;
  description: string;
  categoryId: string;
}

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (theme: Theme) => void;
  theme?: Theme | null;
  categories: ProductCategory[];
}

export default function ThemeModal({ isOpen, onClose, onSave, theme, categories }: ThemeModalProps) {
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (theme) {
      setDescription(theme.description);
      setCategoryId(theme.categoryId);
    } else {
      setDescription('');
      setCategoryId('');
    }
  }, [theme, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !categoryId) return;

    onSave({
      id: theme?.id || '',
      description: description.trim(),
      categoryId,
    });

    setDescription('');
    setCategoryId('');
  };

  const handleClose = () => {
    setDescription('');
    setCategoryId('');
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
          {theme ? 'Editar Tema' : 'Novo Tema'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados do tema
        </DialogDescription>

        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#F4ACB7' }}>
              {theme ? 'Editar Tema' : 'Novo Tema'}
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
                Descrição do Tema <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Ben 10, Frozen, Spider-Man..."
                className="h-11 text-[15px]"
                style={{ 
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                Categoria <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 px-3 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.description}</option>
                ))}
              </select>
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
              {theme ? 'Salvar Alterações' : 'Cadastrar Tema'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
