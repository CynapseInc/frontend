import type { ReactNode } from "react"; 
import styles from "./Button.module.css"; 

interface ButtonProps {
    children: ReactNode; 
    classeCss?: String
    variante?: 'rosa' | 'branco'
    onClick?: () => void
}

export function Button({ children, classeCss, variante = 'rosa', onClick }: ButtonProps) {
  
  const classeEstilo = (variante == 'branco' ? styles.botaoBranco : styles.botaoRosa);

  return (
    <button className={`${classeEstilo} ${classeCss}`} onClick={onClick}>
      {children}
    </button>
  );
}