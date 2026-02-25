import { useState, useEffect } from 'react';
import { Tag, List, Box, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ProductCategoryModal from './modals/ProductCategoryModal';
import ProductCategoryListModal from './modals/ProductCategoryListModal';
import ThemeModal from './modals/ThemeModal';
import ThemeListModal from './modals/ThemeListModal';
import ItemModal from './modals/ItemModal';
import ItemListModal from './modals/ItemListModal';
import DeleteProductCategoryDialog from './modals/DeleteProductCategoryDialog';
import DeleteThemeDialog from './modals/DeleteThemeDialog';
import DeleteItemDialog from './modals/DeleteItemDialog';

import './index-cadastro.css'
import { Navigate, useNavigate } from 'react-router-dom';

interface ProductCategory {
  id: string;
  description: string;
}

interface Theme {
  id: string;
  description: string;
  categoryId: string;
}

interface Item {
  id: string;
  description: string;
  salePrice: number;
  productionCost: number;
  productionDeadline: string;
  width: string;
  height: string;
  weight: string;
  length: string;
  material: string;
  promotionalPrice: number;
  unitPrice: number;
  minimumQuantity: number;
}

const mockCategories: ProductCategory[] = [
  { id: '1', description: 'Herói' },
  { id: '2', description: 'Princesa' },
  { id: '3', description: 'Times' },
  { id: '4', description: 'Personagem' },
];

const mockThemes: Theme[] = [
  { id: '1', description: 'Ben 10', categoryId: '1' },
  { id: '2', description: 'Spider-Man', categoryId: '1' },
  { id: '3', description: 'Frozen', categoryId: '2' },
  { id: '4', description: 'Barbie', categoryId: '2' },
  { id: '5', description: 'Corinthians', categoryId: '3' },
  { id: '6', description: 'Palmeiras', categoryId: '3' },
];

const mockItems: Item[] = [
  {
    id: '1',
    description: 'Caneca',
    salePrice: 60.00,
    productionCost: 15.00,
    productionDeadline: '3 dias',
    width: '8cm',
    height: '10cm',
    weight: '250g',
    length: '8cm',
    material: 'Cerâmica',
    promotionalPrice: 50.00,
    unitPrice: 30.00,
    minimumQuantity: 2,
  },
  {
    id: '2',
    description: 'Caderno',
    salePrice: 45.00,
    productionCost: 12.00,
    productionDeadline: '5 dias',
    width: '20cm',
    height: '28cm',
    weight: '200g',
    length: '0.5cm',
    material: 'Papel',
    promotionalPrice: 40.00,
    unitPrice: 15.00,
    minimumQuantity: 3,
  },
];

export default function App() {
  const [categories, setCategories] = useState<ProductCategory[]>(mockCategories);
  const [themes, setThemes] = useState<Theme[]>(mockThemes);
  const [items, setItems] = useState<Item[]>(mockItems);
  
  const navigate = useNavigate();

  // Product form
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isItemLocked, setIsItemLocked] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryListModalOpen, setIsCategoryListModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isThemeListModalOpen, setIsThemeListModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemListModalOpen, setIsItemListModalOpen] = useState(false);

  // Editing state
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Delete state
  const [deleteCategory, setDeleteCategory] = useState<ProductCategory | null>(null);
  const [deleteTheme, setDeleteTheme] = useState<Theme | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  // Atualizar categoria quando tema mudar
  useEffect(() => {
    if (selectedThemeId) {
      const theme = themes.find(t => t.id === selectedThemeId);
      if (theme) {
        const category = categories.find(c => c.id === theme.categoryId);
        setSelectedCategory(category?.description || '');
      }
    } else {
      setSelectedCategory('');
    }
  }, [selectedThemeId, themes, categories]);

  // Preencher item quando selecionado
  useEffect(() => {
    if (selectedItemId) {
      const item = items.find(i => i.id === selectedItemId);
      if (item) {
        setCurrentItem(item);
        setIsItemLocked(true);
      }
    } else {
      setCurrentItem(null);
      setIsItemLocked(false);
    }
  }, [selectedItemId, items]);

  // Category handlers
  const handleAddCategory = (category: ProductCategory) => {
    setCategories([...categories, { ...category, id: Date.now().toString() }]);
    setIsCategoryModalOpen(false);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setCategories(categories.map(cat => cat.id === category.id ? category : cat));
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = () => {
    if (deleteCategory) {
      setCategories(categories.filter(cat => cat.id !== deleteCategory.id));
      setDeleteCategory(null);
    }
  };

  const openEditCategoryModal = (category: ProductCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
    setIsCategoryListModalOpen(false);
  };

  // Theme handlers
  const handleAddTheme = (theme: Theme) => {
    setThemes([...themes, { ...theme, id: Date.now().toString() }]);
    setIsThemeModalOpen(false);
  };

  const handleEditTheme = (theme: Theme) => {
    setThemes(themes.map(t => t.id === theme.id ? theme : t));
    setIsThemeModalOpen(false);
    setEditingTheme(null);
  };

  const handleDeleteTheme = () => {
    if (deleteTheme) {
      setThemes(themes.filter(t => t.id !== deleteTheme.id));
      setDeleteTheme(null);
    }
  };

  const openEditThemeModal = (theme: Theme) => {
    setEditingTheme(theme);
    setIsThemeModalOpen(true);
    setIsThemeListModalOpen(false);
  };

  // Item handlers
  const handleAddItem = (item: Item) => {
    setItems([...items, { ...item, id: Date.now().toString() }]);
    setIsItemModalOpen(false);
  };

  const handleEditItem = (item: Item) => {
    setItems(items.map(i => i.id === item.id ? item : i));
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = () => {
    if (deleteItem) {
      setItems(items.filter(i => i.id !== deleteItem.id));
      setDeleteItem(null);
    }
  };

  const openEditItemModal = (item: Item) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
    setIsItemListModalOpen(false);
  };

  const handleUnlockItem = () => {
    setIsItemLocked(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Produto cadastrado:', {
      title: productTitle,
      description: productDescription,
      themeId: selectedThemeId,
      itemId: selectedItemId,
      category: selectedCategory
    });
    navigate('/produtos/fotos');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Navbar */}
    

      <div className="max-w-[1200px] mx-auto px-8 py-12">
        
        {/* Cabeçalho */}
        <div className="mb-10">
          <button 
            className="flex items-center gap-2 mb-4 text-[15px] transition-colors hover:opacity-80"
            style={{ color: '#9D8189' }}
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-5" />
            Voltar para Produtos
          </button>
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Cadastro de Produto</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Preencha as informações para cadastrar um novo produto</p>
        </div>

        {/* Botões de gerenciamento */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={() => setIsCategoryListModalOpen(true)}
            className="gap-2 h-11 px-5 text-[15px]"
            style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}
          >
            <List className="size-4" />
            Categorias
          </Button>
          <Button 
            onClick={() => {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
            className="gap-2 h-11 px-5 text-[15px]"
            style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}
          >
            <Tag className="size-4" />
            Nova Categoria
          </Button>

          <Button 
            onClick={() => setIsThemeListModalOpen(true)}
            className="gap-2 h-11 px-5 text-[15px]"
            style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}
          >
            <List className="size-4" />
            Temas
          </Button>
          <Button 
            onClick={() => {
              setEditingTheme(null);
              setIsThemeModalOpen(true);
            }}
            className="gap-2 h-11 px-5 text-[15px]"
            style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}
          >
            <Tag className="size-4" />
            Novo Tema
          </Button>

          <Button 
            onClick={() => setIsItemListModalOpen(true)}
            className="gap-2 h-11 px-5 text-[15px]"
            style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}
          >
            <List className="size-4" />
            Itens
          </Button>
          <Button 
            onClick={() => {
              setEditingItem(null);
              setIsItemModalOpen(true);
            }}
            className="gap-2 h-11 px-5 text-[15px]"
            style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}
          >
            <Box className="size-4" />
            Novo Item
          </Button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg p-8 shadow-sm space-y-6" style={{ border: '1px solid #D8E2DC' }}>
            
            {/* Título do Produto */}
            <div>
              <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Título do Produto</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <Input
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="Ex: Caneca do Ben 10"
                className="h-12 text-[15px]"
                style={{ 
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              />
            </div>

            {/* Descrição do Produto */}
            <div>
              <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Descrição do Produto</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Descreva o produto..."
                className="w-full min-h-[120px] px-4 py-3 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{ 
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              />
            </div>

            {/* Tema */}
            <div>
              <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Tema</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <select
                value={selectedThemeId}
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              >
                <option value="">Selecione um tema</option>
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.description}</option>
                ))}
              </select>
            </div>

            {/* Categoria (exibição automática) */}
            {selectedCategory && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFE5D9' }}>
                <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}>
                  <strong>Categoria</strong> (automática)
                </label>
                <div 
                  className="inline-flex items-center px-4 py-2 rounded-full text-[15px]"
                  style={{
                    backgroundColor: '#FFCAD4',
                    color: '#6D6875'
                  }}
                >
                  {selectedCategory}
                </div>
              </div>
            )}

            {/* Item */}
            <div>
              <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}>
                <strong>Item</strong> <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full h-12 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              >
                <option value="">Selecione um item</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.description}</option>
                ))}
              </select>
            </div>

            {/* Informações do Item */}
            {currentItem && (
              <div 
                className="p-6 rounded-lg space-y-4"
                style={{ 
                  backgroundColor: isItemLocked ? '#F9F9F9' : '#FFE5D9',
                  border: '1px solid #D8E2DC'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[18px]" style={{ color: '#F4ACB7' }}>
                    <strong>Detalhes do Item</strong>
                  </h3>
                  {isItemLocked && (
                    <Button
                      type="button"
                      onClick={handleUnlockItem}
                      className="px-4 py-2 h-9 text-[14px]"
                      style={{
                        backgroundColor: '#F4ACB7',
                        color: 'white'
                      }}
                    >
                      Alterar Item
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Preço de Venda</span>
                    <p className="text-[16px]" style={{ color: '#4CAF50' }}>
                      <strong>R$ {currentItem.salePrice.toFixed(2)}</strong>
                    </p>
                  </div>
                  
                  {currentItem.promotionalPrice > 0 && (
                    <div 
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: '#FFCAD4',
                        gridColumn: 'span 2'
                      }}
                    >
                      <span className="text-[14px]" style={{ color: '#6D6875' }}>
                        🎉 Preço Promocional
                      </span>
                      <p className="text-[20px]" style={{ color: '#6D6875' }}>
                        <strong>R$ {currentItem.promotionalPrice.toFixed(2)}</strong>
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Custo de Produção</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      R$ {currentItem.productionCost.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Preço Unitário</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      R$ {currentItem.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Quantidade Mínima</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      {currentItem.minimumQuantity}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Prazo de Produção</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      {currentItem.productionDeadline || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Material</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      {currentItem.material || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Peso</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      {currentItem.weight || '-'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Largura</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      {currentItem.width || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Altura</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      {currentItem.height || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[14px]" style={{ color: '#9D8189' }}>Comprimento</span>
                    <p className="text-[16px]" style={{ color: '#6D6875' }}>
                      {currentItem.length || '-'}
                    </p>
                  </div>
                </div>

                {!isItemLocked && (
                  <div className="pt-4 border-t" style={{ borderColor: '#D8E2DC' }}>
                    <p className="text-[14px]" style={{ color: '#9D8189' }}>
                      Clique em "Itens" no menu acima para editar este item ou criar um novo baseado nele.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              onClick={() => window.history.back()}
              className="px-8 py-3 h-12 text-[16px]"
              style={{
                backgroundColor: 'white',
                color: '#9D8189',
                border: '1px solid #D8E2DC'
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-8 py-3 h-12 text-[16px]"
              style={{
                backgroundColor: '#F4ACB7',
                color: 'white'
              }}
              // onClick={() => navigate('/produtos/fotos')}
            >
              Cadastrar e Adicionar Fotos
            </Button>
          </div>
        </form>
      </div>

      {/* Modals de Categoria */}
      <ProductCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        category={editingCategory}
      />

      <ProductCategoryListModal
        isOpen={isCategoryListModalOpen}
        onClose={() => setIsCategoryListModalOpen(false)}
        categories={categories}
        onEdit={openEditCategoryModal}
        onDelete={(category) => setDeleteCategory(category)}
      />

      {/* Modals de Tema */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => {
          setIsThemeModalOpen(false);
          setEditingTheme(null);
        }}
        onSave={editingTheme ? handleEditTheme : handleAddTheme}
        theme={editingTheme}
        categories={categories}
      />

      <ThemeListModal
        isOpen={isThemeListModalOpen}
        onClose={() => setIsThemeListModalOpen(false)}
        themes={themes}
        categories={categories}
        onEdit={openEditThemeModal}
        onDelete={(theme) => setDeleteTheme(theme)}
      />

      {/* Modals de Item */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={editingItem ? handleEditItem : handleAddItem}
        item={editingItem}
        items={items}
      />

      <ItemListModal
        isOpen={isItemListModalOpen}
        onClose={() => setIsItemListModalOpen(false)}
        items={items}
        onEdit={openEditItemModal}
        onDelete={(item) => setDeleteItem(item)}
      />

      {/* Dialogs de confirmação */}
      <DeleteProductCategoryDialog
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDeleteCategory}
        categoryName={deleteCategory?.description || ''}
      />

      <DeleteThemeDialog
        isOpen={!!deleteTheme}
        onClose={() => setDeleteTheme(null)}
        onConfirm={handleDeleteTheme}
        themeName={deleteTheme?.description || ''}
      />

      <DeleteItemDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteItem}
        itemName={deleteItem?.description || ''}
      />
    </div>
  );
}