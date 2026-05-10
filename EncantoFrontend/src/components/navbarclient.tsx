import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Home, Package, MessageCircle } from 'lucide-react';
import EncantoLogo from '../assets/logoEncanto.png';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkProps = (caminho: string) => {
    const currentPath = location.pathname + location.hash;
    const estaAtivo = currentPath === caminho || (caminho === '/catalogo' && location.pathname === '/catalogo' && location.hash === '');

    return {
      className: `cursor-pointer transition-colors duration-300 ${
        estaAtivo 
          ? 'text-[#F4ACB7] font-bold' 
          : 'text-[#9D8189] hover:text-[#F4ACB7] font-normal'
      }`
    };
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#D8E2DC] w-full h-[10vh] min-h-[64px]">
      <div className="flex items-center justify-between w-full h-full px-8 md:px-[3vw]">
        
        {/* LADO ESQUERDO: Logo (Ocupa 1/3 do espaço para não espremer o centro) */}
        <div className="flex-1 flex justify-start h-full py-3">
          <div 
            className="flex items-center h-full cursor-pointer" 
            onClick={() => handleNavigation('/catalogo')}
          >
            <img 
              src={EncantoLogo} 
              alt="Logo O Encanto Personalizados" 
              className="h-12 md:h-[6.5vh] w-auto object-contain" 
            />
          </div>
        </div>

        {/* CENTRO: Links de Navegação (Visível APENAS no PC) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-16 text-base lg:text-lg whitespace-nowrap">
          <div onClick={() => handleNavigation('/catalogo')} {...getLinkProps('/catalogo')}>
            Home
          </div>
          <div onClick={() => handleNavigation('/pesquisa-produtos')} {...getLinkProps('/pesquisa-produtos')}>
            Produtos
          </div>
          <div onClick={() => handleNavigation('/catalogo#contato')} {...getLinkProps('/catalogo#contato')}>
            Contato
          </div>
        </nav>

        {/* LADO DIREITO: Carrinho e Menu Mobile (Ocupa 1/3 do espaço) */}
        <div className="flex-1 flex justify-end items-center gap-4">
          
          {/* Carrinho (Sempre visível) */}
          <button 
            onClick={() => handleNavigation("/carrinho")} 
            className="relative p-2 md:p-3 bg-[#FFE5D9] rounded-2xl hover:bg-[#FFCAD4] transition-all shadow-md flex items-center justify-center border-none cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[#6D6875]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F4ACB7] text-white w-5 h-5 text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hambúrguer: Usamos a classe de CSS puro "esconder-no-pc" para forçar a ocultação */}
          <button 
            className="esconder-no-pc flex p-2 text-[#6D6875] bg-[#F9F9F9] rounded-xl border border-[#D8E2DC] items-center justify-center active:scale-95 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
        </div>

      </div>

      {/* Menu Mobile - Fica oculto automaticamente no computador pela lógica do botão */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-[#D8E2DC] flex flex-col py-2">
          <div onClick={() => handleNavigation('/catalogo')} className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium border-b border-gray-50 transition-colors">
            <Home className="w-5 h-5 text-[#F4ACB7]" /> Home
          </div>
          <div onClick={() => handleNavigation('/pesquisa-produtos')} className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium border-b border-gray-50 transition-colors">
            <Package className="w-5 h-5 text-[#F4ACB7]" /> Produtos
          </div>
          <div onClick={() => handleNavigation('/catalogo#contato')} className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium transition-colors">
            <MessageCircle className="w-5 h-5 text-[#F4ACB7]" /> Contato
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;