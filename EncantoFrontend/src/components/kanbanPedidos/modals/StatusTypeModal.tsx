import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import type { StatusPedidoResponse, StatusPedidoRole } from '../../../interfaces/Pedido';

interface StatusTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // O onSave devolve um objeto simples com o que foi digitado para o index.tsx processar
  onSave: (status: { id?: number; name: string; color: string; role: StatusPedidoRole | null }) => void;
  statusType: StatusPedidoResponse | null;
}

const PRESET_COLORS = [
  '#FFE5D9', '#FFCAD4', '#F4ACB7', '#D8E2DC', 
  '#E2ECE9', '#F0EFEB', '#EAD2AC', '#DFE7FD'
];

export default function StatusTypeModal({ isOpen, onClose, onSave, statusType }: StatusTypeModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [role, setRole] = useState<StatusPedidoRole | ''>('');

  useEffect(() => {
    if (statusType) {
      setName(statusType.status || '');
      setColor(statusType.cor || PRESET_COLORS[0]);
      setRole(statusType.role || '');
    } else {
      setName('');
      setColor(PRESET_COLORS[0]);
      setRole('');
    }
  }, [statusType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({
      id: statusType?.id,
      name,
      color,
      role: role || null,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div>
            <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}>
              <strong>{statusType ? 'Editar Status' : 'Novo Status'}</strong>
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <X className="size-6" style={{ color: '#9D8189' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
              <strong>Nome do Status</strong> <span style={{ color: '#F4ACB7' }}>*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Em Produção"
              className="h-12 text-[15px]"
              style={{ borderColor: '#D8E2DC', color: '#6D6875' }}
              required
            />
          </div>

          <div>
            <label className="block text-[15px] mb-3" style={{ color: '#6D6875' }}>
              <strong>Cor da Coluna</strong>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-12 rounded-md transition-all border-2"
                  style={{ 
                    backgroundColor: c,
                    borderColor: color === c ? '#6D6875' : 'transparent',
                    transform: color === c ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
              <strong>Classificação Interna</strong>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StatusPedidoRole | '')}
              className="h-12 w-full rounded-md border px-3 text-[15px] bg-white"
              style={{ borderColor: '#D8E2DC', color: '#6D6875' }}
            >
              <option value="">Sem classificação</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="ENTREGUE">Entregue</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#D8E2DC' }}>
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-2 h-11 text-[15px]"
              style={{ backgroundColor: 'white', color: '#9D8189', border: '1px solid #D8E2DC' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 h-11 text-[15px]"
              style={{ backgroundColor: '#F4ACB7', color: 'white' }}
              disabled={!name.trim()}
            >
              {statusType ? 'Salvar Alterações' : 'Criar Status'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
