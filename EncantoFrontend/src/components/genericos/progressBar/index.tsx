import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progresso: number;
  cor: string;
  classeEstilo?: String;
}

export function ProgressBar({ progresso, cor, classeEstilo }: ProgressBarProps) {
  return (
    <div className={`${styles.trilho} ${classeEstilo}`}>
      <div 
        className={styles.preenchimento} 
        style={{ width: `${progresso}%`, backgroundColor: cor }} 
      />
    </div>
  );
}