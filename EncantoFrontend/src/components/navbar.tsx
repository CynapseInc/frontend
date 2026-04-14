import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import logoEncanto from '../assets/logoEncanto.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('encanto_user');
    
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else if (sessionStorage.getItem('usuarioNome')) {
      setUserData({ 
        nome: sessionStorage.getItem('usuarioNome'), 
        email: 'funcionario@encanto.com' 
      });
    }else{
      navigate('/login'); // Redireciona para login se não encontrar dados do usuário
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [location.pathname]); 

  const handleLogout = () => {
    if(window.confirm('Tem a certeza que deseja sair do sistema?')) {
      sessionStorage.removeItem('encanto_token'); 
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('encanto_user');  
      sessionStorage.removeItem('usuarioNome');
      navigate('/login'); 
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getEstiloLink = (caminho: string) => {
    const estaAtivo = location.pathname === caminho;
    return {
      color: estaAtivo ? '#F4ACB7' : '#9D8189', 
      cursor: 'pointer',
      fontWeight: estaAtivo ? 'bold' : 'normal', 
      transition: 'color 0.3s ease'
    };
  };
  if(userData !== null){
  return (
    <header className="navbar-padrao" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2vw', height: '10vh', borderBottom: '1px solid #D8E2DC', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 40 }}>
      
      <div 
        style={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }} 
        onClick={() => navigate("/home")}
        title="Ir para a Home"
      >
        <img 
          src={logoEncanto} 
          alt="Logo O Encanto Personalizados" 
          style={{ 
            height: '6.5vh',
            width: 'auto',   
            objectFit: 'contain' 
          }} 
        />
      </div>
      {/* A depender do cargo do usuario mostrar uma nav bar diferente */}
      {userData?.cargo === 'Administrador' && (


      <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
         <div onClick={() => navigate("/home")} style={getEstiloLink("/home")}>Home</div>
         <div onClick={() => navigate("/kanban")} style={getEstiloLink("/kanban")}>Pedidos</div>
         <div onClick={() => navigate("/dashboard")} style={getEstiloLink("/dashboard")}>Financeiro</div>
         <div onClick={() => navigate("/lista-produtos")} style={getEstiloLink("/lista-produtos")}>Produtos</div>
         <div onClick={() => navigate("/movimentacao")} style={getEstiloLink("/movimentacao")}>Movimentações</div>
         <div onClick={() => navigate("/funcionarios")} style={getEstiloLink("/funcionarios")}>Funcionários</div>
         <div onClick={() => navigate("/dashboard-gestao")} style={getEstiloLink("/dashboard-gestao")}>Dashboard Gestão</div>
      </nav>
      )}

      {userData?.cargo === 'Manufatura' && (
         <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
         <div onClick={() => navigate("/home")} style={getEstiloLink("/home")}>Home</div>
         <div onClick={() => navigate("/kanban")} style={getEstiloLink("/kanban")}>Pedidos</div>
      </nav>
      )}

      {userData?.cargo === 'Social Media' && (
        <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
         <div onClick={() => navigate("/home")} style={getEstiloLink("/home")}>Home</div>
         <div onClick={() => navigate("/kanban")} style={getEstiloLink("/kanban")}>Pedidos</div>
          <div onClick={() => navigate("/lista-produtos")} style={getEstiloLink("/lista-produtos")}>Produtos</div>
      </nav>
      )}

      <div className="relative" ref={dropdownRef}>
        {!userData ? (
          <button 
            onClick={() => navigate('/login')}
            style={{ backgroundColor: '#6D6875', color: 'white', padding: '1vh 2vw', border: 'none', borderRadius: '0.5vw', cursor: 'pointer', fontSize: '1vw' }}
          >
            Login
          </button>
        ) : (
          <>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F9F9F9] transition-colors"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm transition-transform hover:scale-105" style={{ backgroundColor: '#F4ACB7' }}>
                {getInitials(userData.nome)}
              </div>
              
              <div className="text-left hidden md:block">
                <p className="text-[14px] font-bold leading-tight m-0" style={{ color: '#6D6875' }}>{userData.nome}</p>
                <p className="text-[12px] m-0" style={{ color: '#9D8189' }}>{userData.role || 'Administrador'}</p>
              </div>
              
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ color: '#9D8189' }} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border overflow-hidden transition-all" style={{ borderColor: '#D8E2DC', zIndex: 50 }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}>
                  <p className="text-[15px] font-bold truncate m-0" style={{ color: '#6D6875' }}>{userData.nome}</p>
                  <p className="text-[13px] truncate m-0" style={{ color: '#9D8189' }}>{userData.email}</p>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] rounded-xl hover:bg-[#FFE5D9] transition-colors" style={{ color: '#6D6875', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <User className="w-4 h-4" /> Meu Perfil
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] rounded-xl hover:bg-[#FFE5D9] transition-colors" style={{ color: '#6D6875', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <Settings className="w-4 h-4" /> Configurações
                  </button>
                </div>
                
                <div className="p-2 border-t" style={{ borderColor: '#D8E2DC' }}>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] rounded-xl hover:bg-red-50 text-red-500 transition-colors font-medium"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <LogOut className="w-4 h-4" /> Sair do Sistema
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
  }else {
    return null; // Ou um loader, ou redirecionamento, etc. dependendo do que você queira mostrar enquanto carrega os dados do usuário
  }
}