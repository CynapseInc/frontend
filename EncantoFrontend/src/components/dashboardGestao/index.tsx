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
    <div className="bg-[#F4ACB7] text-white px-3 py-1 rounded-lg">
      <span className="font-semibold">E</span>
    </div>
    <span className="text-[#6D6875] font-semibold">Encanto Personalizados</span>
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

  const chartLegendFormatter = (value: unknown) => (
    <span style={{ color: '#6D6875' }}>{String(value)}</span>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}


      <main className="w-full max-w-[1600px] mx-auto px-8 py-10 box-border space-y-6">
        {/* Page Title */}
        <div style={{ marginBottom: '2vh' }}>
          <h1 style={{ fontSize: '48px', color: '#F4ACB7', marginBottom: '0.5rem', fontWeight: '600' }}>
            Gestão de Pedidos
          </h1>
          <p style={{ fontSize: '16px', color: '#9D8189', marginBottom: '2rem' }}>
            Visão geral operacional da sua equipe {periodoResumo}.
            <span style={{color: '#F4ACB7', fontWeight: '700'}}>{periodoFiltrado && ` ${periodoFiltrado}`}</span>
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Filtros Globais */}
        <Card className="p-6 bg-white border-[#D8E2DC] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="size-5 text-[#F4ACB7]" />
            <h3 className="text-[#6D6875]">Filtros da Dashboard</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Tipo de Pedido */}
            <div className="space-y-2">
              <label className="text-sm text-[#6D6875]">Tipo de Pedido</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full h-11 rounded-md border border-[#D8E2DC] bg-white px-3 text-sm text-[#6D6875] focus:outline-none focus:ring-1 focus:ring-[#F4ACB7]/30"
              >
                <option value="">Todos</option>
                <option value="Normal">Normal</option>
                <option value="Atrasado">Atrasado</option>
                <option value="Retrabalho">Retrabalho</option>
              </select>
            </div>

            {/* Produto */}
            <div className="space-y-2">
              <label className="text-sm text-[#6D6875]">Produto</label>
              <select
                value={filtroProdutoId}
                onChange={(e) => setFiltroProdutoId(e.target.value)}
                className="w-full h-11 rounded-md border border-[#D8E2DC] bg-white px-3 text-sm text-[#6D6875] focus:outline-none focus:ring-1 focus:ring-[#F4ACB7]/30"
              >
                <option value="">Todos</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>{p.titulo}</option>
                ))}
              </select>
            </div>

            {/* Tema */}
            <div className="space-y-2">
              <label className="text-sm text-[#6D6875]">Tema</label>
              <select
                value={filtroTemaId}
                onChange={(e) => setFiltroTemaId(e.target.value)}
                className="w-full h-11 rounded-md border border-[#D8E2DC] bg-white px-3 text-sm text-[#6D6875] focus:outline-none focus:ring-1 focus:ring-[#F4ACB7]/30"
              >
                <option value="">Todos</option>
                {temas.map((t) => (
                  <option key={t.id} value={t.id}>{t.descricao}</option>
                ))}
              </select>
            </div>

            {/* Data Início */}
            <div className="space-y-2">
              <label className="text-sm text-[#6D6875]">Data Início</label>
              <Input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                className="bg-white border-[#D8E2DC]"
              />
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <label className="text-sm text-[#6D6875]">Data Fim</label>
              <Input
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
                className="bg-white border-[#D8E2DC]"
              />
            </div>
          </div>

          {/* Contador + Limpar Filtros */}
          <div className="mt-4 flex items-center justify-between">
            {loading ? (
              <span className="flex items-center gap-2 text-sm text-[#9D8189]">
                <Loader2 className="size-4 animate-spin text-[#F4ACB7]" />
                Atualizando dados...
              </span>
            ) : (
              <p className="text-sm text-[#9D8189]">
                Exibindo <span className="text-[#F4ACB7] font-medium">{dashData?.tiposPedido.length ?? 0}</span> pedidos
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
              className="border-[#F4ACB7] bg-[#F4ACB7] text-white hover:bg-[#F4ACB7] hover:opacity-90"
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="min-h-[150px] p-4 bg-white border-[#D8E2DC] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[#9D8189] text-sm leading-5 min-h-10">Total de Pedidos</p>
                <p className="text-[#6D6875] mt-1 text-[18px] leading-6">{kpis.total}</p>
              </div>
              <div className="bg-[#FFE5D9] p-2 rounded-lg shrink-0">
                <Package className="size-5 text-[#F4ACB7]" />
              </div>
            </div>
            <p className="text-[#9D8189] text-sm leading-5">No período</p>
          </Card>

          <Card className="min-h-[150px] p-4 bg-white border-[#D8E2DC] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[#9D8189] text-sm leading-5 min-h-10">Pedidos Entregues</p>
                <p className="text-[#6D6875] mt-1 text-[18px] leading-6">{kpis.entregues}</p>
              </div>
              <div className="bg-[#FFE5D9] p-2 rounded-lg shrink-0">
                <CheckCircle2 className="size-5 text-[#F4ACB7]" />
              </div>
            </div>
            <p className="text-[#F4ACB7] text-sm leading-5">{kpis.percentualEntregues}% de conclusão</p>
          </Card>

          <Card className="min-h-[150px] p-4 bg-white border-[#D8E2DC] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[#9D8189] text-sm leading-5 min-h-10">Pedidos Atrasados</p>
                <p className="text-[#6D6875] mt-1 text-[18px] leading-6">{kpis.percentualAtrasados}%</p>
              </div>
              <div className="bg-[#FFE5D9] p-2 rounded-lg shrink-0">
                <AlertCircle className="size-5 text-[#F4ACB7]" />
              </div>
            </div>
            <p className="text-[#6D6875] text-sm leading-5">{kpis.atrasados} pedidos atrasados</p>
          </Card>

          <Card className="min-h-[150px] p-4 bg-white border-[#D8E2DC] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[#9D8189] text-sm leading-5 min-h-10">Tempo Médio de Entrega</p>
                <p className="text-[#6D6875] mt-1 text-[18px] leading-6">
                  {ultimoLeadTime !== null ? `${ultimoLeadTime} dias` : '—'}
                </p>
              </div>
              <div className="bg-[#FFE5D9] p-2 rounded-lg shrink-0">
                <Clock className="size-5 text-[#F4ACB7]" />
              </div>
            </div>
            {/* TODO: no comparison data in API */}
            <p className="text-[#9D8189] text-sm leading-5">Último mês do período</p>
          </Card>

          <Card className="min-h-[150px] p-4 bg-white border-[#D8E2DC] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[#9D8189] text-sm leading-5 min-h-10">Sem Atualização</p>
                <p className="text-[#6D6875] mt-1 text-[18px] leading-6">{kpis.semAtualizacao}</p>
              </div>
              <div className="bg-[#FFE5D9] p-2 rounded-lg shrink-0">
                <PauseCircle className="size-5 text-[#F4ACB7]" />
              </div>
            </div>
            <p className="text-[#9D8189] text-sm leading-5">Há 4+ dias parados</p>
          </Card>

          <Card className="min-h-[150px] p-4 bg-white border-[#D8E2DC] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[#9D8189] text-sm leading-5 min-h-10">Pedidos Refeitos</p>
                <p className="text-[#6D6875] mt-1 text-[18px] leading-6">{kpis.retrabalho}</p>
              </div>
              <div className="bg-[#FFE5D9] p-2 rounded-lg shrink-0">
                <RefreshCw className="size-5 text-[#F4ACB7]" />
              </div>
            </div>
            <p className="text-[#F4ACB7] text-sm leading-5">No período filtrado</p>
          </Card>
        </div>

        {/* Gráficos Operacionais */}
        <div className="space-y-4">
          <h2 className="text-[#6D6875]" style={{color: '#F4ACB7'}}>Gráficos Operacionais</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pedidos criados x entregues */}
            <Card className="p-6 bg-white border-[#D8E2DC] shadow-sm">
              <h3 className="text-[#6D6875] mb-4" style={{color: '#F4ACB7'}}>Pedidos Criados vs Entregues</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pedidosMesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8E2DC" />
                  <XAxis dataKey="mes" stroke="#6D6875" tick={{ fill: '#6D6875' }} tickFormatter={formatarMes} />
                  <YAxis stroke="#6D6875" tick={{ fill: '#6D6875' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #D8E2DC',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend iconType="square" iconSize={10} formatter={chartLegendFormatter} />
                  <Bar dataKey="criados" fill="#9D8189" name="Criados" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="entregues" fill="#F4ACB7" name="Entregues" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Lead Time */}
            <Card className="p-6 bg-white border-[#D8E2DC] shadow-sm">
              <h3 className="text-[#6D6875] mb-4" style={{color: '#F4ACB7'}}>Tempo Médio de Entrega (dias)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={leadTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8E2DC" />
                  <XAxis dataKey="mes" stroke="#6D6875" tick={{ fill: '#6D6875' }} tickFormatter={formatarMes} />
                  <YAxis stroke="#6D6875" tick={{ fill: '#6D6875' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #D8E2DC',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend iconType="square" iconSize={10} formatter={chartLegendFormatter} />
                  <Line
                    type="monotone"
                    dataKey="leadTime"
                    stroke="#F4ACB7"
                    strokeWidth={3}
                    name="Tempo de Entrega"
                    dot={{ fill: '#F4ACB7', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tempo por etapa */}
            <Card className="p-6 bg-white border-[#D8E2DC] shadow-sm">
              <h3 className="text-[#6D6875] mb-4" style={{color: '#F4ACB7'}}>Tempo Médio por Etapa (dias)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={etapasProcessoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8E2DC" />
                  <XAxis type="number" stroke="#6D6875" tick={{ fill: '#6D6875' }} />
                  <YAxis dataKey="etapa" type="category" stroke="#6D6875" tick={{ fill: '#6D6875' }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #D8E2DC',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="dias" fill="#F4ACB7" name="Dias" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Retrabalho */}
            <Card className="p-6 bg-white border-[#D8E2DC] shadow-sm">
              <h3 className="text-[#6D6875] mb-4" style={{color: '#F4ACB7'}}>Pedidos Refeitos por Mês</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={retrabalhoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8E2DC" />
                  <XAxis dataKey="mes" stroke="#6D6875" tick={{ fill: '#6D6875' }} />
                  <YAxis stroke="#6D6875" tick={{ fill: '#6D6875' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #D8E2DC',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="quantidade" fill="#9D8189" name="Pedidos Refeitos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Gráficos de Produtividade */}
        <div className="space-y-4">
          <h2 className="text-[#6D6875]" style={{color: '#F4ACB7'}}>Produtividade da Equipe</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pedidos concluídos */}
            <Card className="p-6 bg-white border-[#D8E2DC] shadow-sm">
              <h3 className="text-[#6D6875] mb-4" style={{color: '#F4ACB7'}}>Pedidos Concluídos por Funcionário</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pedidosConcluidosData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8E2DC" />
                  <XAxis type="number" stroke="#6D6875" tick={{ fill: '#6D6875' }} />
                  <YAxis dataKey="funcionario" type="category" stroke="#6D6875" tick={{ fill: '#6D6875' }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #D8E2DC',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="pedidos" fill="#F4ACB7" name="Concluídos" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Carga de trabalho */}
            <Card className="p-6 bg-white border-[#D8E2DC] shadow-sm">
              <h3 className="text-[#6D6875] mb-4" style={{color: '#F4ACB7'}}>Carga de Trabalho Atual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cargaTrabalhoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8E2DC" />
                  <XAxis type="number" stroke="#6D6875" tick={{ fill: '#6D6875' }} />
                  <YAxis dataKey="funcionario" type="category" stroke="#6D6875" tick={{ fill: '#6D6875' }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #D8E2DC',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="emAndamento" fill="#9D8189" name="Em Andamento" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Tabela de Pedidos Sem Atualização */}
        <div className="space-y-4">
          <h2 className="text-[#6D6875]">Pedidos Sem Atualização</h2>
          <Card className="bg-white border-[#D8E2DC] shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FFE5D9] hover:bg-[#FFE5D9] border-[#D8E2DC]">
                  <TableHead className="text-[#6D6875]">ID</TableHead>
                  <TableHead className="text-[#6D6875]">Cliente</TableHead>
                  <TableHead className="text-[#6D6875]">Status Atual</TableHead>
                  <TableHead className="text-[#6D6875]">Dias Parado</TableHead>
                  <TableHead className="text-[#6D6875]">Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosSemAtualizacao.length > 0 ? (
                  pedidosSemAtualizacaoPaginados.map((pedido, index) => (
                    <TableRow
                      key={pedido.id}
                      className={`border-[#D8E2DC] ${
                        index % 2 === 0
                          ? 'bg-[#F9F9F9] hover:bg-[#F9F9F9]'
                          : 'bg-white hover:bg-white'
                      }`}
                    >
                      <TableCell className="text-[#6D6875]">{pedido.id}</TableCell>
                      <TableCell className="text-[#6D6875]">{pedido.cliente}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-[#FFE5D9] text-[#6D6875] border border-[#D8E2DC]">
                          {pedido.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-[#6D6875]">{pedido.diasParado} dias</span>
                      </TableCell>
                      <TableCell className="text-[#6D6875]">{pedido.responsavel}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-[#9D8189] py-8">
                      Nenhum pedido encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {pedidosSemAtualizacao.length > 0 && (
              <div className="flex items-center justify-between gap-4 border-t border-[#D8E2DC] px-4 py-3">
                <span className="text-sm text-[#9D8189]">
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
                    <span className="text-sm text-[#9D8189]">
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
