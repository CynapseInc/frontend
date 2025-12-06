import Styles from "./input.module.css";
// import type { ReactNode } from 'react';


interface InputProps {
  classeCss?: string; 
  multiLinha?: boolean
  placeholder?: string;
  value?: string;
  type?: string;
  readOnly?: boolean;
  onChange?: (e: any)=> void;
}

export function Input({classeCss = '', placeholder = '', multiLinha = false, value, onChange, type = "text", readOnly = false}: InputProps){
  
  if(multiLinha){
        return(  
        <textarea 
            value={value}
            onChange={onChange}
            placeholder={placeholder} 
            className={`${Styles.input} ${classeCss}`}/>  
        )
  }
  return(
        <input 
          type={type} 
          readOnly={readOnly}
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          className={`${Styles.input} ${classeCss}`} />
    )
}