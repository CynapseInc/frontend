import { useEffect, useState } from 'react';
import { Edit2, Filter, Search, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import FeedbackModal from '../ui/FeedbackModal';
import ConfirmModal from '../ui/ConfirmModal';
import OrderDetailModal from '../kanbanPedidos/modals/OrderDetailModal';
import { pedidoService } from '../../services/PedidoService';
import { statusPedidoService } from '../../services/StatusPedidoService';
import type { PedidoPageResponse, PedidoResponse, StatusPedidoResponse } from '../../interfaces/Pedido';

import './pedidos.css';

const ITEMS_PER_PAGE = 8;

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
  const [origem, setOrigem] = useState('');
  const [statusId, setStatusId] = useState('');
  const [createdAtInicio, setCreatedAtInicio] = useState('');
  const [createdAtFim, setCreatedAtFim] = useState('');
  const [dataLimiteInicio, setDataLimiteInicio] = useState('');
  const [dataLimiteFim, setDataLimiteFim] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PedidoResponse | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<PedidoResponse | null>(null);
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
      const temFiltrosAvancados = Boolean(
        origem ||
        statusId ||
        createdAtInicio ||
        createdAtFim ||
        dataLimiteInicio ||
        dataLimiteFim ||
        sortBy
      );

      if (idPesquisa && !temFiltrosAvancados) {
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
        origem: origem.trim(),
        statusId,
        createdAtInicio,
        createdAtFim,
        dataLimiteInicio,
        dataLimiteFim,
        sortBy,
        sortDirection,
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
  }, [
    currentPage,
    debouncedSearch,
    origem,
    statusId,
    createdAtInicio,
    createdAtFim,
    dataLimiteInicio,
    dataLimiteFim,
    sortBy,
    sortDirection,
  ]);

  const limparFiltros = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setOrigem('');
    setStatusId('');
    setCreatedAtInicio('');
    setCreatedAtFim('');
    setDataLimiteInicio('');
    setDataLimiteFim('');
    setSortBy('');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const resetarPagina = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

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

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await pedidoService.mudarEstado(orderToDelete.id);
      showFeedback('Pedido removido do histórico com sucesso.', 'success');
      setOrderToDelete(null);
      carregarPedidos();
    } catch (error) {
      showFeedback('Não foi possível remover o pedido.', 'error');
    }
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
          <h1 className="text-[48px] mb-2 titulo-pedidos" style={{ color: '#F4ACB7' }}>Histórico de Pedidos</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Consulte os pedidos registrados no sistema</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex-1 min-w-[280px] max-w-md relative">
              <Search
                className="absolute top-1/2 -translate-y-1/2"
                style={{ color: '#9D8189', left: 14, width: 17, height: 17, pointerEvents: 'none' }}
              />
              <Input
                placeholder="Procurar por pedido, cliente ou origem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 text-[14px]"
                style={{ paddingLeft: 44, borderColor: '#D8E2DC', backgroundColor: '#F9F9F9', color: '#6D6875' }}
              />
            </div>

            <div className="self-start md:self-auto px-4 py-2 rounded-md text-[15px]" style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}>
              {pedidosPage.totalElements} pedido(s)
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid #D8E2DC' }}>
            <Filter className="size-4" style={{ color: '#9D8189' }} />
            <span className="text-[15px]" style={{ color: '#9D8189' }}>Filtrar por:</span>
          </div>

          <div className="grid items-end gap-3 filtros-grid">
            <div>
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>Origem</label>
              <Input
                placeholder="Ex: Loja, Online..."
                value={origem}
                onChange={(e) => resetarPagina(() => setOrigem(e.target.value))}
                className="h-11 text-[14px]"
                style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9', color: '#6D6875' }}
              />
            </div>

            <div>
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>Status</label>
              <select
                value={statusId}
                onChange={(e) => resetarPagina(() => setStatusId(e.target.value))}
                className="w-full h-11 px-3 rounded-md text-[14px] border focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                <option value="">Todos</option>
                {statusTypes.map((status) => (
                  <option key={status.id} value={status.id}>{status.status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => resetarPagina(() => setSortBy(e.target.value))}
                className="w-full h-11 px-3 rounded-md text-[14px] border focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                <option value="">Padrão</option>
                <option value="valor">Valor</option>
                <option value="createdAt">Data de criação</option>
                <option value="dataLimite">Data de entrega</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>Período de criação</label>
              <div className="grid items-center gap-2" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                <input
                  type="date"
                  value={createdAtInicio}
                  onChange={(e) => resetarPagina(() => setCreatedAtInicio(e.target.value))}
                  className="min-w-0 w-full h-11 px-3 rounded-md text-[13px] border focus:outline-none focus:border-[#F4ACB7]"
                  style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#6D6875' }}
                  title="Início do período de criação"
                />
                <span className="text-[13px]" style={{ color: '#9D8189' }}>até</span>
                <input
                  type="date"
                  value={createdAtFim}
                  onChange={(e) => resetarPagina(() => setCreatedAtFim(e.target.value))}
                  className="min-w-0 w-full h-11 px-3 rounded-md text-[13px] border focus:outline-none focus:border-[#F4ACB7]"
                  style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#6D6875' }}
                  title="Fim do período de criação"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] mb-1" style={{ color: '#9D8189' }}>Período de entrega</label>
              <div className="grid items-center gap-2" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                <input
                  type="date"
                  value={dataLimiteInicio}
                  onChange={(e) => resetarPagina(() => setDataLimiteInicio(e.target.value))}
                  className="min-w-0 w-full h-11 px-3 rounded-md text-[13px] border focus:outline-none focus:border-[#F4ACB7]"
                  style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#6D6875' }}
                  title="Início do período de entrega"
                />
                <span className="text-[13px]" style={{ color: '#9D8189' }}>até</span>
                <input
                  type="date"
                  value={dataLimiteFim}
                  onChange={(e) => resetarPagina(() => setDataLimiteFim(e.target.value))}
                  className="min-w-0 w-full h-11 px-3 rounded-md text-[13px] border focus:outline-none focus:border-[#F4ACB7]"
                  style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC', color: '#6D6875' }}
                  title="Fim do período de entrega"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={limparFiltros}
              className="h-11 px-4 rounded-md text-[14px] transition-all flex items-center gap-2"
              style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
              title="Limpar filtros"
            >
              <X className="size-4" />
              Limpar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm tabela-container" style={{ border: '1px solid #D8E2DC' }}>
          <table className="w-full min-w-[1000px]"> {/* O min-w forçará o scroll no mobile sem esmagar as colunas */}
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
                        <button
                          onClick={() => handleOrderClick(pedido)}
                          className="text-[15px] px-2 py-1 rounded transition-all hover:opacity-80"
                          style={{ backgroundColor: '#FFE5D9', color: '#6D6875', border: '1px solid transparent', cursor: 'pointer' }}
                          title="Visualizar detalhes"
                        >
                          {formatarCodigoPedido(pedido.id)}
                        </button>
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
                            onClick={() => handleSeeDetails(pedido.id)}
                            className="p-2 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#D8E2DC' }}
                            title="Editar pedido"
                          >
                            <Edit2 className="size-4" style={{ color: '#6D6875' }} />
                          </button>
                          <button
                            onClick={() => setOrderToDelete(pedido)}
                            className="p-2 rounded-md transition-all hover:bg-opacity-80"
                            style={{ backgroundColor: '#FFE5D9' }}
                            title="Remover pedido"
                          >
                            <Trash2 className="size-4" style={{ color: '#9D8189' }} />
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
          className="flex items-center justify-between mt-6 bg-white rounded-lg p-4 shadow-sm paginacao-container"
          style={{ border: '1px solid #D8E2DC' }}
        >
          <p className="text-[14px]" style={{ color: '#9D8189' }}>
            Mostrando {startIndex} a {endIndex} de {pedidosPage.totalElements} pedidos
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 paginacao-botoes">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 rounded-md text-[14px] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
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
                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
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

      <ConfirmModal
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDeleteOrder}
        title="Remover pedido?"
        message={`O pedido ${orderToDelete ? formatarCodigoPedido(orderToDelete.id) : ''} será inativado e sairá do histórico.`}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
}
