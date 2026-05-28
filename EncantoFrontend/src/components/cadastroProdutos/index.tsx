import { useState, useEffect } from 'react';
import { List, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useNavigate, useParams } from 'react-router-dom'; // Adicionado useParams
import FeedbackModal from '../ui/FeedbackModal';
// Importação dos Modais
import ProductCategoryModal from './modals/ProductCategoryModal';
import ProductCategoryListModal from './modals/ProductCategoryListModal';
import ThemeModal from './modals/ThemeModal';
import ThemeListModal from './modals/ThemeListModal';
import ItemModal from './modals/ItemModal';
import ItemListModal from './modals/ItemListModal';
import DeleteProductCategoryDialog from './modals/DeleteProductCategoryDialog';
import DeleteThemeDialog from './modals/DeleteThemeDialog';
import DeleteItemDialog from './modals/DeleteItemDialog';

// Importação dos Serviços
import { categoriaTemaService } from '../../services/CategoriaTemaService';
import { temaService } from '../../services/TemaService';
import { itemService } from '../../services/ItemService';
import { produtoService } from '../../services/ProdutoService';

import './index-cadastro.css'

interface ProductCategory { id: string; description: string; }
interface Theme { id: string; description: string; categoryId: string; }
interface Item {
  id: string; description: string; salePrice: number; productionCost: number;
  productionDeadline: string; width: string; height: string; weight: string;
  length: string; material: string; descricaoPadrao?: string; promotionalPrice: number; unitPrice: number; minimumQuantity: number;
}

export default function App() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL se estivermos a editar
  const isEditingProduct = !!id; // Verdadeiro se existir um ID na URL

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Formulário Produto
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isItemLocked, setIsItemLocked] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  // Estados dos Modais
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryListModalOpen, setIsCategoryListModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isThemeListModalOpen, setIsThemeListModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemListModalOpen, setIsItemListModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  // Estados de Edição e Exclusão (Auxiliares)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<ProductCategory | null>(null);
  const [deleteTheme, setDeleteTheme] = useState<Theme | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  // ==========================================
  // CARREGAMENTO INICIAL (DADOS AUXILIARES)
  // ==========================================
  useEffect(() => {
    const fetchAuxiliaryData = async () => {
      try {
        const [categoriasData, itensData] = await Promise.all([
          categoriaTemaService.listarTodos().catch(() => []),
          itemService.listarTodos().catch(() => [])
        ]);

        const todosOsTemas: Theme[] = [];
        const categoriasFormatadas = categoriasData.map((c: any) => {
          if (c.temas && Array.isArray(c.temas)) {
            c.temas.forEach((t: any) => {
              todosOsTemas.push({ id: t.id.toString(), description: t.descricao, categoryId: c.id.toString() });
            });
          }
          return { id: c.id.toString(), description: c.titulo };
        });

        const itensFormatados = itensData.map((i: any) => ({
          id: i.id.toString(),
          description: i.descricao,
          salePrice: i.precoVenda || 0,
          productionCost: i.custoProducao || 0,
          productionDeadline: i.prazoProducao ? `${i.prazoProducao} dias` : '-',
          width: i.largura ? `${i.largura}cm` : '-',
          height: i.altura ? `${i.altura}cm` : '-',
          weight: i.peso ? `${i.peso}g` : '-',
          length: i.comprimento ? `${i.comprimento}cm` : '-',
          material: i.material || '-',
          descricaoPadrao: i.descricaoPadrao || '',
          promotionalPrice: i.precoPromocional || 0,
          unitPrice: i.precoVenda || 0, 
          minimumQuantity: 1 
        }));

        setCategories(categoriasFormatadas);
        setThemes(todosOsTemas);
        setItems(itensFormatados);
      } catch (error) {
        console.error("Erro ao carregar dados auxiliares:", error);
      }
    };
    fetchAuxiliaryData();
  }, []);

  // ==========================================
  // CARREGAMENTO DO PRODUTO PARA EDIÇÃO
  // ==========================================
  useEffect(() => {
    const carregarProdutoParaEdicao = async () => {
      if (!isEditingProduct || !id) return;
      
      try {
        const produto = await produtoService.buscarPorId(id);
        
        // Preenche os campos do formulário com os dados que vieram do banco
        setProductTitle(produto.titulo || '');
        setProductDescription(produto.descricao || '');
        
        // Seleciona os IDs nos dropdowns (garante que vêm como string para o value do select)
        if (produto.tema?.id) setSelectedThemeId(produto.tema.id.toString());
        if (produto.item?.id) setSelectedItemId(produto.item.id.toString());
        
      } catch (error) {
        console.error("Erro ao buscar produto para edição:", error);
        showFeedback("Não foi possível carregar o produto para edição. Tente novamente.", "error");
      }
    };

    carregarProdutoParaEdicao();
  }, [id, isEditingProduct]);

  // Preenchimento automático (Categoria e Item)
  useEffect(() => {
    if (selectedThemeId) {
      const theme = themes.find(t => t.id === selectedThemeId);
      if (theme) {
        const category = categories.find(c => c.id === theme.categoryId);
        setSelectedCategory(category?.description || 'Desconhecida');
      }
    } else setSelectedCategory('');
  }, [selectedThemeId, themes, categories]);

  useEffect(() => {
    if (selectedItemId) {
      const item = items.find(i => i.id === selectedItemId);
      if (item) { setCurrentItem(item); setIsItemLocked(true); }
    } else { setCurrentItem(null); setIsItemLocked(false); }
  }, [selectedItemId, items]);

  useEffect(() => {
    if (!isEditingProduct && selectedItemId && productDescription.trim() === '') {
      
      const itemSelecionado = items.find(i => i.id === selectedItemId);
      
      if (itemSelecionado && itemSelecionado.descricaoPadrao) {
        
        setProductDescription(itemSelecionado.descricaoPadrao);
      }
    }
  }, [selectedItemId, isEditingProduct, items, productDescription]);

  // Função auxiliar para limpeza de números
  const extractNumber = (str: string | number) => {
    if (!str) return 0;
    const match = str.toString().match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  // ==========================================
  // FUNÇÕES DE CATEGORIA, TEMA E ITEM
  // ==========================================
  const handleAddCategory = async (category: ProductCategory) => {
    try {
      const data = await categoriaTemaService.criar(category.description);
      setCategories([...categories, { id: data.id.toString(), description: data.titulo }]);
      setIsCategoryModalOpen(false);
    } catch (e) { 
      console.error(e); 
      showFeedback("Erro ao criar categoria.", "error");
    }
  };

  const handleEditCategory = async (category: ProductCategory) => {
    try {
      await categoriaTemaService.atualizar(category.id, category.description);
      setCategories(categories.map(cat => cat.id === category.id ? category : cat));
      setIsCategoryModalOpen(false); setEditingCategory(null);
    } catch (e) { console.error(e); showFeedback("Erro ao atualizar categoria.", "error"); }
  };

  const handleDeleteCategory = async () => {
    if (deleteCategory) {
      try {
        await categoriaTemaService.deletar(deleteCategory.id);
        setCategories(categories.filter(cat => cat.id !== deleteCategory.id));
        setDeleteCategory(null);
      } catch (e) { console.error(e); showFeedback("Erro ao excluir. Pode estar vinculada a um tema.", "error"); }
    }
  };

  const handleAddTheme = async (theme: Theme) => {
    try {
      const data = await temaService.criar(theme.description, parseInt(theme.categoryId));
      setThemes([...themes, { id: data.id.toString(), description: data.descricao, categoryId: theme.categoryId }]);
      setIsThemeModalOpen(false);
    } catch (e) { console.error(e); showFeedback("Erro ao criar tema.", "error"); }
  };

  const handleEditTheme = async (theme: Theme) => {
    try {
      await temaService.atualizar(theme.id, theme.description, parseInt(theme.categoryId));
      setThemes(themes.map(t => t.id === theme.id ? theme : t));
      setIsThemeModalOpen(false); setEditingTheme(null);
    } catch (e) { console.error(e); showFeedback("Erro ao atualizar tema.", "error"); }
  };

  const handleDeleteTheme = async () => {
    if (deleteTheme) {
      try {
        await temaService.deletar(deleteTheme.id);
        setThemes(themes.filter(t => t.id !== deleteTheme.id));
        setDeleteTheme(null);
      } catch (e) { console.error(e); showFeedback("Erro ao excluir. Pode estar vinculado a um produto.", "error"); }
    }
  };

  const buildItemPayload = (item: Item) => ({
    descricao: item.description,
    precoVenda: item.salePrice,
    custoProducao: item.productionCost,
    prazoProducao: Math.round(extractNumber(item.productionDeadline)),
    largura: extractNumber(item.width),
    altura: extractNumber(item.height),
    peso: extractNumber(item.weight),
    comprimento: extractNumber(item.length),
    material: item.material,
    descricaoPadrao: item.descricaoPadrao,
    precoPromocional: item.promotionalPrice || 0
  });

  const handleAddItem = async (item: Item) => {
    try {
      const data = await itemService.criar(buildItemPayload(item));
      setItems([...items, { ...item, id: data.id.toString() }]);
      setIsItemModalOpen(false);
    } catch (e) { console.error(e); showFeedback("Erro ao criar item.", "error"); }
  };

  const handleEditItem = async (item: Item) => {
    try {
      await itemService.atualizar(item.id, buildItemPayload(item));
      setItems(items.map(i => i.id === item.id ? item : i));
      setIsItemModalOpen(false); setEditingItem(null);
    } catch (e) { console.error(e); showFeedback("Erro ao atualizar item.", "error"); }
  };

  const handleDeleteItem = async () => {
    if (deleteItem) {
      try {
        await itemService.deletar(deleteItem.id);
        setItems(items.filter(i => i.id !== deleteItem.id));
        setDeleteItem(null);
      } catch (e) { console.error(e); showFeedback("Erro ao excluir. Pode estar vinculado a um produto.", "error"); }
    }
  };

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ isOpen: true, message, type });
  };

  // ==========================================
  // SUBMISSÃO DO PRODUTO (CRIAR / EDITAR)
  // ==========================================
  // ==========================================
  // SUBMISSÃO DO PRODUTO (CRIAR / EDITAR)
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThemeId || !selectedItemId) { 
      showFeedback("Por favor, selecione um Tema e um Item.", "error"); 
      return;
    }
    
    try {
    const dadosBackend = {
      titulo: productTitle,
      descricao: productDescription,
      temaId: parseInt(selectedThemeId),
      itemId: parseInt(selectedItemId),
      fotos: [] 
    };

    if (isEditingProduct && id) {
      await produtoService.atualizar(id, dadosBackend as any);
      
      showFeedback('Produto atualizado com sucesso!', 'success');
      
      setTimeout(() => {
        navigate('/lista-produtos'); 
      }, 1500); 
      
    } else {
      const novoProduto = await produtoService.criar(dadosBackend as any);
      
      // 🟢 SUCESSO
      showFeedback('Produto cadastrado! Vamos adicionar as imagens agora.', 'success');
      
      setTimeout(() => {
        navigate(`/produtos/fotos/${novoProduto.id}`); 
      }, 1500);
    }

  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    showFeedback('Erro ao salvar produto. Verifique se preencheu tudo corretamente.', 'error');
  }
};

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        {/* Cabeçalho */}
        <div className="mb-10">
          <button type="button" className="no-button-feedback flex items-center gap-2 mb-4 text-[15px]" style={{ color: '#9D8189' }} onClick={() => navigate('/lista-produtos')}>
            <ArrowLeft className="size-5" /> Voltar para Produtos
          </button>
          
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>
            {isEditingProduct ? 'Editar Produto' : 'Cadastro de Produto'}
          </h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>
            {isEditingProduct 
              ? 'Altere as informações necessárias do seu produto' 
              : 'Preencha as informações para cadastrar um novo produto'}
          </p>
        </div>

        {/* Botões de gerenciamento */}
        <div className="flex gap-3 mb-6">
          <Button type="button" onClick={() => setIsCategoryListModalOpen(true)} className="no-button-feedback gap-2 h-11 px-5 text-[15px]" style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}><List className="size-4" /> Categorias</Button>
          <Button type="button" onClick={() => setIsThemeListModalOpen(true)} className="no-button-feedback gap-2 h-11 px-5 text-[15px]" style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}><List className="size-4" /> Temas</Button>
          <Button type="button" onClick={() => setIsItemListModalOpen(true)} className="no-button-feedback gap-2 h-11 px-5 text-[15px]" style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}><List className="size-4" /> Itens</Button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg p-8 shadow-sm space-y-6" style={{ border: '1px solid #D8E2DC' }}>
            
            {/* Título do Produto */}
            <div>
              <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}><strong>Título do Produto</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
              <Input value={productTitle} onChange={(e) => setProductTitle(e.target.value)} placeholder="Ex: Caneca do Ben 10" className="h-11 text-[15px]" style={{ borderColor: '#D8E2DC', color: '#6D6875' }} required />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}><strong>Descrição do Produto</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
              <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Descreva o produto..." className="w-full min-h-[120px] px-4 py-3 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]" style={{ borderColor: '#D8E2DC', color: '#6D6875' }} required />
            </div>

            {/* Tema */}
            <div>
              <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}><strong>Tema</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
              <select value={selectedThemeId} onChange={(e) => setSelectedThemeId(e.target.value)} className="w-full h-11 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]" style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }} required>
                <option value="">Selecione um tema</option>
                {themes.map(theme => <option key={theme.id} value={theme.id}>{theme.description}</option>)}
              </select>
            </div>

            {/* Categoria */}
            {selectedCategory && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFE5D9' }}>
                <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}><strong>Categoria</strong> (automática)</label>
                <div className="inline-flex items-center px-4 py-2 rounded-full text-[15px]" style={{ backgroundColor: '#FFCAD4', color: '#6D6875' }}>{selectedCategory}</div>
              </div>
            )}

            {/* Item */}
            <div>
              <label className="block text-[16px] mb-2" style={{ color: '#6D6875' }}><strong>Item</strong> <span style={{ color: '#F4ACB7' }}>*</span></label>
              <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className="w-full h-11 px-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]" style={{ backgroundColor: 'white', borderColor: '#D8E2DC', color: '#6D6875' }} required>
                <option value="">Selecione um item</option>
                {items.map(item => <option key={item.id} value={item.id}>{item.description}</option>)}
              </select>
             
            </div>

            {/* Informações do Item (Card) */}
            {currentItem && (
              <div className="p-6 rounded-lg space-y-4" style={{ backgroundColor: isItemLocked ? '#F9F9F9' : '#FFE5D9', border: '1px solid #D8E2DC' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[18px]" style={{ color: '#F4ACB7' }}><strong>Detalhes do Item</strong></h3>
                  {isItemLocked && (
                    <Button type="button" onClick={() => setIsItemLocked(false)} className="px-4 py-2 h-9 text-[14px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>Alterar Item</Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><span className="text-[14px]" style={{ color: '#9D8189' }}>Preço de Venda</span><p className="text-[16px]" style={{ color: '#4CAF50' }}><strong>R$ {currentItem.salePrice.toFixed(2)}</strong></p></div>
                  {currentItem.promotionalPrice > 0 && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFCAD4', gridColumn: 'span 2' }}>
                      <span className="text-[14px]" style={{ color: '#6D6875' }}>🎉 Preço Promocional</span><p className="text-[20px]" style={{ color: '#6D6875' }}><strong>R$ {currentItem.promotionalPrice.toFixed(2)}</strong></p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" onClick={() => navigate('/lista-produtos')} className="px-8 py-3 h-11 text-[16px]" style={{ backgroundColor: 'white', color: '#9D8189', border: '1px solid #D8E2DC' }}>Cancelar</Button>
            <Button type="submit" className="px-8 py-3 h-11 text-[16px]" style={{ backgroundColor: '#F4ACB7', color: 'white' }}>
              {isEditingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </Button>
          </div>
        </form>
      </div>

      {/* Modais com onSave e onDelete Mapeados */}
      <ProductCategoryModal isOpen={isCategoryModalOpen} onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }} onSave={editingCategory ? handleEditCategory : handleAddCategory} category={editingCategory} />
      <ProductCategoryListModal isOpen={isCategoryListModalOpen} onClose={() => setIsCategoryListModalOpen(false)} categories={categories} onCreate={() => { setEditingCategory(null); setIsCategoryListModalOpen(false); setIsCategoryModalOpen(true); }} onEdit={(cat) => { setEditingCategory(cat); setIsCategoryModalOpen(true); setIsCategoryListModalOpen(false); }} onDelete={(cat) => setDeleteCategory(cat)} />
      
      <ThemeModal isOpen={isThemeModalOpen} onClose={() => { setIsThemeModalOpen(false); setEditingTheme(null); }} onSave={editingTheme ? handleEditTheme : handleAddTheme} theme={editingTheme} categories={categories} />
      <ThemeListModal isOpen={isThemeListModalOpen} onClose={() => setIsThemeListModalOpen(false)} themes={themes} categories={categories} onCreate={() => { setEditingTheme(null); setIsThemeListModalOpen(false); setIsThemeModalOpen(true); }} onEdit={(t) => { setEditingTheme(t); setIsThemeModalOpen(true); setIsThemeListModalOpen(false); }} onDelete={(t) => setDeleteTheme(t)} />
      
      <ItemModal isOpen={isItemModalOpen} onClose={() => { setIsItemModalOpen(false); setEditingItem(null); }} onSave={editingItem ? handleEditItem : handleAddItem} item={editingItem} items={items} />
      <ItemListModal isOpen={isItemListModalOpen} onClose={() => setIsItemListModalOpen(false)} items={items} onCreate={() => { setEditingItem(null); setIsItemListModalOpen(false); setIsItemModalOpen(true); }} onEdit={(i) => { setEditingItem(i); setIsItemModalOpen(true); setIsItemListModalOpen(false); }} onDelete={(i) => setDeleteItem(i)} />

      {/* Confirmações de Exclusão */}
      <DeleteProductCategoryDialog isOpen={!!deleteCategory} onClose={() => setDeleteCategory(null)} onConfirm={handleDeleteCategory} categoryName={deleteCategory?.description || ''} />
      <DeleteThemeDialog isOpen={!!deleteTheme} onClose={() => setDeleteTheme(null)} onConfirm={handleDeleteTheme} themeName={deleteTheme?.description || ''} />
      <DeleteItemDialog isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDeleteItem} itemName={deleteItem?.description || ''} />
    <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        message={feedback.message}
        type={feedback.type}
      />
    </div>
  );
}
