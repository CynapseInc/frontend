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

export function DashFinanceira() {
  return (
    <div className={styles.conteudo}>
      
      {/* Cabeçalho */}
      <div className={styles.cabecalho}>
        <h1 className={styles.titulo}>Controle Financeiro</h1>
        <p className={styles.textoSecundario}>
          Acompanhe suas receitas, despesas e indicadores financeiros
        </p>
      </div>

{/* Filtros */}
<div className={styles.cardConteudoFiltros}>
  <div className={styles.containerFiltro}>
    <span className={styles.tituloFiltro}>Data Inicial</span>
    <Input classeCss={styles.inputFiltro} />
  </div>
  <div className={styles.containerFiltro}>
    <span className={styles.tituloFiltro}>Data Final</span>
    <Input classeCss={styles.inputFiltro} />
  </div>
  <Button classeCss={styles.botaoFiltro}>Aplicar Filtros</Button>
</div>

      {/* Cards KPI usando Grid */}
      <div className={styles.containerCards}>
        <CardKPI icone={<LuDollarSign />} classeIconeCor="bg-[#FFCAD4]" porcentagem='+12.5%' textoAbaixo='vs mês anterior' tipo='positivo' titulo='Receitas' valor='R$ 28.000,00' />
        <CardKPI icone={<FiCreditCard />} classeIconeCor="bg-[#F4ACB7]" porcentagem='-5.3%' textoAbaixo='vs mês anterior' tipo='negativo' titulo='Despesas' valor='R$ 12.000,00' />
        <CardKPI icone={<TfiWallet />} classeIconeCor="bg-[#9D8189]" porcentagem='+18.2%' textoAbaixo='vs mês anterior' tipo='positivo' titulo='Lucro' valor='R$ 16.000,00' />
        <CardKPI icone={<IoAlertOutline />} classeIconeCor="bg-[#FFE5D9]" porcentagem='-8.7%' textoAbaixo='vs mês anterior' tipo='negativo' titulo='A Pagar' valor='R$ 7.950,00' />
      </div>

      {/* Gráficos usando Grid */}
      <div className={styles.containerCardGraficos}>
        <EvolucaoMensalGrafico />
        <DespesasPorCategoria />
      </div>
      
      <div className={styles.containerCardGraficos}>
        <GraficoVendasCategoria />
        <ProximosPagamentos />
      </div>

    </div>
  );
}