import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // Importante para o Portal
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Home, Package, MessageCircle, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import EncantoLogo from '../assets/logoEncanto.png';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkProps = (caminho: string) => {
    if (caminho === 'contato') {
      return {
        className: `cursor-pointer transition-colors duration-300 text-[#9D8189] hover:text-[#F4ACB7] font-normal`
      };
    }

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

  const openContactModal = () => {
    setIsContactModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. NAVBAR (Header) */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#D8E2DC] w-full h-[10vh] min-h-[64px]">
        <div className="flex items-center justify-between w-full h-full px-8 md:px-[3vw]">
          
          <div className="flex-1 flex justify-start h-full py-3">
            <div className="flex items-center h-full cursor-pointer" onClick={() => handleNavigation('/catalogo')}>
              <img src={EncantoLogo} alt="Logo" className="h-12 md:h-[6.5vh] w-auto object-contain" />
            </div>
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-16 text-base lg:text-lg whitespace-nowrap">
            <div onClick={() => handleNavigation('/catalogo')} {...getLinkProps('/catalogo')}>Home</div>
            <div onClick={() => handleNavigation('/pesquisa-produtos')} {...getLinkProps('/pesquisa-produtos')}>Produtos</div>
            {/* O link de contato chama o modal diretamente */}
            <div onClick={openContactModal} {...getLinkProps('contato')}>Contato</div>
          </nav>

          <div className="flex-1 flex justify-end items-center gap-4">
            <button onClick={() => handleNavigation("/carrinho")} className="relative p-2 md:p-3 bg-[#FFE5D9] rounded-2xl hover:bg-[#FFCAD4] transition-all shadow-md flex items-center justify-center border-none cursor-pointer">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[#6D6875]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F4ACB7] text-white w-5 h-5 text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="esconder-no-pc flex p-2 text-[#6D6875] bg-[#F9F9F9] rounded-xl border border-[#D8E2DC] items-center justify-center active:scale-95 transition-all" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-[#D8E2DC] flex flex-col py-2">
            <div onClick={() => handleNavigation('/catalogo')} className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium border-b border-gray-50 cursor-pointer"><Home className="w-5 h-5 text-[#F4ACB7]" /> Home</div>
            <div onClick={() => handleNavigation('/pesquisa-produtos')} className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium border-b border-gray-50 cursor-pointer"><Package className="w-5 h-5 text-[#F4ACB7]" /> Produtos</div>
            <div onClick={openContactModal} className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium cursor-pointer"><MessageCircle className="w-5 h-5 text-[#F4ACB7]" /> Contato</div>
          </div>
        )}
      </header>

      {/* 2. MODAL DE CONTATO USANDO PORTAL */}
      {isContactModalOpen && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden"
          style={{ 
            zIndex: 99999, 
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            backdropFilter: 'blur(4px)' 
          }} 
        >
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsContactModalOpen(false)}
          ></div>
          
          <div 
            className="bg-white w-full max-w-md p-6 md:p-8 relative shadow-2xl border-2 border-[#FFCAD4] animate-in fade-in zoom-in duration-300"
            style={{ 
              zIndex: 999999,
              borderRadius: '2rem'
            }}
          >
            {/* Botão Fechar */}
            <button 
              onClick={() => setIsContactModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-[#F9F9F9] hover:bg-[#FFE5D9] text-[#9D8189] hover:text-[#F4ACB7] rounded-full transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 mt-2">
              {/* Logo da Empresa centralizada */}
              <div className="flex justify-center mb-6">
                <img 
                  src={EncantoLogo} 
                  alt="Encanto Personalizados" 
                  className="h-16 md:h-20 w-auto object-contain" 
                />
              </div>
              
              <h2 className="text-2xl font-extrabold text-[#6D6875]">Fale Conosco</h2>
              <p className="text-[#9D8189] text-sm mt-2 leading-relaxed">
                Estamos aqui para tornar seus momentos inesquecíveis!
              </p>
            </div>

            <div className="space-y-4">
              <a href="https://wa.me/5511987654321" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-[#F9F9F9] rounded-2xl border border-[#D8E2DC] hover:border-[#F4ACB7] hover:shadow-md transition-all group no-underline">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:bg-[#FFE5D9] transition-colors">
                  <Phone className="w-6 h-6 text-[#F4ACB7]" />
                </div>
                <div>
                  <p className="font-bold text-[#6D6875] m-0">WhatsApp</p>
                  <p className="text-[#9D8189] text-sm m-0">(11) 98765-4321</p>
                </div>
              </a>

              <a href="mailto:contato@encanto.com.br" className="flex items-center gap-4 p-4 bg-[#F9F9F9] rounded-2xl border border-[#D8E2DC] hover:border-[#F4ACB7] hover:shadow-md transition-all group no-underline">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:bg-[#FFE5D9] transition-colors">
                  <Mail className="w-6 h-6 text-[#F4ACB7]" />
                </div>
                <div>
                  <p className="font-bold text-[#6D6875] m-0">E-mail</p>
                  <p className="text-[#9D8189] text-sm m-0">contato@encanto.com.br</p>
                </div>
              </a>
            </div>

            <div className="mt-8 text-center border-t border-[#D8E2DC] pt-6">
              <p className="text-[#9D8189] text-sm font-bold mb-4 uppercase tracking-wider">
                Acompanhe nosso trabalho
              </p>
              <div className="flex justify-center gap-4">
                <a href="#" className="p-3 bg-[#F9F9F9] hover:bg-[#FFCAD4] hover:-translate-y-1 text-[#6D6875] rounded-xl transition-all shadow-sm">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 bg-[#F9F9F9] hover:bg-[#FFCAD4] hover:-translate-y-1 text-[#6D6875] rounded-xl transition-all shadow-sm">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default Navbar;