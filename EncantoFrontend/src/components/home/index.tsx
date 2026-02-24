import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Package, Calendar, Eye, Send, Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import './index.css';
// import styles from '../../styles/index.css'

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

const mockOrders: Order[] = [
  { id: 'PED-001', clientName: 'Maria Silva', products: ['Caneca Ben 10', 'Caderno Frozen'], quantity: 3, deliveryDate: '2025-11-18', status: 'Para Enviar', category: 'Herói', theme: 'Ben 10' },
  { id: 'PED-002', clientName: 'João Santos', products: ['Mochila Spider-Man'], quantity: 2, deliveryDate: '2025-11-18', status: 'Para Enviar', category: 'Herói', theme: 'Spider-Man' },
  { id: 'PED-003', clientName: 'Ana Costa', products: ['Almofada Frozen'], quantity: 5, deliveryDate: '2025-11-20', status: 'Para Enviar', category: 'Princesa', theme: 'Frozen' },
  { id: 'PED-004', clientName: 'Pedro Lima', products: ['Caneca Corinthians'], quantity: 1, deliveryDate: '2025-11-22', status: 'Para Enviar', category: 'Time', theme: 'Corinthians' },
  { id: 'PED-005', clientName: 'Carla Souza', products: ['Caderno Naruto'], quantity: 4, deliveryDate: '2025-11-25', status: 'Para Enviar', category: 'Nerd', theme: 'Naruto' },
  { id: 'PED-006', clientName: 'Lucas Oliveira', products: ['Mochila Batman'], quantity: 2, deliveryDate: '2025-11-10', status: 'Para Enviar', category: 'Herói', theme: 'Batman' },
  { id: 'PED-007', clientName: 'Juliana Matos', products: ['Caneca Harry Potter'], quantity: 3, deliveryDate: '2025-12-05', status: 'Para Enviar', category: 'Nerd', theme: 'Harry Potter' },
  { id: 'PED-008', clientName: 'Roberto Dias', products: ['Almofada Elsa'], quantity: 2, deliveryDate: '2025-12-15', status: 'Para Enviar', category: 'Princesa', theme: 'Frozen' },
];

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export  function HomeCalendar() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(10); // Novembro (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemFilter, setItemFilter] = useState('');

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getOrdersForDate = (date: string) => {
    return mockOrders.filter(order => order.deliveryDate === date);
  };

  const getOrdersForMonth = (year: number, month: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    return mockOrders.filter(order => 
      order.deliveryDate.startsWith(`${year}-${monthStr}`)
    ).length;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const ordersForDay = getOrdersForDate(dateStr);
      const hasOrders = ordersForDay.length > 0;
      const isToday = dateStr === '2025-11-15'; // Mock today

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
            hasOrders ? 'cursor-pointer hover:shadow-lg' : ''
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
                className="size-6 rounded-full flex items-center justify-center text-[11px] text-white"
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
    alert(`Pedido ${orderId} marcado como enviado!`);
  };

  const handleViewDetails = (orderId: string) => {
    alert(`Navegando para detalhes do pedido ${orderId}`);
  };

  const filteredOrders = mockOrders.filter(order => {
    if (!itemFilter) return true;
    const searchTerm = itemFilter.toLowerCase();
    return (
      order.products.some(p => p.toLowerCase().includes(searchTerm)) ||
      order.category.toLowerCase().includes(searchTerm) ||
      order.theme.toLowerCase().includes(searchTerm)
    );
  });

  const sortedPendingOrders = [...filteredOrders].sort((a, b) => {
    return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
  });

  const getDaysUntilDelivery = (date: string) => {
    const today = new Date('2025-11-15');
    const deliveryDate = new Date(date);
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeliveryDate = (date: string) => {
    const daysUntil = getDaysUntilDelivery(date);
    const formattedDate = new Date(date).toLocaleDateString('pt-BR');
    
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Navbar */}
      {/* <header className="bg-white border-b shadow-sm" style={{ borderColor: '#D8E2DC' }}>
        <div className="max-w-[1600px] mx-auto px-8 py-5">
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
              <a href="#" className="text-[16px]" style={{ color: '#F4ACB7' }}>Home</a>
              <a href="#" className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Pedidos</a>
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

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        
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
                    {getOrdersForMonth(currentYear, currentMonth)} pedidos este mês
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
                <strong>Pendências</strong>
              </h2>

              {/* Filtro de Itens */}
              <div className="mb-4">
                <label className="block text-[13px] mb-2" style={{ color: '#6D6875' }}>
                  <strong>Filtrar por Item</strong>
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
                          <strong>Enviado</strong>
                        </button>
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="h-8 px-3 rounded-md text-[13px] flex items-center justify-center transition-all hover:opacity-90"
                          style={{
                            backgroundColor: 'white',
                            color: '#6D6875',
                            border: '1px solid #D8E2DC'
                          }}
                        >
                          <Eye className="size-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {sortedPendingOrders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[14px]" style={{ color: '#9D8189' }}>
                      Nenhum pedido encontrado
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal - Pedidos do Dia */}
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
            {/* Header */}
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
                        className="px-3 py-1 rounded-full text-[13px]"
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
                        <span>{new Date(order.deliveryDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMarkAsSent(order.id)}
                        className="flex-1 h-10 gap-2 text-[14px]"
                        style={{
                          backgroundColor: '#F4ACB7',
                          color: 'white'
                        }}
                      >
                        <Send className="size-4" />
                        <strong>Marcar como Enviado</strong>
                      </Button>
                      <Button
                        onClick={() => handleViewDetails(order.id)}
                        className="h-10 px-4 gap-2 text-[14px]"
                        style={{
                          backgroundColor: 'white',
                          color: '#6D6875',
                          border: '1px solid #D8E2DC'
                        }}
                      >
                        <Eye className="size-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div 
              className="flex justify-end p-6 border-t"
              style={{ borderColor: '#D8E2DC' }}
            >
              <Button
                onClick={() => setIsModalOpen(false)}
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
      )}

      {/* Botão Flutuante - Adicionar Pedido */}
      <button
        onClick={() => alert('Navegando para o Kanban de Pedidos')}
        className="fixed bottom-8 right-8 size-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40"
        style={{ backgroundColor: '#F4ACB7' }}
      >
        <Plus className="size-8" style={{ color: 'white' }} />
      </button>
    </div>
  );
}
