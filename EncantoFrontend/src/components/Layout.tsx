import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './navbar'
import NavbarClient from './navbarclient'

export default function Layout() {
  const location = useLocation();
  
  // Páginas onde a navbar não deve aparecer
  const hiddenNavbarPages = ['/catalogo', '/login'];
  const shouldHideNavbar = hiddenNavbarPages.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {shouldHideNavbar && <NavbarClient />}
      <main style={{ paddingTop: shouldHideNavbar ? '0px' : '70px' }}>
        <Outlet />
      </main>
    </>
  )
}
