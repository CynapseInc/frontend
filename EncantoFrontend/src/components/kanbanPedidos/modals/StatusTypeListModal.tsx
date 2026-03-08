import { X, Pencil, Trash2 } from 'lucide-react';
import type { StatusPedidoResponse } from '../../../interfaces/Pedido';

interface StatusTypeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusTypes: StatusPedidoResponse[];
  onEdit: (status: StatusPedidoResponse) => void;
  onDelete: (status: StatusPedidoResponse) => void;
}

export default function StatusTypeListModal({ isOpen, onClose, statusTypes, onEdit, onDelete }: StatusTypeListModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div>
            <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}>
              <strong>Gerenciar Status</strong>
            </h2>
            <p className="text-[14px] mt-1" style={{ color: '#9D8189' }}>
              Visualize, edite ou remova as colunas do seu Kanban
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <X className="size-6" style={{ color: '#9D8189' }} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-3">
            {statusTypes.map(status => (
              <div
                key={status.id}
                className="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm"
                style={{ borderColor: '#D8E2DC', backgroundColor: 'white' }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="size-6 rounded-full border"
                    style={{ backgroundColor: status.cor || '#F9F9F9', borderColor: '#D8E2DC' }}
                  />
                  <span className="text-[16px]" style={{ color: '#6D6875' }}>
                    <strong>{status.status}</strong>
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(status)}
                    className="p-2 rounded-md transition-colors hover:bg-gray-100"
                    title="Editar Status"
                  >
                    <Pencil className="size-4" style={{ color: '#9D8189' }} />
                  </button>
                  <button
                    onClick={() => onDelete(status)}
                    className="p-2 rounded-md transition-colors hover:bg-red-50"
                    title="Excluir Status"
                  >
                    <Trash2 className="size-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}

            {statusTypes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[15px]" style={{ color: '#9D8189' }}>Nenhum status cadastrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}