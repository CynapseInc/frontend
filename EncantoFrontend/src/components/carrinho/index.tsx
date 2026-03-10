import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import './index.css';

export default function App() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  // 1. Carregar o carrinho do LocalStorage ao abrir a página
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('encanto_carrinho') || '[]');
    setCartItems(savedCart);
  }, []);

  // 2. Função para salvar mudanças (quantidade/remoção) de volta no LocalStorage
  const updateCartStorage = (newCart: any[]) => {
    setCartItems(newCart);
    localStorage.setItem('encanto_carrinho', JSON.stringify(newCart));
  };

  const handleRemoveItem = (cartItemId: string) => {
    const newCart = cartItems.filter(item => item.cartItemId !== cartItemId);
    updateCartStorage(newCart);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = cartItems.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCartStorage(newCart);
  };

  const handleClearCart = () => {
    if (confirm('Tem a certeza que deseja esvaziar o carrinho?')) {
      updateCartStorage([]);
    }
  };

  // 3. Cálculos do Pedido
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalWeight = cartItems.reduce((acc, item) => acc + ((item.weight || 0) * item.quantity), 0);
  
  // Vamos assumir um frete fixo ou frete grátis por agora (pode expandir no futuro)
  const shippingCost = 0; 
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Aqui você vai decidir como finalizar: enviar para o WhatsApp ou abrir uma tela de Login/Cadastro de Cliente
    alert('Redirecionando para finalização do pedido...');
    console.log("Itens prontos para checkout:", cartItems);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-[#FFE5D9] rounded-2xl flex items-center justify-center shadow-sm border border-[#FFCAD4]">
            <ShoppingBag className="w-8 h-8 text-[#F4ACB7]" />
          </div>
          <div>
            <h1 className="text-[36px] text-[#6D6875] leading-tight">Seu Carrinho</h1>
            <p className="text-[#9D8189] text-[16px]">Confira os seus itens antes de finalizar a compra</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Carrinho Vazio */
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl border-2 border-[#D8E2DC]">
            <div className="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#D8E2DC]">
              <Package className="w-10 h-10 text-[#9D8189]" />
            </div>
            <h2 className="text-[#6D6875] text-[24px] mb-3">O seu carrinho está vazio</h2>
            <p className="text-[#9D8189] mb-8">Que tal adicionar alguns produtos encantadores?</p>
            <button 
              onClick={() => navigate('/pesquisa-produtos')}
              className="bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white px-8 py-4 rounded-xl shadow-lg font-medium hover:scale-105 transition-all"
            >
              Explorar Produtos
            </button>
          </div>
        ) : (
          /* Carrinho com Itens */
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Lista de Produtos (Esquerda) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#D8E2DC]">
                <div className="flex items-center justify-between border-b-2 border-[#D8E2DC] pb-4 mb-6">
                  <h2 className="text-[#6D6875] text-[20px] font-medium">Itens Selecionados ({cartItems.length})</h2>
                  <button onClick={handleClearCart} className="text-[#F4ACB7] text-sm hover:underline">
                    Esvaziar carrinho
                  </button>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex gap-6 p-4 rounded-2xl bg-[#F9F9F9] border border-[#D8E2DC] transition-all hover:shadow-md">
                      
                      {/* Imagem */}
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-white shrink-0 border border-[#D8E2DC]">
                        {item.image ? (
                          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#9D8189] text-xs">Sem foto</div>
                        )}
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-[#6D6875] text-[18px] mb-1">{item.name}</h3>
                            {(item.customName || item.customAge) && (
                              <div className="inline-block bg-[#FFE5D9] px-3 py-1 rounded-lg mt-1">
                                <p className="text-[#9D8189] text-[12px]">
                                  <strong>Personalização:</strong> {item.customName} {item.customAge ? `(${item.customAge} anos)` : ''}
                                </p>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => handleRemoveItem(item.cartItemId)}
                            className="p-2 text-[#9D8189] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Controlo de Quantidade */}
                          <div className="flex items-center gap-3 bg-white border border-[#D8E2DC] rounded-lg p-1">
                            <button 
                              onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F9F9F9] text-[#6D6875]"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-[#6D6875] font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F9F9F9] text-[#6D6875]"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Preço */}
                          <div className="text-right">
                            <p className="text-[#9D8189] text-sm">R$ {item.price.toFixed(2)} / un</p>
                            <p className="text-[#F4ACB7] text-[20px] font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/pesquisa-produtos')}
                className="flex items-center gap-2 text-[#6D6875] hover:text-[#F4ACB7] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Continuar comprando
              </button>
            </div>

            {/* Resumo do Pedido (Direita) */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#FFCAD4]">
                <h2 className="text-[#6D6875] text-[20px] font-medium border-b-2 border-[#D8E2DC] pb-4 mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#6D6875]">
                    <span>Subtotal ({cartItems.length} itens)</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#6D6875]">
                    <span>Frete</span>
                    <span className="text-[#4CAF50]">Grátis</span>
                  </div>
                  {totalWeight > 0 && (
                     <div className="flex justify-between text-[#9D8189] text-sm">
                       <span>Peso estimado</span>
                       <span>{(totalWeight / 1000).toFixed(2)} kg</span>
                     </div>
                  )}
                </div>

                <div className="border-t-2 border-[#D8E2DC] pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6D6875] text-[18px]">Total</span>
                    <span className="text-[#F4ACB7] text-[32px] font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                  <p className="text-[#9D8189] text-xs mt-1 text-right">Em até 3x sem juros</p>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-4 rounded-xl shadow-lg font-medium hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  Finalizar Compra <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Box de Confiança */}
              <div className="bg-[#FFE5D9]/50 rounded-2xl p-6 border border-[#FFCAD4]/50">
                <p className="text-[#6D6875] text-sm text-center">
                  🔒 Compra 100% segura.<br/>
                  Seus dados estão protegidos.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}