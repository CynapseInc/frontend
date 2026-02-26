import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Search, X, Filter, Grid, List, ChevronDown, Eye, Sparkles, TrendingUp, DollarSign, Tag } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {Navigate, useNavigate} from 'react-router-dom'
import './pesquisa-index.css'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [cartCount] = useState(3);

  const navigate = useNavigate();

  const handlePecaJaClick = (productId: number) => {
    navigate(`/detalhe-produto/${productId}`);
  };

  const categories = [
    { name: 'Eventos Corporativos', count: 45 },
    { name: 'Aniversários', count: 67 },
    { name: 'Casamentos', count: 38 },
    { name: 'Infantis', count: 52 },
    { name: 'Datas Comemorativas', count: 29 }
  ];

  const themes = [
    { name: 'Ben 10', count: 12 },
    { name: 'Princesas', count: 18 },
    { name: 'Super-heróis', count: 15 },
    { name: 'Unicórnio', count: 22 },
    { name: 'Frozen', count: 14 }
  ];

  const items = [
    { name: 'Caneca', count: 45 },
    { name: 'Camiseta', count: 32 },
    { name: 'Mochila', count: 18 },
    { name: 'Agenda', count: 25 },
    { name: 'Almofada', count: 20 }
  ];

  const products = [
    {
      id: 1,
      name: 'Caneca Personalizada Premium',
      description: 'Caneca de porcelana com impressão de alta qualidade',
      price: 35.00,
      oldPrice: 45.00,
      category: 'Eventos Corporativos',
      theme: 'Super-heróis',
      item: 'Caneca',
      image: 'https://images.unsplash.com/photo-1544281474-bdf3e12f871f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBtdWclMjBkZXNpZ258ZW58MXx8fHwxNzYzMjIyOTM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      isNew: true,
      isBestSeller: false,
      isPromo: true,
      inStock: true
    },
    {
      id: 2,
      name: 'Kit Festa Aniversário Completo',
      description: 'Kit com 50 itens personalizados para festas',
      price: 120.00,
      oldPrice: 150.00,
      category: 'Aniversários',
      theme: 'Unicórnio',
      item: 'Mochila',
      image: 'https://images.unsplash.com/photo-1760557658200-5e6230cbd13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBnaWZ0cyUyMG1vZGVybnxlbnwxfHx8fDE3NjMyMjI5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      isNew: false,
      isBestSeller: true,
      isPromo: true,
      inStock: true
    },
    {
      id: 3,
      name: 'Camiseta Personalizada Premium',
      description: 'Camiseta 100% algodão com estampa personalizada',
      price: 48.00,
      oldPrice: null,
      category: 'Eventos Corporativos',
      theme: 'Ben 10',
      item: 'Camiseta',
      image: 'https://images.unsplash.com/photo-1739001411231-4fc0f4140259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjB0c2hpcnR8ZW58MXx8fHwxNzYzMTk3ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      isNew: true,
      isBestSeller: true,
      isPromo: false,
      inStock: true
    },
    {
      id: 4,
      name: 'Agenda Executiva Personalizada',
      description: 'Agenda anual com capa dura e personalização completa',
      price: 85.00,
      oldPrice: 110.00,
      category: 'Eventos Corporativos',
      theme: 'Frozen',
      item: 'Agenda',
      image: 'https://images.unsplash.com/photo-1713224878100-456d41f5264d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBub3RlYm9va3xlbnwxfHx8fDE3NjMyMjI5MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      isNew: false,
      isBestSeller: false,
      isPromo: true,
      inStock: true
    },
    {
      id: 5,
      name: 'Mochila Infantil Personalizada',
      description: 'Mochila resistente com design personalizado',
      price: 95.00,
      oldPrice: 120.00,
      category: 'Infantis',
      theme: 'Princesas',
      item: 'Mochila',
      image: 'https://images.unsplash.com/photo-1711024818943-a4aa01ae8f8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBiYWNrcGFja3xlbnwxfHx8fDE3NjMyMjI5MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      isNew: false,
      isBestSeller: true,
      isPromo: true,
      inStock: true
    },
    {
      id: 6,
      name: 'Kit Corporativo Premium',
      description: 'Kit executivo com caneta, caderno e caneca',
      price: 135.00,
      oldPrice: null,
      category: 'Eventos Corporativos',
      theme: 'Super-heróis',
      item: 'Caneca',
      image: 'https://images.unsplash.com/photo-1761222667027-424659b017ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBwcm9kdWN0cyUyMHBlcnNvbmFsaXplZHxlbnwxfHx8fDE3NjMyMjI5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      isNew: true,
      isBestSeller: false,
      isPromo: false,
      inStock: true
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedThemes([]);
    setSelectedItems([]);
    setPriceRange([0, 500]);
    setOnlyPromo(false);
    setInStock(true);
    setQuickFilter(null);
  };

  const filteredProducts = products.filter(product => {
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.theme.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.item.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    if (selectedThemes.length > 0 && !selectedThemes.includes(product.theme)) {
      return false;
    }
    if (selectedItems.length > 0 && !selectedItems.includes(product.item)) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (onlyPromo && !product.isPromo) {
      return false;
    }
    if (inStock && !product.inStock) {
      return false;
    }
    if (quickFilter === 'new' && !product.isNew) {
      return false;
    }
    if (quickFilter === 'bestseller' && !product.isBestSeller) {
      return false;
    }
    if (quickFilter === 'promo' && !product.isPromo) {
      return false;
    }
    return true;
  });

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Navbar */}
      

      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#FFE5D9] to-[#F9F9F9] py-12 border-b-2 border-[#D8E2DC]">
        <div className="w-full px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#6D6875] mb-2">Catálogo de Produtos</h2>
              <p className="text-[#9D8189] text-lg">Encontre o produto perfeito para seu momento especial</p>
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-[#F4ACB7] text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-8 py-8">
        <div className="flex gap-8">
          {/* Left Column - Filters */}
           {/* filtros ocupavam 100% da largura quando `showFilters` ativado em telas pequenas
             isso empurrava os produtos para baixo. Agora forçamos largura fixa menor
             de 9rem (w-36) para que o painel fique à esquerda e deixe mais espaço
             para a coluna de produtos. A visibilidade ainda é controlada por
             `showFilters` e o botão de exibição. */}
           <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-36 shrink-0`}>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#D8E2DC] sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#6D6875]">Filtros</h3>
                <button
                  onClick={clearFilters}
                  className="text-[#F4ACB7] text-sm hover:underline"
                >
                  Limpar tudo
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9D8189]" />
                  <input
                    type="text"
                    placeholder="Buscar produto, tema ou item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-5 h-5 text-[#9D8189]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-[#6D6875] mb-3">Categoria</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat.name} className="flex items-center gap-3 cursor-pointer hover:bg-[#F9F9F9] p-2 rounded-lg">
                      <div
                        onClick={() => {
                          if (selectedCategories.includes(cat.name)) {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat.name));
                          } else {
                            setSelectedCategories([...selectedCategories, cat.name]);
                          }
                        }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedCategories.includes(cat.name)
                            ? 'bg-[#F4ACB7] border-[#F4ACB7]'
                            : 'bg-white border-[#D8E2DC]'
                        }`}
                      >
                        {selectedCategories.includes(cat.name) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-[#6D6875] flex-1">{cat.name}</span>
                      <span className="text-[#9D8189] text-sm">({cat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div className="mb-6">
                <h4 className="text-[#6D6875] mb-3">Tema</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {themes.map((theme) => (
                    <label key={theme.name} className="flex items-center gap-3 cursor-pointer hover:bg-[#F9F9F9] p-2 rounded-lg">
                      <div
                        onClick={() => {
                          if (selectedThemes.includes(theme.name)) {
                            setSelectedThemes(selectedThemes.filter(t => t !== theme.name));
                          } else {
                            setSelectedThemes([...selectedThemes, theme.name]);
                          }
                        }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedThemes.includes(theme.name)
                            ? 'bg-[#F4ACB7] border-[#F4ACB7]'
                            : 'bg-white border-[#D8E2DC]'
                        }`}
                      >
                        {selectedThemes.includes(theme.name) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-[#6D6875] flex-1">{theme.name}</span>
                      <span className="text-[#9D8189] text-sm">({theme.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="text-[#6D6875] mb-3">Item</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <label key={item.name} className="flex items-center gap-3 cursor-pointer hover:bg-[#F9F9F9] p-2 rounded-lg">
                      <div
                        onClick={() => {
                          if (selectedItems.includes(item.name)) {
                            setSelectedItems(selectedItems.filter(i => i !== item.name));
                          } else {
                            setSelectedItems([...selectedItems, item.name]);
                          }
                        }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedItems.includes(item.name)
                            ? 'bg-[#F4ACB7] border-[#F4ACB7]'
                            : 'bg-white border-[#D8E2DC]'
                        }`}
                      >
                        {selectedItems.includes(item.name) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-[#6D6875] flex-1">{item.name}</span>
                      <span className="text-[#9D8189] text-sm">({item.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-[#6D6875] mb-3">Preço</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[#F4ACB7]"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border-2 border-[#D8E2DC] rounded-lg focus:border-[#F4ACB7] focus:outline-none"
                      placeholder="Min"
                    />
                    <span className="text-[#9D8189]">até</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full px-3 py-2 border-2 border-[#D8E2DC] rounded-lg focus:border-[#F4ACB7] focus:outline-none"
                      placeholder="Max"
                    />
                  </div>
                  <div className="text-[#9D8189] text-sm">
                    R$ {priceRange[0]} - R$ {priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Other Filters */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-[#F9F9F9] p-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={onlyPromo}
                    onChange={(e) => setOnlyPromo(e.target.checked)}
                    className="w-4 h-4 accent-[#F4ACB7]"
                  />
                  <span className="text-[#6D6875]">Apenas promoções</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-[#F9F9F9] p-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-[#F4ACB7]"
                  />
                  <span className="text-[#6D6875]">Em estoque</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Column - Products */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-2xl p-6 mb-6 w-70 shadow-lg border-2 border-[#D8E2DC]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[#6D6875]">
                    Mostrando <strong>{startIndex + 1}-{Math.min(endIndex, totalProducts)}</strong> de <strong>{totalProducts}</strong> produtos
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode */}
                  <div className="flex gap-2 bg-[#F9F9F9] p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-md' : ''}`}
                    >
                      <Grid className="w-5 h-5 text-[#6D6875]" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-md' : ''}`}
                    >
                      <List className="w-5 h-5 text-[#6D6875]" />
                    </button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border-2 border-[#D8E2DC] rounded-lg focus:border-[#F4ACB7] focus:outline-none text-[#6D6875]"
                  >
                    <option value="newest">Mais novo</option>
                    <option value="bestseller">Mais vendido</option>
                    <option value="lowprice">Menor preço</option>
                    <option value="highprice">Maior preço</option>
                    <option value="promo">Promoções</option>
                  </select>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => setQuickFilter(quickFilter === 'new' ? null : 'new')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                    quickFilter === 'new'
                      ? 'bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white shadow-lg'
                      : 'bg-[#F9F9F9] text-[#6D6875] hover:bg-[#FFE5D9]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Novo
                </button>
                <button
                  onClick={() => setQuickFilter(quickFilter === 'bestseller' ? null : 'bestseller')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                    quickFilter === 'bestseller'
                      ? 'bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white shadow-lg'
                      : 'bg-[#F9F9F9] text-[#6D6875] hover:bg-[#FFE5D9]'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Mais vendido
                </button>
                <button
                  onClick={() => setQuickFilter(quickFilter === 'promo' ? null : 'promo')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                    quickFilter === 'promo'
                      ? 'bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white shadow-lg'
                      : 'bg-[#F9F9F9] text-[#6D6875] hover:bg-[#FFE5D9]'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  Promocionais
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className={`grid gap-6 mb-8 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
              }`}>
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group border-2 border-[#D8E2DC] ${
                      viewMode === 'list' ? 'flex gap-6' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64' : ''}`}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                          viewMode === 'list' ? 'h-full' : 'h-64'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-[#FFCAD4] text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 shadow-lg">
                            <Sparkles className="w-3 h-3" />
                            Novo
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-[#F4ACB7] text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 shadow-lg">
                            <TrendingUp className="w-3 h-3" />
                            Top
                          </span>
                        )}
                        {product.isPromo && (
                          <span className="bg-[#FFE5D9] text-[#F4ACB7] px-3 py-1 rounded-lg text-sm flex items-center gap-1 shadow-lg">
                            <Tag className="w-3 h-3" />
                            Promo
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white/95 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-all shadow-lg">
                          <Heart className="w-5 h-5 text-[#F4ACB7]" />
                        </button>
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="bg-white/95 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-all shadow-lg"
                        >
                          <Eye className="w-5 h-5 text-[#F4ACB7]" />
                        </button>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 fill-[#F4ACB7] text-[#F4ACB7]" />
                        <span className="text-[#6D6875]">{product.rating}.0</span>
                      </div>
                    </div>

                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div>
                        <h3 className="text-[#6D6875] mb-2">{product.name}</h3>
                        <p className="text-[#9D8189] text-sm mb-4 line-clamp-2">{product.description}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {product.oldPrice && (
                            <span className="text-[#9D8189] line-through text-sm">
                              R$ {product.oldPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-[#F4ACB7]">
                            R$ {product.price.toFixed(2)}
                          </span>
                        </div>

                        <button 
                          onClick={() => handlePecaJaClick(product.id)}
                          className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-3 rounded-xl hover:shadow-lg transition-all">
                          Peça já
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-16 text-center shadow-lg border-2 border-[#D8E2DC]">
                <div className="w-24 h-24 bg-[#FFE5D9] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-[#F4ACB7]" />
                </div>
                <h3 className="text-[#6D6875] mb-3">Nenhum produto encontrado</h3>
                <p className="text-[#9D8189] mb-6">
                  Tente remover alguns filtros ou fazer uma nova pesquisa
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  Mostrar todos os produtos
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#D8E2DC]">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border-2 border-[#D8E2DC] rounded-xl hover:bg-[#FFE5D9] disabled:opacity-50 disabled:cursor-not-allowed text-[#6D6875] flex items-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white shadow-lg'
                              : 'bg-[#F9F9F9] text-[#6D6875] hover:bg-[#FFE5D9]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border-2 border-[#D8E2DC] rounded-xl hover:bg-[#FFE5D9] disabled:opacity-50 disabled:cursor-not-allowed text-[#6D6875] flex items-center gap-2"
                  >
                    Próximo
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-[#9D8189] text-sm">Itens por página: </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 border-2 border-[#D8E2DC] rounded-lg focus:border-[#F4ACB7] focus:outline-none text-[#6D6875] text-sm"
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-[#6D6875]">Visualização Rápida</h2>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="p-2 hover:bg-[#FFE5D9] rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-[#6D6875]" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#D8E2DC]">
                  <ImageWithFallback
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-96 object-cover"
                  />
                  {quickViewProduct.isPromo && (
                    <span className="absolute top-4 left-4 bg-[#FFE5D9] text-[#F4ACB7] px-4 py-2 rounded-xl shadow-lg">
                      Promoção
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-[#6D6875] mb-4">{quickViewProduct.name}</h3>
                  <p className="text-[#9D8189] mb-6">{quickViewProduct.description}</p>

                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(quickViewProduct.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#F4ACB7] text-[#F4ACB7]" />
                    ))}
                    <span className="text-[#9D8189] text-sm ml-2">({quickViewProduct.rating}.0)</span>
                  </div>

                  <div className="bg-[#F9F9F9] rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-2">
                      {quickViewProduct.oldPrice && (
                        <span className="text-[#9D8189] line-through text-lg">
                          R$ {quickViewProduct.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[#F4ACB7] text-3xl">
                        R$ {quickViewProduct.price.toFixed(2)}
                      </span>
                    </div>
                    {quickViewProduct.oldPrice && (
                      <p className="text-[#9D8189] text-sm">
                        Economize R$ {(quickViewProduct.oldPrice - quickViewProduct.price).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-[#6D6875]">
                      <span className="text-[#9D8189]">Categoria:</span>
                      <span>{quickViewProduct.category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#6D6875]">
                      <span className="text-[#9D8189]">Tema:</span>
                      <span>{quickViewProduct.theme}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#6D6875]">
                      <span className="text-[#9D8189]">Item:</span>
                      <span>{quickViewProduct.item}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-4 rounded-xl hover:shadow-lg transition-all">
                      Peça já
                    </button>
                    <button className="p-4 border-2 border-[#D8E2DC] rounded-xl hover:bg-[#FFE5D9] transition-colors">
                      <Heart className="w-6 h-6 text-[#F4ACB7]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}