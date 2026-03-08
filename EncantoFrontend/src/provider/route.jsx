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
import HomeClient from "../components/homeClient"
import PesquisaProdutosClient from "../components/pesquisaProdutosClient"
import DetalheProdutoClient from "../components/detalheProdutoClient"
import Carrinho from "../components/carrinho"
import Funcionarios from "../components/funcionarios"
import DashGestao from "../components/dashboardGestao"

export const route = createBrowserRouter([
    { path: "/login", element: <Login /> },
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "pedidos", element: <CadastroPedidos /> },
            { path: "dashboard", element: <DashFinanceira /> },
            { index: true, element: <Login /> },
            { path: "home", element: <HomeCalendar /> },
            { path: "kanban", element: <Kanban /> },
            {path: "lista-produtos", element: <ListaProdutos />},
            { path: "produtos", element: <CadastroProdutos />},
             { path: "produtos/fotos", element: <CadastroFotosProduto /> },
             { path: "movimentacao", element: <CadastroMovimentacao /> },
             {path: "pedidos/cadastro", element: <CadastroPedido/>},
            
             {path: "pedidos/detalhes/:id", element: <DetalhesPedido/>},
             { path: "catalogo", element: <HomeClient /> },
             {path: "pesquisa-produtos", element: <PesquisaProdutosClient /> },
             {path: "detalhe-produto/:id", element: <DetalheProdutoClient /> },
             {path: "carrinho", element: <Carrinho />},
             {path: "funcionarios", element: <Funcionarios />},
             {path: "dashboard-gestao", element: <DashGestao />},
             
        ]
    }
])