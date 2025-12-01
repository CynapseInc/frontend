import styles from './dashboardFinanceira.module.css';
import { LuDollarSign } from "react-icons/lu";
import { FiCreditCard } from "react-icons/fi";
import { TfiWallet } from "react-icons/tfi";
import { IoAlertOutline } from "react-icons/io5";
import { CardKPI } from "./cardKPI";
import { Card } from "../genericos/card";
import { Button } from "../genericos/button";
import { EvolucaoMensalGrafico } from "./evolucaoMensalGrafico";
import { DespesasPorCategoria } from "./despesasPorCategoria";


export function DashFinanceira() {
  return (
    <div className={styles.conteudo}>
      <span className={styles.titulo}>Controle Financeiro</span>
      <span className={styles.textoSecundario}>Acompanhe suas receitas, despesas e indicadores financeiros</span>
      <Card classeCss={styles.cardConteudoFiltros}>
        <div className={styles.containerFiltro}>
          <span className={styles.tituloFiltro}>Data Inicial</span>
          <input type="text" className={styles.filtros} />
        </div>
        <div className={styles.containerFiltro}>
          <span className={styles.tituloFiltro}>Data Final</span>
          <input type="text" className={styles.filtros} />
        </div>
        <Button classeCss={styles.botaoFiltro}>Aplicar Filtros</Button>
        
      </Card>
      <div className={styles.containerCards}>
        <CardKPI icone={<LuDollarSign/>} classeIconeCor={styles.rosa} porcentagem='+12.5%' textoAbaixo='vs mês anterior' tipo='positivo' titulo='Receitas' valor='R$ 28.000,00' />
        <CardKPI icone={<FiCreditCard/>} classeIconeCor={styles.rosaForte} porcentagem='-5.3%' textoAbaixo='vs mês anterior' tipo='negativo' titulo='Despesas' valor='R$ 12.000,00' />
        <CardKPI icone={<TfiWallet/>} classeIconeCor={styles.marrom} porcentagem='+18.2%' textoAbaixo='vs mês anterior' tipo='positivo' titulo='Lucro' valor='R$ 16.000,00' />
        <CardKPI icone={<IoAlertOutline/>} classeIconeCor={styles.rosaClaro} porcentagem='-8.7%' textoAbaixo='vs mês anterior' tipo='negativo' titulo='A Pagar' valor='R$ 7.950,00' />
      </div>
      <div style={{display: 'flex'}}>
        
        <div className={styles.containerCardGraficos}>
          <EvolucaoMensalGrafico />
        
          <DespesasPorCategoria/>
        </div>

      </div>
    </div>
  );
}