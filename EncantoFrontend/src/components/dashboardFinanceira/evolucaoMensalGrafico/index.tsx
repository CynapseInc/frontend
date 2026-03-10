import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from '../../genericos/card';
import styles from './evolucaoMensalChart.module.css';

interface EvolucaoMensalGraficoProps {
  dados?: Array<{
    mes: string;
    receita: number;
    despesa: number;
  }>;
}

const dadosFalsos = [
  { mes: 'Jan', receita: 14000, despesa: 8000 },
  { mes: 'Fev', receita: 18000, despesa: 10000 },
  { mes: 'Mar', receita: 22000, despesa: 15000 },
  { mes: 'Abr', receita: 19000, despesa: 12000 },
  { mes: 'Mai', receita: 25000, despesa: 18000 },
  { mes: 'Jun', receita: 28000, despesa: 14000 },
];

export function EvolucaoMensalGrafico({ dados = [] }: EvolucaoMensalGraficoProps) {
  
  if (!dados || dados.length === 0) {
    return (
      <Card classeCss={styles.containerGrafico}>
        <h3 className={styles.tituloGrafico}>Evolução Mensal</h3>
        <div className={styles.areaGrafico} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#999', fontSize: '14px' }}>Nenhum dado disponível para o período selecionado</p>
        </div>
      </Card>
    );
  }

  return (
    <Card classeCss={styles.containerGrafico}>
      
      <h3 className={styles.tituloGrafico}>Evolução Mensal</h3>
      <div className={styles.areaGrafico}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} barGap={4}>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="mes" 
              axisLine={{ stroke: '#6D6875', strokeWidth: 1 }} 
              tickLine={false} 
              tick={{ fill: '#9D8189', fontSize: 12 }} 
              dy={10} 
            />
            
            <YAxis 
              axisLine={{ stroke: '#6D6875', strokeWidth: 1 }} 
              tickLine={false} 
              tick={{ fill: '#9D8189', fontSize: 12 }}
              tickFormatter={(valor) => `R$ ${valor / 1000}k`} 
            />
            
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`}
            />

            <Bar 
              dataKey="despesa" 
              fill="#FFB5C2" 
              radius={[4, 4, 0, 0]} 
              barSize={30} 
            />
            <Bar 
              dataKey="receita" 
              fill="#FFD6E0" 
              radius={[4, 4, 0, 0]} 
              barSize={30} 
            />
            
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.legenda}>
        <div className={styles.itemLegenda}>
          <div className={styles.quadradoDespesa}></div>
          <span>Despesas</span>
        </div>
        <div className={styles.itemLegenda}>
          <div className={styles.quadradoReceita}></div>
          <span>Receitas</span>
        </div>
      </div>

    </Card>
  );
}