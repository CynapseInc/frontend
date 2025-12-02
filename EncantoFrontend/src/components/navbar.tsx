import { useState } from 'react'
import React from 'react';
import logo from '../assets/logoEncanto.png';


function Navbar() {

    return (
        <div style={{ backgroundColor: 'white', alignItems: 'center', width: '100vw', display: 'flex', position: 'fixed', justifyContent: 'center', justifySelf: 'center', top: '0%', height: '56px', gap: "20px", zIndex: "10" }}>

                {/* Logo Encanto Personalizados */}
            <div><img src={logo} alt="logoEncanto" height={"48px"} /></div>

                {/* Centro da navbar  */}
            <div style={{ backgroundColor: 'blue', width: "50%", flexDirection:"row", display:"flex", gap:"5%", justifyContent:"center"}}>

                {/* Opções da nav */}
                <div style={{ fontSize: "80%" }}>Home</div>
                <div style={{ fontSize: "80%" }}>Pedidos</div>
                <div style={{ fontSize: "80%" }}>Financeiro</div>
                <div style={{ fontSize: "80%" }}>Produtos</div>
                <div style={{ fontSize: "80%" }}>Funcionários</div>


            </div>

                {/* Botão login e botão carrinho  */}
            <div style={{ backgroundColor: "green", width: "fit-content", padding:"3px" }}>Login</div>
            <div style={{ backgroundColor: "green", width: "fit-content", padding:"3px" }}>Carrinho</div>

        </div>

    )

}

export default Navbar