import { useState, useEffect } from 'react';
import DeleteConfirmDialog from "./modais/DeleteConfirmDialog"
import { Search, Pencil, Plus, Filter, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FeedbackModal from '../ui/FeedbackModal';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { produtoService } from '../../services/ProdutoService';
import type { Produto } from '../../interfaces/Produto'; 
import './index-lista-produtos.css';

export default function App() {
  const [products, setProducts] = useState<Produto[]>([]);
  const [deleteProduct, setDeleteProduct] = useState<Produto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTheme, setSelectedTheme] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  const [themes, setThemes] = useState<string[]>(['Todos']);
  const [items, setItems] = useState<string[]>(['Todos']);
  const [categories, setCategories] = useState<string[]>(['Todos']);
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

  const itemsPerPage = 10;

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await produtoService.listarTodos(currentPage - 1, 10, searchTerm);
      
      if (data && data.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages); 
        setTotalElements(data.totalElements || data.content.length); // <-- Adicione isto
      } else {
        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(1); 
        setTotalElements(Array.isArray(data) ? data.length : 0); // <-- Adicione isto
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  fetchProducts();
}, [currentPage, searchTerm]);

  const filteredProducts = products.filter(product => {
    const nome = product.titulo || '';
    const categoria = product.tema?.categoriaTema?.titulo || 'Sem Categoria';
    const tema = product.tema?.descricao || 'Sem tema';
    const item = product.item?.descricao || 'Sem item';

    const matchesSearch = nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || categoria === selectedCategory;
    const matchesTheme = selectedTheme === 'Todos' || tema === selectedTheme;
    const matchesItem = selectedItem === 'Todos' || item === selectedItem;
    
    return matchesSearch && matchesCategory && matchesTheme && matchesItem;
  });

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const currentProducts = filteredProducts;

  const handleEditProduct = (productId: number) => {
    navigate(`/produtos/editar/${productId}`); 
  };

  const handleAddProduct = () => {
    navigate("/produtos");
  };
  const handleDeleteProduct = async () => {
      if (deleteProduct && deleteProduct.id) {
        try {
          await produtoService.deletar(deleteProduct.id);
          setProducts(products.filter(prod => prod.id !== deleteProduct.id));
          setDeleteProduct(null);
        } catch (error) {
          showFeedback('Erro ao excluir produto. Tente novamente mais tarde.', 'error');
          console.error("Erro ao apagar Produto:", error);
        }
      }
    };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="w-full max-w-[1600px] mx-auto px-8 py-10 box-border">

        <div className="mb-10">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Produtos</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie todos os produtos personalizados do seu catálogo</p>
        </div>

        {/* Filtros */}
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

        {/* Tabela */}
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
              {currentProducts.map((product, index) => {
                // Pegar a foto principal de forma segura
                const fotoUrl = product.fotos && product.fotos.length > 0 ? product.fotos[0].foto : '';

                return (
                  <tr
                    key={product.id}
                    className="border-b transition-colors hover:bg-opacity-50"
                    style={{ borderColor: '#D8E2DC', backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9' }}
                  >
                    <td className="px-6 py-4">
                      <div className="size-16 rounded-lg overflow-hidden border" style={{ borderColor: '#D8E2DC' }}>
                        {fotoUrl ? (
                          <ImageWithFallback onClick={() => navigate(`/produtos/fotos/${product.id}`)} src={fotoUrl} alt={product.titulo} className="w-full h-full object-cover" style={{ cursor: "pointer"}}/>
                        ) : (
                          <div onClick={() => navigate(`/produtos/fotos/${product.id}`)} className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs cursor-pointer">Sem Foto</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[16px]" style={{ color: '#6D6875' }}>{product.titulo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[14px]" style={{ backgroundColor: '#FFCAD4', color: '#6D6875' }}>
                        {product.tema?.categoriaTema?.titulo || 'Sem Categoria'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[15px]" style={{ color: '#9D8189' }}>
                        {product.tema?.descricao || 'Sem tema'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[14px]" style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}>
                        {product.item?.descricao || 'Sem item'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setDeleteProduct(product)}
                          className="p-2 rounded-md transition-all hover:bg-opacity-80"
                          style={{ backgroundColor: '#FFCAD4' }}
                          title="Excluir"
                        >
                          <Trash2 className="size-4" style={{ color: '#6D6875' }} />
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product.id)} 
                          className="p-2 rounded-md transition-all hover:bg-opacity-80" 
                          style={{ backgroundColor: '#D8E2DC' }} 
                          title="Editar Dados"
                        >
                          <Pencil className="size-4" style={{ color: '#6D6875' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
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
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalElements)} de {totalElements} produtos
          </p>
          {totalPages > 1 && (
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
      <DeleteConfirmDialog
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDeleteProduct}
        productTitulo={deleteProduct?.titulo || ''}
      />
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        message={feedback.message}
        type={feedback.type}
      />
    </div>
  );
}