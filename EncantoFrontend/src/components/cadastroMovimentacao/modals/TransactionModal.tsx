import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X } from 'lucide-react';
import CounterpartyCombobox from './CounterpartyCombobox';
import CategoryCombobox from './CategoryCombobox copy';

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
  categoryId: string;
  category: string;
  value: number;
  date: string;
  type: 'Receita' | 'Despesa';
  paymentStatus?: 'pago' | 'pendente';
  dueDate?: string;
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
    categoryId: '',
    category: '',
    value: 0,
    date: '',
    type: 'Receita',
    paymentStatus: 'pago',
    dueDate: '',
  });

  useEffect(() => {
    // Pegar a data local correta no formato YYYY-MM-DD
    const hoje = new Date();
    const dataLocal = new Date(hoje.getTime() - (hoje.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];

    if (transaction) {
      setFormData(transaction);
    } else {
      setFormData({
        counterpartyId: counterparties.length > 0 ? counterparties[0].id : '',
        counterpartyName: counterparties.length > 0 ? counterparties[0].name : '',
        description: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        category: categories.length > 0 ? categories[0].name : '',
        value: 0,
        date: dataLocal, // <-- Uso da data com o fuso horário corrigido
        type: 'Receita',
        paymentStatus: 'pago',
        dueDate: '',
      });
    }
  }, [transaction, isOpen, categories, counterparties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.counterpartyId && formData.categoryId && formData.value && formData.date) {
      const transactionData = {
        ...formData,
        updatedAt: transaction ? new Date().toISOString() : undefined,
      } as Transaction;
      
      onSave(transactionData);
      
      // Limpa o formulário após salvar
      setFormData({
        counterpartyId: '',
        counterpartyName: '',
        description: '',
        categoryId: '',
        category: '',
        value: 0,
        date: '',
        type: 'Receita',
        paymentStatus: 'pago',
        dueDate: '',
      });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({ ...formData, value: Math.abs(value) });
  };

  const handleTypeChange = (type: 'Receita' | 'Despesa') => {
    setFormData({ ...formData, type });
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
                <CounterpartyCombobox 
                  value={formData.counterpartyId || ''}
                  onChange={(id, name) => setFormData({ 
                    ...formData, 
                    counterpartyId: id,
                    counterpartyName: name 
                  })}
                  isErr={!formData.counterpartyId}
                />
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
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Categoria de movimentação
                </label>
                <CategoryCombobox 
                  value={formData.categoryId || ''}
                  onChange={(id, name) => setFormData({ 
                    ...formData, 
                    categoryId: id,
                    category: name 
                  })}
                  isErr={!formData.categoryId}
                />
              </div>

              {/* Status de Pagamento */}
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Status de pagamento
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentStatus: 'pago' })} // <-- Corrigido para minúsculas
                    className="flex-1 px-4 py-2.5 rounded-md text-[15px] transition-all"
                    style={{
                      backgroundColor: formData.paymentStatus === 'pago' ? '#D8E2DC' : '#F9F9F9',
                      color: formData.paymentStatus === 'pago' ? '#6D6875' : '#9D8189',
                      border: `1px solid ${formData.paymentStatus === 'pago' ? '#D8E2DC' : '#D8E2DC'}`
                    }}
                  >
                    Pago
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentStatus: 'pendente' })} // <-- Corrigido para minúsculas
                    className="flex-1 px-4 py-2.5 rounded-md text-[15px] transition-all"
                    style={{
                      backgroundColor: formData.paymentStatus === 'pendente' ? '#FFF4E6' : '#F9F9F9',
                      color: formData.paymentStatus === 'pendente' ? '#6D6875' : '#9D8189',
                      border: `1px solid ${formData.paymentStatus === 'pendente' ? '#FFD89B' : '#D8E2DC'}`
                    }}
                  >
                    Pendente
                  </button>
                </div>
              </div>

              {/* Data de Vencimento (aparece apenas se pendente) */}
              {formData.paymentStatus === 'pendente' && (
                <div>
                  <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                    Data de vencimento
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                    style={{ 
                      backgroundColor: '#F9F9F9', 
                      borderColor: '#D8E2DC',
                      color: '#6D6875'
                    }}
                    required
                  />
                </div>
              )}

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