import { X, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';

interface StatusType {
  id: string;
  name: string;
  color: string;
}

interface StatusTypeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusTypes: StatusType[];
  onEdit: (statusType: StatusType) => void;
  onDelete: (statusType: StatusType) => void;
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
        className="bg-white rounded-lg shadow-xl w-full max-w-[700px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b sticky top-0 bg-white"
          style={{ borderColor: '#D8E2DC' }}
        >
          <div>
            <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}>
              <strong>Gerenciar Tipos de Status</strong>
            </h2>
            <p className="text-[14px] mt-1" style={{ color: '#9D8189' }}>
              {statusTypes.length} {statusTypes.length === 1 ? 'status cadastrado' : 'status cadastrados'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="size-6" style={{ color: '#9D8189' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {statusTypes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[16px]" style={{ color: '#9D8189' }}>
                Nenhum tipo de status cadastrado.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {statusTypes.map(statusType => (
                <div
                  key={statusType.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ 
                    borderColor: '#D8E2DC',
                    backgroundColor: statusType.color
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="size-12 rounded-full border"
                      style={{
                        backgroundColor: statusType.color,
                        borderColor: '#D8E2DC'
                      }}
                    />
                    <div>
                      <p className="text-[17px]" style={{ color: '#6D6875' }}>
                        <strong>{statusType.name}</strong>
                      </p>
                      <p className="text-[13px]" style={{ color: '#9D8189' }}>
                        Cor: {statusType.color}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onEdit(statusType)}
                      className="px-4 py-2 h-9 gap-2 text-[14px]"
                      style={{
                        backgroundColor: 'white',
                        color: '#6D6875',
                        border: '1px solid #D8E2DC'
                      }}
                    >
                      <Edit2 className="size-4" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => onDelete(statusType)}
                      className="px-4 py-2 h-9 gap-2 text-[14px]"
                      style={{
                        backgroundColor: 'white',
                        color: '#F4ACB7',
                        border: '1px solid #F4ACB7'
                      }}
                    >
                      <Trash2 className="size-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="flex justify-end p-6 border-t"
          style={{ borderColor: '#D8E2DC' }}
        >
          <Button
            onClick={onClose}
            className="px-6 py-2 h-11 text-[15px]"
            style={{
              backgroundColor: '#F4ACB7',
              color: 'white'
            }}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
