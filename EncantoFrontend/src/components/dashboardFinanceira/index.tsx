import { LuDollarSign } from "react-icons/lu";
import { FiCreditCard } from "react-icons/fi";
import { TfiWallet } from "react-icons/tfi";
import { IoAlertOutline } from "react-icons/io5";
import { CardKPI } from "./cardKPI";
import { Card } from "../genericos/card";
import { Button } from "../genericos/button";
import { Input } from "../genericos/input";
import { EvolucaoMensalGrafico } from "./evolucaoMensalGrafico";
import { DespesasPorCategoria } from "./despesasPorCategoria";
import { GraficoVendasCategoria } from "./vendasPorCategoria";
import { ProximosPagamentos } from "./proximosPagamentos";

import { useLocation, useNavigate } from 'react-router-dom';

export function DashFinanceira() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Controle Financeiro</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>
            Acompanhe suas receitas, despesas e indicadores financeiros
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg p-5 shadow-sm mb-6" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex gap-4 items-end justify-center">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#6D6875] font-bold">Data Inicial</span>
              <Input classeCss="border border-[#D8E2DC] rounded h-10 w-64" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#6D6875] font-bold">Data Final</span>
              <Input classeCss="border border-[#D8E2DC] rounded h-10 w-64" />
            </div>
            <Button classeCss="px-6 py-2 h-11 text-sm">Aplicar Filtros</Button>
          </div>
        </div>

        {/* Cards KPI */}
        <div className="flex gap-4 mb-6 flex-wrap justify-center">
          <CardKPI icone={<LuDollarSign />} classeIconeCor="bg-[#FFCAD4]" porcentagem='+12.5%' textoAbaixo='vs mês anterior' tipo='positivo' titulo='Receitas' valor='R$ 28.000,00' />
          <CardKPI icone={<FiCreditCard />} classeIconeCor="bg-[#F4ACB7]" porcentagem='-5.3%' textoAbaixo='vs mês anterior' tipo='negativo' titulo='Despesas' valor='R$ 12.000,00' />
          <CardKPI icone={<TfiWallet />} classeIconeCor="bg-[#9D8189]" porcentagem='+18.2%' textoAbaixo='vs mês anterior' tipo='positivo' titulo='Lucro' valor='R$ 16.000,00' />
          <CardKPI icone={<IoAlertOutline />} classeIconeCor="bg-[#FFE5D9]" porcentagem='-8.7%' textoAbaixo='vs mês anterior' tipo='negativo' titulo='A Pagar' valor='R$ 7.950,00' />
        </div>

        {/* Gráficos */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <EvolucaoMensalGrafico />
            <DespesasPorCategoria />
          </div>
          <div className="flex gap-4">
            <GraficoVendasCategoria />
            <ProximosPagamentos />
          </div>
        </div>

      </div>
    </div>
  );
}