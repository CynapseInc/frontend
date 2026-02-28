import { useState } from 'react';
import { Search, Pencil, Plus, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Navigate, useNavigate } from 'react-router-dom';
import './index-lista-produtos.css'

interface Product {
  id: string;
  name: string;
  category: string;
  theme: string;
  item: string;
  imageUrl: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Caneca do Ben 10',
    category: 'Herói',
    theme: 'Ben 10',
    item: 'Caneca',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
  },
  {
    id: '2',
    name: 'Caderno Frozen',
    category: 'Princesa',
    theme: 'Frozen',
    item: 'Caderno',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
  },
  {
    id: '3',
    name: 'Caneca Hello Kitty',
    category: 'Personagem',
    theme: 'Hello Kitty',
    item: 'Caneca',
    imageUrl: 'https://images.unsplash.com/photo-1534832982841-4dfb5feb87b7?w=400',
  },
  {
    id: '4',
    name: 'Caderno Spider-Man',
    category: 'Herói',
    theme: 'Spider-Man',
    item: 'Caderno',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
  },
  {
    id: '5',
    name: 'Caneca Corinthians',
    category: 'Times',
    theme: 'Corinthians',
    item: 'Caneca',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
  },
  {
    id: '6',
    name: 'Caderno Unicórnio',
    category: 'Fantasia',
    theme: 'Unicórnio',
    item: 'Caderno',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400',
  },
  {
    id: '7',
    name: 'Caneca Batman',
    category: 'Herói',
    theme: 'Batman',
    item: 'Caneca',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
  },
  {
    id: '8',
    name: 'Caderno Barbie',
    category: 'Princesa',
    theme: 'Barbie',
    item: 'Caderno',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
  },
  {
    id: '9',
    name: 'Caneca Palmeiras',
    category: 'Times',
    theme: 'Palmeiras',
    item: 'Caneca',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
  },
  {
    id: '10',
    name: 'Caderno Naruto',
    category: 'Anime',
    theme: 'Naruto',
    item: 'Caderno',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
  },
];

const categories = ['Todos', 'Herói', 'Princesa', 'Personagem', 'Times', 'Fantasia', 'Anime'];
const themes = ['Todos', 'Ben 10', 'Frozen', 'Hello Kitty', 'Spider-Man', 'Corinthians', 'Unicórnio', 'Batman', 'Barbie', 'Palmeiras', 'Naruto'];
const items = ['Todos', 'Caneca', 'Caderno'];

export default function App() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTheme, setSelectedTheme] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 8;

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesTheme = selectedTheme === 'Todos' || product.theme === selectedTheme;
    const matchesItem = selectedItem === 'Todos' || product.item === selectedItem;
    return matchesSearch && matchesCategory && matchesTheme && matchesItem;
  });

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleEditProduct = (productId: string) => {
    console.log('Editar produto:', productId);
    // Aqui será implementada a navegação para a tela de edição
  };

  const handleAddProduct = () => {
    navigate("/produtos");
    // Aqui será implementada a navegação para a tela de cadastro
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Navbar */}


      <div className="w-full px-[4vw] py-[4vh] box-border">

        {/* Cabeçalho */}
        <div className="mb-10">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Produtos</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie todos os produtos personalizados do seu catálogo</p>
        </div>

        {/* Barra de filtros e pesquisa */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between gap-6 mb-5">
            {/* Pesquisa */}
            {/* Bloco de Pesquisa - Lista de Produtos */}
            <div className="flex-1 max-w-md relative">
              {/* Ícone da Lupa (Posição absoluta proporcional) */}
              <Search
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  color: '#9D8189',
                  left: '1vw',      /* Encostado na esquerda */
                  width: '1.2vw',   /* Tamanho proporcional */
                  height: '1.2vw',
                  pointerEvents: 'none' /* O clique passa direto para o input */
                }}
              />

              {/* Input (Sem a classe pl-10) */}
              <Input
                placeholder="Buscar produto por nome..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 text-[0.9vw]"
                style={{
                  paddingLeft: '3.5vw', /* <--- AUMENTEI PARA 3.5vw (Garante espaço para a lupa) */
                  borderColor: '#D8E2DC',
                  backgroundColor: '#F9F9F9',
                  color: '#6D6875'
                }}
              />
            </div>

            {/* Botão Cadastrar */}
            <Button
              onClick={handleAddProduct}
              className="gap-2 h-11 px-6 text-[15px]"
              style={{ backgroundColor: '#F4ACB7', color: 'white' }}
            >
              <Plus className="size-5" />
              Cadastrar Produto
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-4">
            <Filter className="size-4" style={{ color: '#9D8189' }} />
            <span className="text-[15px]" style={{ color: '#9D8189' }}>Filtrar por:</span>

            {/* Categoria */}
            <div className="flex items-center gap-2">
              <label className="text-[14px]" style={{ color: '#9D8189' }}>Categoria:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-md text-[14px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tema */}
            <div className="flex items-center gap-2">
              <label className="text-[14px]" style={{ color: '#9D8189' }}>Tema:</label>
              <select
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-md text-[14px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              >
                {themes.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>

            {/* Item */}
            <div className="flex items-center gap-2">
              <label className="text-[14px]" style={{ color: '#9D8189' }}>Item:</label>
              <select
                value={selectedItem}
                onChange={(e) => {
                  setSelectedItem(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-md text-[14px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              >
                {items.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D8E2DC' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '15%' }}>
                  Foto
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '30%' }}>
                  Nome do Produto
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '18%' }}>
                  Categoria
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '18%' }}>
                  Tema
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '12%' }}>
                  Item
                </th>
                <th className="text-right px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '7%' }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b transition-colors hover:bg-opacity-50"
                  style={{
                    borderColor: '#D8E2DC',
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                  }}
                >
                  <td className="px-6 py-4">
                    <div
                      className="size-16 rounded-lg overflow-hidden border"
                      style={{ borderColor: '#D8E2DC' }}
                    >
                      <ImageWithFallback
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[16px]" style={{ color: '#6D6875' }}>
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[14px]"
                      style={{
                        backgroundColor: '#FFCAD4',
                        color: '#6D6875'
                      }}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[15px]" style={{ color: '#9D8189' }}>
                      {product.theme}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[14px]"
                      style={{
                        backgroundColor: '#D8E2DC',
                        color: '#6D6875'
                      }}
                    >
                      {product.item}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="p-2 rounded-md transition-all hover:bg-opacity-80"
                        style={{ backgroundColor: '#D8E2DC' }}
                        title="Editar"
                      >
                        <Pencil className="size-4" style={{ color: '#6D6875' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Informação de paginação e controles */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-[15px]" style={{ color: '#9D8189' }}>
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} produtos
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md text-[15px] transition-all disabled:opacity-40"
                style={{
                  backgroundColor: 'white',
                  color: '#6D6875',
                  border: '1px solid #D8E2DC'
                }}
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="px-4 py-2 rounded-md text-[15px] transition-all"
                  style={{
                    backgroundColor: currentPage === page ? '#F4ACB7' : 'white',
                    color: currentPage === page ? 'white' : '#6D6875',
                    border: `1px solid ${currentPage === page ? '#F4ACB7' : '#D8E2DC'}`
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md text-[15px] transition-all disabled:opacity-40"
                style={{
                  backgroundColor: 'white',
                  color: '#6D6875',
                  border: '1px solid #D8E2DC'
                }}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
