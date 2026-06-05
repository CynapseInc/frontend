import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, Menu, X } from 'lucide-react';
import ConfirmModal from './ui/ConfirmModal';
import ProfileModal from './ui/ProfileModal';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoEncanto from '../assets/logoEncanto.png';

const isDev = import.meta.env.MODE === 'development';

const getFotoUrl = (caminho?: string) => {
  if (!caminho) return undefined;
  if (caminho.startsWith('data:image') || caminho.startsWith('http')) return caminho;
  
  return isDev ? `http://localhost:8080${caminho}` : caminho;
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileModal, setProfileModal] = useState<{ open: boolean, mode: 'view' | 'edit' | 'settings' }>({
    open: false,
    mode: 'view'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('encanto_user') || sessionStorage.getItem('encanto_user');
    
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [location.pathname, navigate]);

  const confirmLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('encanto_token');
    localStorage.removeItem('encanto_user');
    navigate('/login'); 
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUserData(updatedUser);
    if (localStorage.getItem('encanto_user')) {
      localStorage.setItem('encanto_user', JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem('encanto_user', JSON.stringify(updatedUser));
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getLinkProps = (caminho: string) => {
    const estaAtivo = location.pathname === caminho;
    return {
      className: `cursor-pointer transition-all duration-300 font-medium ${
        estaAtivo 
          ? 'text-[#F4ACB7]' 
          : 'text-[#9D8189] hover:text-[#F4ACB7]'
      }`
    };
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const getNavLinks = (cargo: string) => {
    const allLinks = [
      { label: 'Home', path: '/home', roles: ['Administrador', 'Manufatura', 'Social Media'] },
      { label: 'Kanban', path: '/kanban', roles: ['Administrador', 'Manufatura', 'Social Media'] },
      { label: 'Pedidos', path: '/pedidos', roles: ['Administrador', 'Manufatura', 'Social Media'] },
      { label: 'Gestão', path: '/dashboard-gestao', roles: ['Administrador'] },
      { label: 'Produtos', path: '/lista-produtos', roles: ['Administrador', 'Social Media'] },
      { label: 'Clientes', path: '/clientes', roles: ['Administrador', 'Manufatura', 'Social Media'] },
      { label: 'Movimentações', path: '/movimentacao', roles: ['Administrador'] },
      { label: 'Financeiro', path: '/dashboard', roles: ['Administrador'] },
      { label: 'Funcionários', path: '/funcionarios', roles: ['Administrador'] },
    ];
    return allLinks.filter(link => link.roles.includes(cargo));
  };

  if(!userData) return null;

  const allowedLinks = getNavLinks(userData.cargo);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#D8E2DC] w-full">
        <div className="flex items-center justify-between w-full px-6 md:px-12 lg:px-16 h-20">
          
          {/* Logo - Sem flex-1, agora toma apenas o espaço necessário */}
          <div className="flex justify-start h-full items-center flex-shrink-0">
            <div className="flex items-center h-full cursor-pointer" onClick={() => navigate("/home")}>
              <img src={logoEncanto} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            </div>
          </div>

          {/* Nav Desktop - Mantém o flex-1 para engolir todo o espaço livre da tela */}
          <nav 
            className="mostrar-no-pc-admin flex flex-1 justify-center items-center gap-8 xl:gap-10 text-[16px] xl:text-[17px] whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden px-2 mx-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
             {allowedLinks.map((link) => (
               <div key={link.path} onClick={() => handleNavigation(link.path)} {...getLinkProps(link.path)}>
                 {link.label}
               </div>
             ))}
          </nav>

          {/* Área Direita: Perfil + Menu Mobile - Sem flex-1 */}
          <div className="flex justify-end items-center gap-3 flex-shrink-0">
            
            {/* Dropdown de Usuário */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F9F9F9] transition-colors border-none bg-transparent cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm overflow-hidden" style={{ backgroundColor: '#FFE5D9' }}>
                  {userData.foto ? (
                    <ImageWithFallback src={getFotoUrl(userData.foto)} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <span style={{ color: '#F4ACB7' }}>{getInitials(userData.nome)}</span>
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[14px] font-bold leading-tight m-0" style={{ color: '#6D6875' }}>{userData.nome}</p>
                  <p className="text-[12px] m-0" style={{ color: '#9D8189' }}>{userData.cargo}</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ color: '#9D8189' }} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border overflow-hidden" style={{ borderColor: '#D8E2DC', zIndex: 50 }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}>
                    <p className="text-[15px] font-bold truncate m-0" style={{ color: '#6D6875' }}>{userData.nome}</p>
                    <p className="text-[13px] truncate m-0" style={{ color: '#9D8189' }}>{userData.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { setIsDropdownOpen(false); setProfileModal({ open: true, mode: 'view' }); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] rounded-xl hover:bg-[#FFE5D9] transition-colors"
                      style={{ color: '#6D6875', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <User className="w-4 h-4" /> Meu Perfil
                    </button>
                    <button 
                      onClick={() => { setIsDropdownOpen(false); setProfileModal({ open: true, mode: 'settings' }); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] rounded-xl hover:bg-[#FFE5D9] transition-colors"
                      style={{ color: '#6D6875', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <Settings className="w-4 h-4" /> Configurações
                    </button>
                  </div>
                  <div className="p-2 border-t" style={{ borderColor: '#D8E2DC' }}>
                    <button onClick={() => { setIsDropdownOpen(false); setIsLogoutModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] rounded-xl hover:bg-red-50 text-red-500 transition-colors font-medium" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                      <LogOut className="w-4 h-4" /> Sair do Sistema
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Hambúrguer Mobile */}
            <button
              className="esconder-no-pc-admin flex p-2 text-[#6D6875] bg-[#F9F9F9] rounded-xl border border-[#D8E2DC] items-center justify-center active:scale-95 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ cursor: 'pointer' }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        {isMobileMenuOpen && (
          <div className="esconder-no-pc-admin absolute top-full left-0 w-full bg-white shadow-xl border-t border-[#D8E2DC] flex flex-col py-2 z-40">
            {allowedLinks.map((link) => (
              <div
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`flex items-center gap-4 px-6 py-4 font-medium border-b border-gray-50 cursor-pointer ${
                  location.pathname === link.path 
                    ? 'text-[#F4ACB7] bg-[#FFF0F3]' 
                    : 'text-[#6D6875] hover:bg-[#FFE5D9]'
                }`}
              >
                {link.label}
              </div>
            ))}
          </div>
        )}

        <ConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={confirmLogout} title="Sair" message="Deseja sair do sistema?" confirmText="Sair" />
        <ProfileModal isOpen={profileModal.open} onClose={() => setProfileModal({ ...profileModal, open: false })} user={userData} onUserUpdate={handleUserUpdate} initialMode={profileModal.mode} />
      </header>
    </>
  );
}