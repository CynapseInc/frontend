import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackText = 'Sem imagem',
  ...props 
}) => {
  const [error, setError] = useState(false);

  // 1. O SEGREDO ESTÁ AQUI: 
  // Se a imagem começar com "/uploads", sabemos que veio do Java.
  // Então adicionamos a URL base do seu servidor backend (localhost:8080)
  const backendUrl = 'http://localhost:8080';
  const finalSrc = src && src.startsWith('/uploads') ? `${backendUrl}${src}` : src;

  // Se der erro ao carregar ou não tiver src, mostra um quadrado cinza bonitinho
  if (error || !finalSrc) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center border border-gray-200 ${className}`} {...props}>
         <span className="text-gray-400 text-[11px] text-center p-2 font-medium">
           {fallbackText}
         </span>
      </div>
    );
  }

  // Se tiver src, tenta renderizar a imagem real
  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}