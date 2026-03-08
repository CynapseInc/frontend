import { useState, useEffect } from 'react';
import { Search, Pencil, Plus, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { produtoService } from '../../services/ProdutoService';
import type { ProdutoFrontend } from '../../interfaces/Produto';
import './index-lista-produtos.css';

export default function App() {
  const [products, setProducts] = useState<ProdutoFrontend[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTheme, setSelectedTheme] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Opções dinâmicas baseadas nos produtos
  const [themes, setThemes] = useState<string[]>(['Todos']);
  const [items, setItems] = useState<string[]>(['Todos']);
  const [categories] = useState<string[]>(['Todos', 'Diversos']);

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const dados = await produtoService.listarTodos();
        
        if (!dados || !Array.isArray(dados)) {
          setProducts([]);
          return;
        }

        const produtosFormatados: ProdutoFrontend[] = dados.map((produto: any) => {
          let fotoUrl = '';
          if (produto.fotos && produto.fotos.length > 0 && produto.fotos[0].foto) {
             fotoUrl = produto.fotos[0].foto;
          }

          return {
            id: produto.id?.toString() || '',
            name: produto.titulo || 'Produto sem nome',
            category: 'Diversos', 
            theme: produto.tema?.descricao || 'Sem tema',
            item: produto.item?.descricao || 'Sem item',
            imageUrl: fotoUrl,
          };
        });

        setProducts(produtosFormatados);

        // Preenche os selects dinamicamente
        const uniqueThemes = Array.from(new Set(produtosFormatados.map(p => p.theme)));
        const uniqueItems = Array.from(new Set(produtosFormatados.map(p => p.item)));
        
        setThemes(['Todos', ...uniqueThemes]);
        setItems(['Todos', ...uniqueItems]);

      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesTheme = selectedTheme === 'Todos' || product.theme === selectedTheme;
    const matchesItem = selectedItem === 'Todos' || product.item === selectedItem;
    return matchesSearch && matchesCategory && matchesTheme && matchesItem;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleEditProduct = (productId: string) => {
    navigate(`/produtos/editar/${productId}`); // Assumindo que você terá uma rota assim
  };

  const handleAddProduct = () => {
    navigate("/produtos");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="w-full px-[4vw] py-[4vh] box-border">

        <div className="mb-10">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Produtos</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie todos os produtos personalizados do seu catálogo</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between gap-6 mb-5">
            <div className="flex-1 max-w-md relative">
              <Search
                className="absolute top-1/2 -translate-y-1/2"
                style={{ color: '#9D8189', left: '1vw', width: '1.2vw', height: '1.2vw', pointerEvents: 'none' }}
              />
              <Input
                placeholder="Buscar produto por nome..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 text-[0.9vw]"
                style={{ paddingLeft: '3.5vw', borderColor: '#D8E2DC', backgroundColor: '#F9F9F9', color: '#6D6875' }}
              />
            </div>

            <Button
              onClick={handleAddProduct}
              className="gap-2 h-11 px-6 text-[15px]"
              style={{ backgroundColor: '#F4ACB7', color: 'white' }}
            >
              <Plus className="size-5" />
              Cadastrar Produto
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Filter className="size-4" style={{ color: '#9D8189' }} />
            <span className="text-[15px]" style={{ color: '#9D8189' }}>Filtrar por:</span>

            <div className="flex items-center gap-2">
              <label className="text-[14px]" style={{ color: '#9D8189' }}>Categoria:</label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 rounded-md text-[14px] border focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[14px]" style={{ color: '#9D8189' }}>Tema:</label>
              <select
                value={selectedTheme}
                onChange={(e) => { setSelectedTheme(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 rounded-md text-[14px] border focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                {themes.map(theme => <option key={theme} value={theme}>{theme}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[14px]" style={{ color: '#9D8189' }}>Item:</label>
              <select
                value={selectedItem}
                onChange={(e) => { setSelectedItem(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 rounded-md text-[14px] border focus:outline-none focus:border-[#F4ACB7]"
                style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }}
              >
                {items.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D8E2DC' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '15%' }}>Foto</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '30%' }}>Nome do Produto</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '18%' }}>Categoria</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '18%' }}>Tema</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '12%' }}>Item</th>
                <th className="text-right px-6 py-4 text-[16px]" style={{ color: '#6D6875', width: '7%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b transition-colors hover:bg-opacity-50"
                  style={{ borderColor: '#D8E2DC', backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9' }}
                >
                  <td className="px-6 py-4">
                    <div className="size-16 rounded-lg overflow-hidden border" style={{ borderColor: '#D8E2DC' }}>
                      {product.imageUrl ? (
                        <ImageWithFallback src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">Sem Foto</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-[16px]" style={{ color: '#6D6875' }}>{product.name}</span></td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[14px]" style={{ backgroundColor: '#FFCAD4', color: '#6D6875' }}>{product.category}</span>
                  </td>
                  <td className="px-6 py-4"><span className="text-[15px]" style={{ color: '#9D8189' }}>{product.theme}</span></td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[14px]" style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}>{product.item}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button onClick={() => handleEditProduct(product.id)} className="p-2 rounded-md transition-all hover:bg-opacity-80" style={{ backgroundColor: '#D8E2DC' }} title="Editar">
                        <Pencil className="size-4" style={{ color: '#6D6875' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {currentProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Nenhum produto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-[15px]" style={{ color: '#9D8189' }}>
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} produtos
          </p>
          {totalPages > 1 && (
             // ... controlos de paginação inalterados (podem ser os mesmos que já estavam lá)
             <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-md text-[15px] border transition-all disabled:opacity-40" style={{ backgroundColor: 'white', color: '#6D6875', borderColor: '#D8E2DC' }}>Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className="px-4 py-2 rounded-md text-[15px] border transition-all" style={{ backgroundColor: currentPage === page ? '#F4ACB7' : 'white', color: currentPage === page ? 'white' : '#6D6875', borderColor: currentPage === page ? '#F4ACB7' : '#D8E2DC' }}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-md text-[15px] border transition-all disabled:opacity-40" style={{ backgroundColor: 'white', color: '#6D6875', borderColor: '#D8E2DC' }}>Próximo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}