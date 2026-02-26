import { Card } from "./ui/card";
import { 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  PauseCircle, 
  RefreshCw,
  Filter
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState, useMemo } from "react";
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

// Logo simples para Encanto Personalizados
const EncantoLogo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-[#e67e96] text-white px-3 py-1 rounded-lg">
      <span className="font-semibold">E</span>
    </div>
    <span className="text-neutral-800 font-semibold">Encanto Personalizados</span>
  </div>
);

// Dados completos de pedidos com datas
const todosPedidos = [
  { id: "PED-1234", cliente: "Tech Solutions Ltda", status: "Em Produção", diasParado: 8, responsavel: "Carlos Silva", produto: "Caneca Personalizada", tema: "Aniversário", tipo: "atrasado", mes: "Jan", dataCriacao: "2025-01-15", entregue: false },
  { id: "PED-1189", cliente: "Indústria ABC", status: "Retrabalho", diasParado: 6, responsavel: "Ana Costa", produto: "Camiseta Estampada", tema: "Casamento", tipo: "retrabalho", mes: "Jan", dataCriacao: "2025-01-20", entregue: false },
  { id: "PED-1156", cliente: "Comercial XYZ", status: "Qualidade", diasParado: 5, responsavel: "João Santos", produto: "Almofada Personalizada", tema: "Festa Infantil", tipo: "normal", mes: "Fev", dataCriacao: "2025-02-05", entregue: false },
  { id: "PED-1098", cliente: "Distribuidora Nacional", status: "Em Produção", diasParado: 5, responsavel: "Maria Oliveira", produto: "Caneca Personalizada", tema: "Corporativo", tipo: "atrasado", mes: "Fev", dataCriacao: "2025-02-10", entregue: false },
  { id: "PED-1045", cliente: "Varejo Express", status: "Retrabalho", diasParado: 4, responsavel: "Pedro Lima", produto: "Toalha Bordada", tema: "Aniversário", tipo: "retrabalho", mes: "Mar", dataCriacao: "2025-03-01", entregue: false },
  { id: "PED-1032", cliente: "Magazine ABC", status: "Análise", diasParado: 3, responsavel: "Carlos Silva", produto: "Camiseta Estampada", tema: "Casamento", tipo: "normal", mes: "Mar", dataCriacao: "2025-03-15", entregue: false },
  { id: "PED-1021", cliente: "Loja Central", status: "Em Produção", diasParado: 7, responsavel: "Ana Costa", produto: "Almofada Personalizada", tema: "Festa Infantil", tipo: "atrasado", mes: "Abr", dataCriacao: "2025-04-05", entregue: false },
  
  // Pedidos entregues
  { id: "PED-1000", cliente: "Cliente A", status: "Entregue", diasParado: 0, responsavel: "Carlos Silva", produto: "Caneca Personalizada", tema: "Aniversário", tipo: "normal", mes: "Jan", dataCriacao: "2025-01-01", entregue: true },
  { id: "PED-1001", cliente: "Cliente B", status: "Entregue", diasParado: 0, responsavel: "Ana Costa", produto: "Camiseta Estampada", tema: "Casamento", tipo: "normal", mes: "Jan", dataCriacao: "2025-01-02", entregue: true },
  { id: "PED-1002", cliente: "Cliente C", status: "Entregue", diasParado: 0, responsavel: "João Santos", produto: "Almofada Personalizada", tema: "Festa Infantil", tipo: "normal", mes: "Jan", dataCriacao: "2025-01-03", entregue: true },
  { id: "PED-1003", cliente: "Cliente D", status: "Entregue", diasParado: 0, responsavel: "Maria Oliveira", produto: "Toalha Bordada", tema: "Corporativo", tipo: "normal", mes: "Fev", dataCriacao: "2025-02-01", entregue: true },
  { id: "PED-1004", cliente: "Cliente E", status: "Entregue", diasParado: 0, responsavel: "Pedro Lima", produto: "Caneca Personalizada", tema: "Aniversário", tipo: "normal", mes: "Fev", dataCriacao: "2025-02-05", entregue: true },
  { id: "PED-1005", cliente: "Cliente F", status: "Entregue", diasParado: 0, responsavel: "Carlos Silva", produto: "Camiseta Estampada", tema: "Casamento", tipo: "normal", mes: "Mar", dataCriacao: "2025-03-01", entregue: true },
  { id: "PED-1006", cliente: "Cliente G", status: "Entregue", diasParado: 0, responsavel: "Ana Costa", produto: "Almofada Personalizada", tema: "Festa Infantil", tipo: "normal", mes: "Mar", dataCriacao: "2025-03-05", entregue: true },
  { id: "PED-1007", cliente: "Cliente H", status: "Entregue", diasParado: 0, responsavel: "João Santos", produto: "Toalha Bordada", tema: "Corporativo", tipo: "normal", mes: "Abr", dataCriacao: "2025-04-01", entregue: true },
  { id: "PED-1008", cliente: "Cliente I", status: "Entregue", diasParado: 0, responsavel: "Maria Oliveira", produto: "Caneca Personalizada", tema: "Aniversário", tipo: "normal", mes: "Mai", dataCriacao: "2025-05-01", entregue: true },
  { id: "PED-1009", cliente: "Cliente J", status: "Entregue", diasParado: 0, responsavel: "Pedro Lima", produto: "Camiseta Estampada", tema: "Casamento", tipo: "normal", mes: "Mai", dataCriacao: "2025-05-05", entregue: true },
  { id: "PED-1010", cliente: "Cliente K", status: "Entregue", diasParado: 0, responsavel: "Carlos Silva", produto: "Almofada Personalizada", tema: "Festa Infantil", tipo: "normal", mes: "Jun", dataCriacao: "2025-06-01", entregue: true },
  { id: "PED-1011", cliente: "Cliente L", status: "Entregue", diasParado: 0, responsavel: "Ana Costa", produto: "Toalha Bordada", tema: "Corporativo", tipo: "normal", mes: "Jun", dataCriacao: "2025-06-05", entregue: true },
];

export default function App() {
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroProduto, setFiltroProduto] = useState("todos");
  const [filtroTema, setFiltroTema] = useState("todos");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");

  // Aplicar filtros a todos os pedidos
  const pedidosFiltrados = useMemo(() => {
    return todosPedidos.filter((pedido) => {
      if (filtroTipo !== "todos" && pedido.tipo !== filtroTipo) return false;
      if (filtroProduto !== "todos" && pedido.produto !== filtroProduto) return false;
      if (filtroTema !== "todos" && pedido.tema !== filtroTema) return false;
      if (filtroDataInicio && pedido.dataCriacao < filtroDataInicio) return false;
      if (filtroDataFim && pedido.dataCriacao > filtroDataFim) return false;
      return true;
    });
  }, [filtroTipo, filtroProduto, filtroTema, filtroDataInicio, filtroDataFim]);

  // Calcular KPIs baseados nos pedidos filtrados
  const kpis = useMemo(() => {
    const total = pedidosFiltrados.length;
    const entregues = pedidosFiltrados.filter(p => p.entregue).length;
    const atrasados = pedidosFiltrados.filter(p => p.tipo === "atrasado").length;
    const semAtualizacao = pedidosFiltrados.filter(p => !p.entregue && p.diasParado >= 4).length;
    const retrabalho = pedidosFiltrados.filter(p => p.tipo === "retrabalho").length;
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
  }, [pedidosFiltrados]);

  // Dados para gráficos baseados nos pedidos filtrados
  const pedidosMesData = useMemo(() => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    return meses.map(mes => {
      const pedidosDoMes = pedidosFiltrados.filter(p => p.mes === mes);
      return {
        mes,
        criados: pedidosDoMes.length,
        entregues: pedidosDoMes.filter(p => p.entregue).length
      };
    });
  }, [pedidosFiltrados]);

  const leadTimeData = [
    { mes: "Jan", leadTime: 12.5 },
    { mes: "Fev", leadTime: 11.8 },
    { mes: "Mar", leadTime: 10.2 },
    { mes: "Abr", leadTime: 11.5 },
    { mes: "Mai", leadTime: 9.8 },
    { mes: "Jun", leadTime: 9.2 },
  ];

  const etapasProcessoData = [
    { etapa: "Análise", dias: 2.5 },
    { etapa: "Aprovação", dias: 1.8 },
    { etapa: "Produção", dias: 5.2 },
    { etapa: "Qualidade", dias: 1.5 },
    { etapa: "Expedição", dias: 2.1 },
  ];

  const retrabalhoData = useMemo(() => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    return meses.map(mes => {
      const retrabalhoDoMes = pedidosFiltrados.filter(p => p.mes === mes && p.tipo === "retrabalho");
      return {
        mes,
        quantidade: retrabalhoDoMes.length
      };
    });
  }, [pedidosFiltrados]);

  const pedidosConcluidosData = useMemo(() => {
    const funcionarios = ["Carlos Silva", "Ana Costa", "João Santos", "Maria Oliveira", "Pedro Lima"];
    return funcionarios.map(funcionario => {
      const pedidosConcluidos = pedidosFiltrados.filter(p => p.responsavel === funcionario && p.entregue);
      return {
        funcionario,
        pedidos: pedidosConcluidos.length
      };
    });
  }, [pedidosFiltrados]);

  const cargaTrabalhoData = useMemo(() => {
    const funcionarios = ["Carlos Silva", "Ana Costa", "João Santos", "Maria Oliveira", "Pedro Lima"];
    return funcionarios.map(funcionario => {
      const emAndamento = pedidosFiltrados.filter(p => p.responsavel === funcionario && !p.entregue);
      return {
        funcionario,
        emAndamento: emAndamento.length
      };
    });
  }, [pedidosFiltrados]);

  const pedidosSemAtualizacao = useMemo(() => {
    return pedidosFiltrados.filter(p => !p.entregue && p.diasParado >= 3);
  }, [pedidosFiltrados]);

  return (
    <div className="min-h-screen bg-[#faf8f7]">
      {/* Header */}
      

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-[#e67e96]">Dashboard de Gestão de Pedidos</h1>
          <p className="text-neutral-400 mt-1">Visão geral operacional - Junho 2025</p>
        </div>

        {/* Filtros Globais */}
        <Card className="p-6 bg-white border-neutral-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="size-5 text-[#e67e96]" />
            <h3 className="text-neutral-800">Filtros da Dashboard</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filtro de Tipo */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Tipo de Pedido</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="bg-white border-neutral-200">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="atrasado">Atrasados</SelectItem>
                  <SelectItem value="retrabalho">Em Retrabalho</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Produto */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Produto</label>
              <Select value={filtroProduto} onValueChange={setFiltroProduto}>
                <SelectTrigger className="bg-white border-neutral-200">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Caneca Personalizada">Caneca Personalizada</SelectItem>
                  <SelectItem value="Camiseta Estampada">Camiseta Estampada</SelectItem>
                  <SelectItem value="Almofada Personalizada">Almofada Personalizada</SelectItem>
                  <SelectItem value="Toalha Bordada">Toalha Bordada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Tema */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Tema</label>
              <Select value={filtroTema} onValueChange={setFiltroTema}>
                <SelectTrigger className="bg-white border-neutral-200">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Aniversário">Aniversário</SelectItem>
                  <SelectItem value="Casamento">Casamento</SelectItem>
                  <SelectItem value="Festa Infantil">Festa Infantil</SelectItem>
                  <SelectItem value="Corporativo">Corporativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Data Início */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Data Início</label>
              <Input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                className="bg-white border-neutral-200"
              />
            </div>

            {/* Filtro de Data Fim */}
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

          {/* Botão Limpar Filtros */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setFiltroTipo("todos");
                setFiltroProduto("todos");
                setFiltroTema("todos");
                setFiltroDataInicio("");
                setFiltroDataFim("");
              }}
              className="border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              Limpar Filtros
            </Button>
          </div>

          {/* Contador de Resultados */}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-600">
              Exibindo <span className="text-[#e67e96]">{pedidosFiltrados.length}</span> de {todosPedidos.length} pedidos
            </p>
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
            <p className="text-neutral-400 text-sm mt-3">Filtrados</p>
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
                <p className="text-neutral-800 mt-1">9.2 dias</p>
              </div>
              <div className="bg-[#fce4e8] p-2 rounded-lg">
                <Clock className="size-5 text-[#e67e96]" />
              </div>
            </div>
            <p className="text-[#e67e96] text-sm mt-3">↓ 6% vs mês anterior</p>
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
          <h2 className="text-neutral-800">Gráficos Operacionais</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pedidos criados x entregues */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4">Pedidos Criados vs Entregues</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pedidosMesData}>
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
                  <Legend />
                  <Bar dataKey="criados" fill="#f7b4c4" name="Criados" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="entregues" fill="#e67e96" name="Entregues" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Lead Time */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4">Tempo Médio de Entrega (dias)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={leadTimeData}>
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
              <h3 className="text-neutral-800 mb-4">Tempo Médio por Etapa (dias)</h3>
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
              <h3 className="text-neutral-800 mb-4">Pedidos Refeitos por Mês</h3>
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
          <h2 className="text-neutral-800">Produtividade da Equipe</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pedidos concluídos */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4">Pedidos Concluídos por Funcionário</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pedidosConcluidosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="funcionario" stroke="#a3a3a3" angle={-15} textAnchor="end" height={80} />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="pedidos" fill="#e67e96" name="Concluídos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Carga de trabalho */}
            <Card className="p-6 bg-white border-neutral-100 shadow-sm">
              <h3 className="text-neutral-800 mb-4">Carga de Trabalho Atual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cargaTrabalhoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="funcionario" stroke="#a3a3a3" angle={-15} textAnchor="end" height={80} />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="emAndamento" fill="#f7b4c4" name="Em Andamento" radius={[4, 4, 0, 0]} />
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
                  <TableHead className="text-neutral-800">Produto</TableHead>
                  <TableHead className="text-neutral-800">Tema</TableHead>
                  <TableHead className="text-neutral-800">Status Atual</TableHead>
                  <TableHead className="text-neutral-800">Dias Parado</TableHead>
                  <TableHead className="text-neutral-800">Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosSemAtualizacao.length > 0 ? (
                  pedidosSemAtualizacao.map((pedido) => (
                    <TableRow key={pedido.id} className="border-neutral-100">
                      <TableCell className="text-neutral-800">{pedido.id}</TableCell>
                      <TableCell className="text-neutral-600">{pedido.cliente}</TableCell>
                      <TableCell className="text-neutral-600">{pedido.produto}</TableCell>
                      <TableCell className="text-neutral-600">{pedido.tema}</TableCell>
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
                    <TableCell colSpan={7} className="text-center text-neutral-400 py-8">
                      Nenhum pedido encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}
