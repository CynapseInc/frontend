import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import FeedbackModal from '../ui/FeedbackModal';
import './index.css';

// Tabela de preços de frete por estado
const FRETE_PRICES: { [key: string]: number } = {
  'AC': 35.00, // Acre
  'AL': 25.00, // Alagoas
  'AP': 40.00, // Amapá
  'AM': 45.00, // Amazonas
  'BA': 20.00, // Bahia
  'CE': 22.00, // Ceará
  'DF': 18.00, // Distrito Federal
  'ES': 18.00, // Espírito Santo
  'GO': 20.00, // Goiás
  'MA': 28.00, // Maranhão
  'MT': 32.00, // Mato Grosso
  'MS': 30.00, // Mato Grosso do Sul
  'MG': 17.00, // Minas Gerais
  'PA': 38.00, // Pará
  'PB': 24.00, // Paraíba
  'PR': 16.00, // Paraná
  'PE': 23.00, // Pernambuco
  'PI': 26.00, // Piauí
  'RJ': 16.00, // Rio de Janeiro
  'RN': 25.00, // Rio Grande do Norte
  'RS': 19.00, // Rio Grande do Sul
  'RO': 42.00, // Rondônia
  'RR': 50.00, // Roraima
  'SC': 18.00, // Santa Catarina
  'SP': 15.00, // São Paulo
  'SE': 24.00, // Sergipe
  'TO': 36.00, // Tocantins
};

export default function App() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showFrete, setShowFrete] = useState(false);
  const [cep, setCep] = useState('');
  const [freteData, setFreteData] = useState(null);
  const [freteLoading, setFreteLoading] = useState(false);
  const [freteError, setFreteError] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ isOpen: true, message, type });
  };

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
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (cartItems.length === 0 || !showFrete || !freteData) return;
    showFeedback('Redirecionando para finalização do pedido!', 'success');
    console.log("Itens prontos para checkout:", cartItems);
  };

  const consultarFrete = async () => {
    if (cep.length !== 8) {
      setFreteError('CEP inválido (deve ter 8 dígitos)');
      return;
    }

    setFreteLoading(true);
    setFreteError(null);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      const data = await response.json();

      if (!response.ok) throw new Error('CEP não encontrado');

      console.log('Dados do frete:', data);
      
      // Buscar o preço do frete baseado no estado
      const estado = data.state;
      const preco = FRETE_PRICES[estado];
      
      if (preco === undefined) {
        throw new Error(`Estado não encontrado: ${estado}`);
      }
      
      setShippingCost(preco);
      setFreteData(data);
      setShowFrete(true);
    } catch (err: any) {
      setFreteError(err.message);
    } finally {
      setFreteLoading(false);
    }
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
                  {showFrete && freteData && (
                    <div id="frete-span" className="flex justify-between text-[#6D6875] bg-[#F9F9F9] p-3 rounded-lg mb-3">
                      <div className="text-sm">
                        <p><strong>📍 Frete para {freteData.city}/{freteData.state}</strong></p>
                        <p className="text-[#9D8189] text-xs mt-1">{freteData.street || 'Endereço localizado'}</p>
                      </div>
                      <span className="text-[#F4ACB7] font-bold">R$ {shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  {totalWeight > 0 && (
                    <div className="flex justify-between text-[#9D8189] text-sm">
                      <span>Peso estimado</span>
                      <span>{totalWeight} g</span>
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

                <div className="flex flex-col md:flex-row md:flex-nowrap gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="CEP (8 dígitos)"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                    className="w-full md:flex-1 md:min-w-0 px-3 py-3 rounded-xl border-2 border-[#D8E2DC] text-[#6D6875] placeholder-[#9D8189] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  />
                  <button
                    onClick={consultarFrete}
                    disabled={freteLoading}
                    className="w-full md:flex-1 md:min-w-0 bg-white border-2 border-[#F4ACB7] text-[#F4ACB7] py-3 rounded-xl shadow-md font-medium hover:bg-[#FFE5D9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {freteLoading ? 'Calculando...' : 'Calcular Frete'}
                  </button>
                </div>
                {freteError && <p className="text-red-500 text-sm mb-3">{freteError}</p>}

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
                  🔒 Compra 100% segura.<br />
                  Seus dados estão protegidos.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        message={feedback.message}
        type={feedback.type}
      />
    </div>
  );
}