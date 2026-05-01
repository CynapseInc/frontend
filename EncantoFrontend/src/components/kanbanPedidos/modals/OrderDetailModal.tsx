import { useEffect, useState } from 'react';
import { X, User, Phone, Package, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import type { PedidoResponse, StatusPedidoResponse } from '../../../interfaces/Pedido';

import { produtoService } from '../../../services/ProdutoService';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PedidoResponse | null;
  statusTypes: StatusPedidoResponse[];
  onUpdateStatus: (orderId: number, newStatusId: number) => void;
  onClickInSeeDetails: (orderId: number) => void;
}

export default function OrderDetailModal({ isOpen, onClose, order, statusTypes, onUpdateStatus, onClickInSeeDetails }: OrderDetailModalProps) {
  const [selectedStatusId, setSelectedStatusId] = useState('');
  
  const [productNames, setProductNames] = useState<Record<number, string>>({});

  useEffect(() => {
    if (order && order.statusAtual?.idStatusPedido) {
      setSelectedStatusId(order.statusAtual.idStatusPedido.toString());
    }
  }, [order]);

  useEffect(() => {
    const fetchProductNames = async () => {
      if (!order?.produtos || !isOpen) return;
      
      const newNames = { ...productNames };
      let hasChanges = false;

      for (const prod of order.produtos) {
        if (!newNames[prod.idProduto]) {
          try {
            const produto = await produtoService.buscarPorId(prod.idProduto); 
            newNames[prod.idProduto] = produto.titulo; // Baseado na sua interface Produto.ts
            hasChanges = true;
          } catch (error) {
            newNames[prod.idProduto] = `Produto ID: ${prod.idProduto}`;
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        setProductNames(newNames);
      }
    };

    fetchProductNames();
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

const currentStatus = statusTypes.find(st => st.id === order.statusAtual?.idStatusPedido);

  const handleStatusChange = (newStatusId: string) => {
    setSelectedStatusId(newStatusId);
    onUpdateStatus(order.id, parseInt(newStatusId));
  };

  const handleViewOrderDetails = () => {
    onClickInSeeDetails(order.id);
  };

  const formatarData = (dataStr?: string) => {
    if (!dataStr) return 'Não definida';
    return new Date(dataStr).toLocaleDateString('pt-BR');
  };

  const formatarDataHora = (dataStr?: string) => {
    if (!dataStr) return 'Não definida';
    return new Date(dataStr).toLocaleString('pt-BR');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10" style={{ borderColor: '#D8E2DC' }}>
          <div>
            <h2 className="text-[28px]" style={{ color: '#F4ACB7' }}>
              <strong>Detalhes do Pedido</strong>
            </h2>
            <p className="text-[15px] mt-1" style={{ color: '#9D8189' }}>
              Código: PED-{order.id.toString().padStart(3, '0')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <X className="size-6" style={{ color: '#9D8189' }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: currentStatus?.cor || '#F9F9F9', border: '1px solid #D8E2DC' }}>
              <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Status Atual</strong>
              </label>
              <div className="inline-flex items-center px-4 py-2 rounded-full text-[15px] bg-white bg-opacity-50" style={{ color: '#6D6875' }}>
                {currentStatus?.status || 'Sem status'}
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}>
              <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Mover para Status:</strong>
              </label>
              <select
                value={selectedStatusId}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full h-10 px-3 rounded-md text-[14px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                <option value="">Selecione um status...</option>
                {statusTypes.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#D8E2DC' }}>
            <h3 className="text-[18px] mb-4" style={{ color: '#F4ACB7' }}>
              <strong>Informações do Cliente</strong>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="size-5" style={{ color: '#F4ACB7' }} />
                <div>
                  <span className="block text-[13px]" style={{ color: '#9D8189' }}>Nome</span>
                  <span className="text-[16px]" style={{ color: '#6D6875' }}>
                    <strong>{order.cliente?.nome || 'Cliente não associado'}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="size-5" style={{ color: '#F4ACB7' }} />
                <div>
                  <span className="block text-[13px]" style={{ color: '#9D8189' }}>Contato</span>
                  <span className="text-[16px]" style={{ color: '#6D6875' }}>
                    {order.cliente?.telefone || order.cliente?.email || 'Sem contato registado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#D8E2DC' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px]" style={{ color: '#F4ACB7' }}>
                <strong>Produtos do Pedido</strong>
              </h3>
              <span className="text-[14px] font-bold" style={{ color: '#4CAF50' }}>
                Total: R$ {order.precoTotal?.toFixed(2) || '0.00'}
              </span>
            </div>
            
            <div className="space-y-2">
              {order.produtos && order.produtos.length > 0 ? (
                order.produtos.map((prod, index) => (
                  <div key={prod.id || index} className="flex items-start gap-3 p-3 rounded-md" style={{ backgroundColor: '#F9F9F9' }}>
                    <Package className="size-5 mt-1" style={{ color: '#F4ACB7' }} />
                    <div className="flex-1">
                      <span className="text-[15px]" style={{ color: '#6D6875' }}>
                        {/* AQUI ESTAMOS EXIBINDO O NOME DO PRODUTO */}
                        <strong>{prod.quantidade}x {productNames[prod.idProduto] || 'Carregando...'}</strong>
                      </span>
                      <div className="flex gap-4 mt-1 text-[13px]" style={{ color: '#9D8189' }}>
                        <span>Peso: {prod.pesoTotal?.toFixed(2)}Kg</span>
                        <span>Preço: R$ {prod.precoTotal?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[14px] text-gray-500 italic">Nenhum produto adicionado a este pedido.</p>
              )}
            </div>

            {order.observacoes && (
              <div className="mt-4 flex items-start gap-3">
                <FileText className="size-5 mt-1" style={{ color: '#F4ACB7' }} />
                <div className="flex-1 p-3 rounded-lg" style={{ backgroundColor: '#FFE5D9' }}>
                  <span className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                    <strong>Observações do Pedido</strong>
                  </span>
                  <p className="text-[14px]" style={{ color: '#6D6875' }}>
                    {order.observacoes}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4" style={{ color: '#F4ACB7' }} />
                <span className="text-[13px]" style={{ color: '#9D8189' }}>Data de Criação</span>
              </div>
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                {formatarDataHora(order.createdAt)}
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4" style={{ color: '#F4ACB7' }} />
                <span className="text-[13px]" style={{ color: '#9D8189' }}>Última Alteração</span>
              </div>
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                {formatarDataHora(order.updatedAt)}
              </p>
            </div>

            <div className="p-4 rounded-lg col-span-2" style={{ backgroundColor: '#FFCAD4' }}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4" style={{ color: '#6D6875' }} />
                <span className="text-[13px]" style={{ color: '#6D6875' }}>
                  <strong>Prazo Limite de Entrega</strong>
                </span>
              </div>
              <p className="text-[17px]" style={{ color: '#6D6875' }}>
                <strong>{formatarData(order.dataLimite)}</strong>
              </p>
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: '#D8E2DC' }}>
          <Button
            onClick={handleViewOrderDetails}
            className="px-6 py-2 h-11 text-[15px]"
            style={{ backgroundColor: '#FFCAD4', color: '#6D6875' }}
          >
            Ver Detalhes Do Pedido
          </Button>
          <Button
            onClick={onClose}
            className="px-6 py-2 h-11 text-[15px]"
            style={{ backgroundColor: '#F4ACB7', color: 'white' }}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}