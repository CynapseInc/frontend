import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import EncantoLogo from '../assets/logoEncanto.png';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkProps = (caminho: string) => {
    const currentPath = location.pathname + location.hash;
    const estaAtivo = currentPath === caminho || (caminho === '/catalogo' && location.pathname === '/catalogo' && location.hash === '');

    return {
      className: `cursor-pointer transition-all duration-300 ${
        estaAtivo 
          ? 'text-[#F4ACB7]' 
          : 'text-[#9D8189] hover:text-[#F4ACB7]'
      }`,
      style: { 
        fontWeight: estaAtivo ? 'bold' : 'normal' 
      } as const
    };
  };

  return (
    <header 
      className="navbar-padrao" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 2vw', 
        height: '10vh', 
        borderBottom: '1px solid #D8E2DC', 
        backgroundColor: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 40 
      }}
    >
      
      {/* Logo */}
      <div 
        style={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }} 
        onClick={() => navigate('/catalogo')}
        title="Ir para a Home"
      >
        <img 
          src={EncantoLogo} 
          alt="Logo O Encanto Personalizados" 
          style={{ 
            height: '6.5vh',
            width: 'auto',   
            objectFit: 'contain' 
          }} 
        />
      </div>

      {/* Links de Navegação com Funcionalidade de Seleção */}
      <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
        <div onClick={() => navigate('/catalogo')} {...getLinkProps('/catalogo')}>
          Home
        </div>
        <div onClick={() => navigate('/pesquisa-produtos')} {...getLinkProps('/pesquisa-produtos')}>
          Produtos
        </div>
        <div onClick={() => navigate('/catalogo#contato')} {...getLinkProps('/catalogo#contato')}>
          Contato
        </div>
      </nav>

      {/* Carrinho (Mantendo sua funcionalidade e estilo do client) */}
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate("/carrinho")} 
          className="relative p-3 bg-[#FFE5D9] rounded-2xl hover:bg-[#FFCAD4] transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <ShoppingCart className="w-6 h-6 text-[#6D6875]" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#F4ACB7] text-white w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          )}
        </button>
      </div>
      
    </header>
  );
}

export default Navbar;