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
  
  const isDev = import.meta.env.MODE === 'development';
  
  const finalSrc = src && src.startsWith('/uploads') && isDev 
    ? `http://localhost:8080${src}` 
    : src;

  if (error || !finalSrc) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center border border-gray-200 ${className}`} {...props}>
         <span className="text-gray-400 text-[11px] text-center p-2 font-medium">
           {fallbackText}
         </span>
      </div>
    );
  }

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