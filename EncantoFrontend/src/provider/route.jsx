import { createBrowserRouter } from "react-router-dom"
import { CadastroPedidos } from "../components/kanbanPedidos/cadastroPedidos"
import { DashFinanceira } from "../components/dashboardFinanceira"
import {HomeCalendar} from '../components/home'
import Login from "../components/login"
import Layout from "../components/Layout"
import Kanban from "../components/kanbanPedidos"
import CadastroProdutos from "../components/cadastroProdutos"
import CadastroFotosProduto from "../components/cadastroFotosProduto"
import CadastroMovimentacao from "../components/cadastroMovimentacao"
import ListaProdutos  from "../components/listaProdutos"
import CadastroPedido from "../components/cadastroPedidos"
import DetalhesPedido from "../components/detalhesPedido"

export const route = createBrowserRouter([
    { path: "/login", element: <Login /> },
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "pedidos", element: <CadastroPedidos /> },
            { path: "dashboard", element: <DashFinanceira /> },
            { index: true, element: <DashFinanceira /> },
            { path: "home", element: <HomeCalendar /> },
            { path: "kanban", element: <Kanban /> },
            {path: "lista-produtos", element: <ListaProdutos />},
            { path: "produtos", element: <CadastroProdutos />},
             { path: "produtos/fotos", element: <CadastroFotosProduto /> },
             { path: "movimentacao", element: <CadastroMovimentacao /> },
             {path: "pedidos/cadastro", element: <CadastroPedido/>},
            //  url para detalhes do pedido, pode ser algo como /pedidos/detalhes/:id, onde :id é o identificador do pedido
            
             {path: "pedidos/detalhes/:id", element: <DetalhesPedido/>},
        ]
    }
])