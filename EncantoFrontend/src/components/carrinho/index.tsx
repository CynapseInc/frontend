import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Package, QrCode, CreditCard, Truck, Bold } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import FeedbackModal from '../ui/FeedbackModal';
import api from '../../provider/api';
import './index.css';

// CEP DA SUA LOJA - Substitua pelo correto
const CEP_ORIGEM = "01139000"; 

export default function App() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showFrete, setShowFrete] = useState(false);
  const [cep, setCep] = useState('');
  const [freteData, setFreteData] = useState<any>(null);
  const [freteLoading, setFreteLoading] = useState(false);
  const [freteError, setFreteError] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  
  // Estados para as múltiplas opções do Melhor Envio
  const [opcoesFrete, setOpcoesFrete] = useState<any[]>([]);
  const [freteSelecionado, setFreteSelecionado] = useState<any>(null);
  
  const [meioPagamento, setMeioPagamento] = useState<string>('');

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

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('encanto_carrinho') || '[]');
    setCartItems(savedCart);
  }, []);

  const updateCartStorage = (newCart: any[]) => {
    setCartItems(newCart);
    localStorage.setItem('encanto_carrinho', JSON.stringify(newCart));
  };

  const handleRemoveItem = (cartItemId: string) => {
    const newCart = cartItems.filter(item => item.cartItemId !== cartItemId);
    updateCartStorage(newCart);
    
    // Se o carrinho ficar vazio, reseta o frete
    if (newCart.length === 0) {
      setShowFrete(false);
      setOpcoesFrete([]);
      setFreteSelecionado(null);
      setShippingCost(0);
    }
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
      setShowFrete(false);
      setOpcoesFrete([]);
      setFreteSelecionado(null);
      setShippingCost(0);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalWeight = (cartItems.reduce((acc, item) => acc + ((item.weight || 0) * item.quantity), 0) / 1000).toFixed(2);
  const total = subtotal + shippingCost;

  const consultarFrete = async () => {
    if (cep.length !== 8) {
      setFreteError('CEP inválido (deve ter 8 dígitos)');
      return;
    }
    setFreteLoading(true);
    setFreteError(null);
    setOpcoesFrete([]);
    setFreteSelecionado(null);

    try {
      // 1. Pega os dados básicos do endereço do cliente direto da BrasilAPI (sem precisar de token)
      const responseBrasilApi = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      if (!responseBrasilApi.ok) throw new Error('CEP não encontrado');
      const dataEndereco = await responseBrasilApi.json();
      setFreteData(dataEndereco);

      // 2. Prepara os produtos para o body da nossa API
      const produtosParaBackend = cartItems.map((item, index) => ({
        id: item.cartItemId || String(index),
        width: item.largura || 11,
        height: item.altura || 2,
        length: item.comprimento || 16,
        weight: (item.weight || 300) / 1000, 
        insurance_value: item.price,
        quantity: item.quantity
      }));

      // 3. Consulta nosso próprio backend
      const responseFrete = await api.post('/fretes/calcular', {
        cepOrigem: CEP_ORIGEM,
        cepDestino: cep,
        produtos: produtosParaBackend
      });

      const transportadorasDisponiveis = responseFrete.data;

      if (!transportadorasDisponiveis || transportadorasDisponiveis.length === 0) {
        throw new Error('Nenhuma transportadora disponível para este CEP.');
      }

      setOpcoesFrete(transportadorasDisponiveis);
      setFreteSelecionado(transportadorasDisponiveis[0]); // Seleciona o mais barato por padrão
      setShippingCost(transportadorasDisponiveis[0].price);
      setShowFrete(true);

    } catch (err: any) {
      const msgErro = err.response?.data?.message || err.message || 'Erro ao calcular frete.';
      setFreteError(msgErro);
    } finally {
      setFreteLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
        showFeedback('O seu carrinho está vazio!', 'error');
        return;
    }
    
    if (!showFrete || !freteData || !freteSelecionado) {
        showFeedback('Por favor, calcule e selecione um frete para a sua região.', 'error');
        return;
    }

    if (!meioPagamento) {
        showFeedback('Por favor, selecione uma forma de pagamento.', 'error');
        return;
    }

    let texto = `Olá! Gostaria de finalizar meu pedido na Encanto Personalizados:\n\n`;
    
    texto += `*PRODUTOS:*\n`;
    cartItems.forEach((item) => {
      const personalizacao = (item.customName || item.customAge) 
        ? ` (Pers.: ${item.customName || ''} ${item.customAge ? `- ${item.customAge} anos` : ''})` 
        : '';
      texto += `- ${item.quantity}x ${item.name}${personalizacao} (R$ ${item.price.toFixed(2)})\n`;
    });

    texto += `\n*RESUMO DO PEDIDO:*\n`;
    texto += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    if (parseFloat(totalWeight) > 0) {
      texto += `Peso Estimado: ${totalWeight} Kg\n`;
    }
    
    const nomeTransportadora = freteSelecionado.name;
    const prazoTransportadora = freteSelecionado.deliveryTime;
    texto += `Frete (${nomeTransportadora} - ~${prazoTransportadora} dias): R$ ${shippingCost.toFixed(2)}\n`;
    texto += `*Total: R$ ${total.toFixed(2)}*\n\n`;

    texto += `*ENDEREÇO DE ENTREGA:*\n`;
    texto += `CEP: ${cep}\n`;
    texto += `${freteData.street || 'Endereço localizado'}, ${freteData.neighborhood || ''}\n`;
    texto += `${freteData.city} - ${freteData.state}\n\n`;

    texto += `*FORMA DE PAGAMENTO ESCOLHIDA:*\n`;
    texto += `${meioPagamento}\n`;

    const numeroLoja = "5511987654321"; // Coloque o número do WhatsApp da loja aqui
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroLoja}&text=${encodeURIComponent(texto)}`;

    window.open(urlWhatsapp, '_blank');
    navigate('/catalogo');
  };

  const opcoesPagamento = [
    { id: 'Pix', label: 'Pix', icon: QrCode },
    { id: 'Cartão de Crédito', label: 'Crédito', icon: CreditCard },
    { id: 'Cartão de Débito', label: 'Débito', icon: CreditCard },
  ];

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
                            className="p-2 text-[#9D8189] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
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
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F9F9F9] text-[#6D6875] focus:outline-none"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-[#6D6875] font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F9F9F9] text-[#6D6875] focus:outline-none"
                            >
                              +
                            </button>
                          </div>

                          {/* Preço */}
                          <div className="text-right">
                            <p className="text-[#9D8189] text-sm">R$ {item.price.toFixed(2)} / un</p>
                            {item.weight && (
                              <p className="text-[#9D8189] text-xs mt-0.5">Peso: {item.weight}g / un</p>
                            )}
                            <p className="text-[#F4ACB7] text-[20px] font-bold mt-1">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/pesquisa-produtos')}
                className="flex items-center gap-2 text-[#6D6875] hover:text-[#F4ACB7] transition-colors focus:outline-none"
              >
                <ArrowLeft className="w-4 h-4" /> Continuar comprando
              </button>
            </div>

            {/* Resumo do Pedido (Direita) */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#FFCAD4]">
                <h2 className="text-[#6D6875] text-[20px] font-medium border-b-2 border-[#D8E2DC] pb-4 mb-6">Resumo do Pedido</h2>
                
                {/* 1. Subtotal */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#6D6875]">
                    <span>Subtotal ({cartItems.length} itens)</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {parseFloat(totalWeight) > 0 && (
                    <div className="flex justify-between text-[#9D8189] text-sm mt-2">
                      <span>Peso total estimado</span>
                      <span>{totalWeight} Kg</span>
                    </div>
                  )}
                </div>

                {/* 2. Seção de Frete / Entrega */}
                <div className="border-t-2 border-[#D8E2DC] pt-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-[#F4ACB7]" />
                    <h3 className="text-[#6D6875] font-bold text-base">Entrega</h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:flex-nowrap gap-2 mb-2">
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
                      disabled={freteLoading || cep.length !== 8}
                      className="w-full md:flex-1 md:min-w-0 bg-white border-2 border-[#F4ACB7] text-[#F4ACB7] py-3 rounded-xl shadow-md font-medium hover:bg-[#FFE5D9] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                    >
                      {freteLoading ? 'Calculando...' : 'Calcular Frete'}
                    </button>
                  </div>
                  
                  <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noreferrer" className="text-xs text-[#9D8189] hover:text-[#F4ACB7] underline mb-4 inline-block focus:outline-none">
                    Não sei meu CEP
                  </a>

                  {freteError && <p className="text-red-500 text-sm mb-3">{freteError}</p>}
                  
                  {/* Resultado Múltiplo do Frete com visual de opção selecionada */}
                  {showFrete && freteData && opcoesFrete.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#D8E2DC] transition-all">
                      
                      {/* Endereço de Entrega */}
                      <div className="mb-4">
                        <p className="text-[#6D6875] text-sm">
                          <strong>🚚 {freteData.city}/{freteData.state}</strong>
                        </p>
                        <p className="text-[#9D8189] text-xs mt-0.5">{freteData.street || 'Endereço localizado'}</p>
                      </div>

                      {/* NOVO: Título claro para a escolha da transportadora */}
                      <h4 className="text-[#6D6875] font-bold mb-0 text-sm" style={{fontWeight: 'bold'}}>Escolha a Transportadora</h4>
                      <h4 className="text-[#6D6875] mb-3 text-sm">Escolha a Transportadora</h4>

                      <div className="space-y-2">
                        {opcoesFrete.map((opcao) => {
                          const isSelected = freteSelecionado?.id === opcao.id;
                          const precoFrete = opcao.price;
                          
                          return (
                            <button
                              key={opcao.id}
                              onClick={() => {
                                setFreteSelecionado(opcao);
                                setShippingCost(precoFrete);
                              }}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all focus:outline-none ${
                                isSelected 
                                  ? 'bg-[#FFE5D9] border-[#F4ACB7]' 
                                  : 'bg-white border-[#D8E2DC] hover:bg-gray-50'
                              }`}
                              style={{ 
                                outline: 'none', 
                                boxShadow: isSelected ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                                WebkitTapHighlightColor: 'transparent'
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full flex items-center justify-center transition-colors shrink-0"
                                  style={{ backgroundColor: isSelected ? '#F4ACB7' : '#D8E2DC' }}
                                >
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                </div>
                                
                                <div className="text-left">
                                  <p 
                                    className="text-sm transition-colors"
                                    style={{ 
                                      color: isSelected ? '#6D6875' : '#9D8189',
                                      fontWeight: isSelected ? 'bold' : 'normal'
                                    }}
                                  >
                                    {opcao.name} <span className="text-[10px] font-normal opacity-70">({opcao.companyName})</span>
                                  </p>
                                  <p className="text-xs" style={{ color: isSelected ? '#9D8189' : '#ADB5BD' }}>
                                    Chega em aprox. {opcao.deliveryTime} dias úteis
                                  </p>
                                </div>
                              </div>
                              
                              <span 
                                className="text-sm transition-colors shrink-0"
                                style={{ 
                                  color: isSelected ? '#F4ACB7' : '#6D6875',
                                  fontWeight: 'bold'
                                }}
                              >
                                R$ {precoFrete.toFixed(2)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Total Geral */}
                <div className="border-t-2 border-[#D8E2DC] pt-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6D6875] text-[18px]">Total</span>
                    <span className="text-[#F4ACB7] text-[32px] font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* 4. Forma de Pagamento */}
                <div className="border-t-2 border-[#D8E2DC] pt-6 mb-6">
                  <h3 className="text-[#6D6875] font-bold mb-1 text-sm">Forma de Pagamento</h3>
                  <p className="text-xs text-[#9D8189] mb-4">
                    Selecione a forma. Os detalhes serão combinados via WhatsApp.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {opcoesPagamento.map((metodo) => {
                      const Icon = metodo.icon;
                      const isSelected = meioPagamento === metodo.id;
                      
                      return (
                        <button
                          key={metodo.id}
                          onClick={() => setMeioPagamento(metodo.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? 'bg-[#FFE5D9] border-[#F4DCB7]' 
                              : 'bg-white border-[#D8E2DC] hover:bg-gray-50 hover:border-[#FFCAD4]'
                          }`}
                          style={{ 
                            outline: 'none', 
                            boxShadow: isSelected ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                            WebkitTapHighlightColor: 'transparent' 
                          }}
                        >
                          <Icon 
                            className="w-6 h-6 mb-2 transition-colors" 
                            style={{ color: isSelected ? '#6D6875' : '#9D8189' }}
                          />
                          <span 
                            className="text-xs text-center transition-colors"
                            style={{ 
                              color: isSelected ? '#6D6875' : '#9D8189',
                              fontWeight: isSelected ? 'bold' : 'normal'
                            }}
                          >
                            {metodo.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Botão de Finalizar */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-4 rounded-xl shadow-lg font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg uppercase tracking-wide focus:outline-none"
                >
                  Finalizar via WhatsApp <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Box de Confiança */}
              <div className="bg-[#FFE5D9]/50 rounded-2xl p-6 border border-[#FFCAD4]/50">
                <p className="text-[#6D6875] text-sm text-center">
                  🔒 Compra 100% segura.<br />
                  Finalização rápida e prática com nossa equipe.
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