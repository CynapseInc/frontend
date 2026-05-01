import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Settings, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from '../ui/FeedbackModal';
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

  const dataLimiteFormatada = order.dataLimite 
    ? new Date(order.dataLimite).toLocaleDateString('pt-BR') 
    : 'Sem data';

  return (
    <div
      ref={drag as any}
      onClick={() => onClick(order)}
      className="p-4 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md shrink-0"
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

interface KanbanColumnProps {
  status: StatusPedidoResponse;
  index: number;
  orders: PedidoResponse[];
  onDropOrder: (orderId: number, newStatusId: number) => void;
  onOrderClick: (order: PedidoResponse) => void;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  saveColumnOrder: () => void;
}

function KanbanColumn({ status, index, orders, onDropOrder, onOrderClick, moveColumn, saveColumnOrder }: KanbanColumnProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDraggingColumn }, dragColumn, previewColumn] = useDrag({
    type: 'COLUMN',
    item: { index, id: status.id },
    collect: (monitor) => ({
      isDraggingColumn: monitor.isDragging(),
    }),
    end: () => {
      saveColumnOrder(); 
    }
  });

  const [, dropColumn] = useDrop({
    accept: 'COLUMN',
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverWidth = hoverBoundingRect.right - hoverBoundingRect.left;
      
      const triggerRight = hoverWidth * 0.15; 
      const triggerLeft = hoverWidth * 0.15;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < triggerRight) return;
      
      if (dragIndex > hoverIndex && hoverClientX > triggerLeft) return;

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isOverOrder }, dropOrder] = useDrop(() => ({
    accept: 'ORDER',
    drop: (item: { orderId: number }) => {
      onDropOrder(item.orderId, status.id);
    },
    collect: (monitor) => ({
      isOverOrder: monitor.isOver(),
    }),
  }), [onDropOrder, status.id]); 

  const columnColor = status.cor || '#F9F9F9';

  dropOrder(dropColumn(previewColumn(ref)));

  return (
    <div
      ref={ref as any}
      className="flex flex-col shrink-0 rounded-lg p-4"
      style={{
        width: '325px', 
        height: 'calc(100vh - 300px)', 
        minHeight: '300px', 
        opacity: isDraggingColumn ? 0.4 : 1, 
        backgroundColor: isOverOrder ? '#FFE5D9' : columnColor,
        border: '1px solid #D8E2DC',
        transition: 'background-color 0.2s ease',
      }}
    >
      <div className="flex items-center justify-between mb-4 shrink-0 group">
        <div className="flex items-center gap-2">
          <div 
            ref={dragColumn as any} 
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-black/10 rounded transition-colors flex items-center justify-center"
            title="Arraste para reordenar"
          >
             <GripVertical className="size-6" style={{ color: '#9D8189' }} />
          </div>
          <h2 className="text-[20px]" style={{ color: '#6D6875' }}>
            <strong>{status.status}</strong>
          </h2>
        </div>
        <span
          className="size-7 rounded-full flex items-center justify-center text-[14px]"
          style={{ backgroundColor: '#F4ACB7', color: 'white' }}
        >
          {orders.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-2 custom-scrollbar min-h-0">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onClick={onOrderClick} />
        ))}
      </div>
    </div>
  );
}

export default function Kanban() {
  const [orders, setOrders] = useState<PedidoResponse[]>([]);
  const [statusTypes, setStatusTypes] = useState<StatusPedidoResponse[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isStatusTypeModalOpen, setIsStatusTypeModalOpen] = useState(false);
  const [isStatusTypeListOpen, setIsStatusTypeListOpen] = useState(false);
  
  const [editingStatusType, setEditingStatusType] = useState<StatusPedidoResponse | null>(null);
  const [deleteStatusType, setDeleteStatusType] = useState<StatusPedidoResponse | null>(null);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ isOpen: true, message, type });
  };

  useEffect(() => {
    const fetchKanbanData = async () => {
      try {
        const hoje = new Date();
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(hoje.getDate() - 30);

        const dataFim = hoje.toISOString().split('T')[0];
        const dataInicio = trintaDiasAtras.toISOString().split('T')[0];

        const [statusData, pedidosData] = await Promise.all([
          statusPedidoService.listarTodos(),
          pedidoService.listarTodos(0, 500, true, '', dataInicio, dataFim)
        ]);

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

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setStatusTypes((prevStatusTypes) => {
      const newStatuses = [...prevStatusTypes];
      const draggedStatus = newStatuses[dragIndex];
      newStatuses.splice(dragIndex, 1);
      newStatuses.splice(hoverIndex, 0, draggedStatus);
      return newStatuses;
    });
  }, []);

  const saveColumnOrder = useCallback(() => {
    setStatusTypes((currentStatuses) => {
      const payload = currentStatuses.map((st, idx) => ({
        id: st.id,
        novaOrdemKanban: idx + 1
      }));
      
      statusPedidoService.reordenarKanban(payload).catch(err => {
        showFeedback("Erro ao salvar a ordem do Kanban.", "error");
        console.error(err);
      });

      return currentStatuses.map((st, idx) => ({ ...st, ordemKanban: idx + 1 }));
    });
  }, []);

  const handleOrderDrop = async (orderId: number, newStatusId: number) => {
    try {
      await pedidoService.mudarStatus(orderId, newStatusId);

      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            statusAtual: {
              ...order.statusAtual,
              idStatusPedido: newStatusId 
            }
          };
        }
        return order;
      }));
    } catch (error) {
      console.error("Erro ao mover pedido:", error);
      showFeedback("Não foi possível mover o pedido. Tente novamente.", "error");
    }
  };

  const handleOrderClick = (order: PedidoResponse) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  const handleAddStatusType = async (statusType: any) => {
    try {
      const novaOrdem = statusTypes.length > 0 
        ? Math.max(...statusTypes.map(st => st.ordemKanban || 0)) + 1 
        : 1;

      const novoStatus = await statusPedidoService.criar(statusType.name, statusType.color, novaOrdem); 
      
      setStatusTypes([...statusTypes, novoStatus]);
      setIsStatusTypeModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Erro ao criar status.';
      showFeedback(errorMessage, 'error');
      console.error("Erro ao criar status", error);
    }
  };

  const handleEditStatusType = async (statusType: any) => {
    try {
      const statusAtualizado = await statusPedidoService.atualizar(statusType.id, statusType.name, statusType.color);
      setStatusTypes(statusTypes.map(st => st.id === statusAtualizado.id ? statusAtualizado : st));
      setIsStatusTypeModalOpen(false);
      setEditingStatusType(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Erro ao atualizar status.';
      showFeedback(errorMessage, 'error');
      console.error("Erro ao atualizar status", error);
    }
  };

  const handleDeleteStatusType = async () => {
    if (deleteStatusType) {
      try {
        await statusPedidoService.desativar(deleteStatusType.id);
        setStatusTypes(statusTypes.filter(st => st.id !== deleteStatusType.id));
        setDeleteStatusType(null);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Erro ao deletar status.';
        showFeedback(errorMessage, 'error');
        console.error("Erro ao deletar status", error);
      }
    }
  };

  const openEditStatusTypeModal = (statusType: any) => {
    setEditingStatusType(statusType);
    setIsStatusTypeModalOpen(true);
    setIsStatusTypeListOpen(false);
  };

  const getOrdersByStatus = (statusId: number) => {
    return orders.filter(order => order.statusAtual?.idStatusPedido === statusId);
  };

  // SCROLL SUAVE E SENSÍVEL
  const handleDragOverContainer = (e: React.DragEvent) => {
    e.preventDefault(); 
    const container = scrollContainerRef.current;
    if (!container) return;

    const threshold = 300; 
    const { left, right } = container.getBoundingClientRect();
    const { clientX } = e;

    if (clientX < left + threshold) {
      const distance = (left + threshold) - clientX;
      // Usando scrollBy nativo para um movimento muito mais cadenciado
      container.scrollBy({ left: -(distance * 0.08), behavior: 'auto' });
    } else if (clientX > right - threshold) {
      const distance = clientX - (right - threshold);
      container.scrollBy({ left: distance * 0.08, behavior: 'auto' });
    }
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-[calc(100vh-80px)] flex flex-col" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="w-full max-w-[1600px] mx-auto px-8 py-10 box-border flex flex-col h-full overflow-hidden">
          
          <div className="mb-6 shrink-0">
            <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Pedidos</h1>
            <p className="text-[17px]" style={{ color: '#9D8189' }}>
              Visão rápida dos pedidos nos últimos 30 dias
            </p>
          </div>

          <div className="flex gap-3 mb-8 shrink-0">
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

          <div 
            ref={scrollContainerRef}
            onDragOver={handleDragOverContainer}
            className="flex flex-nowrap gap-6 overflow-x-auto pb-4 items-start custom-scrollbar w-full flex-1 min-h-0"
          >
            {statusTypes.map((status, index) => (
              <KanbanColumn
                key={status.id}
                status={status}
                index={index}
                orders={getOrdersByStatus(status.id)}
                onDropOrder={handleOrderDrop}
                onOrderClick={handleOrderClick}
                moveColumn={moveColumn}
                saveColumnOrder={saveColumnOrder}
              />
            ))}
            
            {statusTypes.length === 0 && (
               <div className="w-full text-center py-10" style={{ color: '#9D8189' }}>
                 Nenhum status cadastrado. Crie um "Novo Status" para montar o seu Kanban!
               </div>
            )}
          </div>
        </div>

        {/* Modais */}
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
          statusType={editingStatusType}
        />
        <StatusTypeListModal
          isOpen={isStatusTypeListOpen}
          onClose={() => setIsStatusTypeListOpen(false)}
          statusTypes={statusTypes}
          onEdit={openEditStatusTypeModal}
          onDelete={(statusType) => {
            const pedidosNoStatus = getOrdersByStatus(statusType.id);
              if (pedidosNoStatus.length > 0) {
                showFeedback("Não é possível excluir um status que contém pedidos. Mova os pedidos primeiro.", "error");
              } else {
                setDeleteStatusType(statusType);
            }
        }}
        />
        <DeleteStatusTypeDialog
          isOpen={!!deleteStatusType}
          onClose={() => setDeleteStatusType(null)}
          onConfirm={handleDeleteStatusType}
          statusTypeName={deleteStatusType?.status || ''}
        />
        <FeedbackModal
          isOpen={feedback.isOpen}
          onClose={() => setFeedback({ ...feedback, isOpen: false })}
          message={feedback.message}
          type={feedback.type}
        />
      </div>
    </DndProvider>
  );
}