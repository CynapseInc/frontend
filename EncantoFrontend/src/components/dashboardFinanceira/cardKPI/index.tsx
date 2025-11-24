import type { ReactNode } from 'react';
import { Card } from '../../genericos/card'; // <--- Importamos a moldura!
import styles from './cardKPI.module.css';

interface SummaryProps {
  titulo: string;
  valor: string;
  icone: ReactNode;
  porcentagem: string;
  textoAbaixo: string;
  tipo: 'positivo' | 'negativo';
}

export function SummaryCard({ titulo, valor, icone, porcentagem, textoAbaixo, tipo }: SummaryProps) {
  return (
    <Card> 
      
      <div className={styles.header}>
        <span className={styles.titulo}>{titulo}</span>
        <div className={styles.bolinhaIcone}>{icone}</div>
      </div>

      <div className={styles.conteudoPrincipal}>
        <strong className={styles.valorGigante}>{valor}</strong>
        
        <div className={styles.rodape}>
          <span className={tipo === 'positivo' ? styles.verde : styles.vermelho}>
            {porcentagem}
          </span>
          <span className={styles.textoCinza}> {textoAbaixo}</span>
        </div>
      </div>

    </Card>
  );
}