import { createBrowserRouter } from "react-router-dom"
import { CadastroPedidos } from "../components/kanbanPedidos/cadastroPedidos"
import { DashFinanceira } from "../components/dashboardFinanceira"
import {HomeCalendar} from '../components/home'
import Login from "../components/login"
import Layout from "../components/Layout"

export const route = createBrowserRouter([
    { path: "/login", element: <Login /> },
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "pedidos", element: <CadastroPedidos /> },
            { path: "dashboard", element: <DashFinanceira /> },
            { index: true, element: <DashFinanceira /> },
            { path: "home", element: <HomeCalendar /> }
        ]
    }
])