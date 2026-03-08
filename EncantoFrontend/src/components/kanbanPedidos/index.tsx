import { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';

// Modais
import OrderDetailModal from './modals/OrderDetailModal';
import StatusTypeModal from './modals/StatusTypeModal';
import StatusTypeListModal from './modals/StatusTypeListModal';
import DeleteStatusTypeDialog from './modals/DeleteStatusTypeDialog';

// Serviços e Interfaces Reais
import { pedidoService } from '../../services/PedidoService';
import { statusPedidoService } from '../../services/StatusPedidoService';
import type { PedidoResponse, StatusPedidoResponse } from '../../interfaces/Pedido';

import './index-kanban.css';

// ==========================================
// COMPONENTE DO CARTÃO DO PEDIDO
// ==========================================
interface OrderCardProps {
  order: PedidoResponse;
  onClick: (order: PedidoResponse) => void;
}

function OrderCard({ order, onClick }: OrderCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ORDER',
    item: { orderId: order.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Formatar a data limite para um formato amigável (DD/MM/YYYY)
  const dataLimiteFormatada = order.dataLimite 
    ? new Date(order.dataLimite).toLocaleDateString('pt-BR') 
    : 'Sem data';

  return (
    <div
      ref={drag as any}
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
          PED-{order.id.toString().padStart(3, '0')}
        </span>
        <span className="text-[13px] font-bold" style={{ color: '#4CAF50' }}>
          R$ {order.precoTotal?.toFixed(2) || '0.00'}
        </span>
      </div>
      
      <h3 className="text-[16px] mb-1 truncate" style={{ color: '#6D6875' }}>
        <strong>{order.cliente?.nome || 'Cliente não informado'}</strong>
      </h3>
      
      <p className="text-[13px] mb-2" style={{ color: '#9D8189' }}>
        {order.produtos?.length || 0} produto(s) no pedido
      </p>
      
      <div className="flex items-center gap-1 text-[12px]" style={{ color: '#9D8189' }}>
        <span>📅</span>
        <span>Entrega: {dataLimiteFormatada}</span>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE DA COLUNA DO KANBAN
// ==========================================
interface KanbanColumnProps {
  status: StatusPedidoResponse;
  orders: PedidoResponse[];
  onDrop: (orderId: number, newStatusId: number) => void;
  onOrderClick: (order: PedidoResponse) => void;
}

function KanbanColumn({ status, orders, onDrop, onOrderClick }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ORDER',
    drop: (item: { orderId: number }) => {
      onDrop(item.orderId, status.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onDrop, status.id]); 

  // Fallback de cor caso o status não tenha cor definida no banco
  const columnColor = status.cor || '#F9F9F9';

  return (
    <div
      ref={drop as any}
      className="flex-1 rounded-lg p-4 min-h-[600px] min-w-[280px]"
      style={{
        backgroundColor: isOver ? '#FFE5D9' : columnColor,
        border: '1px solid #D8E2DC',
        transition: 'background-color 0.2s ease',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px]" style={{ color: '#6D6875' }}>
          <strong>{status.status}</strong>
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

// ==========================================
// COMPONENTE PRINCIPAL KANBAN
// ==========================================
export default function Kanban() {
  const [orders, setOrders] = useState<PedidoResponse[]>([]);
  const [statusTypes, setStatusTypes] = useState<StatusPedidoResponse[]>([]);
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null); // any temporário até arrumarmos o modal
  
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isStatusTypeModalOpen, setIsStatusTypeModalOpen] = useState(false);
  const [isStatusTypeListOpen, setIsStatusTypeListOpen] = useState(false);
  
  const [editingStatusType, setEditingStatusType] = useState<StatusPedidoResponse | null>(null);
  const [deleteStatusType, setDeleteStatusType] = useState<StatusPedidoResponse | null>(null);

  const navigate = useNavigate();

  // 1. CARREGAR DADOS INICIAIS DA API
  useEffect(() => {
    const fetchKanbanData = async () => {
      try {
        const [statusData, pedidosData] = await Promise.all([
          statusPedidoService.listarTodos(),
          pedidoService.listarTodos()
        ]);

        // Ordenar as colunas pela ordem do Kanban definida no banco
        const statusOrdenados = statusData.sort((a: any, b: any) => a.ordemKanban - b.ordemKanban);
        
        setStatusTypes(statusOrdenados);
        setOrders(pedidosData);
      } catch (error) {
        console.error("Erro ao carregar dados do Kanban:", error);
      }
    };

    fetchKanbanData();
  }, []);

  const handleOnClickInSeeDetails = (orderId: number) => {
    navigate(`/pedidos/detalhes/${orderId}`);
  }

  // 2. LÓGICA DE DRAG & DROP REAL
  const handleOrderDrop = async (orderId: number, newStatusId: number) => {
    try {
      // Chamada à API para atualizar o status do pedido
      await pedidoService.mudarStatus(orderId, newStatusId);

      // Atualizar o estado local para o cartão mover instantaneamente na tela
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
          const newStatusObj = statusTypes.find(s => s.id === newStatusId);
          if (newStatusObj) {
            return {
              ...order,
              statusAtual: {
                ...order.statusAtual,
                status: newStatusObj
              }
            };
          }
        }
        return order;
      }));
    } catch (error) {
      console.error("Erro ao mover pedido:", error);
      alert("Ocorreu um erro ao mover o pedido.");
    }
  };

  const handleOrderClick = (order: PedidoResponse) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  // 3. GERENCIAR STATUS (COLUNAS)
  const handleAddStatusType = async (statusType: any) => {
    try {
      const novoStatus = await statusPedidoService.criar(statusType.name); // Ajuste conforme seu backend pede a cor/nome
      setStatusTypes([...statusTypes, novoStatus]);
      setIsStatusTypeModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar status", error);
    }
  };

  const handleEditStatusType = async (statusType: any) => {
    try {
      const statusAtualizado = await statusPedidoService.atualizar(statusType.id, statusType.name);
      setStatusTypes(statusTypes.map(st => st.id === statusAtualizado.id ? statusAtualizado : st));
      setIsStatusTypeModalOpen(false);
      setEditingStatusType(null);
    } catch (error) {
       console.error("Erro ao atualizar status", error);
    }
  };

  const handleDeleteStatusType = async () => {
    if (deleteStatusType) {
      try {
        await statusPedidoService.desativar(deleteStatusType.id);
        setStatusTypes(statusTypes.filter(st => st.id !== deleteStatusType.id));
        setDeleteStatusType(null);
      } catch (error) {
        console.error("Erro ao deletar status", error);
      }
    }
  };

  const openEditStatusTypeModal = (statusType: any) => {
    setEditingStatusType(statusType);
    setIsStatusTypeModalOpen(true);
    setIsStatusTypeListOpen(false);
  };

  // Filtrar pedidos por status (Lembrando que o DTO tem statusAtual -> status -> id)
  const getOrdersByStatus = (statusId: number) => {
    return orders.filter(order => order.statusAtual?.status?.id === statusId);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="max-w-[1920px] mx-auto px-8 py-8">
          {/* Cabeçalho */}
          <div className="mb-10">
            <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Pedidos</h1>
            <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie seus pedidos de forma visual e organizada</p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 mb-8">
            <Button 
              onClick={() => navigate("/pedidos/cadastro")}
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
          <div className="flex gap-6 overflow-x-auto pb-4">
            {statusTypes.map(status => (
              <KanbanColumn
                key={status.id}
                status={status}
                orders={getOrdersByStatus(status.id)}
                onDrop={handleOrderDrop}
                onOrderClick={handleOrderClick}
              />
            ))}
            
            {statusTypes.length === 0 && (
               <div className="w-full text-center py-10" style={{ color: '#9D8189' }}>
                 Nenhum status cadastrado. Crie um "Novo Status" para montar o seu Kanban!
               </div>
            )}
          </div>
        </div>

        {/* Modals - Temporariamente com "any" no selectedOrder até os adaptarmos ao novo modelo no próximo passo */}
        {selectedOrder && (
          <OrderDetailModal
            isOpen={isOrderDetailOpen}
            onClose={() => {
              setIsOrderDetailOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            statusTypes={statusTypes as any}
            onUpdateStatus={(orderId: any, newStatusId: any) => handleOrderDrop(orderId, newStatusId)}
            onClickInSeeDetails={handleOnClickInSeeDetails}
          />
        )}

        <StatusTypeModal
          isOpen={isStatusTypeModalOpen}
          onClose={() => {
            setIsStatusTypeModalOpen(false);
            setEditingStatusType(null);
          }}
          onSave={editingStatusType ? handleEditStatusType : handleAddStatusType}
          statusType={editingStatusType} // Removido o as any
        />

        <StatusTypeListModal
          isOpen={isStatusTypeListOpen}
          onClose={() => setIsStatusTypeListOpen(false)}
          statusTypes={statusTypes} // Removido o as any
          onEdit={openEditStatusTypeModal}
          onDelete={(statusType) => setDeleteStatusType(statusType)}
        />

        <DeleteStatusTypeDialog
          isOpen={!!deleteStatusType}
          onClose={() => setDeleteStatusType(null)}
          onConfirm={handleDeleteStatusType}
          statusTypeName={deleteStatusType?.status || ''}
        />
      </div>
    </DndProvider>
  );
}