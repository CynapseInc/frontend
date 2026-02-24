import { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import OrderDetailModal from './modals/OrderDetailModal';
import StatusTypeModal from './modals/StatusTypeModal';
import StatusTypeListModal from './modals/StatusTypeListModal';
import DeleteStatusTypeDialog from './modals/DeleteStatusTypeDialog';

import './index-kanban.css'

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

const mockStatusTypes: StatusType[] = [
  { id: '1', name: 'A Fazer', color: '#FFE5D9' },
  { id: '2', name: 'Em Andamento', color: '#FFCAD4' },
  { id: '3', name: 'Para Enviar', color: '#F4ACB7' },
  { id: '4', name: 'Enviados', color: '#D8E2DC' },
];

const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Maria Silva',
    productName: 'Caneca do Ben 10',
    deliveryDate: '15/11/2025',
    orderCode: 'PED-001',
    statusId: '1',
    phone: '(11) 98765-4321',
    description: 'Caneca personalizada com estampa do Ben 10',
    observations: 'Cliente pediu para caprichar na embalagem',
    createdAt: '10/11/2025 14:30',
    updatedAt: '10/11/2025 14:30',
    deliveryDeadline: '15/11/2025',
  },
  {
    id: '2',
    customerName: 'João Santos',
    productName: 'Caderno da Frozen',
    deliveryDate: '18/11/2025',
    orderCode: 'PED-002',
    statusId: '2',
    phone: '(11) 91234-5678',
    description: 'Caderno universitário com capa da Frozen',
    observations: 'Presente de aniversário',
    createdAt: '11/11/2025 10:15',
    updatedAt: '13/11/2025 16:20',
    deliveryDeadline: '18/11/2025',
  },
  {
    id: '3',
    customerName: 'Ana Costa',
    productName: 'Caneca do Spider-Man',
    deliveryDate: '16/11/2025',
    orderCode: 'PED-003',
    statusId: '3',
    phone: '(11) 99876-5432',
    description: 'Caneca personalizada com estampa do Spider-Man',
    observations: '',
    createdAt: '09/11/2025 09:00',
    updatedAt: '14/11/2025 11:45',
    deliveryDeadline: '16/11/2025',
  },
  {
    id: '4',
    customerName: 'Pedro Oliveira',
    productName: 'Caderno do Corinthians',
    deliveryDate: '12/11/2025',
    orderCode: 'PED-004',
    statusId: '4',
    phone: '(11) 98888-7777',
    description: 'Caderno escolar com tema do Corinthians',
    observations: 'Entregue com sucesso!',
    createdAt: '05/11/2025 13:20',
    updatedAt: '12/11/2025 10:30',
    deliveryDeadline: '12/11/2025',
  },
];

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

function OrderCard({ order, onClick }: OrderCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ORDER',
    item: { orderId: order.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={() => onClick(order)}
      className="p-4 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md"
      style={{
        backgroundColor: 'white',
        border: '1px solid #D8E2DC',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] px-2 py-0.5 rounded" style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}>
          {order.orderCode}
        </span>
        <span className="text-[13px]" style={{ color: '#9D8189' }}>
          {order.deliveryDate}
        </span>
      </div>
      
      <h3 className="text-[16px] mb-1" style={{ color: '#6D6875' }}>
        <strong>{order.customerName}</strong>
      </h3>
      
      <p className="text-[14px] mb-2" style={{ color: '#9D8189' }}>
        {order.productName}
      </p>
      
      <div className="flex items-center gap-1 text-[12px]" style={{ color: '#9D8189' }}>
        <span>📅</span>
        <span>Entrega: {order.deliveryDate}</span>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  status: StatusType;
  orders: Order[];
  onDrop: (orderId: string, newStatusId: string) => void;
  onOrderClick: (order: Order) => void;
}

function KanbanColumn({ status, orders, onDrop, onOrderClick }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ORDER',
    drop: (item: { orderId: string }) => {
      onDrop(item.orderId, status.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className="flex-1 rounded-lg p-4 min-h-[600px] min-w-[280px]"
      style={{
        backgroundColor: isOver ? '#FFE5D9' : status.color,
        border: '1px solid #D8E2DC',
        transition: 'background-color 0.2s ease',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px]" style={{ color: '#6D6875' }}>
          <strong>{status.name}</strong>
        </h2>
        <span
          className="size-7 rounded-full flex items-center justify-center text-[14px]"
          style={{ backgroundColor: '#F4ACB7', color: 'white' }}
        >
          {orders.length}
        </span>
      </div>

      <div className="space-y-3">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onClick={onOrderClick} />
        ))}
      </div>
    </div>
  );
}

export default function Kanban() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [statusTypes, setStatusTypes] = useState<StatusType[]>(mockStatusTypes);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isStatusTypeModalOpen, setIsStatusTypeModalOpen] = useState(false);
  const [isStatusTypeListOpen, setIsStatusTypeListOpen] = useState(false);
  const [editingStatusType, setEditingStatusType] = useState<StatusType | null>(null);
  const [deleteStatusType, setDeleteStatusType] = useState<StatusType | null>(null);

  const handleOrderDrop = (orderId: string, newStatusId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          statusId: newStatusId,
          updatedAt: new Date().toLocaleString('pt-BR'),
        };
      }
      return order;
    }));
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatusId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          statusId: newStatusId,
          updatedAt: new Date().toLocaleString('pt-BR'),
        };
      }
      return order;
    }));
  };

  const handleAddStatusType = (statusType: StatusType) => {
    setStatusTypes([...statusTypes, { ...statusType, id: Date.now().toString() }]);
    setIsStatusTypeModalOpen(false);
  };

  const handleEditStatusType = (statusType: StatusType) => {
    setStatusTypes(statusTypes.map(st => st.id === statusType.id ? statusType : st));
    setIsStatusTypeModalOpen(false);
    setEditingStatusType(null);
  };

  const handleDeleteStatusType = () => {
    if (deleteStatusType) {
      setStatusTypes(statusTypes.filter(st => st.id !== deleteStatusType.id));
      setDeleteStatusType(null);
    }
  };

  const openEditStatusTypeModal = (statusType: StatusType) => {
    setEditingStatusType(statusType);
    setIsStatusTypeModalOpen(true);
    setIsStatusTypeListOpen(false);
  };

  const getOrdersByStatus = (statusId: string) => {
    return orders.filter(order => order.statusId === statusId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
        {/* Navbar */}
        {/* <header className="bg-white border-b shadow-sm" style={{ borderColor: '#D8E2DC' }}>
          <div className="max-w-[1920px] mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F4ACB7' }}>
                  <span className="text-white text-[18px]">OE</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[20px]" style={{ color: '#F4ACB7' }}>O Encanto</span>
                  <span className="text-[12px]" style={{ color: '#9D8189' }}>personalizados</span>
                </div>
              </div>
              <nav className="flex gap-8">
                <a href="#" className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Home</a>
                <a href="#" className="text-[16px]" style={{ color: '#F4ACB7' }}>Pedidos</a>
                <a href="#" className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Financeiro</a>
                <a href="#" className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Produtos</a>
                <a href="#" className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Funcionários</a>
              </nav>
              <button 
                className="px-6 py-2 rounded-md text-[15px] text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#6D6875' }}
              >
                Login
              </button>
            </div>
          </div>
        </header> */}

        <div className="max-w-[1920px] mx-auto px-8 py-8">
          {/* Cabeçalho */}
          <div className="mb-10">
            <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Pedidos</h1>
            <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie seus pedidos de forma visual e organizada</p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 mb-8">
            <Button 
              onClick={() => alert('Tela de cadastro de pedido (a ser implementada)')}
              className="gap-2 h-11 px-5 text-[15px]"
              style={{ backgroundColor: '#F4ACB7', color: 'white' }}
            >
              <Plus className="size-4" />
              Cadastrar Pedido
            </Button>
            
            <Button 
              onClick={() => {
                setEditingStatusType(null);
                setIsStatusTypeModalOpen(true);
              }}
              className="gap-2 h-11 px-5 text-[15px]"
              style={{ backgroundColor: '#FFCAD4', color: '#6D6875' }}
            >
              <Plus className="size-4" />
              Novo Status
            </Button>
            
            <Button 
              onClick={() => setIsStatusTypeListOpen(true)}
              className="gap-2 h-11 px-5 text-[15px]"
              style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}
            >
              <Settings className="size-4" />
              Gerenciar Status
            </Button>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-6">
            {statusTypes.map(status => (
              <KanbanColumn
                key={status.id}
                status={status}
                orders={getOrdersByStatus(status.id)}
                onDrop={handleOrderDrop}
                onOrderClick={handleOrderClick}
              />
            ))}
          </div>
        </div>

        {/* Modals */}
        <OrderDetailModal
          isOpen={isOrderDetailOpen}
          onClose={() => {
            setIsOrderDetailOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          statusTypes={statusTypes}
          onUpdateStatus={handleUpdateOrderStatus}
        />

        <StatusTypeModal
          isOpen={isStatusTypeModalOpen}
          onClose={() => {
            setIsStatusTypeModalOpen(false);
            setEditingStatusType(null);
          }}
          onSave={editingStatusType ? handleEditStatusType : handleAddStatusType}
          statusType={editingStatusType}
        />

        <StatusTypeListModal
          isOpen={isStatusTypeListOpen}
          onClose={() => setIsStatusTypeListOpen(false)}
          statusTypes={statusTypes}
          onEdit={openEditStatusTypeModal}
          onDelete={(statusType) => setDeleteStatusType(statusType)}
        />

        <DeleteStatusTypeDialog
          isOpen={!!deleteStatusType}
          onClose={() => setDeleteStatusType(null)}
          onConfirm={handleDeleteStatusType}
          statusTypeName={deleteStatusType?.name || ''}
        />
      </div>
    </DndProvider>
  );
}