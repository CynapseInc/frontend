import type { ReactNode } from 'react';
import { Card } from '../../genericos/card';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import styles from './cardKPI.module.css';

interface KpiProps {
  titulo: string;
  valor: string;    
  icone: ReactNode;
  porcentagem: string;
  textoAbaixo: string;
  tipo: 'positivo' | 'negativo';
  classeIconeCor: string;
}

export function CardKPI({ titulo, valor, icone, porcentagem, textoAbaixo, tipo, classeIconeCor }: KpiProps) {
  return (
    <Card classeCss={styles.cardBody}> 
      
      {/* 1. Criamos uma linha superior que segura TUDO (menos o rodapé) */}
      <div className={styles.linhaSuperior}>
        
        {/* COLUNA DA ESQUERDA: Título e Valor juntos */}
        <div className={styles.infoEsquerda}>
            <span className={styles.titulo}>{titulo}</span>
            <span className={styles.valorGigante}>{valor}</span>
        </div>

        {/* COLUNA DA DIREITA: Só o ícone */}
        <div className={`${styles.bolinhaIcone} ${classeIconeCor}`}>{icone}</div>
      
      </div>

      {/* 2. O Rodapé continua separado embaixo */}

      <div className={styles.rodape}>
       {titulo !== 'A Pagar' && (
        <div className={tipo === 'positivo' ? styles.verde : styles.vermelho}>
          {tipo === 'positivo' ? <FaArrowTrendUp/> : <FaArrowTrendDown/>}
          <span>{porcentagem}</span>
        </div>
       )}
        {titulo !== 'A Pagar' && (
          <span className={styles.textoCinza}> {textoAbaixo}</span>
        )}
      </div>

    </Card>
  );
}