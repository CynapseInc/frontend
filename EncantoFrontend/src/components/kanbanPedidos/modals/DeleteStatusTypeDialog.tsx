import { AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';

interface DeleteStatusTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  statusTypeName: string;
}

export default function DeleteStatusTypeDialog({ isOpen, onClose, onConfirm, statusTypeName }: DeleteStatusTypeDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-[450px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div 
              className="size-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FFE5D9' }}
            >
              <AlertTriangle className="size-6" style={{ color: '#F4ACB7' }} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-[20px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Excluir Tipo de Status</strong>
              </h3>
              <p className="text-[15px] mb-4" style={{ color: '#9D8189' }}>
                Tem certeza que deseja excluir o status <strong style={{ color: '#F4ACB7' }}>"{statusTypeName}"</strong>?
              </p>
              <p className="text-[14px]" style={{ color: '#9D8189' }}>
                Esta ação não pode ser desfeita e todos os pedidos neste status precisarão ser realocados.
              </p>
            </div>
          </div>
        </div>

        <div 
          className="flex justify-end gap-3 p-6 border-t"
          style={{ borderColor: '#D8E2DC' }}
        >
          <Button
            onClick={onClose}
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
            onClick={handleConfirm}
            className="px-6 py-2 h-11 text-[15px]"
            style={{
              backgroundColor: '#F4ACB7',
              color: 'white'
            }}
          >
            Sim, Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
