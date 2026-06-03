import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X } from 'lucide-react';

interface Counterparty {
  id: string;
  name: string;
  contractType: string;
  segment: string;
  description: string;
}

interface CounterpartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (counterparty: Counterparty) => void;
  counterparty?: Counterparty | null;
}

export default function CounterpartyModal({ isOpen, onClose, onSave, counterparty }: CounterpartyModalProps) {
  const [formData, setFormData] = useState<Partial<Counterparty>>({
    name: '',
    contractType: '', // <-- Inicia vazio em vez de forçar 'Funcionário'
    segment: '',
    description: '',
  });

  useEffect(() => {
    if (counterparty) {
      setFormData(counterparty);
    } else {
      setFormData({
        name: '',
        contractType: '', // <-- Inicia vazio
        segment: '',
        description: '',
      });
    }
  }, [counterparty, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name && formData.contractType && formData.segment) {
      onSave(formData as Counterparty);
      setFormData({
        name: '',
        contractType: '',
        segment: '',
        description: '',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[700px] p-0 gap-0 [&>button]:hidden"
        style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}
      >
        <DialogTitle className="sr-only">
          {counterparty ? 'Editar contraparte' : 'Cadastrar contraparte'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados da contraparte
        </DialogDescription>
        
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#6D6875' }}>
              {counterparty ? 'Editar Contraparte' : 'Cadastrar Contraparte'}
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {/* Nome */}
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Nome da pessoa ou empresa"
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

              {/* Tipo de contrato - Transformado em campo de texto */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Tipo de contrato
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mensal, CLT, PJ, Fornecedor..."
                  value={formData.contractType}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              {/* Segmento */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Segmento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Comércio, Serviços, Indústria..."
                  value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              {/* Descrição */}
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Descrição
                </label>
                <textarea
                  placeholder="Informações adicionais sobre a contraparte..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors resize-none"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
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
              {counterparty ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}