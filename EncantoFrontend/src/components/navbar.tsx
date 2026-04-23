import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import ConfirmModal from './ui/ConfirmModal';
import ProfileModal from './ui/ProfileModal';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoEncanto from '../assets/logoEncanto.png';

const API_BASE_URL = 'http://localhost:8080';

const getFotoUrl = (caminho?: string) => {
  if (!caminho) return undefined;
  if (caminho.startsWith('data:image') || caminho.startsWith('http')) return caminho;
  return `${API_BASE_URL}${caminho}`;
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileModal, setProfileModal] = useState<{ open: boolean, mode: 'view' | 'edit' | 'settings' }>({
    open: false,
    mode: 'view'
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('encanto_user');
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
    navigate('/login'); 
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUserData(updatedUser);
    sessionStorage.setItem('encanto_user', JSON.stringify(updatedUser));
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

  if(!userData) return null;

  return (
    <>
      <header className="navbar-padrao" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2vw', height: '10vh', borderBottom: '1px solid #D8E2DC', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 40 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }} onClick={() => navigate("/home")}>
          <img src={logoEncanto} alt="Logo" style={{ height: '6.5vh', width: 'auto', objectFit: 'contain' }} />
        </div>

        {userData?.cargo === 'Administrador' && (
          <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
             <div onClick={() => navigate("/home")} {...getLinkProps("/home")}>Home</div>
             <div onClick={() => navigate("/kanban")} {...getLinkProps("/kanban")}>Pedidos</div>
             <div onClick={() => navigate("/dashboard")} {...getLinkProps("/dashboard")}>Financeiro</div>
             <div onClick={() => navigate("/lista-produtos")} {...getLinkProps("/lista-produtos")}>Produtos</div>
             <div onClick={() => navigate("/movimentacao")} {...getLinkProps("/movimentacao")}>Movimentações</div>
             <div onClick={() => navigate("/funcionarios")} {...getLinkProps("/funcionarios")}>Funcionários</div>
             <div onClick={() => navigate("/dashboard-gestao")} {...getLinkProps("/dashboard-gestao")}>Dashboard Gestão</div>
          </nav>
        )}

        {userData?.cargo === 'Manufatura' && (
           <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
           <div onClick={() => navigate("/home")} {...getLinkProps("/home")}>Home</div>
           <div onClick={() => navigate("/kanban")} {...getLinkProps("/kanban")}>Pedidos</div>
        </nav>
        )}

        {userData?.cargo === 'Social Media' && (
          <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
           <div onClick={() => navigate("/home")} {...getLinkProps("/home")}>Home</div>
           <div onClick={() => navigate("/kanban")} {...getLinkProps("/kanban")}>Pedidos</div>
           <div onClick={() => navigate("/lista-produtos")} {...getLinkProps("/lista-produtos")}>Produtos</div>
        </nav>
        )}

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F9F9F9] transition-colors" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
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
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ color: '#9D8189' }} />
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

        <ConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={confirmLogout} title="Sair" message="Deseja sair do sistema?" confirmText="Sair" />
        <ProfileModal isOpen={profileModal.open} onClose={() => setProfileModal({ ...profileModal, open: false })} user={userData} onUserUpdate={handleUserUpdate} initialMode={profileModal.mode} />
      </header>
    </>
  );
}