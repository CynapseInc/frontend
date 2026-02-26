import React, { useState } from 'react';
import { ShoppingCart, Heart, Trash2, Clock, Edit2, Package, Truck, AlertCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import './index.css'

export default function App() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Caneca do Batman',
      price: 35.00,
      oldPrice: 50.00,
      quantity: 10,
      minQuantity: 10,
      productionTime: '7 dias úteis',
      image: 'https://images.unsplash.com/photo-1711854475634-59d52ba677f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRtYW4lMjBtdWclMjBjb2ZmZWV8ZW58MXx8fHwxNzYzMjIzNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      customizations: {
        name: 'João Silva',
        age: '8'
      }
    },
    {
      id: 2,
      name: 'Kit Festa Unicórnio',
      price: 120.00,
      oldPrice: 150.00,
      quantity: 5,
      minQuantity: 5,
      productionTime: '10 dias úteis',
      image: 'https://images.unsplash.com/photo-1760557658200-5e6230cbd13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBnaWZ0cyUyMG1vZGVybnxlbnwxfHx8fDE3NjMyMjI5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      customizations: {
        name: 'Maria',
        age: '5',
        eventDate: '15/12/2025'
      }
    }
  ]);

  const [zipCode, setZipCode] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [zipError, setZipError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(item.minQuantity, newQuantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleUpdateCustomization = (id: number, field: string, value: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              customizations: {
                ...item.customizations,
                [field]: value
              }
            }
          : item
      )
    );
  };

  const handleCalculateShipping = () => {
    setZipError('');
    
    // Validate ZIP code
    const cleanZip = zipCode.replace(/\D/g, '');
    if (cleanZip.length !== 8) {
      setZipError('CEP inválido. Digite um CEP válido.');
      return;
    }

    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      setShippingOptions([
        { id: 'eco', name: 'Econômico', price: 15.00, days: '9 dias úteis' },
        { id: 'fast', name: 'Rápido', price: 25.00, days: '4 dias úteis' },
        { id: 'express', name: 'Expresso', price: 45.00, days: '1–2 dias úteis' }
      ]);
      setSelectedShipping('eco');
      setIsCalculating(false);
    }, 1000);
  };

  const formatZipCode = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedShipping 
    ? shippingOptions.find(opt => opt.id === selectedShipping)?.price || 0 
    : 0;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    const message = `Olá! Gostaria de finalizar meu pedido:\n\n${cartItems.map(item => 
      `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}\n  Personalização: ${item.customizations.name}${item.customizations.age ? `, ${item.customizations.age} anos` : ''}`
    ).join('\n\n')}\n\nSubtotal: R$ ${subtotal.toFixed(2)}\nFrete: R$ ${shippingCost.toFixed(2)}\nTotal: R$ ${total.toFixed(2)}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511999999999?text=${encodedMessage}`, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        {/* Navbar */}
        

        {/* Empty Cart */}
        <div className="max-w-[1920px] mx-auto px-8 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-16 shadow-xl border-2 border-[#D8E2DC]">
              <div className="w-32 h-32 bg-gradient-to-br from-[#FFE5D9] to-[#FFCAD4]/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-16 h-16 text-[#F4ACB7]" />
              </div>
              <h2 className="text-[#6D6875] mb-4">Seu carrinho está vazio</h2>
              <p className="text-[#9D8189] text-lg mb-8">
                Adicione produtos incríveis para começar suas compras!
              </p>
              <a
                href="#produtos"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all text-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                Ver Produtos
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Navbar */}
      

      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#FFE5D9] to-[#F9F9F9] py-12 border-b-2 border-[#D8E2DC]">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-[#6D6875]">Meu Carrinho</h2>
          <p className="text-[#9D8189] text-lg mt-2">
            Revise seus itens antes de finalizar o pedido
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#D8E2DC] hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="relative w-full md:w-48 shrink-0">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#D8E2DC]">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors border-2 border-[#D8E2DC] group"
                      title="Remover item"
                    >
                      <Trash2 className="w-5 h-5 text-[#9D8189] group-hover:text-red-500" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    {/* Title & Production Time */}
                    <div>
                      <h3 className="text-[#6D6875] mb-2">{item.name}</h3>
                      <div className="flex items-center gap-2 text-[#9D8189]">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Produção: até {item.productionTime}</span>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div>
                      <p className="text-[#9D8189] text-sm mb-2">Quantidade</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= item.minQuantity}
                          className="w-10 h-10 bg-[#F9F9F9] rounded-xl flex items-center justify-center hover:bg-[#FFE5D9] transition-colors border-2 border-[#D8E2DC] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#F9F9F9]"
                        >
                          <span className="text-[#6D6875] text-xl">−</span>
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || item.minQuantity)}
                          className="w-20 h-10 text-center border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none text-[#6D6875]"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-10 h-10 bg-[#F9F9F9] rounded-xl flex items-center justify-center hover:bg-[#FFE5D9] transition-colors border-2 border-[#D8E2DC]"
                        >
                          <span className="text-[#6D6875] text-xl">+</span>
                        </button>
                        <span className="text-[#9D8189] text-sm ml-2">
                          Mínimo: {item.minQuantity} un.
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-[#9D8189] text-sm mb-1">Preço</p>
                      <div className="flex items-center gap-3">
                        {item.oldPrice && (
                          <span className="text-[#9D8189] line-through text-lg">
                            R$ {item.oldPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-[#F4ACB7] text-2xl">
                          R$ {item.price.toFixed(2)}
                        </span>
                        <span className="text-[#9D8189] text-sm">/ unidade</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-[#6D6875]">
                          Total do item: R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Customizations */}
                    {item.customizations && (
                      <div className="bg-gradient-to-br from-[#FFCAD4]/10 to-[#FFE5D9]/30 rounded-2xl p-4 border border-[#FFCAD4]/30">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[#6D6875]">Suas personalizações</h4>
                          <button 
                            onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-[#F4ACB7]" />
                          </button>
                        </div>
                        
                        {editingItem === item.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[#9D8189] text-sm mb-1">Nome</label>
                              <input
                                type="text"
                                value={item.customizations.name || ''}
                                onChange={(e) => handleUpdateCustomization(item.id, 'name', e.target.value)}
                                placeholder="Digite o nome"
                                className="w-full px-3 py-2 border-2 border-[#D8E2DC] rounded-lg focus:border-[#F4ACB7] focus:outline-none bg-white text-[#6D6875]"
                              />
                            </div>
                            <div>
                              <label className="block text-[#9D8189] text-sm mb-1">Idade</label>
                              <input
                                type="text"
                                value={item.customizations.age || ''}
                                onChange={(e) => handleUpdateCustomization(item.id, 'age', e.target.value)}
                                placeholder="Digite a idade"
                                className="w-full px-3 py-2 border-2 border-[#D8E2DC] rounded-lg focus:border-[#F4ACB7] focus:outline-none bg-white text-[#6D6875]"
                              />
                            </div>
                            {item.customizations.eventDate !== undefined && (
                              <div>
                                <label className="block text-[#9D8189] text-sm mb-1">Data do Evento</label>
                                <input
                                  type="text"
                                  value={item.customizations.eventDate || ''}
                                  onChange={(e) => handleUpdateCustomization(item.id, 'eventDate', e.target.value)}
                                  placeholder="DD/MM/AAAA"
                                  className="w-full px-3 py-2 border-2 border-[#D8E2DC] rounded-lg focus:border-[#F4ACB7] focus:outline-none bg-white text-[#6D6875]"
                                />
                              </div>
                            )}
                            <button
                              onClick={() => setEditingItem(null)}
                              className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-2 rounded-lg hover:shadow-md transition-all text-sm"
                            >
                              Salvar alterações
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {item.customizations.name && (
                              <div className="flex items-center gap-2">
                                <span className="text-[#9D8189] text-sm">Nome:</span>
                                <span className="text-[#6D6875]">{item.customizations.name}</span>
                              </div>
                            )}
                            {item.customizations.age && (
                              <div className="flex items-center gap-2">
                                <span className="text-[#9D8189] text-sm">Idade:</span>
                                <span className="text-[#6D6875]">{item.customizations.age}</span>
                              </div>
                            )}
                            {item.customizations.eventDate && (
                              <div className="flex items-center gap-2">
                                <span className="text-[#9D8189] text-sm">Data do evento:</span>
                                <span className="text-[#6D6875]">{item.customizations.eventDate}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Shipping Calculator */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#D8E2DC]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFE5D9] to-[#FFCAD4]/30 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-[#F4ACB7]" />
                </div>
                <h3 className="text-[#6D6875]">Calcular Frete</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#6D6875] mb-2">CEP de Entrega</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(formatZipCode(e.target.value))}
                      placeholder="00000-000"
                      maxLength={9}
                      className="flex-1 px-4 py-3 border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none"
                    />
                    <button
                      onClick={handleCalculateShipping}
                      disabled={isCalculating}
                      className="bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCalculating ? 'Calculando...' : 'Calcular'}
                    </button>
                  </div>
                  {zipError && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{zipError}</span>
                    </div>
                  )}
                </div>

                {/* Shipping Options */}
                {shippingOptions.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <p className="text-[#6D6875]">Selecione uma opção de frete:</p>
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedShipping === option.id
                            ? 'border-[#F4ACB7] bg-gradient-to-br from-[#FFCAD4]/10 to-[#FFE5D9]/30'
                            : 'border-[#D8E2DC] hover:border-[#F4ACB7] bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="w-5 h-5 accent-[#F4ACB7]"
                          />
                          <div>
                            <p className="text-[#6D6875]">{option.name}</p>
                            <p className="text-[#9D8189] text-sm">{option.days}</p>
                          </div>
                        </div>
                        <span className="text-[#F4ACB7]">R$ {option.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                )}

                {shippingOptions.length === 0 && !zipError && zipCode.length >= 9 && (
                  <div className="text-center py-6 text-[#9D8189]">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Digite seu CEP e clique em "Calcular" para ver as opções de frete</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#D8E2DC] sticky top-24">
              <h3 className="text-[#6D6875] mb-6">Resumo do Pedido</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-[#6D6875]">
                  <span>Produtos</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-[#6D6875]">
                  <span>Frete</span>
                  <span>
                    {shippingCost > 0 ? `R$ ${shippingCost.toFixed(2)}` : 'Calcular'}
                  </span>
                </div>

                <div className="border-t-2 border-[#D8E2DC] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6D6875]">Total</span>
                    <span className="text-[#F4ACB7] text-3xl">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {!selectedShipping && (
                <div className="bg-[#FFE5D9] rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#F4ACB7] shrink-0 mt-0.5" />
                  <p className="text-[#6D6875] text-sm">
                    Calcule o frete para finalizar seu pedido
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={!selectedShipping}
                className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-4 rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
                Continuar compra
              </button>
              <p className="text-[#9D8189] text-sm text-center mt-3">
                Você será redirecionado para o WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}