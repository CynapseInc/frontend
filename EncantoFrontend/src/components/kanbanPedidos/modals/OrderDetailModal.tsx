import { useEffect, useState } from 'react';
import { X, User, Phone, Package, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
// import { Navigate, useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  customerName: string;
  productName: string;
  deliveryDate: string;
  orderCode: string;
  statusId: string;
  phone: string;
  description: string;
  observations: string;
  createdAt: string;
  updatedAt: string;
  deliveryDeadline: string;
}

interface StatusType {
  id: string;
  name: string;
  color: string;
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  statusTypes: StatusType[];
  onUpdateStatus: (orderId: string, newStatusId: string) => void;
  onClickInSeeDetails: (orderId: string) => void;
}

export default function OrderDetailModal({ isOpen, onClose, order, statusTypes, onUpdateStatus, onClickInSeeDetails }: OrderDetailModalProps) {
  const [selectedStatusId, setSelectedStatusId] = useState('');

  useEffect(() => {
    if (order) {
      setSelectedStatusId(order.statusId);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const currentStatus = statusTypes.find(st => st.id === order.statusId);

  const handleStatusChange = (newStatusId: string) => {
    setSelectedStatusId(newStatusId);
    onUpdateStatus(order.id, newStatusId);
  };

  // const navigate = useNavigate();

  const handleViewProduct = () => {
    // navigate(`pedidos/detalhes/${order.id}`);
    
  };

  const handleViewOrderDetails = () => {
    onClickInSeeDetails(order.id);
  }

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
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: '#D8E2DC' }}
        >
          <div>
            <h2 className="text-[28px]" style={{ color: '#F4ACB7' }}>
              <strong>Detalhes do Pedido</strong>
            </h2>
            <p className="text-[15px] mt-1" style={{ color: '#9D8189' }}>
              Código: {order.orderCode}
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
        <div className="p-6 space-y-6">
          
          {/* Status Atual */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: currentStatus?.color || '#F9F9F9' }}
          >
            <label className="block text-[14px] mb-2" style={{ color: '#6D6875' }}>
              <strong>Status Atual</strong>
            </label>
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full text-[15px]"
              style={{
                backgroundColor: '#FFCAD4',
                color: '#6D6875'
              }}
            >
              {currentStatus?.name}
            </div>
          </div>

          {/* Alterar Status */}
          <div>
            <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}>
              <strong>Alterar Status</strong>
            </label>
            <select
              value={selectedStatusId}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
              style={{
                backgroundColor: 'white',
                borderColor: '#D8E2DC',
                color: '#6D6875'
              }}
            >
              {statusTypes.map(status => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          {/* Informações do Cliente */}
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
                    <strong>{order.customerName}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="size-5" style={{ color: '#F4ACB7' }} />
                <div>
                  <span className="block text-[13px]" style={{ color: '#9D8189' }}>Telefone</span>
                  <span className="text-[16px]" style={{ color: '#6D6875' }}>
                    {order.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Pedido */}
          <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#D8E2DC' }}>
            <h3 className="text-[18px] mb-4" style={{ color: '#F4ACB7' }}>
              <strong>Informações do Pedido</strong>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="size-5 mt-1" style={{ color: '#F4ACB7' }} />
                <div className="flex-1">
                  <span className="block text-[13px]" style={{ color: '#9D8189' }}>Produto</span>
                  <span className="text-[16px]" style={{ color: '#6D6875' }}>
                    <strong>{order.productName}</strong>
                  </span>
                  <Button
                    onClick={handleViewProduct}
                    className="mt-2 h-9 px-4 text-[13px]"
                    style={{
                      backgroundColor: '#FFE5D9',
                      color: '#6D6875'
                    }}
                  >
                    Ver Detalhes do Produto
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="size-5 mt-1" style={{ color: '#F4ACB7' }} />
                <div className="flex-1">
                  <span className="block text-[13px]" style={{ color: '#9D8189' }}>Descrição</span>
                  <p className="text-[15px]" style={{ color: '#6D6875' }}>
                    {order.description}
                  </p>
                </div>
              </div>

              {order.observations && (
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#FFE5D9' }}
                >
                  <span className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>
                    <strong>Observações</strong>
                  </span>
                  <p className="text-[14px]" style={{ color: '#6D6875' }}>
                    {order.observations}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Datas e Prazos */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4" style={{ color: '#F4ACB7' }} />
                <span className="text-[13px]" style={{ color: '#9D8189' }}>Data de Criação</span>
              </div>
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                {order.createdAt}
              </p>
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4" style={{ color: '#F4ACB7' }} />
                <span className="text-[13px]" style={{ color: '#9D8189' }}>Última Alteração</span>
              </div>
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                {order.updatedAt}
              </p>
            </div>

            <div 
              className="p-4 rounded-lg col-span-2"
              style={{ backgroundColor: '#FFCAD4' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4" style={{ color: '#6D6875' }} />
                <span className="text-[13px]" style={{ color: '#6D6875' }}>
                  <strong>Prazo Limite de Entrega</strong>
                </span>
              </div>
              <p className="text-[17px]" style={{ color: '#6D6875' }}>
                <strong>{order.deliveryDeadline}</strong>
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div 
          className="flex justify-end gap-3 p-6 border-t"
          style={{ borderColor: '#D8E2DC' }}
        >
          <Button
            onClick={handleViewOrderDetails}
            className="px-6 py-2 h-11 text-[15px]"
            style={{
              backgroundColor: '#F4ACB7',
              color: 'white'
            }}
          >
            Ver Detalhes Do Pedido
          </Button>
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
