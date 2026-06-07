import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: 'success' | 'error';
}

export default function FeedbackModal({ isOpen, onClose, message, type }: FeedbackModalProps) {
  // Estado para garantir que o portal só seja criado após o componente montar no client-side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Usamos createPortal para jogar o HTML do modal direto no <body> da página,
  // fugindo de qualquer bloqueio de z-index ou pointer-events dos componentes pais.
  return createPortal(
    (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        style={{ zIndex: 99999, pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()} // Evita que cliques vazem para os modais de baixo
      >
        <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 relative animate-in zoom-in-95 duration-200 border border-[#D8E2DC]">
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-[#9D8189] hover:text-[#6D6875] transition-colors"
          >
            <X className="size-5" />
          </button>

          <div className="flex flex-col items-center text-center mt-4">
            {type === 'success' ? (
              <div className="size-16 rounded-full bg-[#FFE5D9] flex items-center justify-center mb-4">
                <CheckCircle className="size-8 text-[#4CAF50]" />
              </div>
            ) : (
              <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="size-8 text-red-500" />
              </div>
            )}

            <h3 className="text-xl font-bold text-[#6D6875] mb-2">
              {type === 'success' ? 'Sucesso!' : 'Ops! Algo deu errado.'}
            </h3>
            
            <p className="text-[#9D8189] mb-8">
              {message}
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-white font-medium transition-transform hover:scale-[1.02] active:scale-95"
              style={{ 
                backgroundColor: type === 'success' ? '#F4ACB7' : '#EF4444' 
              }}
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    ),
    document.body // <-- Destino do Portal
  );
}