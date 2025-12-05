import "./App.css";
import { DashFinanceira } from "./components/dashboardFinanceira";
import { CadastroPedidos } from "./components/kanbanPedidos/cadastroPedidos";
import Navbar from './components/navbar';

function App() {

  return (
    <>
    <Navbar/>
    <CadastroPedidos/>
    {/* <DashFinanceira/> */}
    </>
  )
}

export default App
