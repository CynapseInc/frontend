import Styles from "./input.module.css";
// import type { ReactNode } from 'react';


interface InputProps {
  classeCss?: string; 
  multiLinha?: boolean
  placeholder?: string;
}

export function Input({classeCss = '', placeholder = '', multiLinha = false}: InputProps){
  
  if(multiLinha){
        return(  
        <textarea placeholder={placeholder} className={`${Styles.input} ${classeCss}`}/>  
        )
  }
  return(
        <input type="text" placeholder={placeholder} className={`${Styles.input} ${classeCss}`} />
    )
}