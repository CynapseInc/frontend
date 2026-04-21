import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, ChevronRight, Clock, Info, Package, Ruler, Weight, Tag, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useParams, useNavigate } from 'react-router-dom';
import { produtoService } from '../../services/ProdutoService';
import FeedbackModal from '../ui/FeedbackModal';
import './detalhe-index.css'

export default function App() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customAge, setCustomAge] = useState('');
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

  // ==========================================
  // BUSCAR DETALHES DO PRODUTO NA API
  // ==========================================
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await produtoService.buscarPorId(id);

        // Lógica de Preço super protegida
        const precoVenda = data.item?.precoVenda || 0;
        const precoPromocional = data.item?.precoPromocional || 0;
        const hasPromo = precoPromocional > 0 && precoPromocional < precoVenda;
        
        const currentPrice = hasPromo ? precoPromocional : precoVenda;
        const oldPrice = hasPromo ? precoVenda : null;
        
        const discountPercentage = hasPromo 
          ? Math.round(((precoVenda - precoPromocional) / precoVenda) * 100) 
          : null;

        const imagensBackend = data.fotos && data.fotos.length > 0 
          ? data.fotos.map((f: any) => f.foto) 
          : ['https://images.unsplash.com/photo-1544281474-bdf3e12f871f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBtdWclMjBkZXNpZ258ZW58MXx8fHwxNzYzMjIyOTM0fDA&ixlib=rb-4.1.0&q=80&w=1080'];

        // Mapeamento protegido contra Nulls/Undefined
        const mappedProduct = {
          id: data.id,
          name: data.titulo || 'Produto sem título',
          description: data.descricao || 'Nenhuma descrição informada para este produto.',
          price: currentPrice,
          oldPrice: oldPrice,
          discount: discountPercentage,
          
          // Navegação segura pelos objetos aninhados
          category: data.tema?.categoriaTema?.titulo || 'Categoria não informada',
          theme: data.tema?.descricao || 'Tema não informado',
          item: data.item?.descricao || 'Item não informado',
          
          // Se for nulo ou zero, guardamos como null para tratar no visual
          material: data.item?.material || null,
          weight: data.item?.peso || null,
          minQuantity: 1, 
          productionTime: data.item?.prazoProducao ? `${data.item.prazoProducao} dias úteis` : null,
          
          dimensions: {
            height: data.item?.altura || null,
            width: data.item?.largura || null,
            depth: data.item?.comprimento || null
          },
          
          images: imagensBackend,
          rating: 5, 
          reviews: 12,
          inStock: data.ativo !== false // Assume true se não vier false
        };

        setProduct(mappedProduct);
        
      } catch (error) {
        showFeedback('Erro ao carregar os detalhes do produto.', 'error');
        console.error("Erro ao carregar os detalhes do produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center flex-col">
        <div className="w-16 h-16 border-4 border-[#FFCAD4] border-t-[#F4ACB7] rounded-full animate-spin mb-4"></div>
        <p className="text-[#9D8189]">Carregando os encantos deste produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-[32px] text-[#F4ACB7] mb-4">Produto não encontrado</h2>
        <p className="text-[#9D8189] mb-8">Desculpe, não conseguimos encontrar o produto que procura.</p>
        <button 
          onClick={() => navigate('/pesquisa-produtos')}
          className="bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white px-8 py-3 rounded-xl shadow-lg"
        >
          Voltar para o catálogo
        </button>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    const cartItem = {
      cartItemId: Date.now().toString(), // ID único para o carrinho (caso a pessoa adicione o mesmo produto com nomes diferentes)
      produtoId: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      quantity: quantity,
      customName: customName,
      customAge: customAge,
      weight: product.weight
    };

    const existingCart = JSON.parse(localStorage.getItem('encanto_carrinho') || '[]');
    
    existingCart.push(cartItem);
    localStorage.setItem('encanto_carrinho', JSON.stringify(existingCart));

    setTimeout(() => {  
    showFeedback('Produto adicionado ao carrinho com sucesso!', 'success');
    navigate('/carrinho');
  }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#D8E2DC]">
        <div className="max-w-[1920px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-[#9D8189]">
            <button onClick={() => navigate('/catalogo')} className="hover:text-[#F4ACB7] transition-colors">Home</button>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => navigate('/pesquisa-produtos')} className="hover:text-[#F4ACB7] transition-colors">Produtos</button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#6D6875] truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-[#D8E2DC] aspect-square flex items-center justify-center bg-gray-50">
              <ImageWithFallback src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden transition-all bg-gray-50 ${
                      selectedImage === index ? 'ring-4 ring-[#F4ACB7] shadow-lg scale-105' : 'ring-2 ring-[#D8E2DC] hover:ring-[#F4ACB7] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <h2 className="text-[#6D6875] flex-1">{product.name}</h2>
                {product.discount && (
                  <span className="bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-1 shrink-0">
                    <Tag className="w-4 h-4" /> {product.discount}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(product.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#F4ACB7] text-[#F4ACB7]" />)}
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
                      <span className="text-[#9D8189] line-through text-xl">R$ {product.oldPrice.toFixed(2)}</span>
                    )}
                    <span className="text-[#F4ACB7] text-3xl font-bold">R$ {product.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t-2 border-[#D8E2DC] pt-3">
                  <p className="text-[#9D8189] text-sm mb-2">Preço Total</p>
                  <span className="text-[#6D6875] text-4xl font-bold">R$ {totalPrice.toFixed(2)}</span>
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
                  <p className="text-[#6D6875]">
                    {product.productionTime ? `Até ${product.productionTime} após pagamento` : 'Prazo a combinar'}
                  </p>
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
                  Qtd. mínima: {product.minQuantity}
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
                  <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Digite o nome para personalização" className="w-full px-4 py-3 border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-[#6D6875] mb-2">Idade (opcional)</label>
                  <input type="text" value={customAge} onChange={(e) => setCustomAge(e.target.value)} placeholder="Digite a idade" className="w-full px-4 py-3 border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none bg-white" />
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button onClick={handleAddToCart} disabled={!product.inStock} className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-5 rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg disabled:opacity-50">
              <ShoppingCart className="w-6 h-6" />
              {product.inStock ? 'Adicionar ao carrinho' : 'Indisponível'}
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border-2 border-[#D8E2DC]">
          <h3 className="text-[#6D6875] mb-6">Informações Detalhadas do Produto</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-[#6D6875] mb-3">Descrição</h4>
              <p className="text-[#9D8189] leading-relaxed whitespace-pre-wrap">{product.description}</p>
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
                  {product.dimensions.height && product.dimensions.width && product.dimensions.depth 
                    ? `${product.dimensions.height} × ${product.dimensions.width} × ${product.dimensions.depth} cm` 
                    : 'Não informadas'}
                </p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Material</span>
                </div>
                <p className="text-[#6D6875]">{product.material || 'Não informado'}</p>
              </div>

              <div className="bg-[#F9F9F9] rounded-2xl p-5 border border-[#D8E2DC]">
                <div className="flex items-center gap-3 mb-2">
                  <Weight className="w-5 h-5 text-[#F4ACB7]" />
                  <span className="text-[#9D8189] text-sm">Peso Unitário</span>
                </div>
                <p className="text-[#6D6875]">{product.weight ? `${product.weight}g` : 'Não informado'}</p>
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FFCAD4]/30">
              <h4 className="text-[#6D6875] mb-4">📱 Envio das Informações</h4>
              <p className="text-[#6D6875] mb-4">
                Logo após a compra, caso tenha deixado os campos em branco, pode enviar pelo WhatsApp os detalhes da personalização:
              </p>
              <ul className="space-y-2 text-[#6D6875]">
                <li className="flex items-start gap-2"><span className="text-[#F4ACB7]">•</span><span>NOME</span></li>
                <li className="flex items-start gap-2"><span className="text-[#F4ACB7]">•</span><span>IDADE (opcional)</span></li>
                <li className="flex items-start gap-2"><span className="text-[#F4ACB7]">•</span><span>DATA DO EVENTO (opcional)</span></li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FFCAD4]/30">
              <h4 className="text-[#6D6875] mb-4">ℹ️ Informações Importantes</h4>
              <ul className="space-y-3 text-[#6D6875]">
                <li className="flex items-start gap-3"><span className="text-[#F4ACB7] shrink-0">•</span><span>Confira o prazo de produção do produto, contado sempre em dias ÚTEIS após o pagamento.</span></li>
                <li className="flex items-start gap-3"><span className="text-[#F4ACB7] shrink-0">•</span><span>Não enviamos amostra para aprovação quando a personalização for apenas nome/idade.</span></li>
                <li className="flex items-start gap-3"><span className="text-[#F4ACB7] shrink-0">•</span><span>Recomendamos realizar o pedido com antecedência. Produção inicia após o pagamento.</span></li>
              </ul>
            </div>
          </div>
        </div>
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