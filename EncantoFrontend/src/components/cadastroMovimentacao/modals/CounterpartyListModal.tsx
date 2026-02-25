import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface Counterparty {
  id: string;
  name: string;
  contractType: string;
  segment: string;
  description: string;
}

interface CounterpartyListModalProps {
  isOpen: boolean;
  onClose: () => void;
  counterparties: Counterparty[];
  onEdit: (counterparty: Counterparty) => void;
  onDelete: (counterparty: Counterparty) => void;
}

export default function CounterpartyListModal({ isOpen, onClose, counterparties, onEdit, onDelete }: CounterpartyListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCounterparties = counterparties.filter(cp =>
    cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cp.contractType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cp.segment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 gap-0 [&>button]:hidden"
        style={{ 
          backgroundColor: 'white', 
          border: '1px solid #D8E2DC',
          width: '95vw',
          maxWidth: '1800px',
          height: '90vh',
          maxHeight: '900px'
        }}
      >
        <DialogTitle className="sr-only">
          Gerenciar contrapartes
        </DialogTitle>
        <DialogDescription className="sr-only">
          Lista de todas as contrapartes cadastradas
        </DialogDescription>
        
        {/* Header */}
        <div className="px-10 py-7 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[32px]" style={{ color: '#6D6875' }}>
              Contrapartes
            </h2>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: '#9D8189' }}
            >
              <X className="size-6" />
            </button>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="px-10 pt-7 pb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
            <Input
              placeholder="Buscar por nome, tipo ou segmento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-[16px]"
              style={{ 
                borderColor: '#D8E2DC',
                backgroundColor: '#F9F9F9',
                color: '#6D6875'
              }}
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="px-10 pb-7 overflow-y-auto" style={{ maxHeight: '600px' }}>
          {filteredCounterparties.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#9D8189' }}>
              <p className="text-[16px]">Nenhuma contraparte encontrada</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#D8E2DC' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                    <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '25%' }}>
                      Nome
                    </th>
                    <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '18%' }}>
                      Tipo de Contrato
                    </th>
                    <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '15%' }}>
                      Segmento
                    </th>
                    <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '32%' }}>
                      Descrição
                    </th>
                    <th className="text-right px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '10%' }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCounterparties.map((counterparty, index) => (
                    <tr
                      key={counterparty.id}
                      className="border-b transition-colors hover:bg-opacity-50"
                      style={{
                        borderColor: '#D8E2DC',
                        backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-[16px]" style={{ color: '#6D6875' }}>
                          {counterparty.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[15px]" style={{ color: '#9D8189' }}>
                          {counterparty.contractType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-[14px]"
                          style={{
                            backgroundColor: '#D8E2DC',
                            color: '#6D6875'
                          }}
                        >
                          {counterparty.segment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[15px]" style={{ color: '#9D8189' }}>
                          {counterparty.description || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => onEdit(counterparty)}
                            className="p-2.5 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#D8E2DC' }}
                            title="Editar"
                          >
                            <Pencil className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                          <button
                            onClick={() => onDelete(counterparty)}
                            className="p-2.5 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#FFCAD4' }}
                            title="Excluir"
                          >
                            <Trash2 className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t flex justify-end" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
          <button
            onClick={onClose}
            className="px-7 py-3 rounded-md text-[16px] border transition-all hover:bg-white"
            style={{
              backgroundColor: 'white',
              borderColor: '#D8E2DC',
              color: '#9D8189'
            }}
          >
            Fechar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}