import { useState } from 'react';
import { Search, Pencil, Trash2, Plus, Filter, Tag, List, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import CategoryModal from './modals/CategoryModal';
import TransactionModal from './modals/TransactionModal';
import CounterpartyModal from './modals/CounterpartyModal';
import CategoryListModal from './modals/CategoryListModal';
import CounterpartyListModal from './modals/CounterpartyListModal';
import DeleteTransactionDialog from './modals/DeleteTransactionDialog';
import DeleteCategoryDialog from './modals/DeleteCategoryDialog';
import DeleteCounterpartyDialog from './modals/DeleteCounterpartyDialog';

import './index-cadastro-mov.css'

interface Category {
  id: string;
  name: string;
}

interface Counterparty {
  id: string;
  name: string;
  contractType: string;
  segment: string;
  description: string;
}

interface Transaction {
  id: string;
  counterpartyId: string;
  counterpartyName: string;
  description: string;
  category: string;
  value: number;
  date: string;
  type: 'Receita' | 'Despesa';
  updatedAt?: string;
}

const mockCategories: Category[] = [
  { id: '1', name: 'Pagamento de Funcionário' },
  { id: '2', name: 'Prolabore' },
  { id: '3', name: 'Fornecedor' },
  { id: '4', name: 'Prestador de Serviço' },
  { id: '5', name: 'Venda de Produto' },
];

const mockCounterparties: Counterparty[] = [
  { id: '1', name: 'Ana Carolina Silva', contractType: 'Funcionário', segment: 'Recursos Humanos', description: 'Funcionária do setor administrativo' },
  { id: '2', name: 'Shopee Brasil', contractType: 'Empresa', segment: 'E-commerce', description: 'Marketplace online' },
  { id: '3', name: 'Tecidos Premium Ltda', contractType: 'Fornecedor', segment: 'Comércio', description: 'Fornecedor de tecidos e materiais' },
  { id: '4', name: 'Instagram Store', contractType: 'Empresa', segment: 'E-commerce', description: 'Vendas via Instagram' },
  { id: '5', name: 'João Silva - Designer', contractType: 'Prestador de Serviço', segment: 'Design', description: 'Designer freelancer' },
  { id: '6', name: 'Elo7 Brasil', contractType: 'Empresa', segment: 'E-commerce', description: 'Marketplace de produtos artesanais' },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    counterpartyId: '1',
    counterpartyName: 'Ana Carolina Silva',
    description: 'Salário mensal',
    category: 'Pagamento de Funcionário',
    value: -3500.00,
    date: '2024-01-05',
    type: 'Despesa',
  },
  {
    id: '2',
    counterpartyId: '2',
    counterpartyName: 'Shopee Brasil',
    description: '20 Cadernos Hello Kit',
    category: 'Venda de Produto',
    value: 500.00,
    date: '2024-01-10',
    type: 'Receita',
  },
  {
    id: '3',
    counterpartyId: '3',
    counterpartyName: 'Tecidos Premium Ltda',
    description: 'Compra de tecidos para produção',
    category: 'Fornecedor',
    value: -1200.00,
    date: '2024-01-12',
    type: 'Despesa',
  },
  {
    id: '4',
    counterpartyId: '4',
    counterpartyName: 'Instagram Store',
    description: '2 Canecas Corintians',
    category: 'Venda de Produto',
    value: 60.00,
    date: '2024-01-15',
    type: 'Receita',
  },
  {
    id: '5',
    counterpartyId: '5',
    counterpartyName: 'João Silva - Designer',
    description: 'Criação de artes personalizadas',
    category: 'Prestador de Serviço',
    value: -800.00,
    date: '2024-01-18',
    type: 'Despesa',
  },
  {
    id: '6',
    counterpartyId: '6',
    counterpartyName: 'Elo7 Brasil',
    description: '100 Cadernos Frozen',
    category: 'Venda de Produto',
    value: 1000.00,
    date: '2024-01-20',
    type: 'Receita',
  },
];

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [counterparties, setCounterparties] = useState<Counterparty[]>(mockCounterparties);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCounterpartyModalOpen, setIsCounterpartyModalOpen] = useState(false);
  const [isCategoryListModalOpen, setIsCategoryListModalOpen] = useState(false);
  const [isCounterpartyListModalOpen, setIsCounterpartyListModalOpen] = useState(false);
  
  // Editing state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingCounterparty, setEditingCounterparty] = useState<Counterparty | null>(null);
  
  // Delete state
  const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [deleteCounterparty, setDeleteCounterparty] = useState<Counterparty | null>(null);
  
  const itemsPerPage = 8;
  const filters = ['Todos', 'Receitas', 'Despesas'];

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.counterpartyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'Todos' || 
                         (selectedFilter === 'Receitas' && transaction.type === 'Receita') ||
                         (selectedFilter === 'Despesas' && transaction.type === 'Despesa');
    return matchesSearch && matchesFilter;
  });

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Calcular total
  const total = filteredTransactions.reduce((sum, t) => sum + t.value, 0);

  // Category handlers
  const handleAddCategory = (category: Category) => {
    setCategories([...categories, { ...category, id: Date.now().toString() }]);
    setIsCategoryModalOpen(false);
  };

  const handleEditCategory = (category: Category) => {
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

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
    setIsCategoryListModalOpen(false);
  };

  // Counterparty handlers
  const handleAddCounterparty = (counterparty: Counterparty) => {
    setCounterparties([...counterparties, { ...counterparty, id: Date.now().toString() }]);
    setIsCounterpartyModalOpen(false);
  };

  const handleEditCounterparty = (counterparty: Counterparty) => {
    setCounterparties(counterparties.map(cp => cp.id === counterparty.id ? counterparty : cp));
    setIsCounterpartyModalOpen(false);
    setEditingCounterparty(null);
  };

  const handleDeleteCounterparty = () => {
    if (deleteCounterparty) {
      setCounterparties(counterparties.filter(cp => cp.id !== deleteCounterparty.id));
      setDeleteCounterparty(null);
    }
  };

  const openEditCounterpartyModal = (counterparty: Counterparty) => {
    setEditingCounterparty(counterparty);
    setIsCounterpartyModalOpen(true);
    setIsCounterpartyListModalOpen(false);
  };

  // Transaction handlers
  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now().toString() }]);
    setIsTransactionModalOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = () => {
    if (deleteTransaction) {
      setTransactions(transactions.filter(t => t.id !== deleteTransaction.id));
      setDeleteTransaction(null);
    }
  };

  const openEditTransactionModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const openAddTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openAddCounterpartyModal = () => {
    setEditingCounterparty(null);
    setIsCounterpartyModalOpen(true);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Obter tipo de contrato da contraparte
  const getCounterpartyContractType = (counterpartyId: string) => {
    const counterparty = counterparties.find(cp => cp.id === counterpartyId);
    return counterparty?.contractType || '-';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Navbar */}
      

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        
        {/* Cabeçalho */}
        <div className="mb-10">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Financeiro</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie todas as receitas e despesas do seu negócio</p>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between gap-6 mb-5">
            {/* Pesquisa */}
            {/* Bloco de Pesquisa - Movimentação */}
<div className="flex-1 max-w-md relative">
  <Search 
    className="absolute top-1/2 -translate-y-1/2" 
    style={{ 
      color: '#9D8189', 
      left: '1vw', 
      width: '1.2vw', 
      height: '1.2vw',
      pointerEvents: 'none'
    }} 
  />
  <Input
    placeholder="Buscar por nome ou descrição..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
    className="h-11 text-[0.9vw]"
    style={{ 
      paddingLeft: '3.5vw', /* Força o texto a começar depois da lupa */
      borderColor: '#D8E2DC',
      backgroundColor: '#F9F9F9',
      color: '#6D6875'
    }}
  />
</div>
            
            {/* Botões */}
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsCategoryListModalOpen(true)}
                className="gap-2 h-11 px-6 text-[15px]"
                style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}
              >
                <List className="size-5" />
                Categorias
              </Button>
              <Button 
                onClick={() => setIsCounterpartyListModalOpen(true)}
                className="gap-2 h-11 px-6 text-[15px]"
                style={{ backgroundColor: '#FFE5D9', color: '#6D6875' }}
              >
                <Users className="size-5" />
                Contrapartes
              </Button>
              <Button 
                onClick={openAddCategoryModal}
                className="gap-2 h-11 px-6 text-[15px]"
                style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}
              >
                <Tag className="size-5" />
                Nova Categoria
              </Button>
              <Button 
                onClick={openAddCounterpartyModal}
                className="gap-2 h-11 px-6 text-[15px]"
                style={{ backgroundColor: '#D8E2DC', color: '#6D6875' }}
              >
                <Users className="size-5" />
                Nova Contraparte
              </Button>
              <Button 
                onClick={openAddTransactionModal}
                className="gap-2 h-11 px-6 text-[15px]"
                style={{ backgroundColor: '#F4ACB7', color: 'white' }}
              >
                <Plus className="size-5" />
                Nova Movimentação
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-3">
            <Filter className="size-4" style={{ color: '#9D8189' }} />
            <span className="text-[15px]" style={{ color: '#9D8189' }}>Filtrar por tipo:</span>
            <div className="flex gap-2">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-1.5 rounded-md text-[15px] transition-all"
                  style={{
                    backgroundColor: selectedFilter === filter ? '#FFCAD4' : 'transparent',
                    color: selectedFilter === filter ? '#6D6875' : '#9D8189',
                    border: `1px solid ${selectedFilter === filter ? '#FFCAD4' : '#D8E2DC'}`
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D8E2DC' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Nome
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Descrição
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Tipo de Contrato
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Categoria
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Valor
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Data
                </th>
                <th className="text-right px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id}
                  className="border-b transition-colors hover:bg-opacity-50"
                  style={{ 
                    borderColor: '#D8E2DC',
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                  }}
                >
                  <td className="px-6 py-4">
                    <span className="text-[16px]" style={{ color: '#6D6875' }}>
                      {transaction.counterpartyName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[15px]" style={{ color: '#9D8189' }}>
                      {transaction.description}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[15px]" style={{ color: '#9D8189' }}>
                      {getCounterpartyContractType(transaction.counterpartyId)}
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
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="text-[16px]"
                      style={{ 
                        color: transaction.value > 0 ? '#4CAF50' : '#F4ACB7'
                      }}
                    >
                      {formatCurrency(transaction.value)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[15px]" style={{ color: '#9D8189' }}>
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEditTransactionModal(transaction)}
                        className="p-2 rounded-md transition-all hover:bg-opacity-80"
                        style={{ backgroundColor: '#D8E2DC' }}
                        title="Editar"
                      >
                        <Pencil className="size-4" style={{ color: '#6D6875' }} />
                      </button>
                      <button
                        onClick={() => setDeleteTransaction(transaction)}
                        className="p-2 rounded-md transition-all hover:bg-opacity-80"
                        style={{ backgroundColor: '#FFCAD4' }}
                        title="Excluir"
                      >
                        <Trash2 className="size-4" style={{ color: '#6D6875' }} />
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
          <div className="flex items-center gap-8">
            <p className="text-[15px]" style={{ color: '#9D8189' }}>
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTransactions.length)} de {filteredTransactions.length} movimentações
            </p>
            <p className="text-[17px]" style={{ color: total >= 0 ? '#4CAF50' : '#F4ACB7' }}>
              <strong>Total: {formatCurrency(total)}</strong>
            </p>
          </div>
          
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

      {/* Modal de categoria */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        category={editingCategory}
      />

      {/* Modal de contraparte */}
      <CounterpartyModal
        isOpen={isCounterpartyModalOpen}
        onClose={() => {
          setIsCounterpartyModalOpen(false);
          setEditingCounterparty(null);
        }}
        onSave={editingCounterparty ? handleEditCounterparty : handleAddCounterparty}
        counterparty={editingCounterparty}
      />

      {/* Modal de transação */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={editingTransaction ? handleEditTransaction : handleAddTransaction}
        transaction={editingTransaction}
        categories={categories}
        counterparties={counterparties}
      />

      {/* Modal de listagem de categorias */}
      <CategoryListModal
        isOpen={isCategoryListModalOpen}
        onClose={() => setIsCategoryListModalOpen(false)}
        categories={categories}
        onEdit={openEditCategoryModal}
        onDelete={(category) => setDeleteCategory(category)}
      />

      {/* Modal de listagem de contrapartes */}
      <CounterpartyListModal
        isOpen={isCounterpartyListModalOpen}
        onClose={() => setIsCounterpartyListModalOpen(false)}
        counterparties={counterparties}
        onEdit={openEditCounterpartyModal}
        onDelete={(counterparty) => setDeleteCounterparty(counterparty)}
      />

      {/* Dialog de confirmação de exclusão de transação */}
      <DeleteTransactionDialog
        isOpen={!!deleteTransaction}
        onClose={() => setDeleteTransaction(null)}
        onConfirm={handleDeleteTransaction}
        transactionName={deleteTransaction?.counterpartyName || ''}
      />

      {/* Dialog de confirmação de exclusão de categoria */}
      <DeleteCategoryDialog
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDeleteCategory}
        categoryName={deleteCategory?.name || ''}
      />

      {/* Dialog de confirmação de exclusão de contraparte */}
      <DeleteCounterpartyDialog
        isOpen={!!deleteCounterparty}
        onClose={() => setDeleteCounterparty(null)}
        onConfirm={handleDeleteCounterparty}
        counterpartyName={deleteCounterparty?.name || ''}
      />
    </div>
  );
}
