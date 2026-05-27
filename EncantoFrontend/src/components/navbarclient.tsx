import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Importante para o Portal
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Menu, X, Home, Package, MessageCircle, Phone, Mail, Instagram, Facebook, Search } from 'lucide-react';
import EncantoLogo from '../assets/logoEncanto.png';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Sincronizar searchInput com URL params ao montar ou quando a URL mudar
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchInput(urlSearch);
  }, [searchParams]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/pesquisa-produtos?search=${encodeURIComponent(searchInput)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    navigate('/pesquisa-produtos');
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // Se JÁ ESTÁ na página de pesquisa, faz busca automática ao digitar
    if (location.pathname === '/pesquisa-produtos') {
      if (value.trim()) {
        navigate(`/pesquisa-produtos?search=${encodeURIComponent(value)}`);
      } else {
        navigate('/pesquisa-produtos');
      }
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    // Se JÁ está na página de pesquisa, o onChange já faz a busca, então ignora Enter
    if (location.pathname === '/pesquisa-produtos') {
      return;
    }
    
    // Se NÃO está na página de pesquisa, busca ao pressionar Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedSearch = (e.target as HTMLInputElement).value.trim();
      if (trimmedSearch) {
        navigate(`/pesquisa-produtos?search=${encodeURIComponent(trimmedSearch)}`);
        setIsMobileMenuOpen(false);
      }
    }
  };

  const getLinkProps = (caminho: string) => {
    if (caminho === 'contato') {
      return {
        className: `cursor-pointer transition-colors duration-300 text-[#9D8189] hover:text-[#F4ACB7] font-normal`
      };
    }

    const currentPath = location.pathname + location.hash;
    const estaAtivo = currentPath === caminho || (caminho === '/catalogo' && location.pathname === '/catalogo' && location.hash === '');

    return {
      className: `cursor-pointer transition-colors duration-300 ${estaAtivo
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
      <header
        className="sticky top-0 z-50 bg-white border-b border-[#D8E2DC] w-full h-[10vh] min-h-[64px]"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'white',
          borderBottom: '1px solid #D8E2DC',
          width: '100%',
          height: '10vh',
          minHeight: '64px'
        }}
      >
        <div
          className="flex items-center justify-between w-full h-full px-8 md:px-[3vw]"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%'
          }}
        >

          <div className="flex-1 flex justify-start h-full py-3">
            <div className="flex items-center h-full cursor-pointer" onClick={() => handleNavigation('/catalogo')}>
              <img src={EncantoLogo} alt="Logo" className="h-12 md:h-[6.5vh] w-auto object-contain" />
            </div>
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-16 text-base lg:text-2xl whitespace-nowrap">
            <div onClick={() => handleNavigation('/catalogo')} {...getLinkProps('/catalogo')}>Home</div>
            <div onClick={() => handleNavigation('/pesquisa-produtos')} {...getLinkProps('/pesquisa-produtos')}>Produtos</div>
            {/* O link de contato chama o modal diretamente */}
            <div onClick={openContactModal} {...getLinkProps('contato')}>Contato</div>
          </nav>

          <div
            className="flex-1 flex justify-end items-center gap-3"
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            {/* Barra de Pesquisa - Desktop */}
            <div
              className="hidden md:flex items-center gap-1 bg-white border-2 border-[#D8E2DC] rounded-xl px-3 py-2 focus-within:border-[#F4ACB7] transition-all"
              style={{
                alignItems: 'right',
                gap: '0.75rem',
                backgroundColor: 'white',
                border: '2px solid #D8E2DC',
                borderRadius: '0.75rem',
                padding: '0.5rem 0.75rem',
                transition: 'all 0.3s ease',
                width: 'clamp(180px, 30vw, 450px)'
              }}
            >
              <Search size={26} className="text-[#9D8189] flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar por produto"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="text-xs outline-none bg-transparent text-[#6D6875] w-32 lg:w-40 placeholder-[#9D8189]"
                style={{
                  flex: 1,
                  minWidth: 0
                }}
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="flex-shrink-0 p-1 hover:bg-[#F9F9F9] rounded transition-all"
                  style={{
                    marginLeft: 'auto',
                    flexShrink: 0
                  }}
                >
                  <X size={14} className="text-[#9D8189]" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleNavigation("/carrinho")}
              className="relative p-2 md:p-3 bg-[#FFE5D9] rounded-2xl hover:bg-[#FFCAD4] transition-all shadow-md flex items-center justify-center border-none cursor-pointer"
              style={{
                position: 'relative',
                backgroundColor: '#FFE5D9',
                borderRadius: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[#6D6875]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F4ACB7] text-white w-5 h-5 text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="esconder-no-pc flex p-2 text-[#6D6875] bg-[#F9F9F9] rounded-xl border border-[#D8E2DC] items-center justify-center active:scale-95 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                backgroundColor: '#F9F9F9',
                borderRadius: '0.75rem',
                border: '1px solid #D8E2DC',
                color: '#6D6875',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '0.5rem'
              }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa - Mobile */}
        
        <div
          className="md:hidden w-full bg-gradient-to-b from-white to-[#F9F9F9] px-8 py-4 border-b border-[#D8E2DC]"
          style={{
            width: '100%',
            background: 'linear-gradient(180deg, white, #F9F9F9)',
            borderBottom: '1px solid #D8E2DC'
          }}
        >
          <div
            className="flex items-center gap-2 bg-white border-2 border-[#D8E2DC] rounded-xl px-3 py-2.5 focus-within:border-[#F4ACB7] transition-all"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #D8E2DC',
              borderRadius: '0.75rem',
              padding: '0.625rem 0.75rem',
              transition: 'all 0.3s ease'
            }}
          >
            <Search size={16} className="text-[#9D8189] flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar por produto"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="text-sm outline-none bg-transparent text-[#6D6875] flex-1 placeholder-[#9D8189]"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="flex-shrink-0 p-1 hover:bg-[#F9F9F9] rounded transition-all"
                style={{
                  marginLeft: 'auto',
                  flexShrink: 0
                }}
              >
                <X size={14} className="text-[#9D8189]" />
              </button>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-[#D8E2DC] flex flex-col py-2 z-40"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: 'white',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              borderTop: '1px solid #D8E2DC',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              zIndex: 40
            }}
          >
            <div
              onClick={() => handleNavigation('/catalogo')}
              className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium border-b border-gray-50 cursor-pointer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                color: '#6D6875',
                fontWeight: 500,
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer'
              }}
            ><Home className="w-5 h-5 text-[#F4ACB7]" /> Home</div>
            <div
              onClick={() => handleNavigation('/pesquisa-produtos')}
              className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium border-b border-gray-50 cursor-pointer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                color: '#6D6875',
                fontWeight: 500,
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer'
              }}
            ><Package className="w-5 h-5 text-[#F4ACB7]" /> Produtos</div>
            <div
              onClick={openContactModal}
              className="flex items-center gap-4 px-6 py-4 text-[#6D6875] hover:bg-[#FFE5D9] font-medium cursor-pointer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                color: '#6D6875',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            ><MessageCircle className="w-5 h-5 text-[#F4ACB7]" /> Contato</div>
          </div>
        )}
      </header>

      {/* 2. MODAL DE CONTATO USANDO PORTAL */}
      {isContactModalOpen && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            overflow: 'hidden',
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {/* Overlay para fechar ao clicar fora */}
          <div
            className="absolute inset-0"
            onClick={() => setIsContactModalOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }}
          ></div>

          <div
            className="bg-white w-full max-w-md p-6 md:p-8 relative shadow-2xl border-2 border-[#FFCAD4] animate-in fade-in zoom-in duration-300"
            style={{
              backgroundColor: 'white',
              width: '100%',
              maxWidth: '28rem',
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: '2px solid #FFCAD4',
              borderRadius: '2rem',
              zIndex: 999999
            }}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-[#F9F9F9] hover:bg-[#FFE5D9] text-[#9D8189] hover:text-[#F4ACB7] rounded-full transition-all z-10"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.5rem',
                backgroundColor: '#F9F9F9',
                color: '#9D8189',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
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