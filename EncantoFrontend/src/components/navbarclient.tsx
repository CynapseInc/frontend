import { useState } from 'react'
import React from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { PiShoppingCartSimple } from "react-icons/pi";
import logo from '../assets/logoEncanto.png';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    return (
         <nav className="bg-white shadow-sm sticky top-0 z-50 border-b-2 border-[#D8E2DC]">
        <div className="w-full px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FFCAD4] to-[#F4ACB7] rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-[#F4ACB7]">Encanto</h1>
                <p className="text-[#9D8189] text-sm -mt-1">Personalizados</p>
              </div>
            </div>

            {/* Menu */}
            <div className="hidden md:flex items-center gap-12">
              <a href="#home" className="text-[#6D6875] hover:text-[#F4ACB7] transition-colors text-lg">
                Home
              </a>
              <a href="#produtos" className="text-[#6D6875] hover:text-[#F4ACB7] transition-colors text-lg">
                Produtos
              </a>
              <a href="#contato" className="text-[#6D6875] hover:text-[#F4ACB7] transition-colors text-lg">
                Contato
              </a>
            </div>

            {/* Cart */}
            <button className="relative p-4 bg-[#FFE5D9] rounded-2xl hover:bg-[#FFCAD4] transition-all shadow-md hover:shadow-lg">
              <ShoppingCart className="w-6 h-6 text-[#6D6875]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F4ACB7] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    )

}

export default Navbar