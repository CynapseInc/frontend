import { createBrowserRouter } from "react-router-dom"
import { KanbanPedidos } from "../components/kanbanPedidos"
import { DashFinanceira } from "../components/dashboardFinanceira"
import Login from "../components/login"
import Layout from "../components/Layout"

export const route = createBrowserRouter([
    { path: "/login", element: <Login /> },
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "pedidos", element: <KanbanPedidos /> },
            { path: "dashboard", element: <DashFinanceira /> },
            { index: true, element: <DashFinanceira /> }
        ]
    }
])