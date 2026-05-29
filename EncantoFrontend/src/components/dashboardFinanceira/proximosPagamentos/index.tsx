import { Card } from '../../genericos/card';
import { ItemPagamento } from './itemPagamento';
import styles from './ProximosPagamentos.module.css';

interface PagamentoItem {
  id: number;
  nome: string;
  categoria: string;
  valor: number;
  dataTexto: string;
  status: 'atrasado' | 'proximo';
}

interface ProximosPagamentosProps {
  pagamentos?: PagamentoItem[];
}

const dadosPagamentosPadrao = [
  {
    id: 1,
    nome: 'Conta de Luz - Atrasada',
    categoria: 'Infraestrutura',
    valor: 450.00,
    dataTexto: 'Venceu há 5 dias',
    status: 'atrasado' as const
  },
  {
    id: 2,
    nome: 'Salário - Maria Silva',
    categoria: 'Funcionários',
    valor: 3500.00,
    dataTexto: '17/11/2025 (3 dias)',
    status: 'proximo' as const
  },
  {
    id: 3,
    nome: 'Fornecedor - Canecas Premium',
    categoria: 'Fornecedores',
    valor: 2800.00,
    dataTexto: '19/11/2025 (5 dias)',
    status: 'proximo' as const
  },
  {
    id: 4,
    nome: 'Freelancer - Design Gráfico',
    categoria: 'Freelancers',
    valor: 1200.00,
    dataTexto: '21/11/2025 (7 dias)',
    status: 'proximo' as const
  }
];

export function ProximosPagamentos({ pagamentos = [] }: ProximosPagamentosProps) {
  
  if (!pagamentos || pagamentos.length === 0) {
    return (
      <Card classeCss={styles.containerPagamentos}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className={styles.cabecalho}>
            <h3 className={styles.titulo}>Próximos Pagamentos</h3>
          </div>
          <div className={styles.listaScroll} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>Sem dados</p>
          </div>
        </div>
        <div className={styles.totalContainer}>
          <span className={styles.labelTotal}>Total a Pagar</span>
          <span className={styles.valorTotal}>
            {(0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </Card>
    );
  }

  const total = pagamentos.reduce((acc, item) => acc + item.valor, 0);

  return (
    <Card classeCss={styles.containerPagamentos}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className={styles.cabecalho}>
            <h3 className={styles.titulo}>Próximos Pagamentos</h3>
        </div>

        <div className={styles.listaScroll}>
            {pagamentos.map((item) => (
            <ItemPagamento 
                key={item.id}
                nome={item.nome}
                categoria={item.categoria}
                valor={item.valor}
                dataTexto={item.dataTexto}
                status={item.status}
            />
            ))}
        </div>
      </div>

      <div className={styles.totalContainer}>
        <span className={styles.labelTotal}>Total a Pagar</span>
        <span className={styles.valorTotal}>
          {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

    </Card>
  );
}
