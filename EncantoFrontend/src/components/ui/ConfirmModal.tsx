import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Tem certeza?",
  message,
  confirmText = "Sim, confirmar",
  cancelText = "Cancelar"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 relative animate-in zoom-in-95 duration-200 border border-[#D8E2DC]">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-[#9D8189] hover:text-[#6D6875] transition-colors">
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="size-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
            <AlertTriangle className="size-7 text-orange-500" />
          </div>

          <h3 className="text-xl font-bold text-[#6D6875] mb-2">{title}</h3>
          <p className="text-[#9D8189] mb-8">{message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[#6D6875] font-medium transition-colors border border-[#D8E2DC] hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl text-white font-medium transition-transform hover:scale-[1.02] active:scale-95 shadow-md"
              style={{ backgroundColor: '#F4ACB7' }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}