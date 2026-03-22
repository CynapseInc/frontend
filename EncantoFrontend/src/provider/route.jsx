import { createBrowserRouter } from "react-router-dom"
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
import ProtectedRoute from "./ProtectedRoutes"

// export const route = createBrowserRouter([
//     { path: "/login", element: <Login /> },
//     {
//         path: "/",
//         element: <Layout />,
//         children: [
//             





//         ]
//     }
// ])


export const route = createBrowserRouter([
  { path: "/login", element: <Login /> },

  // 🌐 ROTAS PÚBLICAS
  { path: "catalogo", element: <HomeClient /> },
  { path: "detalhe-produto/:id", element: <DetalheProdutoClient /> },
  { path: "carrinho", element: <Carrinho /> },
  { path: "pesquisa-produtos", element: <PesquisaProdutosClient /> },

  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Login /> },

      // 🔓 TODOS LOGADOS
      {
        element: (
          <ProtectedRoute allowedRoles={["Administrador", "Manufatura", "Social Media"]} />
        ),
        children: [
          { path: "home", element: <HomeCalendar /> },
          { path: "kanban", element: <Kanban /> },
          { path: "pedidos/detalhes/:id", element: <DetalhesPedido /> },
        ],
      },

      // 🔒 MANUFATURA + ADMIN (pode cadastrar pedido)
      {
        element: (
          <ProtectedRoute allowedRoles={["Administrador", "Manufatura"]} />
        ),
        children: [
          { path: "pedidos/cadastro", element: <CadastroPedido /> },
        ],
      },

      // 🔒 SOCIAL MEDIA + MANUFATURA + ADMIN (sem cadastro pedido)
      {
        element: (
          <ProtectedRoute allowedRoles={["Administrador", "Manufatura", "Social Media"]} />
        ),
        children: [
          { path: "lista-produtos", element: <ListaProdutos /> },
          { path: "produtos", element: <CadastroProdutos /> },
          { path: "produtos/editar/:id", element: <CadastroProdutos /> },
          { path: "produtos/fotos/:id", element: <CadastroFotosProduto /> },
        ],
      },

      // 🔒 SOMENTE ADMIN
      {
        element: (
          <ProtectedRoute allowedRoles={["Administrador"]} />
        ),
        children: [
          { path: "dashboard", element: <DashFinanceira /> },
          { path: "dashboard-gestao", element: <DashGestao /> },
          { path: "funcionarios", element: <Funcionarios /> },
          { path: "movimentacao", element: <CadastroMovimentacao /> },
        ],
      },
    ],
  },
]);

// export const route = createBrowserRouter([
//     { path: "/login", element: <Login /> },
//     { path: "catalogo", element: <HomeClient /> },
//     { path: "detalhe-produto/:id", element: <DetalheProdutoClient /> },
//     { path: "carrinho", element: <Carrinho />},
//     { path: "pesquisa-produtos", element: <PesquisaProdutosClient /> },


//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       { index: true, element: <Login /> },

//       // 🔓 TODOS LOGADOS
//       {
//         element: (
//           <ProtectedRoute allowedRoles={["Administrador", "Manufatura", "Social Media"]} />
//         ),
//         children: [
//           { path: "home", element: <HomeCalendar /> },
//           { path: "kanban", element: <Kanban /> },
//           { path: "pedidos/detalhes/:id", element: <DetalhesPedido /> },
//         ]
//       },

//       // 🔒 ADMIN + MANUFATURA
//       {
//         element: (
//           <ProtectedRoute allowedRoles={["Administrador", "Manufatura"]} />
//         ),
//         children: [
//           { path: "pedidos/cadastro", element: <CadastroPedido /> },
//         ]
//       },
//       {
//         element: (
//           <ProtectedRoute allowedRoles={["Social Media"]} />
//         ),
//         children: [
//             { path: "/lista-produtos", element: <ListaProdutos /> },
//             { path: "produtos/editar/:id", element: <CadastroProdutos /> }, 
//             { path: "produtos/fotos/:id", element: <CadastroFotosProduto /> },
//             {path: "produtos", element: <CadastroProdutos />},


//         ]
//       },

//       // 🔒 SOMENTE ADMIN
//       {
//         element: (
//           <ProtectedRoute allowedRoles={["Administrador"]} />
//         ),
//         children: [
//           { path: "dashboard", element: <DashFinanceira /> },
//           { path: "dashboard-gestao", element: <DashGestao /> },
//           { path: "funcionarios", element: <Funcionarios /> },
//           { path: "pedidos/cadastro", element: <CadastroPedido/>},
//           { path: "movimentacao", element: <CadastroMovimentacao /> },
//           { path: "pedidos/cadastro", element: <CadastroPedido /> },
//         { path: "lista-produtos", element: <ListaProdutos /> },
//         { path: "produtos/editar/:id", element: <CadastroProdutos /> }, 
//         { path: "produtos/fotos/:id", element: <CadastroFotosProduto /> },
            

//         {path: "produtos", element: <CadastroProdutos />},

//         ]
//       },
//     ]
//   }
// ]);