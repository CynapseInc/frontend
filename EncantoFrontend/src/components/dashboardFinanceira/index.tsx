// 
import styles from './dashboardFinanceira.module.css';

import { LuDollarSign } from "react-icons/lu";
import { FiCreditCard } from "react-icons/fi";
import { TfiWallet } from "react-icons/tfi";
import { IoAlertOutline } from "react-icons/io5";
import { CardKPI } from "./cardKPI";
import { Button } from "../genericos/button";
import { Input } from "../genericos/input";
import { EvolucaoMensalGrafico } from "./evolucaoMensalGrafico";
import { DespesasPorCategoria } from "./despesasPorCategoria";
import { GraficoVendasCategoria } from "./vendasPorCategoria";
import { ProximosPagamentos } from "./proximosPagamentos";
import { useEffect, useState } from 'react';
import { dashFinanceiraService } from '../../services/DashFinanceira';

interface KPIs {
  totalReceita?: string;
  totalDespesa?: string;
  totalLucro?: string;
  totalAPagar?: string;
  varReceita?: number;
  varDespesa?: number;
  varLucro?: number;
  varAPagar?: number;
}

interface EvolucaoMensalItem {
  mes: string;
  receita: number;
  despesa: number;
}

interface DespesasItem {
  id: number;
  nome: string;
  valor: string;
  pct: number;
  cor: string;
}

interface CategoriaVenda {
  categoria: string;
  receita: number;
  quantidade: number;
}

interface PagamentoItem {
  id: number;
  nome: string;
  categoria: string;
  valor: number;
  dataTexto: string;
  status: 'atrasado' | 'proximo';
}

export function DashFinanceira() {
  const [kpis, setKpis] = useState<KPIs>({});
  const [evolucaoMensal, setEvolucaoMensal] = useState<EvolucaoMensalItem[]>([]);
  const [despesasPorCategoria, setDespesasPorCategoria] = useState<DespesasItem[]>([]);
  const [categoriasMaisVendidas, setCategoriasMaisVendidas] = useState<CategoriaVenda[]>([]);
  const [proximosPagamentos, setProximosPagamentos] = useState<PagamentoItem[]>([]);

  // Função para obter data atual no formato YYYY-MM
  const obterMesAtual = (): string => {
    const agora = new Date();
    return agora.getFullYear() + '-' + String(agora.getMonth() + 1).padStart(2, '0');
  };

  // Estados para filtro de data
  const [dataInicio, setDataInicio] = useState<string>('2025-01');
  const [dataFim, setDataFim] = useState<string>(obterMesAtual());

  // Função para formatar valores em BRL
  const formatarValor = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Função para transformar dados de evolução mensal (Corrigida para Fuso Horário)
  const transformarEvolucaoMensal = (dados: any[]) => {
    const meses: { [key: string]: any } = {};
    
    dados.forEach((item) => {
      const partes = item.mesReferencia.split('-'); 
      const mesAnoKey = `${partes[0]}-${partes[1]}`;
      
      const mesIndex = parseInt(partes[1], 10) - 1;
      const nomeMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][mesIndex];
      
      if (!meses[mesAnoKey]) {
        meses[mesAnoKey] = { mes: nomeMes, receita: 0, despesa: 0 };
      }
      
      if (item.tipoMovimentacao === 'Receita') {
        meses[mesAnoKey].receita += item.valorMesAtual;
      } else {
        meses[mesAnoKey].despesa += Math.abs(item.valorMesAtual);
      }
    });
    
    return Object.values(meses);
  };

  // Função para transformar despesas por categoria
  const transformarDespesasCategoria = (dados: any[]) => {
    const total = dados.reduce((sum, item) => sum + Math.abs(item.total), 0);
    
    const cores = ['#FFCAD4', '#F4ACB7', '#FFE5D9', '#D8E2DC'];
    
    return dados.map((item, index) => ({
      id: index + 1,
      nome: item.categoria,
      valor: formatarValor(Math.abs(item.total)),
      pct: Number(((Math.abs(item.total) / total) * 100).toFixed(1)),
      cor: cores[index % cores.length]
    }));
  };

  // Função para transformar categorias mais vendidas
  const transformarCategoriasMaisVendidas = (dados: any[]) => {
    return dados.slice(0, 5).map((item) => ({
      categoria: item.categoria,
      receita: item.total,
      quantidade: Math.floor(item.total / 100) // Estimativa de quantidade
    }));
  };

  // Função para transformar próximos pagamentos
  const transformarProximosPagamentos = (dados: any[]): PagamentoItem[] => {
    return dados.map((item, index) => ({
      id: index + 1,
      nome: item.descricao,
      categoria: item.categoria,
      valor: Math.abs(item.valor),
      dataTexto: item.dataVencimentoFormatada,
      status: (item.isAtrasado ? 'atrasado' : 'proximo') as 'atrasado' | 'proximo'
    }));
  };

  // Adiciona o dia 01 para o início do filtro
  const converterDataInicioParaAPI = (data: string): string => {
    return data + '-01';
  };

  // Calcula automaticamente se o mês acaba no dia 28, 30 ou 31 para o final do filtro
  const converterDataFimParaAPI = (data: string): string => {
    const [ano, mes] = data.split('-');
    // O dia '0' no Javascript nos dá o último dia do mês exato
    const ultimoDia = new Date(Number(ano), Number(mes), 0).getDate();
    return `${data}-${ultimoDia.toString().padStart(2, '0')}`;
  };

  const obterMesAnterior = (dataStr: string) => {
    const [ano, mes] = dataStr.split('-').map(Number);
    const dataObj = new Date(ano, mes - 2, 1); 
    return `${dataObj.getFullYear()}-${String(dataObj.getMonth() + 1).padStart(2, '0')}`;
  };

  const calcularVariacao = (atual: number, anterior: number): number => {
    if (!anterior || anterior === 0) return atual > 0 ? 100 : 0;
    return ((atual - anterior) / Math.abs(anterior)) * 100;
  };
  
  const formatarTrend = (valor?: number) => {
    if (valor === undefined) return '0.0%';
    return `${valor > 0 ? '+' : ''}${valor.toFixed(1)}%`;
  };

  const buscarDadosComFiltros = async () => {
    try {
      const dataInicioFormatada = converterDataInicioParaAPI(dataInicio);
      const dataFimFormatada = converterDataFimParaAPI(dataFim);

      const dataInicioAntFormatada = converterDataInicioParaAPI(obterMesAnterior(dataInicio));
      const dataFimAntFormatada = converterDataFimParaAPI(obterMesAnterior(dataFim));

      const [data, dataAnterior] = await Promise.all([
        dashFinanceiraService.listarDashFinanceiros(dataInicioFormatada, dataFimFormatada),
        dashFinanceiraService.listarDashFinanceiros(dataInicioAntFormatada, dataFimAntFormatada)
      ]);

      // Reaproveitar dados do gráfico de evolução mensal para calcular as variações
      const evolucaoAtual = transformarEvolucaoMensal(data.evolucaoMensal);
      let receitaAtual = 0, receitaAnterior = 0, despesaAtual = 0, despesaAnterior = 0, lucroAtual = 0, lucroAnterior = 0;
      if (evolucaoAtual.length >= 2) {
        const penultimo = evolucaoAtual[evolucaoAtual.length - 2];
        const ultimo = evolucaoAtual[evolucaoAtual.length - 1];
        receitaAnterior = penultimo.receita;
        receitaAtual = ultimo.receita;
        despesaAnterior = penultimo.despesa;
        despesaAtual = ultimo.despesa;
        lucroAnterior = penultimo.receita - penultimo.despesa;
        lucroAtual = ultimo.receita - ultimo.despesa;
      } else if (evolucaoAtual.length === 1) {
        receitaAtual = evolucaoAtual[0].receita;
        despesaAtual = evolucaoAtual[0].despesa;
        lucroAtual = receitaAtual - despesaAtual;
      }

      const varReceita = calcularVariacao(receitaAtual, receitaAnterior);
      const varDespesa = calcularVariacao(despesaAtual, despesaAnterior);
      const varLucro = calcularVariacao(lucroAtual, lucroAnterior);
      // varAPagar permanece igual pois não está no gráfico
      const varAPagar = calcularVariacao(Math.abs(data.kpi.totalAPagar), Math.abs(dataAnterior.kpi.totalAPagar));

      const totalPagar = formatarValor(Math.abs(data.kpi.totalAPagar));
      const totalDespesa = formatarValor(Math.abs(data.kpi.totalDespesa));
      const totalLucro = formatarValor(data.kpi.totalLucro);
      const totalReceita = formatarValor(data.kpi.totalReceita);

      setKpis({
        totalReceita,
        totalDespesa,
        totalLucro,
        totalAPagar: totalPagar,
        varReceita,
        varDespesa,
        varLucro,
        varAPagar
      });

      setEvolucaoMensal(evolucaoAtual);
      setDespesasPorCategoria(transformarDespesasCategoria(data.despesasPorCategoria));
      setCategoriasMaisVendidas(transformarCategoriasMaisVendidas(data.categoriasMaisVendidas));
      setProximosPagamentos(transformarProximosPagamentos(data.proximosPagamentos));

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard financeiro:', error);
    }
  };

  useEffect(() => {
    buscarDadosComFiltros();
  }, [dataInicio, dataFim]);

  

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
  <div className={`w-full max-w-[1600px] mx-auto px-8 py-10 box-border ${styles.conteudo}`}>

      <div className={styles.cabecalho}>
        <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Controle Financeiro</h1>
        <p className={styles.textoSecundario}>
          Acompanhe suas receitas, despesas e indicadores financeiros
        </p>
      </div>

{/* Filtros */}
<div className={styles.cardConteudoFiltros}>
  <div className={styles.containerFiltro}>
    <span className={styles.tituloFiltro}>Data Inicial</span>
    <Input 
      type='month'
      value={dataInicio}
      onChange={(e) => {
        console.log('Data início alterada para:', e.target.value);
        setDataInicio(e.target.value);
      }}
      classeCss={styles.inputFiltro} 
    />
  </div>
  <div className={styles.containerFiltro}>
    <span className={styles.tituloFiltro}>Data Final</span>
    <Input 
      type='month'
      value={dataFim}
      onChange={(e) => {
        console.log('Data fim alterada para:', e.target.value);
        setDataFim(e.target.value);
      }}
      classeCss={styles.inputFiltro} 
    />
  </div>
  <Button onClick={() => {
    console.log('Botão Aplicar Filtros clicado');
    buscarDadosComFiltros();
  }} classeCss={styles.botaoFiltro}>Aplicar Filtros</Button>
</div>

      <div className={styles.containerCards}>
        <CardKPI 
          icone={<LuDollarSign />} classeIconeCor="bg-[#FFCAD4]" 
          porcentagem={formatarTrend(kpis.varReceita)} 
          textoAbaixo='vs mês anterior' 
          tipo={(kpis.varReceita || 0) >= 0 ? 'positivo' : 'negativo'} 
          titulo='Receitas' valor={kpis.totalReceita || 'R$ 0,00'} 
        />
        <CardKPI 
          icone={<FiCreditCard />} classeIconeCor="bg-[#F4ACB7]" 
          porcentagem={formatarTrend(kpis.varDespesa)} 
          textoAbaixo='vs mês anterior' 
          tipo={(kpis.varDespesa || 0) <= 0 ? 'positivo' : 'negativo'} 
          titulo='Despesas' valor={kpis.totalDespesa || 'R$ 0,00'} 
        />
        <CardKPI 
          icone={<TfiWallet />} classeIconeCor="bg-[#9D8189]" 
          porcentagem={formatarTrend(kpis.varLucro)} 
          textoAbaixo='vs mês anterior' 
          tipo={(kpis.varLucro || 0) >= 0 ? 'positivo' : 'negativo'} 
          titulo='Lucro' valor={kpis.totalLucro || 'R$ 0,00'} 
        />
        <CardKPI 
          icone={<IoAlertOutline />} classeIconeCor="bg-[#FFE5D9]" 
          porcentagem={formatarTrend(kpis.varAPagar)} 
          textoAbaixo='vs mês anterior' 
          tipo={(kpis.varAPagar || 0) <= 0 ? 'positivo' : 'negativo'} 
          titulo='A Pagar' valor={kpis.totalAPagar || 'R$ 0,00'} 
        />
      </div>

      {/* Gráficos usando Grid */}
      <div className={styles.containerCardGraficos}>
        <EvolucaoMensalGrafico dados={evolucaoMensal} />
        <DespesasPorCategoria despesas={despesasPorCategoria} />
      </div>
      
      <div className={styles.containerCardGraficos}>
        <GraficoVendasCategoria dados={categoriasMaisVendidas} />
        <ProximosPagamentos pagamentos={proximosPagamentos} />
      </div>

    </div>
    </div>
  );
}