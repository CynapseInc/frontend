import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface StatusType {
  id: string;
  name: string;
  color: string;
}

interface StatusTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (statusType: StatusType) => void;
  statusType?: StatusType | null;
}

const colorOptions = [
  { name: 'Rosa Claro', value: '#FFE5D9' },
  { name: 'Rosa', value: '#FFCAD4' },
  { name: 'Rosa Médio', value: '#F4ACB7' },
  { name: 'Cinza Rosado', value: '#9D8189' },
  { name: 'Verde Claro', value: '#D8E2DC' },
  { name: 'Branco', value: '#F9F9F9' },
  { name: 'Roxo', value: '#6D6875' },
];

export default function StatusTypeModal({ isOpen, onClose, onSave, statusType }: StatusTypeModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFE5D9');

  useEffect(() => {
    if (statusType) {
      setName(statusType.name);
      setSelectedColor(statusType.color);
    } else {
      setName('');
      setSelectedColor('#FFE5D9');
    }
  }, [statusType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Por favor, preencha o nome do status');
      return;
    }

    onSave({
      id: statusType?.id || '',
      name: name.trim(),
      color: selectedColor,
    });

    setName('');
    setSelectedColor('#FFE5D9');
  };

  const handleClose = () => {
    setName('');
    setSelectedColor('#FFE5D9');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: '#D8E2DC' }}
        >
          <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}>
            <strong>{statusType ? 'Editar' : 'Novo'} Tipo de Status</strong>
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="size-6" style={{ color: '#9D8189' }} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            
            {/* Nome */}
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Nome do Status</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Aguardando Pagamento"
                className="h-11 text-[15px]"
                style={{ 
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-[15px] mb-3" style={{ color: '#6D6875' }}>
                <strong>Cor da Coluna</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105"
                    style={{
                      borderColor: selectedColor === color.value ? '#F4ACB7' : '#D8E2DC',
                      backgroundColor: selectedColor === color.value ? '#FFE5D9' : 'white',
                    }}
                  >
                    <div
                      className="size-10 rounded-full border"
                      style={{
                        backgroundColor: color.value,
                        borderColor: '#D8E2DC'
                      }}
                    />
                    <span className="text-[11px]" style={{ color: '#9D8189' }}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: selectedColor }}
            >
              <span className="block text-[13px] mb-2" style={{ color: '#9D8189' }}>
                Pré-visualização
              </span>
              <div 
                className="inline-flex items-center px-4 py-2 rounded-full text-[15px]"
                style={{
                  backgroundColor: 'white',
                  color: '#6D6875',
                  border: '1px solid #D8E2DC'
                }}
              >
                {name || 'Nome do Status'}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div 
            className="flex justify-end gap-3 p-6 border-t"
            style={{ borderColor: '#D8E2DC' }}
          >
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
              {statusType ? 'Salvar Alterações' : 'Criar Status'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
