import type { ReactNode } from "react"; 
import styles from "./Button.module.css"; 

interface ButtonProps {
    conteudo: ReactNode
    variante?: 'rosa' | 'branco'
    onClick?: () => void
}

export function Button({ conteudo, variante = 'rosa', onClick }: ButtonProps) {
  
  const classeEstilo = (variante == 'branco' ? styles.botaoBranco : styles.botaoRosa);

  return (
    <button className={classeEstilo} onClick={onClick}>
      {conteudo}
    </button>
  );
}