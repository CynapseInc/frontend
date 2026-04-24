import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Package, Calendar, Eye, Send, Search, X, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from '../ui/FeedbackModal';
import ConfirmModal from '../ui/ConfirmModal';
// Serviços
import { pedidoService } from '../../services/PedidoService';
import { produtoService } from '../../services/ProdutoService';
import { statusPedidoService } from '../../services/StatusPedidoService';

import './index.css';

interface Order {
  id: string;
  clientName: string;
  products: string[];
  quantity: number;
  deliveryDate: string;
  status: string;
  category: string;
  theme: string;
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function HomeCalendar() {
  const navigate = useNavigate();
  
  // Data real de hoje
  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  const [currentYear, setCurrentYear] = useState(todayObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayObj.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemFilter, setItemFilter] = useState('');
  
  // Estado para guardar os pedidos reais da API
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para os Modais de Feedback e Confirmação
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  // Estado para guardar qual pedido está sendo excluído no ConfirmModal
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ isOpen: true, message, type });
  };

  // ==========================================
  // BUSCAR DADOS INICIAIS DA API
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [pedidosData, produtosResponse, statusData] = await Promise.all([
          pedidoService.listarTodos(0, 500), // Busca até 500 pedidos
          produtoService.listarTodos(0, 500), // Busca até 500 produtos
          statusPedidoService.listarTodos()
        ]);

        // CORREÇÃO AQUI: Extrair o array .content caso a API retorne um objeto paginado
        const produtosData = Array.isArray(produtosResponse) 
          ? produtosResponse 
          : (produtosResponse?.content || []);

        const mappedOrders: Order[] = pedidosData.map((p: any) => {
          // Agora o produtosData.find() vai funcionar perfeitamente!
          const nomesProdutos = p.produtos?.map((prod: any) => {
            const catalogoProd = produtosData.find((cat: any) => cat.id === prod.idProduto);
            return catalogoProd ? catalogoProd.titulo : `Produto #${prod.idProduto}`;
          }) || [];

          // 2. Pegar a categoria e tema baseados no primeiro produto (ou definir como Diversos)
          const primeiroProdCatalogo = p.produtos && p.produtos.length > 0 
            ? produtosData.find((cat: any) => cat.id === p.produtos[0].idProduto) 
            : null;
            
          const category = primeiroProdCatalogo?.tema?.categoriaTema?.titulo || 'Diversos';
          const theme = primeiroProdCatalogo?.tema?.descricao || 'Diversos';

          // 3. Cruzar o ID do status com a lista de status
          const statusObj = statusData.find((s: any) => s.id === p.statusAtual?.idStatusPedido);
          const statusName = statusObj ? statusObj.status : 'Desconhecido';

          // 4. Formatar a data limite (vem como YYYY-MM-DDTHH:mm:ss)
          const dataLimiteDate = p.dataLimite ? p.dataLimite.split('T')[0] : '';

          // 5. Somar quantidade total de itens no pedido
          const totalQty = p.produtos?.reduce((acc: number, curr: any) => acc + curr.quantidade, 0) || 0;

          return {
            id: p.id.toString(),
            clientName: p.cliente?.nome || 'Cliente não informado',
            products: nomesProdutos,
            quantity: totalQty,
            deliveryDate: dataLimiteDate,
            status: statusName,
            category: category,
            theme: theme
          };
        });

        // Filtrar apenas pedidos que têm data de entrega definida
        setOrders(mappedOrders.filter(o => o.deliveryDate !== ''));

      } catch (error) {
        console.error("Erro ao carregar dados do calendário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getOrdersForDate = (date: string) => {
    return orders.filter(order => order.deliveryDate === date);
  };

  const getOrdersForMonth = (year: number, month: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    return orders.filter(order => 
      order.deliveryDate.startsWith(`${year}-${monthStr}`)
    ).length;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Células vazias antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const ordersForDay = getOrdersForDate(dateStr);
      const hasOrders = ordersForDay.length > 0;
      const isToday = dateStr === todayStr;

      days.push(
        <button
          key={day}
          onClick={() => {
            if (hasOrders) {
              setSelectedDate(dateStr);
              setIsModalOpen(true);
            }
          }}
          className={`aspect-square rounded-lg transition-all relative ${
            hasOrders ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''
          }`}
          style={{
            backgroundColor: hasOrders ? '#FFE5D9' : 'white',
            border: isToday ? '2px solid #F4ACB7' : '1px solid #D8E2DC',
            opacity: hasOrders ? 1 : 0.6,
          }}
        >
          <div className="flex flex-col items-center justify-center h-full p-2">
            <span 
              className="text-[16px] mb-1"
              style={{ 
                color: isToday ? '#F4ACB7' : '#6D6875',
                fontWeight: hasOrders || isToday ? 'bold' : 'normal'
              }}
            >
              {day}
            </span>
            {hasOrders && (
              <div 
                className="size-6 rounded-full flex items-center justify-center text-[11px] text-white shadow-sm"
                style={{ backgroundColor: '#F4ACB7' }}
              >
                <strong>{ordersForDay.length}</strong>
              </div>
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  const handleMarkAsSent = (orderId: string) => {
    showFeedback(`O pedido PED-${orderId.padStart(3, '0')} deve ser movido no Kanban!`, 'success');
    setTimeout(() => {
      navigate('/kanban');
    }, 1500);
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/pedidos/detalhes/${orderId}`);
  };

  // Função que apenas abre o modal e guarda o ID
  const handleDeleteOrderClick = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  // Função que de fato exclui quando o usuário clica em "Sim" no modal
  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await pedidoService.mudarEstado(orderToDelete);
      setOrders(orders.filter(order => order.id !== orderToDelete));
      showFeedback('Pedido arquivado com sucesso!', 'success');
      
      if (selectedOrders.length <= 1) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erro ao arquivar pedido:", error);
      showFeedback('Ocorreu um erro ao tentar arquivar o pedido. Tente novamente.', 'error');
    } finally {
      setOrderToDelete(null); // Limpa o estado depois que termina
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!itemFilter) return true;
    const searchTerm = itemFilter.toLowerCase();
    return (
      order.products.some(p => p.toLowerCase().includes(searchTerm)) ||
      order.category.toLowerCase().includes(searchTerm) ||
      order.theme.toLowerCase().includes(searchTerm) ||
      order.clientName.toLowerCase().includes(searchTerm)
    );
  });

  const sortedPendingOrders = [...filteredOrders].sort((a, b) => {
    return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
  });

  const getDaysUntilDelivery = (date: string) => {
    const today = new Date(todayStr);
    const deliveryDate = new Date(date);
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeliveryDate = (date: string) => {
    const daysUntil = getDaysUntilDelivery(date);
    // Adiciona "T00:00:00" para evitar problemas de fuso horário no JS
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
    
    if (daysUntil < 0) {
      return { text: `Atrasado há ${Math.abs(daysUntil)} dias`, color: '#F44336', bg: '#FFEBEE' };
    } else if (daysUntil === 0) {
      return { text: 'Entrega hoje', color: '#FF9800', bg: '#FFF3E0' };
    } else if (daysUntil === 1) {
      return { text: 'Entrega amanhã', color: '#FF9800', bg: '#FFF3E0' };
    } else if (daysUntil <= 3) {
      return { text: `${formattedDate} (${daysUntil} dias)`, color: '#FF9800', bg: '#FFF3E0' };
    } else {
      return { text: formattedDate, color: '#9D8189', bg: '#F9F9F9' };
    }
  };

  const selectedOrders = selectedDate ? getOrdersForDate(selectedDate) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFCAD4] border-t-[#F4ACB7] rounded-full animate-spin mb-4"></div>
        <p className="text-[#9D8189]">A carregar a sua agenda de envios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="w-full max-w-[1600px] mx-auto px-8 py-10 box-border">
        
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Envios</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>
            Gerencie entregas e acompanhe pedidos por data
          </p>
        </div>

        <div className="grid grid-cols-[280px_1fr_320px] gap-6">
          
          {/* COLUNA ESQUERDA - Seletor de Ano e Meses */}
          <div className="space-y-5">
            
            {/* Seletor de Ano */}
            <div className="bg-white rounded-lg p-5 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setCurrentYear(currentYear - 1)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="size-5" style={{ color: '#9D8189' }} />
                </button>
                <span className="text-[28px]" style={{ color: '#F4ACB7' }}>
                  <strong>{currentYear}</strong>
                </span>
                <button
                  onClick={() => setCurrentYear(currentYear + 1)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="size-5" style={{ color: '#9D8189' }} />
                </button>
              </div>
            </div>

            {/* Lista de Meses */}
            <div className="bg-white rounded-lg p-4 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
              <h3 className="text-[16px] mb-3 px-2" style={{ color: '#6D6875' }}>
                <strong>Meses</strong>
              </h3>
              <div className="space-y-1">
                {monthNames.map((month, index) => {
                  const ordersCount = getOrdersForMonth(currentYear, index);
                  const isSelected = index === currentMonth;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentMonth(index)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md transition-all"
                      style={{
                        backgroundColor: isSelected ? '#FFE5D9' : 'transparent',
                        border: isSelected ? '1px solid #F4ACB7' : '1px solid transparent',
                      }}
                    >
                      <span 
                        className="text-[15px]"
                        style={{ 
                          color: isSelected ? '#F4ACB7' : '#6D6875',
                          fontWeight: isSelected ? 'bold' : 'normal'
                        }}
                      >
                        {month}
                      </span>
                      {ordersCount > 0 && (
                        <span 
                          className="size-6 rounded-full flex items-center justify-center text-[12px] text-white"
                          style={{ backgroundColor: isSelected ? '#F4ACB7' : '#FFCAD4' }}
                        >
                          <strong>{ordersCount}</strong>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUNA CENTRAL - Calendário */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}>
                  <strong>{monthNames[currentMonth]} {currentYear}</strong>
                </h2>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5" style={{ color: '#F4ACB7' }} />
                  <span className="text-[15px]" style={{ color: '#9D8189' }}>
                    {getOrdersForMonth(currentYear, currentMonth)} pedidos com entrega neste mês
                  </span>
                </div>
              </div>

              {/* Grid do Calendário */}
              <div className="mb-3">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {daysOfWeek.map(day => (
                    <div 
                      key={day}
                      className="text-center text-[14px] py-2"
                      style={{ color: '#9D8189' }}
                    >
                      <strong>{day}</strong>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendar()}
                </div>
              </div>

              {/* Legenda */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4" style={{ borderTop: '1px solid #D8E2DC' }}>
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded" style={{ backgroundColor: '#FFE5D9', border: '1px solid #D8E2DC' }} />
                  <span className="text-[13px]" style={{ color: '#9D8189' }}>Com pedidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded" style={{ backgroundColor: 'white', border: '2px solid #F4ACB7' }} />
                  <span className="text-[13px]" style={{ color: '#9D8189' }}>Hoje</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA - Pendências */}
          <div>
            <div className="bg-white rounded-lg p-5 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
              <h2 className="text-[22px] mb-4" style={{ color: '#F4ACB7' }}>
                <strong>Próximas Entregas</strong>
              </h2>

              {/* Filtro de Itens */}
              <div className="mb-4">
                <label className="block text-[13px] mb-2" style={{ color: '#6D6875' }}>
                  <strong>Buscar por Cliente ou Produto</strong>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4" style={{ color: '#9D8189' }} />
                  <input
                    type="text"
                    value={itemFilter}
                    onChange={(e) => setItemFilter(e.target.value)}
                    placeholder="Digite para filtrar..."
                    className="w-full h-10 pl-10 pr-4 rounded-md text-[14px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                    style={{
                      backgroundColor: 'white',
                      borderColor: '#D8E2DC',
                      color: '#6D6875'
                    }}
                  />
                </div>
              </div>

              {/* Lista de Pendências */}
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {sortedPendingOrders.map(order => {
                  const dateInfo = formatDeliveryDate(order.deliveryDate);
                  
                  return (
                    <div
                      key={order.id}
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: dateInfo.bg,
                        border: `1px solid ${dateInfo.color === '#F44336' ? '#F44336' : '#D8E2DC'}`
                      }}
                    >
                      <div className="mb-2">
                        <p className="text-[15px] mb-1" style={{ color: '#6D6875' }}>
                          <strong>{order.clientName}</strong>
                        </p>
                        <p className="text-[13px]" style={{ color: '#9D8189' }}>
                          {order.products.join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Package className="size-4" style={{ color: '#F4ACB7' }} />
                        <span className="text-[13px]" style={{ color: '#9D8189' }}>
                          {order.quantity} {order.quantity === 1 ? 'unidade' : 'unidades'}
                        </span>
                        <span className="text-[13px]" style={{ color: '#9D8189' }}>
                          • {order.category}
                        </span>
                      </div>

                      <div 
                        className="px-2 py-1 rounded mb-3 inline-block"
                        style={{ backgroundColor: dateInfo.color === '#F44336' ? '#FFCDD2' : dateInfo.color === '#FF9800' ? '#FFE0B2' : '#E0E0E0' }}
                      >
                        <p className="text-[12px]" style={{ color: dateInfo.color }}>
                          <strong>{dateInfo.text}</strong>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMarkAsSent(order.id)}
                          className="flex-1 h-8 px-3 rounded-md text-[13px] flex items-center justify-center gap-2 transition-all hover:opacity-90"
                          style={{
                            backgroundColor: '#F4ACB7',
                            color: 'white'
                          }}
                        >
                          <Send className="size-3" />
                          <strong>Atualizar no Kanban</strong>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {sortedPendingOrders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[14px]" style={{ color: '#9D8189' }}>
                      Nenhum pedido encontrado.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10"
              style={{ borderColor: '#D8E2DC' }}
            >
              <div>
                <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}>
                  <strong>Pedidos do Dia</strong>
                </h2>
                <p className="text-[14px] mt-1" style={{ color: '#9D8189' }}>
                  {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="size-6" style={{ color: '#9D8189' }} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {selectedOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: '#F9F9F9', border: '1px solid #D8E2DC' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-[17px] mb-1" style={{ color: '#6D6875' }}>
                          <strong>{order.clientName}</strong>
                        </p>
                        <p className="text-[14px]" style={{ color: '#9D8189' }}>
                          {order.products.join(', ')}
                        </p>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-full text-[13px] text-center"
                        style={{ backgroundColor: '#FFE5D9', color: '#F4ACB7' }}
                      >
                        <strong>{order.status}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-[14px]" style={{ color: '#9D8189' }}>
                      <div className="flex items-center gap-2">
                        <Package className="size-4" style={{ color: '#F4ACB7' }} />
                        <span>{order.quantity} {order.quantity === 1 ? 'unidade' : 'unidades'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" style={{ color: '#F4ACB7' }} />
                        <span>{new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMarkAsSent(order.id)}
                        className="flex-1 h-10 gap-2 text-[14px]"
                        style={{ backgroundColor: '#F4ACB7', color: 'white' }}
                      >
                        <Send className="size-4" />
                        <strong>Mover no Kanban</strong>
                      </Button>
                      <Button
                        onClick={() => handleViewDetails(order.id)}
                        className="h-10 px-4 gap-2 text-[14px]"
                        style={{ backgroundColor: 'white', color: '#6D6875', border: '1px solid #D8E2DC' }}
                      >
                        <Eye className="size-4" />
                        Detalhes do Pedido
                      </Button>
                      <button
                        onClick={() => handleDeleteOrderClick(order.id)}
                        className="h-10 px-4 rounded-md flex items-center justify-center transition-all hover:bg-red-50 group"
                        style={{ backgroundColor: 'white', border: '1px solid #ffcdd2' }}
                        title="Arquivar/Excluir Pedido"
                      >
                        <Trash2 className="size-5 text-red-400 group-hover:text-red-600 transition-colors" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="flex justify-end p-6 border-t"
              style={{ borderColor: '#D8E2DC' }}
            >
              <Button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 h-11 text-[15px]"
                style={{ backgroundColor: '#F4ACB7', color: 'white' }}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/pedidos/cadastro')}
        className="fixed bottom-8 right-8 size-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40"
        style={{ backgroundColor: '#F4ACB7' }}
        title="Cadastrar Novo Pedido"
      >
        <Plus className="size-8" style={{ color: 'white' }} />
      </button>

      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        message={feedback.message}
        type={feedback.type}
      />

      {/* Modal de Confirmação para Exclusão */}
      <ConfirmModal
        isOpen={orderToDelete !== null}
        onClose={() => setOrderToDelete(null)}
        onConfirm={confirmDeleteOrder}
        title="Arquivar Pedido"
        message="Tem certeza que deseja arquivar/excluir este pedido? Ele sairá do calendário e do Kanban."
        confirmText="Sim, arquivar"
      />
    </div>
  );
}