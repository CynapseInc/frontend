import { useState } from 'react'
import React from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { PiShoppingCartSimple } from "react-icons/pi";
import logo from '../assets/logoEncanto.png';


function Navbar() {

    return (
        <div style={{ backgroundColor: 'white', alignItems: 'center', width: '100vw', display: 'flex', position: 'fixed', justifyContent: 'center', justifySelf: 'center', top: '0%', height: '70px', gap: "40px", zIndex: "10", filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15))" }}>

            {/* Logo Encanto Personalizados */}
            <div><img src={logo} alt="logoEncanto" height={"56px"} /></div>

            {/* Centro da navbar  */}
            <div style={{ width: "50%", flexDirection: "row", display: "flex", gap: "5%", justifyContent: "center" }}>

                {/* Opções da nav */}
                <div style={{ fontSize: "100%" }}>Home</div>
                <div style={{ fontSize: "100%" }}>Pedidos</div>
                <div style={{ fontSize: "100%" }}>Financeiro</div>
                <div style={{ fontSize: "100%" }}>Produtos</div>
                <div style={{ fontSize: "100%" }}>Funcionários</div>


            </div>

            {/* Botão login e botão carrinho  */}
            <div style={{ color: "#f4acacff", display:"flex", width: "fit-content", height: "fit-content", padding: "3px", scale: "2.5" }}><FaCircleUser /></div>
            <div style={{ backgroundColor: "#fbc9bbff", color:"grey", display:"flex", width: "fit-content", height: "fit-content", padding: "5px", scale: "1.6", borderRadius:"8px" }}><PiShoppingCartSimple /></div>

        </div>

    )

}

export default Navbar