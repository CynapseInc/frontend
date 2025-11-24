import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode; 
  classeCss?: string; 
}

export function Card({ children, classeCss = '' }: CardProps) {
  return (
    <div className={`${styles.cardContainer} ${classeCss}`}>
      {children}
    </div>
  );
}