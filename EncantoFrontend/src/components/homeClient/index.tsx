import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Instagram, Facebook, Send, Phone, Mail, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import EncantoLogo from '../../assets/logoEncanto.png';
import './index-home-client.css'

import { produtoService } from '../../services/ProdutoService';
import type { ProdutoResponse } from '../../interfaces/Produto';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const [products, setProducts] = useState<ProdutoResponse[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        // 1. Passamos 0 e 500 para trazer até 500 produtos na página inicial
        const data = await produtoService.listarTodos(0, 500);

        // 2. Extraímos o array 'content' de forma segura
        const listaProdutos = Array.isArray(data)
          ? data
          : (data?.content || []);

        // 3. Fazemos o .filter na nova lista extraída
        const produtosAtivos = listaProdutos.filter((p: any) => p.ativo !== false);
        setProducts(produtosAtivos);

        const categoriasUnicas = new Set<string>();
        produtosAtivos.forEach((p: any) => {
          const categoria = p.tema?.categoriaTema?.titulo;
          if (categoria) {
            categoriasUnicas.add(categoria);
          }
        });

        setCategories(['Todos', ...Array.from(categoriasUnicas)]);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Ana Paula Silva',
      location: 'São Paulo - SP',
      image: 'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjMxNjc3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      text: 'Simplesmente apaixonada! As canecas personalizadas ficaram lindas e os convidados adoraram. Qualidade excepcional e entrega no prazo. Super recomendo!'
    },
    {
      id: 2,
      name: 'Carlos Roberto Mendes',
      location: 'Rio de Janeiro - RJ',
      image: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjMxNDY0MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      text: 'Precisávamos de brindes corporativos com urgência e a Encanto nos surpreendeu. Produtos de altíssima qualidade e atendimento impecável. Parceiros para sempre!'
    },
    {
      id: 3,
      name: 'Mariana Costa',
      location: 'Belo Horizonte - MG',
      image: 'https://images.unsplash.com/photo-1753161023962-665967602405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMTk5MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      text: 'A festa de aniversário da minha filha foi um sucesso graças às lembrancinhas personalizadas. Todos os detalhes foram pensados com muito carinho. Obrigada!'
    }
  ];

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.tema?.categoriaTema?.titulo === selectedCategory);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="home-client-wrapper min-h-screen bg-[#F9F9F9]">
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-[#FFE5D9] via-[#F9F9F9] to-[#D8E2DC] py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFCAD4] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#F4ACB7] rounded-full opacity-20 blur-3xl"></div>

        <div className="w-full px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div className="relative z-10">
              <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-2 border-[#FFCAD4]">
                <p className="text-[#F4ACB7]">
                  ✨ Cada detalhe conta na hora de celebrar!
                </p>
              </div>

              {/* Hero Section -> Título */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#6D6875] mb-6 leading-tight font-extrabold">
                TRANSFORMAMOS <span className="text-[#F4ACB7]">LEMBRANÇAS</span> EM MOMENTOS <span className="text-[#F4ACB7]">INESQUECÍVEIS</span>
              </h1>

              <p className="text-[#9D8189] text-xl leading-relaxed mb-6">
                Na <strong className="text-[#F4ACB7]">Encanto Personalizados</strong> criamos peças personalizadas que encantam seus convidados e tornam seus momentos ainda mais especiais. Escolha, personalize e receba lembranças feitas com carinho e dedicação.
              </p>

              <div className="inline-block bg-gradient-to-r from-[#FFCAD4] to-[#F4ACB7] p-1 rounded-2xl mb-8">
                <div className="bg-white px-5 py-2.5 rounded-xl">
                  <p className="text-[#6D6875] m-0">
                    <strong>💝 Produtos únicos, feitos sob medida para você!</strong>
                  </p>
                </div>
              </div>

              <div className="block w-full">
                <button onClick={() => navigate('/pesquisa-produtos')} className="bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white px-10 py-5 rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 shadow-xl font-bold">
                  Conheça nossos produtos
                </button>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFCAD4]/30 to-[#F4ACB7]/30 rounded-[3rem] blur-3xl"></div>
              <div className="relative bg-white rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1760557658200-5e6230cbd13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBnaWZ0cyUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MzIyMjM1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Produtos personalizados"
                  className="w-full h-[550px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F4ACB7]/20 to-transparent"></div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border-2 border-[#FFCAD4]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FFE5D9] rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#F4ACB7] fill-[#F4ACB7]" />
                  </div>
                  <div>
                    <p className="text-[#6D6875]"><strong>500+</strong></p>
                    <p className="text-[#9D8189] text-sm">Clientes Felizes</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border-2 border-[#FFCAD4]">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F4ACB7] text-[#F4ACB7]" />
                  ))}
                </div>
                <p className="text-[#6D6875] text-sm mt-2"><strong>5.0</strong> Avaliação</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Favoritos */}
      <section id="produtos" className="py-24  bg-white">
        <div className="w-full px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#FFE5D9] px-6 py-3 rounded-full mb-4">
              <p className="text-[#F4ACB7]">🎁 Seleção Especial</p>
            </div>
            <h2 className="text-[#6D6875] mb-6">Nossos Favoritos</h2>
            <p className="text-[#9D8189] text-xl leading-relaxed">
              Selecionamos os produtos mais pedidos para inspirar você. Personalize cada detalhe e transforme seu evento em um momento único.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {/* O slice(0, 6) pega apenas os 6 primeiros itens do array */}
            {categories.slice(0, 7).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-4 rounded-2xl transition-all text-lg ${selectedCategory === category
                  ? 'bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white shadow-xl scale-105'
                  : 'bg-[#F9F9F9] text-[#6D6875] hover:bg-[#FFE5D9] border-2 border-[#D8E2DC]'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Products Grid - Cartões 100% Quadrados */}
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 mb-12 px-4">
            {isLoading ? (
              <p className="col-span-full text-center text-[#9D8189]">A carregar produtos...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="col-span-full text-center text-[#9D8189]">Nenhum produto encontrado.</p>
            ) : (
              filteredProducts.slice(0, 8).map((product) => {
                const imageUrl = product.fotos && product.fotos.length > 0
                  ? product.fotos[0].foto
                  : 'https://via.placeholder.com/300x300?text=Sem+Foto';

                const precoVenda = product.item?.precoVenda || 0;
                const precoPromocional = product.item?.precoPromocional || 0;
                const temDesconto = precoPromocional > 0 && precoPromocional < precoVenda;

                return (
                  <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group border border-[#D8E2DC] flex flex-col aspect-square">

                    <div className="relative flex-1 w-full overflow-hidden">
                      <ImageWithFallback
                        src={imageUrl}
                        alt={product.titulo}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute bottom-1.5 left-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded flex items-center gap-1 shadow-sm z-10">
                        <Star className="w-2.5 h-2.5 fill-[#F4ACB7] text-[#F4ACB7]" />
                        <span className="text-[#6D6875] text-[9px] font-bold">5.0</span>
                      </div>
                    </div>

                    <div className="p-2.5 flex flex-col justify-between gap-1.5 shrink-0 bg-white">
                      <h4 className="text-[#6D6875] text-[11px] font-bold line-clamp-1 leading-tight mb-1.5" title={product.titulo}>
                        {product.titulo}
                      </h4>

                      <div className="gap-1.5 flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                          {temDesconto ? (
                            <>
                              <span className="text-[#9D8189] line-through text-[9px]">
                                R$ {precoVenda.toFixed(2)}
                              </span>
                              <span className="text-[#F4ACB7] font-bold text-[9px]" style={{ fontWeight: 'bold' }}>
                                R$ {precoPromocional.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-[#F4ACB7] font-bold text-[9px]">
                              R$ {precoVenda.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button onClick={() => navigate('/pesquisa-produtos', { state: { openProductId: product.id } })} className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-1 rounded hover:shadow-sm transition-all text-[9px] font-bold uppercase tracking-wide">
                          Peça já
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <button onClick={() => navigate('/pesquisa-produtos')} className="bg-white border-3 border-[#F4ACB7] text-[#F4ACB7] px-12 py-5 rounded-2xl hover:bg-[#F4ACB7] hover:text-white transition-all shadow-lg hover:shadow-xl text-lg">
              Conheça todos os produtos
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-[#FFE5D9] via-[#F9F9F9] to-[#D8E2DC]">
        <div className="w-full px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-white px-6 py-3 rounded-full mb-4 border-2 border-[#FFCAD4]">
              <p className="text-[#F4ACB7]">💬 Depoimentos</p>
            </div>
            <h2 className="text-[#6D6875] mb-6">Encantando clientes em cada detalhe</h2>
            <p className="text-[#9D8189] text-xl leading-relaxed">
              Há anos ajudamos famílias e empresas a transformar lembranças em momentos especiais. Nossos clientes confiam no carinho, na qualidade e na dedicação que colocamos em cada pedido.
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative w-full">
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`bg-white rounded-3xl p-8 shadow-xl border-2 border-[#D8E2DC] transition-all ${index === currentTestimonial ? 'scale-105 border-[#F4ACB7]' : 'scale-100'
                    }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-[#FFCAD4] shadow-lg">
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#6D6875]">{testimonial.name}</h4>
                      <p className="text-[#9D8189] text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#F4ACB7] text-[#F4ACB7]" />
                    ))}
                  </div>

                  <p className="text-[#6D6875] leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-white p-5 rounded-full shadow-2xl hover:bg-[#FFE5D9] transition-all border-2 border-[#D8E2DC]"
            >
              <ChevronLeft className="w-6 h-6 text-[#F4ACB7]" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-white p-5 rounded-full shadow-2xl hover:bg-[#FFE5D9] transition-all border-2 border-[#D8E2DC]"
            >
              <ChevronRight className="w-6 h-6 text-[#F4ACB7]" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 rounded-full transition-all ${currentTestimonial === index ? 'bg-[#F4ACB7] w-10' : 'bg-[#D8E2DC] w-3'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gradient-to-br from-[#6D6875] to-[#9D8189] py-12">
        <div className="max-w-7xl mx-auto px-8">

          <div className="grid grid-cols-4 gap-8 mb-8">

            <div className="flex flex-col">
              <img src={EncantoLogo} alt="Encanto Personalizados" className="w-40 object-contain mb-4" />
              <p className="text-[#D8E2DC] text-sm leading-relaxed">
                Transformando momentos em lembranças inesquecíveis. Criamos peças personalizadas com carinho e dedicação.
              </p>
            </div>

            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-4">Nossas Redes</h4>
              <div className="flex gap-3">
                <a href="#" style={{ color: 'white' }} className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#FFCAD4] hover:text-[#6D6875] transition-all shadow-sm">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" style={{ color: 'white' }} className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#FFCAD4] hover:text-[#6D6875] transition-all shadow-sm">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" style={{ color: 'white' }} className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#FFCAD4] hover:text-[#6D6875] transition-all shadow-sm">
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-4">Menu</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" style={{ color: '#D8E2DC' }} className="hover:!text-[#FFCAD4] transition-colors flex items-center gap-2 text-sm">
                    → Home
                  </a>
                </li>
                <li>
                  <a href="#produtos" style={{ color: '#D8E2DC' }} className="hover:!text-[#FFCAD4] transition-colors flex items-center gap-2 text-sm">
                    → Produtos
                  </a>
                </li>
                <li>
                  <a href="#contato" style={{ color: '#D8E2DC' }} className="hover:!text-[#FFCAD4] transition-colors flex items-center gap-2 text-sm">
                    → Contato
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-4">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#D8E2DC] text-sm">
                  <Phone className="w-4 h-4 mt-0.5 text-[#FFCAD4]" />
                  <div>
                    <p className="text-white font-bold">Telefone</p>
                    <p>(11) 98765-4321</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-[#D8E2DC] text-sm">
                  <Mail className="w-4 h-4 mt-0.5 text-[#FFCAD4]" />
                  <div>
                    <p className="text-white font-bold">Email</p>
                    <p>contato@encanto.com.br</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-[#D8E2DC] text-sm">
              © 2025 Encanto Personalizados. Todos os direitos reservados. Feito com 💖
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}