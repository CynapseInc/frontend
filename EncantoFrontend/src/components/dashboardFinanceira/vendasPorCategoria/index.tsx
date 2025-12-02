import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from '../../genericos/card';
import styles from './graficoVendasCategoria.module.css';

const dadosExemplo = [
  { categoria: 'Heróis', receita: 12000, quantidade: 45 },
  { categoria: 'Princesas', receita: 18000, quantidade: 68 },
  { categoria: 'Times', receita: 9000, quantidade: 30 },
  { categoria: 'Infantil', receita: 15000, quantidade: 58 },
  { categoria: 'Nerd', receita: 10000, quantidade: 38 },
];

export function GraficoVendasCategoria() {
  return (
    <Card classeCss={styles.containerGrafico}>
      <h3 className={styles.tituloGrafico}>Categorias Mais Vendidas</h3>

      <div className={styles.areaGrafico}>
        <ResponsiveContainer width="100%" height="100%">
          
          <ComposedChart 
            data={dadosExemplo} 
            margin={{ top: 20, right: 0, bottom: -5, left: 20 }}
            barCategoryGap="20%" 
          >
             
            <CartesianGrid 
              stroke="#e0e0e0" 
              vertical={true} 
              horizontal={true}
              strokeDasharray="4 4" 
            />
            
             <XAxis 
              dataKey="categoria" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6D6875', fontSize: 12, fontWeight: 500 }}
              dy={5} 
            />
            
            <YAxis 
              yAxisId="esquerda" 
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6D6875', fontSize: 12 }}
              tickFormatter={(val) => `R$ ${val / 1000}k`}
              domain={[0, 20000]}
              tickCount={5}
            />

            <YAxis 
              yAxisId="direita" 
              orientation="right"
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6D6875', fontSize: 12 }}
              domain={[0, 80]}
              tickCount={5}
            />

            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            />

            <Legend 
              verticalAlign="bottom" 
              height={20} 
              iconType="circle"
               fontSize={10}
              wrapperStyle={{ paddingTop: '0px', paddingBottom: '0px' }} 
            />

            <Bar 
              yAxisId="esquerda" 
              dataKey="receita" 
              name="Receita (R$)" 
              fill="#FFC8DD" 
              radius={[12, 12, 0, 0]} 
            />

            <Line 
              yAxisId="direita" 
              type="monotone" 
              dataKey="quantidade" 
              name="Quantidade de Pedidos"
              stroke="#9D8189" 
              strokeWidth={4}
              dot={{ r: 6, fill: '#9D8189', strokeWidth: 0 }} 
              activeDot={{ r: 8 }}
            />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}