import { useState } from 'react'
import React from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { PiShoppingCartSimple } from "react-icons/pi";
import logo from '../assets/logoEncanto.png';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        // <div style={{ backgroundColor: 'white', alignItems: 'center', width: '100vw', display: 'flex', position: 'fixed', justifyContent: 'center', justifySelf: 'center', top: '0%', height: '70px', gap: "40px", zIndex: "10", filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15))" }}>

        //     {/* Logo Encanto Personalizados */}
        //     <div><img src={logo} alt="logoEncanto" height={"56px"} /></div>

        //     {/* Centro da navbar  */}
        //     <div style={{ width: "50%", flexDirection: "row", display: "flex", gap: "5%", justifyContent: "center" }}>

        //         {/* Opções da nav */}
        //         <div style={{ fontSize: "100%" }} onClick={() => {navigate("/home")}}>Home</div>
        //         <div style={{ fontSize: "100%" }} onClick={() => {navigate("/pedidos")}}>Pedidos</div>
        //         <div style={{ fontSize: "100%" }} onClick={() => {navigate("/dashboard")}}>Financeiro</div>
        //         <div style={{ fontSize: "100%" }}>Produtos</div>
        //         <div style={{ fontSize: "100%" }}>Funcionários</div>


        //     </div>

        //     {/* Botão login e botão carrinho  */}
        //     <div style={{ color: "#f4acacff", display:"flex", width: "fit-content", height: "fit-content", padding: "3px", scale: "2.5" }}onClick={() => {navigate("/login")}}><FaCircleUser /></div>
        //     <div style={{ backgroundColor: "#fbc9bbff", color:"grey", display:"flex", width: "fit-content", height: "fit-content", padding: "5px", scale: "1.6", borderRadius:"8px" }}><PiShoppingCartSimple /></div>

        // </div>

    //      <header className="bg-white border-b shadow-sm" style={{ borderColor: '#D8E2DC' }}>
    //     <div className="max-w-[1600px] mx-auto px-16 py-5">
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-3">
    //           <div className="size-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F4ACB7' }}>
    //             <span className="text-white text-[18px]">OE</span>
    //           </div>
    //           <div className="flex flex-col">
    //             <span className="text-[20px]" style={{ color: '#F4ACB7' }}>O Encanto</span>
    //             <span className="text-[12px]" style={{ color: '#9D8189' }}>personalizados</span>
    //           </div>
    //         </div>
    //         <nav className="flex gap-8">
    //           <div onClick={() => navigate("/home")} className="text-[16px]" style={{ color: '#F4ACB7' }}>Home</div>
    //           <div onClick={() => navigate("/pedidos")} className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Pedidos</div>
    //           <div onClick={() => navigate("/dashboard")} className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Financeiro</div>
    //           <div onClick={() => navigate("/produtos")} className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Produtos</div>
    //           <div onClick={() => navigate("/funcionarios")} className="text-[16px] text-[#9D8189] hover:text-[#F4ACB7] transition-colors">Funcionários</div>
    //         </nav>
    //         <button 
    //           className="px-6 py-2 rounded-md text-[15px] text-white transition-all hover:opacity-90"
    //           style={{ backgroundColor: '#6D6875' }}
    //         >
    //           Login
    //         </button>
    //       </div>
    //     </div>
    //   </header>
    // Dentro do return do seu navbar.tsx:
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

  {/* Centro: Menu de Navegação (Mantenha seus onClick/navigate aqui) */}
  <nav style={{ display: 'flex', gap: '3vw', fontSize: '1vw' }}>
     <div onClick={() => navigate("/home")} style={{ color: '#F4ACB7', cursor: 'pointer' }}>Home</div>
     <div onClick={() => navigate("/kanban")} style={{ color: '#9D8189', cursor: 'pointer' }}>Pedidos</div>
     <div onClick={() => navigate("/dashboard")} style={{ color: '#9D8189', cursor: 'pointer' }}>Financeiro</div>
     <div onClick={() => navigate("/produtos")} style={{ color: '#9D8189', cursor: 'pointer' }}>Produtos</div>
     <div onClick={() => navigate("/movimentacao")} style={{ color: '#9D8189', cursor: 'pointer' }}>Movimentação</div>
     <div onClick={() => navigate("/funcionarios")} style={{ color: '#9D8189', cursor: 'pointer' }}>Funcionários</div>
  </nav>

  {/* Lado Direito: Botão Login */}
  <button style={{ backgroundColor: '#6D6875', color: 'white', padding: '1vh 2vw', border: 'none', borderRadius: '0.5vw', cursor: 'pointer', fontSize: '1vw' }}>
    Login
  </button>
</header>

    )

}

export default Navbar