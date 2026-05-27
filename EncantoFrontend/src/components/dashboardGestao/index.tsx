import { Card } from "./ui/card";
import {
  Package,
  CheckCircle2,
  AlertCircle,
  Clock,
  PauseCircle,
  RefreshCw,
  Filter,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import './index.css'
import { dashFinanceiraService } from '../../services/DashboardGestao';
import { produtoService } from '../../services/ProdutoService';
import { temaService } from '../../services/TemaService';

// Logo simples para Encanto Personalizados
const EncantoLogo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-[#e67e96] text-white px-3 py-1 rounded-lg">
      <span className="font-semibold">E</span>
    </div>
    <span className="text-neutral-800 font-semibold">Encanto Personalizados</span>
  </div>
);

interface DashData {
  tiposPedido: { id: number; origem: string; observacoes: string; status: string; statusRole?: string | null; tipoPedido: string }[];
  retrabalhoQuantidadePorMes: { mes: string; quantidadePedidos: number }[];
  leadtimePorEtapa: { etapa: string; leadTime: number }[];
  leadtimePorFuncionario: { funcionario: string; leadTime: number; totalPedidos: number }[];
  produtosMaisPedidos: { id: number; produtoId: number; qtdProd: number }[];
  leadtimeMensal: { mes: string; leadTime: number }[];
  pedidosPorMes: { mes: string; totalCriados: number; totalEntregues: number }[];
  cargaTrabalho: { funcionario: string; emAndamento: number }[];
  pedidosSemAtualizacao: { id: number; cliente: string; status: string; diasParado: number; responsavel: string }[];
}

export default function App() {
  const [filtroDataInicio, setFiltroDataInicio] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
  });
  const [filtroDataFim, setFiltroDataFim] = useState(() => new Date().toISOString().split('T')[0]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroProdutoId, setFiltroProdutoId] = useState('');
  const [filtroTemaId, setFiltroTemaId] = useState('');
  const [dashData, setDashData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<{ id: number; titulo: string }[]>([]);
  const [temas, setTemas] = useState<{ id: number; descricao: string }[]>([]);
  const [paginaPedidosSemAtualizacao, setPaginaPedidosSemAtualizacao] = useState(1);
  const itensPorPaginaPedidosSemAtualizacao = 10;

  useEffect(() => {
    produtoService.listarTodos(0, 1000).then((data) => setProdutos(data?.content ?? (Array.isArray(data) ? data : []))).catch(() => { });
    temaService.listarTodos().then((data) => setTemas(data)).catch(() => { });
  }, []);

  const fetchDash = useCallback(() => {
    if (!filtroDataInicio || !filtroDataFim) return;
    setLoading(true);
    setError(null);
    dashFinanceiraService
      .listarDashFinanceiros(
        filtroDataInicio,
        filtroDataFim,
        filtroTipo || undefined,
        filtroProdutoId ? Number(filtroProdutoId) : undefined,
        filtroTemaId ? Number(filtroTemaId) : undefined
      )
      .then((data) => setDashData(data))
      .catch(() => setError('Erro ao carregar dados do dashboard.'))
      .finally(() => setLoading(false));
  }, [filtroDataInicio, filtroDataFim, filtroTipo, filtroProdutoId, filtroTemaId]);

  useEffect(() => { fetchDash(); }, [fetchDash]);

  // KPIs derivados de tiposPedido (lista de pedidos individuais retornada pela API)
  const kpis = useMemo(() => {
    const pedidos = dashData?.tiposPedido ?? [];
    const total = pedidos.length;
    const entregues = pedidos.filter(p => p.statusRole === 'ENTREGUE').length;
    const atrasados = pedidos.filter(p => p.tipoPedido === 'Atrasado').length;
    const retrabalho = pedidos.filter(p => p.tipoPedido === 'Retrabalho').length;
    const semAtualizacao = dashData?.pedidosSemAtualizacao.length ?? 0;
    const percentualEntregues = total > 0 ? ((entregues / total) * 100).toFixed(1) : 0;
    const percentualAtrasados = total > 0 ? ((atrasados / total) * 100).toFixed(1) : 0;

    return {
      total,
      entregues,
      atrasados,
      semAtualizacao,
      retrabalho,
      percentualEntregues,
      percentualAtrasados
    };
  }, [dashData]);

  const pedidosMesData = useMemo(() => {
    return (dashData?.pedidosPorMes ?? []).map(p => ({
      mes: p.mes,
      criados: p.totalCriados,
      entregues: p.totalEntregues,
    }));
  }, [dashData]);

  const leadTimeData = dashData?.leadtimeMensal ?? [];

  // Rename leadTime → dias to match chart dataKey
  const etapasProcessoData = useMemo(() => {
    return (dashData?.leadtimePorEtapa ?? []).map(e => ({
      etapa: e.etapa,
      dias: e.leadTime,
    }));
  }, [dashData]);

  const retrabalhoData = useMemo(() => {
    return (dashData?.retrabalhoQuantidadePorMes ?? []).map(r => ({
      mes: r.mes,
      quantidade: r.quantidadePedidos,
    }));
  }, [dashData]);

  const pedidosConcluidosData = useMemo(() => {
    return (dashData?.leadtimePorFuncionario ?? []).map(f => ({
      funcionario: f.funcionario,
      pedidos: f.totalPedidos,
    }));
  }, [dashData]);

  const cargaTrabalhoData = useMemo(() => {
    return dashData?.cargaTrabalho ?? [];
  }, [dashData]);

  const pedidosSemAtualizacao = useMemo(() => {
    return dashData?.pedidosSemAtualizacao ?? [];
  }, [dashData]);

  useEffect(() => {
    setPaginaPedidosSemAtualizacao(1);
  }, [pedidosSemAtualizacao]);

  const totalPaginasPedidosSemAtualizacao = Math.max(
    1,
    Math.ceil(pedidosSemAtualizacao.length / itensPorPaginaPedidosSemAtualizacao)
  );
  const indiceInicialPedidosSemAtualizacao = (paginaPedidosSemAtualizacao - 1) * itensPorPaginaPedidosSemAtualizacao;
  const pedidosSemAtualizacaoPaginados = pedidosSemAtualizacao.slice(
    indiceInicialPedidosSemAtualizacao,
    indiceInicialPedidosSemAtualizacao + itensPorPaginaPedidosSemAtualizacao
  );
  const temPaginacaoPedidosSemAtualizacao = pedidosSemAtualizacao.length > itensPorPaginaPedidosSemAtualizacao;

  // Último lead time mensal para o KPI "Tempo Médio de Entrega"
  const ultimoLeadTime = leadTimeData.length > 0 ? leadTimeData[leadTimeData.length - 1].leadTime : null;

  const periodoFiltrado = useMemo(() => {
    if (!filtroDataInicio || !filtroDataFim) return '';
    const d1 = new Date(filtroDataInicio + 'T00:00:00');
    const d2 = new Date(filtroDataFim + 'T00:00:00');
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const fmtMesAno = (d: Date) =>
      capitalize(new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(d));
    const fmtMes = (d: Date) =>
      capitalize(new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(d));
    const sameMonth = d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
    const sameYear = d1.getFullYear() === d2.getFullYear();
    if (sameMonth) return fmtMesAno(d1);
    if (sameYear) return `${fmtMes(d1)} a ${fmtMesAno(d2)}`;
    return `${fmtMesAno(d1)} a ${fmtMesAno(d2)}`;
  }, [filtroDataInicio, filtroDataFim]);

  const periodoResumo = useMemo(() => {
    if (!filtroDataInicio || !filtroDataFim) return '';

    const dataInicio = new Date(filtroDataInicio + 'T00:00:00');
    const dataFim = new Date(filtroDataFim + 'T00:00:00');
    const hojeIso = new Date().toISOString().split('T')[0];
    const umDiaEmMs = 24 * 60 * 60 * 1000;
    const quantidadeDias = Math.max(1, Math.floor((dataFim.getTime() - dataInicio.getTime()) / umDiaEmMs) + 1);
    const dataFimEhHoje = filtroDataFim === hojeIso;

    if (quantidadeDias === 1) return 'no dia selecionado';
    if (dataFimEhHoje) return `nos últimos ${quantidadeDias} dias`;

    return `em um período de ${quantidadeDias} dias`;
  }, [filtroDataInicio, filtroDataFim]);

  const formatarMes = (mesStr: string) => {
    if (!mesStr) return '';
    const partes = mesStr.split('-');
    if (partes.length < 2) return mesStr;

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mesIndex = parseInt(partes[1], 10) - 1;

    return meses[mesIndex];
  };

  return (
    <div className="min-h-screen bg-[#faf8f7]">
      {/* Header */}


      <main className="w-full max-w-[1600px] mx-auto px-8 py-10 box-border space-y-6">
        {/* Page Title */}
        <div style={{ marginBottom: '2vh' }}>
          <h1 style={{ fontSize: '48px', color: '#F4ACB7', marginBottom: '0.5rem', fontWeight: '600' }}>
            Dashboard de Gestão de Pedidos
          </h1>
          <p style={{ fontSize: '16px', color: '#9D8189', marginBottom: '2rem' }}>
            Visão geral operacional da sua equipe {periodoResumo}.
            <span style={{color: '#e98191', fontWeight: '700'}}>{periodoFiltrado && ` ${periodoFiltrado}`}</span>
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Filtros Globais */}
        <Card className="p-6 bg-white border-neutral-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="size-5 text-[#e67e96]" />
            <h3 className="text-neutral-800">Filtros da Dashboard</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Tipo de Pedido */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Tipo de Pedido</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#e67e96]"
              >
                <option value="">Todos</option>
                <option value="Normal">Normal</option>
                <option value="Atrasado">Atrasado</option>
                <option value="Retrabalho">Retrabalho</option>
              </select>
            </div>

            {/* Produto */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Produto</label>
              <select
                value={filtroProdutoId}
                onChange={(e) => setFiltroProdutoId(e.target.value)}
                className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#e67e96]"
              >
                <option value="">Todos</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>{p.titulo}</option>
                ))}
              </select>
            </div>

            {/* Tema */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Tema</label>
              <select
                value={filtroTemaId}
                onChange={(e) => setFiltroTemaId(e.target.value)}
                className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#e67e96]"
              >
                <option value="">Todos</option>
                {temas.map((t) => (
                  <option key={t.id} value={t.id}>{t.descricao}</option>
                ))}
              </select>
            </div>

            {/* Data Início */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Data Início</label>
              <Input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                className="bg-white border-neutral-200"
              />
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Data Fim</label>
              <Input
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
                className="bg-white border-neutral-200"
              />
            </div>
          </div>

          {/* Contador + Limpar Filtros */}
          <div className="mt-4 flex items-center justify-between">
            {loading ? (
              <span className="flex items-center gap-2 text-sm text-neutral-400">
                <Loader2 className="size-4 animate-spin text-[#e67e96]" />
                Atualizando dados...
              </span>
            ) : (
              <p className="text-sm text-neutral-500">
                Exibindo <span className="text-[#e67e96] font-medium">{dashData?.tiposPedido.length ?? 0}</span> pedidos
              </p>
            )}
            <Button
              variant="outline"
              onClick={() => {
                const d = new Date();
                d.setMonth(d.getMonth() - 3);
                setFiltroDataInicio(d.toISOString().split('T')[0]);
                setFiltroDataFim(new Date().toISOString().split('T')[0]);
                setFiltroTipo('');
                setFiltroProdutoId('');
                setFiltroTemaId('');
              }}
              className="border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="p-4 bg-white border-neutral-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Total de Pedidos</p>
                <p className="text-neutral-800 mt-1">{kpis.total}</p>
              </div>
              <div className="bg-[#fce4e8] p-2 rounded-lg">
                <Package className="size-5 text-[#e67e96]" />
              </div>
            </div>
            <p className="text-neutral-400 text-sm mt-3">No período</p>
          </Card>

          <Card className="p-4 bg-white border-neutral-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Pedidos Entregues</p>
                <p className="text-neutral-800 mt-1">{kpis.entregues}</p>
              </div>
              <div className="bg-[#fce4e8] p-2 rounded-lg">
                <CheckCircle2 className="size-5 text-[#e67e96]" />
              </div>
            </div>
            <p className="text-[#e67e96] text-sm mt-3">{kpis.percentualEntregues}% de conclusão</p>
          </Card>

          <Card className="p-4 bg-white border-neutral-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Pedidos Atrasados</p>
                <p className="text-neutral-800 mt-1">{kpis.percentualAtrasados}%</p>
              </div>
              <div className="bg-[#fce4e8] p-2 rounded-lg">
                <AlertCircle className="size-5 text-[#e67e96]" />
              </div>
            </div>
            <p className="text-[#dc6b84] text-sm mt-3">{kpis.atrasados} pedidos atrasados</p>
          </Card>

          <Card className="p-4 bg-white border-neutral-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Tempo Médio de Entrega</p>
                <p className="text-neutral-800 mt-1">
                  {ultimoLeadTime !== null ? `${ultimoLeadTime} dias` : '—'}
                </p>
              </div>
              <div className="bg-[#fce4e8] p-2 rounded-lg">
                <Clock className="size-5 text-[#e67e96]" />
              </div>
            </div>
            {/* TODO: no comparison data in API */}
            <p className="text-neutral-400 text-sm mt-3">Último mês do período</p>
          </Card>

          <Card className="p-4 bg-white border-neutral-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Sem Atualização</p>
                <p className="text-neutral-800 mt-1">{kpis.semAtualizacao}</p>
              </div>
              <div className="bg-[#fce4e8] p-2 rounded-lg">
                <PauseCircle className="size-5 text-[#e67e96]" />
              </div>
            </div>
            <p className="text-neutral-400 text-sm mt-3">Há 4+ dias parados</p>
          </Card>

          <Card className="p-4 bg-white border-neutral-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Pedidos Refeitos</p>
                <p className="text-neutral-800 mt-1">{kpis.retrabalho}</p>
              </div>
              <div className="bg-[#fce4e8] p-2 rounded-lg">
                <RefreshCw className="size-5 text-[#e67e96]" />
              </div>
            </div>
            <p className="text-[#e67e96] text-sm mt-3">No período filtrado</p>
          </Card>
        </div>

        {/* Gráficos Operacionais */}
        <div className="space-y-4">
          <h2 className="text-neutral-800" style={{color: '#f097a5'}}>Gráficos Operacionais</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pedidos criados x entregues */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4" style={{color: '#f097a5'}}>Pedidos Criados vs Entregues</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pedidosMesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#a3a3a3" tickFormatter={formatarMes} />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="criados" fill="#f7b4c4" name="Criados" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="entregues" fill="#e67e96" name="Entregues" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Lead Time */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4" style={{color: '#f097a5'}}>Tempo Médio de Entrega (dias)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={leadTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#a3a3a3" tickFormatter={formatarMes} />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="leadTime"
                    stroke="#e67e96"
                    strokeWidth={3}
                    name="Tempo de Entrega"
                    dot={{ fill: '#e67e96', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tempo por etapa */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4" style={{color: '#f097a5'}}>Tempo Médio por Etapa (dias)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={etapasProcessoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#a3a3a3" />
                  <YAxis dataKey="etapa" type="category" stroke="#a3a3a3" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="dias" fill="#e67e96" name="Dias" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Retrabalho */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4" style={{color: '#f097a5'}}>Pedidos Refeitos por Mês</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={retrabalhoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#a3a3a3" />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="quantidade" fill="#e67e96" name="Pedidos Refeitos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Gráficos de Produtividade */}
        <div className="space-y-4">
          <h2 className="text-neutral-800" style={{color: '#f097a5'}}>Produtividade da Equipe</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pedidos concluídos */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4" style={{color: '#f097a5'}}>Pedidos Concluídos por Funcionário</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pedidosConcluidosData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#a3a3a3" />
                  <YAxis dataKey="funcionario" type="category" stroke="#a3a3a3" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="pedidos" fill="#e67e96" name="Concluídos" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Carga de trabalho */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4" style={{color: '#f097a5'}}>Carga de Trabalho Atual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cargaTrabalhoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#a3a3a3" />
                  <YAxis dataKey="funcionario" type="category" stroke="#a3a3a3" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="emAndamento" fill="#f7b4c4" name="Em Andamento" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Tabela de Pedidos Sem Atualização */}
        <div className="space-y-4">
          <h2 className="text-neutral-800">Pedidos Sem Atualização</h2>
          <Card className="bg-white border-neutral-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#faf8f7] border-neutral-100">
                  <TableHead className="text-neutral-800">ID</TableHead>
                  <TableHead className="text-neutral-800">Cliente</TableHead>
                  <TableHead className="text-neutral-800">Status Atual</TableHead>
                  <TableHead className="text-neutral-800">Dias Parado</TableHead>
                  <TableHead className="text-neutral-800">Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosSemAtualizacao.length > 0 ? (
                  pedidosSemAtualizacaoPaginados.map((pedido) => (
                    <TableRow key={pedido.id} className="border-neutral-100">
                      <TableCell className="text-neutral-800">{pedido.id}</TableCell>
                      <TableCell className="text-neutral-600">{pedido.cliente}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-[#fce4e8] text-[#dc6b84] border border-[#f7b4c4]">
                          {pedido.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-[#dc6b84]">{pedido.diasParado} dias</span>
                      </TableCell>
                      <TableCell className="text-neutral-600">{pedido.responsavel}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-neutral-400 py-8">
                      Nenhum pedido encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {pedidosSemAtualizacao.length > 0 && (
              <div className="flex items-center justify-between gap-4 border-t border-neutral-100 px-4 py-3">
                <span className="text-sm text-neutral-500">
                  {pedidosSemAtualizacao.length} pedidos sem atualização
                </span>
                {temPaginacaoPedidosSemAtualizacao && (
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      disabled={paginaPedidosSemAtualizacao === 1}
                      onClick={() => setPaginaPedidosSemAtualizacao((pagina) => Math.max(1, pagina - 1))}
                      className="h-8 px-3 text-sm"
                      style={{ backgroundColor: '#F4ACB7', color: 'white' }}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-neutral-500">
                      Página {paginaPedidosSemAtualizacao} de {totalPaginasPedidosSemAtualizacao}
                    </span>
                    <Button
                      type="button"
                      disabled={paginaPedidosSemAtualizacao === totalPaginasPedidosSemAtualizacao}
                      onClick={() => setPaginaPedidosSemAtualizacao((pagina) => Math.min(totalPaginasPedidosSemAtualizacao, pagina + 1))}
                      className="h-8 px-3 text-sm"
                      style={{ backgroundColor: '#F4ACB7', color: 'white' }}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
