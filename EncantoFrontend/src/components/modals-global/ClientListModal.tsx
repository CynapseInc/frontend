import { X, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';

interface EnderecoCliente {
  id?: number; cep: string; logradouro: string; numero: string;
  bairro: string; cidade: string; estado: string; complemento: string;
}

interface Cliente {
  id?: number; nome: string; telefone: string;
  enderecos: EnderecoCliente[];
}

interface ClientListModalProps {
  isOpen: boolean; onClose: () => void; clients: Cliente[];
  onEdit: (client: Cliente) => void;
}

export default function ClientListModal({ isOpen, onClose, clients, onEdit }: ClientListModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white" style={{ borderColor: '#D8E2DC' }}>
          <div>
            <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}><strong>Clientes Cadastrados</strong></h2>
            <p className="text-[14px] mt-1" style={{ color: '#9D8189' }}>{clients.length} cliente(s) cadastrado(s)</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100"><X className="size-6" style={{ color: '#9D8189' }} /></button>
        </div>

        <div className="p-6">
          {clients.length === 0 ? (
            <div className="text-center py-12"><p className="text-[16px]" style={{ color: '#9D8189' }}>Nenhum cliente cadastrado.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F9F9F9' }}>
                    <th className="text-left p-4 text-[14px]" style={{ color: '#6D6875', borderBottom: '1px solid #D8E2DC' }}><strong>Nome</strong></th>
                    <th className="text-left p-4 text-[14px]" style={{ color: '#6D6875', borderBottom: '1px solid #D8E2DC' }}><strong>Telefone</strong></th>
                    <th className="text-left p-4 text-[14px]" style={{ color: '#6D6875', borderBottom: '1px solid #D8E2DC' }}><strong>Endereços</strong></th>
                    <th className="text-center p-4 text-[14px]" style={{ color: '#6D6875', borderBottom: '1px solid #D8E2DC' }}><strong>Ações</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #D8E2DC' }}>
                      <td className="p-4 text-[15px]" style={{ color: '#6D6875' }}><strong>{client.nome}</strong></td>
                      <td className="p-4 text-[15px]" style={{ color: '#9D8189' }}>{client.telefone}</td>
                      <td className="p-4 text-[14px]" style={{ color: '#9D8189' }}>{client.enderecos?.length || 0} endereço(s)</td>
                      <td className="p-4 text-center">
                        <Button onClick={() => onEdit(client)} className="h-9 px-4 gap-2 text-[14px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>
                          <Edit2 className="size-4" /> Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-end p-6 border-t" style={{ borderColor: '#D8E2DC' }}>
          <Button onClick={onClose} className="px-6 py-2 h-11 text-[15px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}