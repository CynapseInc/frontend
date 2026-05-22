import { useEffect, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import FeedbackModal from '../ui/FeedbackModal';
import OrderDetailModal from '../kanbanPedidos/modals/OrderDetailModal';
import { pedidoService } from '../../services/PedidoService';
import { statusPedidoService } from '../../services/StatusPedidoService';
import type { PedidoPageResponse, PedidoResponse, StatusPedidoResponse } from '../../interfaces/Pedido';

const ITEMS_PER_PAGE = 8;
const DATA_INICIO_HISTORICO = '2000-01-01';
const DATA_FIM_HISTORICO = '2100-12-31';

const emptyPage: PedidoPageResponse = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: ITEMS_PER_PAGE,
  number: 0,
  first: true,
  last: true,
  empty: true,
};

const formatarCodigoPedido = (id: number) => `PED-${id.toString().padStart(3, '0')}`;

const formatarData = (data?: string) => {
  if (!data) return '-';
  return new Date(data).toLocaleDateString('pt-BR');
};

const formatarMoeda = (valor?: number) => {
  return (valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const extrairIdPesquisa = (search: string) => {
  const termo = search.trim();
  const match = termo.match(/^(?:ped-?)?(\d+)$/i);
  return match ? Number(match[1]) : null;
};

const gerarPaginas = (currentPage: number, totalPages: number) => {
  const maxPages = 7;

  if (totalPages <= maxPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];
  const start = Math.max(2, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  if (start > 2) pages.push('...');

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push('...');
  pages.push(totalPages);

  return pages;
};

export default function Pedidos() {
  const navigate = useNavigate();
  const [pedidosPage, setPedidosPage] = useState<PedidoPageResponse>(emptyPage);
  const [statusTypes, setStatusTypes] = useState<StatusPedidoResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PedidoResponse | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ isOpen: true, message, type });
  };

  const carregarPedidos = async () => {
    setIsLoading(true);
    try {
      const idPesquisa = extrairIdPesquisa(debouncedSearch);

      if (idPesquisa) {
        const pedido = await pedidoService.buscarPorId(idPesquisa);
        setPedidosPage({
          ...emptyPage,
          content: pedido ? [pedido] : [],
          totalElements: pedido ? 1 : 0,
          totalPages: pedido ? 1 : 0,
          empty: !pedido,
        });
        return;
      }

      const data = await pedidoService.listarPaginado({
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        ativa: true,
        search: debouncedSearch.trim(),
        inicio: DATA_INICIO_HISTORICO,
        fim: DATA_FIM_HISTORICO,
      });

      setPedidosPage(data);
    } catch (error: any) {
      if (extrairIdPesquisa(debouncedSearch) && error?.response?.status === 404) {
        setPedidosPage(emptyPage);
        return;
      }

      showFeedback('Erro ao carregar pedidos.', 'error');
      setPedidosPage(emptyPage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const carregarStatus = async () => {
      try {
        const statusData = await statusPedidoService.listarTodos();
        setStatusTypes(statusData);
      } catch (error) {
        showFeedback('Erro ao carregar status dos pedidos.', 'error');
      }
    };

    carregarStatus();
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [currentPage, debouncedSearch]);

  const handleOrderClick = (pedido: PedidoResponse) => {
    setSelectedOrder(pedido);
    setIsOrderDetailOpen(true);
  };

  const handleUpdateStatus = async (orderId: number, newStatusId: number) => {
    try {
      await pedidoService.mudarStatus(orderId, newStatusId);

      const atualizarPedido = (pedido: PedidoResponse) => {
        if (pedido.id !== orderId) return pedido;

        return {
          ...pedido,
          statusAtual: {
            ...pedido.statusAtual,
            idStatusPedido: newStatusId,
          },
        };
      };

      setPedidosPage((prev) => ({
        ...prev,
        content: prev.content.map(atualizarPedido),
      }));
      setSelectedOrder((prev) => (prev ? atualizarPedido(prev) : prev));
    } catch (error) {
      showFeedback('Não foi possível alterar o status do pedido.', 'error');
    }
  };

  const handleSeeDetails = (orderId: number) => {
    navigate(`/pedidos/detalhes/${orderId}`);
  };

  const getStatusAtual = (pedido: PedidoResponse) => {
    return statusTypes.find((status) => status.id === pedido.statusAtual?.idStatusPedido);
  };

  const totalPages = pedidosPage.totalPages || 0;
  const paginas = gerarPaginas(currentPage, totalPages);
  const startIndex = pedidosPage.totalElements === 0 ? 0 : pedidosPage.number * pedidosPage.size + 1;
  const endIndex = Math.min((pedidosPage.number + 1) * pedidosPage.size, pedidosPage.totalElements);
  const currentPedidos = pedidosPage.content || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="w-full max-w-[1600px] mx-auto px-8 py-10 box-border">
        <div className="mb-10">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Histórico de Pedidos</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Consulte os pedidos registrados no sistema</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 max-w-md relative">
              <Search
                className="absolute top-1/2 -translate-y-1/2"
                style={{ color: '#9D8189', left: '1vw', width: '1.2vw', height: '1.2vw', pointerEvents: 'none' }}
              />
              <Input
                placeholder="Procurar por pedido, cliente ou origem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 text-[0.9vw]"
                style={{ paddingLeft: '3.5vw', borderColor: '#D8E2DC', backgroundColor: '#F9F9F9', color: '#6D6875' }}
              />
            </div>

            <div className="px-4 py-2 rounded-md text-[15px]" style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}>
              {pedidosPage.totalElements} pedido(s)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D8E2DC' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Pedido</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Cliente</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Origem</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Status</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Criação</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Entrega</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Valor</th>
                <th className="text-right px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[16px]" style={{ color: '#9D8189' }}>
                    Carregando pedidos...
                  </td>
                </tr>
              ) : currentPedidos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[16px]" style={{ color: '#9D8189' }}>
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                currentPedidos.map((pedido, index) => {
                  const statusAtual = getStatusAtual(pedido);

                  return (
                    <tr
                      key={pedido.id}
                      className="border-b transition-colors hover:bg-opacity-50"
                      style={{ borderColor: '#D8E2DC', backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9' }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-[15px] px-2 py-1 rounded" style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}>
                          {formatarCodigoPedido(pedido.id)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[16px]" style={{ color: '#6D6875' }}>
                          {pedido.cliente?.nome || 'Cliente não informado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[15px]" style={{ color: '#9D8189' }}>
                          {pedido.origem || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-[14px]"
                          style={{
                            backgroundColor: statusAtual?.cor || '#D8E2DC',
                            color: '#6D6875',
                          }}
                        >
                          {statusAtual?.status || pedido.statusAtual?.status?.status || 'Sem status'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[15px]" style={{ color: '#9D8189' }}>
                          {formatarData(pedido.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[15px]" style={{ color: '#9D8189' }}>
                          {formatarData(pedido.dataLimite)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[15px]" style={{ color: '#6D6875' }}>
                          <strong>{formatarMoeda(pedido.precoTotal)}</strong>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleOrderClick(pedido)}
                            className="p-2 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#D8E2DC' }}
                            title="Visualizar"
                          >
                            <Eye className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex items-center justify-between mt-6 bg-white rounded-lg p-4 shadow-sm"
          style={{ border: '1px solid #D8E2DC' }}
        >
          <p className="text-[14px]" style={{ color: '#9D8189' }}>
            Mostrando {startIndex} a {endIndex} de {pedidosPage.totalElements} pedidos
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 rounded-md text-[14px] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#F9F9F9', color: '#6D6875', border: '1px solid #D8E2DC' }}
              >
                Anterior
              </button>

              {paginas.map((page, index) => (
                <button
                  key={`${page}-${index}`}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={isLoading || page === '...'}
                  className="px-4 py-2 rounded-md text-[14px] transition-all disabled:opacity-40"
                  style={{
                    backgroundColor: currentPage === page ? '#F4ACB7' : 'white',
                    color: currentPage === page ? 'white' : '#6D6875',
                    border: `1px solid ${currentPage === page ? '#F4ACB7' : '#D8E2DC'}`,
                    cursor: page === '...' ? 'default' : 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 rounded-md text-[14px] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#F9F9F9', color: '#6D6875', border: '1px solid #D8E2DC' }}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          isOpen={isOrderDetailOpen}
          onClose={() => {
            setIsOrderDetailOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          statusTypes={statusTypes}
          onUpdateStatus={handleUpdateStatus}
          onClickInSeeDetails={handleSeeDetails}
        />
      )}

      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        message={feedback.message}
        type={feedback.type}
      />
    </div>
  );
}
