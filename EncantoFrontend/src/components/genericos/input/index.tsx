import Styles from "./input.module.css";
// import type { ReactNode } from 'react';


interface InputProps {
  classeCss?: string; 
}

export function Input({classeCss = '' }: InputProps){
    return(
        <input type="text" className={`${Styles.input} ${classeCss}`} />
    )
}