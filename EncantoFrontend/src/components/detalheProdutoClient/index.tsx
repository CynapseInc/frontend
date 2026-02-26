import React, { useState } from 'react';
import { ShoppingCart, Heart, ChevronRight, Clock, Info, Package, Ruler, Weight, Tag, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import './detalhe-index.css'

export default function App() {
  const [cartCount] = useState(3);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customAge, setCustomAge] = useState('');

  const product = {
    id: 1,
    name: 'Caneca do Batman',
    description: 'Caneca personalizada em cerâmica de alta qualidade com impressão durável e design exclusivo do Batman. Perfeita para presentear ou usar no dia a dia. Pode ser personalizada com nome e idade.',
    price: 35.00,
    oldPrice: 50.00,
    discount: 30,
    category: 'Eventos Corporativos',
    theme: 'Super-heróis',
    item: 'Caneca',
    material: 'Cerâmica',
    weight: 350,
    minQuantity: 1,
    productionTime: '7 dias úteis',
    dimensions: {
      height: 9.5,
      width: 8.0,
      depth: 8.0
    },
    images: [
      'https://images.unsplash.com/photo-1711854475634-59d52ba677f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRtYW4lMjBtdWclMjBjb2ZmZWV8ZW58MXx8fHwxNzYzMjIzNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1700887916107-2ac9ba8145e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBjb2ZmZWUlMjBtdWd8ZW58MXx8fHwxNzYzMjIzNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1761233976732-87f2c57a02d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBjZXJhbWljJTIwbXVnfGVufDF8fHx8MTc2MzIyMzc1OHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1575026469075-99e9e3433e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNvZmZlZSUyMGN1cHxlbnwxfHx8fDE3NjMyMjM3NTh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    rating: 5,
    reviews: 127
  };

  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    console.log('Produto adicionado ao carrinho:', {
      product,
      quantity,
      customName,
      customAge
    });
    alert('Produto adicionado ao carrinho!');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Navbar */}
      

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#D8E2DC]">
        <div className="max-w-[1920px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-[#9D8189]">
            <a href="#home" className="hover:text-[#F4ACB7] transition-colors">
              Home
            </a>
            <ChevronRight className="w-4 h-4" />
            <a href="#produtos" className="hover:text-[#F4ACB7] transition-colors">
              Produtos
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#6D6875]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-8 py-12">
        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-[#D8E2DC] aspect-square">
              <ImageWithFallback
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-2xl overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'ring-4 ring-[#F4ACB7] shadow-lg scale-105'
                      : 'ring-2 ring-[#D8E2DC] hover:ring-[#F4ACB7] opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title & Badge */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <h2 className="text-[#6D6875] flex-1">{product.name}</h2>
                {product.discount && (
                  <span className="bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F4ACB7] text-[#F4ACB7]" />
                  ))}
                </div>
                <span className="text-[#9D8189]">({product.reviews} avaliações)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-[#FFE5D9] to-[#F9F9F9] rounded-2xl p-6 border-2 border-[#D8E2DC]">
              <div className="space-y-3">
                <div>
                  <p className="text-[#9D8189] text-sm mb-2">Preço Unitário</p>
                  <div className="flex items-center gap-4">
                    {product.oldPrice && (
                      <span className="text-[#9D8189] line-through text-xl">
                        R$ {product.oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[#F4ACB7] text-3xl">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-[#D8E2DC] pt-3">
                  <p className="text-[#9D8189] text-sm mb-2">Preço Total</p>
                  <span className="text-[#6D6875] text-4xl">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <p className="text-[#F4ACB7] text-sm mt-2">
                      Economize R$ {((product.oldPrice - product.price) * quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Production Time */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#D8E2DC] shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFE5D9] rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#F4ACB7]" />
                </div>
                <div>
                  <p className="text-[#9D8189] text-sm">Prazo de Produção</p>
                  <p className="text-[#6D6875]">Até {product.productionTime} após confirmação do pagamento</p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#D8E2DC] shadow-md">
              <p className="text-[#6D6875] mb-3">Quantidade</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(product.minQuantity, quantity - 1))}
                  className="w-12 h-12 bg-[#F9F9F9] rounded-xl flex items-center justify-center hover:bg-[#FFE5D9] transition-colors border-2 border-[#D8E2DC]"
                >
                  <span className="text-[#6D6875] text-xl">−</span>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.minQuantity, parseInt(e.target.value) || product.minQuantity))}
                  className="w-20 h-12 text-center border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none text-[#6D6875]"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-[#F9F9F9] rounded-xl flex items-center justify-center hover:bg-[#FFE5D9] transition-colors border-2 border-[#D8E2DC]"
                >
                  <span className="text-[#6D6875] text-xl">+</span>
                </button>
                <span className="text-[#9D8189] text-sm">
                  Quantidade mínima: {product.minQuantity}
                </span>
              </div>
            </div>

            {/* Customization */}
            <div className="bg-gradient-to-br from-[#FFCAD4]/10 to-[#FFE5D9]/30 rounded-2xl p-6 border-2 border-[#FFCAD4]/30 shadow-md">
              <h3 className="text-[#6D6875] mb-3">Customize com a gente</h3>
              <p className="text-[#9D8189] text-sm mb-4">Personalização opcional — você pode deixar em branco.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[#6D6875] mb-2">Nome (opcional)</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Digite o nome para personalização"
                    className="w-full px-4 py-3 border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#6D6875] mb-2">Idade (opcional)</label>
                  <input
                    type="text"
                    value={customAge}
                    onChange={(e) => setCustomAge(e.target.value)}
                    placeholder="Digite a idade"
                    className="w-full px-4 py-3 border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-5 rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              Adicionar ao carrinho
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border-2 border-[#D8E2DC]">
          <h3 className="text-[#6D6875] mb-6">Informações Detalhadas do Produto</h3>
          
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-[#6D6875] mb-3">Descrição</h4>
              <p className="text-[#9D8189] leading-relaxed">{product.description}</p>
            </div>

            {/* Technical Info Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Item</span>
                </div>
                <p className="text-[#6D6875]">{product.item}</p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Tema</span>
                </div>
                <p className="text-[#6D6875]">{product.theme}</p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Categoria</span>
                </div>
                <p className="text-[#6D6875]">{product.category}</p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Ruler className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Dimensões (A×L×P)</span>
                </div>
                <p className="text-[#6D6875]">
                  {product.dimensions.height} × {product.dimensions.width} × {product.dimensions.depth} cm
                </p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Material</span>
                </div>
                <p className="text-[#6D6875]">{product.material}</p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Weight className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Peso Unitário</span>
                </div>
                <p className="text-[#6D6875]">{product.weight}g</p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Preço Unitário</span>
                </div>
                <p className="text-[#6D6875]">R$ {product.price.toFixed(2)}</p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Quantidade Mínima</span>
                </div>
                <p className="text-[#6D6875]">{product.minQuantity} unidade</p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Prazo de Produção</span>
                </div>
                <p className="text-[#6D6875]">{product.productionTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Guidelines */}
        <div className="bg-gradient-to-br from-[#FFE5D9] to-[#FFCAD4]/20 rounded-3xl p-8 shadow-xl border-2 border-[#FFCAD4]/40">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <Info className="w-6 h-6 text-[#F4ACB7]" />
            </div>
            <h3 className="text-[#6D6875] flex-1">ORIENTAÇÃO DE PERSONALIZAÇÃO DO PRODUTO</h3>
          </div>

          <div className="space-y-6">
            {/* WhatsApp Instructions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FFCAD4]/30">
              <h4 className="text-[#6D6875] mb-4">📱 Envio das Informações</h4>
              <p className="text-[#6D6875] mb-4">
                Logo após a compra, envie pelo WhatsApp os detalhes da personalização:
              </p>
              <ul className="space-y-2 text-[#6D6875]">
                <li className="flex items-start gap-2">
                  <span className="text-[#F4ACB7]">•</span>
                  <span>NOME</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F4ACB7]">•</span>
                  <span>IDADE (opcional)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F4ACB7]">•</span>
                  <span>DATA DO EVENTO (opcional)</span>
                </li>
              </ul>
            </div>

            {/* Important Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FFCAD4]/30">
              <h4 className="text-[#6D6875] mb-4">ℹ️ Informações Importantes</h4>
              <ul className="space-y-3 text-[#6D6875]">
                <li className="flex items-start gap-3">
                  <span className="text-[#F4ACB7] shrink-0">•</span>
                  <span>Confira o prazo de produção do produto, que é contado sempre em dias ÚTEIS após o pagamento</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F4ACB7] shrink-0">•</span>
                  <span>Enviamos os produtos conforme anunciado (alteração somente no texto da personalização)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F4ACB7] shrink-0">•</span>
                  <span>Não enviamos amostra para aprovação quando a personalização for apenas nome/idade</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F4ACB7] shrink-0">•</span>
                  <span>Recomendamos realizar o pedido com antecedência</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F4ACB7] shrink-0">•</span>
                  <span>Produção inicia após o pagamento</span>
                </li>
              </ul>
            </div>

            {/* Friendly Message */}
            <div className="text-center pt-4">
              <p className="text-[#6D6875] text-lg">
                ✨ Será um prazer responder suas dúvidas! ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
