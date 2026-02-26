import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './navbar'
import '../index.css'
import NavbarClient from './navbarclient'

export default function Layout() {
  const location = useLocation();
  
  // Páginas onde a navbar não deve aparecer
  const hiddenNavbarPages = ['/catalogo', '/login', '/pesquisa-produtos', '/detalhe-produto/:id', '/carrinho'];
  const shouldHideNavbar = hiddenNavbarPages.includes(location.pathname) || location.pathname.startsWith('/detalhe-produto/');

  return (
    <div className="layout-global">
       {!shouldHideNavbar && <Navbar />}
      {shouldHideNavbar && <NavbarClient />}
      <main className="conteudo-padrao">
        <Outlet />
      </main>
    </div>
  )
}