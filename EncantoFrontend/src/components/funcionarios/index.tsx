import { useState, useEffect } from 'react';
import { Search, Pencil, Trash2, Plus, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FeedbackModal from '../ui/FeedbackModal';
import EmployeeModal from './modals/EmployeeModal';
import DeleteConfirmDialog from './modals/DeleteConfirmDialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { funcionarioService } from '../../services/FuncionarioService';
import type { Funcionario } from '../../interfaces/Funcionario';
import './index.css';

const API_BASE_URL = 'http://localhost:8080';

const getFotoUrl = (caminho?: string) => {
  if (!caminho) return undefined;
  if (caminho.startsWith('data:image') || caminho.startsWith('http')) return caminho;
  return `${API_BASE_URL}${caminho}`;
};

export default function App() {
  const [employees, setEmployees] = useState<Funcionario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Funcionario | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Funcionario | null>(null);
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
  
  const itemsPerPage = 8;
  const filters = ['Todos', 'Administrador', 'Social Media', 'Manufatura'];

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const dados = await funcionarioService.listarTodos();
        const funcionarios = dados.content || dados || [];

        const funcionariosFormatados: Funcionario[] = funcionarios.map((usuario: any) => ({
          id: usuario.id,
          name: usuario.name, 
          email: usuario.email,
          cpf: usuario.cpf,
          dataNasc: usuario.dataNasc, 
          cargo: usuario.cargo || 'Não definido',
          foto: usuario.foto,
          status: 'Ativo' 
        }));

        setEmployees(funcionariosFormatados);
      } catch (error) {
        showFeedback('Erro ao carregar funcionários.', 'error');
      }
    };

    fetchFuncionarios();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'Todos' || emp.cargo === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleAddEmployee = async (employee: Funcionario, file?: File) => {
    try {
      const dadosBackend = {
        name: employee.name,
        cpf: employee.cpf,
        email: employee.email,
        password: employee.senha,
        dataNasc: employee.dataNasc,
        cargo: employee.cargo
      };
      
      let novoUsuario = await funcionarioService.criar(dadosBackend);

      if (file) {
        novoUsuario = await funcionarioService.uploadFoto(novoUsuario.id, file);
      }

      setEmployees([...employees, { ...novoUsuario, status: 'Ativo' }]);
      setIsModalOpen(false);
    } catch (error) {
      showFeedback('Erro ao criar funcionário.', 'error');
    }
  };

  const handleEditEmployee = async (employee: Funcionario, file?: File) => {
    try {
      const dadosBackend = {
        name: employee.name, 
        cpf: employee.cpf,
        email: employee.email,
        senha: employee.senha, 
        dataNasc: employee.dataNasc,
        cargo: employee.cargo
      };

      if (!employee.id) return;

      let usuarioAtualizado = await funcionarioService.atualizar(employee.id, dadosBackend);

      if (file) {
        usuarioAtualizado = await funcionarioService.uploadFoto(employee.id, file);
      }

      setEmployees(employees.map(emp => emp.id === employee.id ? { ...usuarioAtualizado, status: 'Ativo' } : emp));
      setIsModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      showFeedback('Erro ao atualizar funcionário.', 'error');
    }
  };

  const handleDeleteEmployee = async () => {
    if (deleteEmployee && deleteEmployee.id) {
      try {
        await funcionarioService.deletar(deleteEmployee.id);
        setEmployees(employees.filter(emp => emp.id !== deleteEmployee.id));
        setDeleteEmployee(null);
      } catch (error) {
        showFeedback('Erro ao deletar funcionário.', 'error');
      }
    }
  };

  const openEditModal = (employee: Funcionario) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="w-full max-w-[1600px] mx-auto px-8 py-10 box-border">
        
        <div className="mb-10">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Funcionários</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie toda a sua equipa num só lugar</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between gap-6 mb-5">
            <div className="flex-1 max-w-md relative">
              <Search 
                className="absolute top-1/2 -translate-y-1/2" 
                style={{ color: '#9D8189', left: '1vw', width: '1.2vw', height: '1.2vw', pointerEvents: 'none' }} 
              />
              <Input
                placeholder="Procurar por nome ou e-mail..."
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
              onClick={openAddModal}
              className="gap-2 h-11 px-6 text-[15px]"
              style={{ backgroundColor: '#F4ACB7', color: 'white' }}
            >
              <Plus className="size-5" />
              Adicionar Funcionário
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="size-4" style={{ color: '#9D8189' }} />
            <span className="text-[15px]" style={{ color: '#9D8189' }}>Filtrar por cargo:</span>
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

        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D8E2DC' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Nome</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Cargo</th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Situação</th>
                <th className="text-right px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr 
                  key={employee.id}
                  className="border-b transition-colors hover:bg-opacity-50"
                  style={{ borderColor: '#D8E2DC', backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9' }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: '#FFE5D9' }}>
                        {employee.foto ? (
                          <ImageWithFallback 
                            src={getFotoUrl(employee.foto)} 
                            alt={employee.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="text-[17px]" style={{ color: '#F4ACB7' }}>
                            {employee.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-[16px]" style={{ color: '#6D6875' }}>
                        {employee.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[15px]" style={{ color: '#9D8189' }}>
                      {employee.cargo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-[14px]"
                      style={{
                        backgroundColor: employee.status === 'Ativo' ? '#D8E2DC' : '#FFE5D9',
                        color: employee.status === 'Ativo' ? '#6D6875' : '#9D8189'
                      }}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(employee)}
                        className="p-2 rounded-md transition-all hover:bg-opacity-80"
                        style={{ backgroundColor: '#D8E2DC' }}
                        title="Editar"
                      >
                        <Pencil className="size-4" style={{ color: '#6D6875' }} />
                      </button>
                      <button
                        onClick={() => setDeleteEmployee(employee)}
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

        <div className="flex items-center justify-between mt-6">
          <p className="text-[15px]" style={{ color: '#9D8189' }}>
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredEmployees.length)} de {filteredEmployees.length} funcionários
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md text-[15px] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
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
                style={{ backgroundColor: '#F4ACB7', color: 'white', border: '1px solid #F4ACB7' }}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={editingEmployee ? handleEditEmployee : handleAddEmployee}
        employee={editingEmployee}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteEmployee}
        onClose={() => setDeleteEmployee(null)}
        onConfirm={handleDeleteEmployee}
        employeeName={deleteEmployee?.name || ''}
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
