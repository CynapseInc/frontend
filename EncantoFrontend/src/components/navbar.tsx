import { useNavigate, useLocation } from 'react-router-dom'; // 1. Adicionamos useLocation

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Pegamos a localização atual

  // 3. Função que decide a cor do link
  const getEstiloLink = (caminho: string) => {
    // Verifica se a rota atual É IGUAL ao caminho do link
    // (ou se começa com o caminho, útil para sub-páginas)
    const estaAtivo = location.pathname === caminho;

    return {
      color: estaAtivo ? '#F4ACB7' : '#9D8189', // Rosa se ativo, Cinza se não
      cursor: 'pointer',
      fontWeight: estaAtivo ? 'bold' : 'normal', // Opcional: deixa negrito quando selecionado
      transition: 'color 0.3s ease'
    };
  };

  return (
    <header className="navbar-padrao">
      
      {/* Lado Esquerdo: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
        <div style={{ width: '3vw', height: '3vw', borderRadius: '50%', backgroundColor: '#F4ACB7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          OE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.2vw', color: '#F4ACB7', fontWeight: 'bold' }}>O Encanto</span>
          <span style={{ fontSize: '0.8vw', color: '#9D8189' }}>personalizados</span>
        </div>
      </div>

      {/* Centro: Menu de Navegação Dinâmico */}
      <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
         <div onClick={() => navigate("/home")} style={getEstiloLink("/home")}>Home</div>
         <div onClick={() => navigate("/kanban")} style={getEstiloLink("/kanban")}>Pedidos</div>
         <div onClick={() => navigate("/dashboard")} style={getEstiloLink("/dashboard")}>Financeiro</div>
         <div onClick={() => navigate("/lista-produtos")} style={getEstiloLink("/lista-produtos")}>Produtos</div>
         <div onClick={() => navigate("/movimentacao")} style={getEstiloLink("/movimentacao")}>Movimentações</div>
      </nav>

      {/* Lado Direito: Botão Login */}
      <button style={{ backgroundColor: '#6D6875', color: 'white', padding: '1vh 2vw', border: 'none', borderRadius: '0.5vw', cursor: 'pointer', fontSize: '1vw' }}>
        Login
      </button>
      
    </header>
  );
}