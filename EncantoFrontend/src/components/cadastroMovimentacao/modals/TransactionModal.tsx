import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Counterparty {
  id: string;
  name: string;
  contractType: string;
  segment: string;
  description: string;
}

interface Transaction {
  id: string;
  counterpartyId: string;
  counterpartyName: string;
  description: string;
  category: string;
  value: number;
  date: string;
  type: 'Receita' | 'Despesa';
  updatedAt?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction?: Transaction | null;
  categories: Category[];
  counterparties: Counterparty[];
}

export default function TransactionModal({ isOpen, onClose, onSave, transaction, categories, counterparties }: TransactionModalProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    counterpartyId: '',
    counterpartyName: '',
    description: '',
    category: '',
    value: 0,
    date: '',
    type: 'Receita',
  });

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    } else {
      setFormData({
        counterpartyId: counterparties.length > 0 ? counterparties[0].id : '',
        counterpartyName: counterparties.length > 0 ? counterparties[0].name : '',
        description: '',
        category: categories.length > 0 ? categories[0].name : '',
        value: 0,
        date: new Date().toISOString().split('T')[0],
        type: 'Receita',
      });
    }
  }, [transaction, isOpen, categories, counterparties]);

  const handleCounterpartyChange = (counterpartyId: string) => {
    const counterparty = counterparties.find(cp => cp.id === counterpartyId);
    if (counterparty) {
      setFormData({ 
        ...formData, 
        counterpartyId: counterparty.id,
        counterpartyName: counterparty.name 
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.counterpartyId && formData.category && formData.value && formData.date) {
      const transactionData = {
        ...formData,
        updatedAt: transaction ? new Date().toISOString() : undefined,
      } as Transaction;
      
      onSave(transactionData);
      setFormData({
        counterpartyId: '',
        counterpartyName: '',
        description: '',
        category: '',
        value: 0,
        date: '',
        type: 'Receita',
      });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    // Se for despesa, tornar negativo
    const finalValue = formData.type === 'Despesa' ? -Math.abs(value) : Math.abs(value);
    setFormData({ ...formData, value: finalValue });
  };

  const handleTypeChange = (type: 'Receita' | 'Despesa') => {
    const currentValue = Math.abs(formData.value || 0);
    const finalValue = type === 'Despesa' ? -currentValue : currentValue;
    setFormData({ ...formData, type, value: finalValue });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[800px] p-0 gap-0 [&>button]:hidden"
        style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}
      >
        <DialogTitle className="sr-only">
          {transaction ? 'Editar movimentação' : 'Adicionar movimentação'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados da movimentação financeira
        </DialogDescription>
        
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#6D6875' }}>
              {transaction ? 'Editar Movimentação' : 'Cadastrar Movimentação'}
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
                <select
                  value={formData.counterpartyId}
                  onChange={(e) => handleCounterpartyChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                >
                  {counterparties.length === 0 ? (
                    <option value="">Nenhum contratante cadastrado</option>
                  ) : (
                    counterparties.map(cp => (
                      <option key={cp.id} value={cp.id}>
                        {cp.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Descrição */}
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva a movimentação..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors resize-none"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              {/* Tipo de transação */}
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Tipo de transação
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('Receita')}
                    className="flex-1 px-4 py-2.5 rounded-md text-[15px] transition-all"
                    style={{
                      backgroundColor: formData.type === 'Receita' ? '#D8E2DC' : '#F9F9F9',
                      color: formData.type === 'Receita' ? '#6D6875' : '#9D8189',
                      border: `1px solid ${formData.type === 'Receita' ? '#D8E2DC' : '#D8E2DC'}`
                    }}
                  >
                    Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('Despesa')}
                    className="flex-1 px-4 py-2.5 rounded-md text-[15px] transition-all"
                    style={{
                      backgroundColor: formData.type === 'Despesa' ? '#FFCAD4' : '#F9F9F9',
                      color: formData.type === 'Despesa' ? '#6D6875' : '#9D8189',
                      border: `1px solid ${formData.type === 'Despesa' ? '#FFCAD4' : '#D8E2DC'}`
                    }}
                  >
                    Despesa
                  </button>
                </div>
              </div>

              {/* Valor */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={Math.abs(formData.value || 0)}
                  onChange={handleValueChange}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              {/* Data */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Data
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Categoria de movimentação
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">Nenhuma categoria cadastrada</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Data da última alteração (apenas na edição) */}
              {transaction && transaction.updatedAt && (
                <div className="col-span-2">
                  <p className="text-[14px]" style={{ color: '#9D8189' }}>
                    Última alteração: {new Date(transaction.updatedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
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
              {transaction ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}