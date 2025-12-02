import styles from '../ProximosPagamentos.module.css';

const IconeAlerta = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

interface ItemPagamentoProps {
  nome: string;
  categoria: string;
  valor: number;
  dataTexto: string;
  status: 'atrasado' | 'proximo';
}

export function ItemPagamento({ nome, categoria, valor, dataTexto, status }: ItemPagamentoProps) {
  
  const classeStatus = status === 'atrasado' ? styles.atrasado : styles.proximo;

  return (
    <div className={`${styles.cardItem} ${classeStatus}`}>
      
      <div className={styles.linhaTopo}>
        <span className={styles.nomeItem}>{nome}</span>
        <span className={styles.valorItem}>
          {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      <span className={styles.categoriaItem}>{categoria}</span>

      <div className={styles.dataContainer}>
        {status === 'atrasado' && <IconeAlerta />}
        <span>{dataTexto}</span>
      </div>

    </div>
  );
}