import { useState } from 'react';
import { Search, Pencil, Trash2, Plus, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import EmployeeModal from './modals/EmployeeModal';
import DeleteConfirmDialog from './modals/DeleteConfirmDialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import './index.css'

interface Employee {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  email: string;
  password: string;
  position: string;
  status: 'Ativo' | 'Inativo';
  image?: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ana Carolina Silva',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    email: 'ana.silva@email.com',
    password: '12345678',
    position: 'Social Media',
    status: 'Ativo',
  },
  {
    id: '2',
    name: 'Bruno Santos Oliveira',
    cpf: '987.654.321-00',
    birthDate: '1988-08-22',
    email: 'bruno.oliveira@email.com',
    password: '12345678',
    position: 'Produção',
    status: 'Ativo',
  },
  {
    id: '3',
    name: 'Camila Rodrigues Costa',
    cpf: '456.789.123-00',
    birthDate: '1992-03-10',
    email: 'camila.costa@email.com',
    password: '12345678',
    position: 'Costura',
    status: 'Ativo',
  },
  {
    id: '4',
    name: 'Daniel Ferreira Lima',
    cpf: '321.654.987-00',
    birthDate: '1985-11-30',
    email: 'daniel.lima@email.com',
    password: '12345678',
    position: 'Social Media',
    status: 'Inativo',
  },
  {
    id: '5',
    name: 'Eduarda Martins Souza',
    cpf: '789.123.456-00',
    birthDate: '1995-07-18',
    email: 'eduarda.souza@email.com',
    password: '12345678',
    position: 'Produção',
    status: 'Ativo',
  },
  {
    id: '6',
    name: 'Felipe Alves Pereira',
    cpf: '654.321.987-00',
    birthDate: '1987-09-25',
    email: 'felipe.pereira@email.com',
    password: '12345678',
    position: 'Costura',
    status: 'Ativo',
  },
  {
    id: '7',
    name: 'Gabriela Fernandes Dias',
    cpf: '147.258.369-00',
    birthDate: '1993-12-05',
    email: 'gabriela.dias@email.com',
    password: '12345678',
    position: 'Social Media',
    status: 'Ativo',
  },
  {
    id: '8',
    name: 'Henrique Castro Ribeiro',
    cpf: '963.852.741-00',
    birthDate: '1991-04-14',
    email: 'henrique.ribeiro@email.com',
    password: '12345678',
    position: 'Produção',
    status: 'Ativo',
  },
];

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  
  const itemsPerPage = 8;
  const filters = ['Todos', 'Produção', 'Social Media', 'Costura'];

  // Filtrar funcionários
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'Todos' || emp.position === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Paginação
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleAddEmployee = (employee: Employee) => {
    setEmployees([...employees, { ...employee, id: Date.now().toString(), status: 'Ativo' }]);
    setIsModalOpen(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEmployees(employees.map(emp => emp.id === employee.id ? employee : emp));
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = () => {
    if (deleteEmployee) {
      setEmployees(employees.filter(emp => emp.id !== deleteEmployee.id));
      setDeleteEmployee(null);
    }
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Navbar */}
      

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        
        {/* Cabeçalho */}
        <div className="mb-10">
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Funcionários</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Gerencie toda sua equipe em um só lugar</p>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between gap-6 mb-5">
            {/* Pesquisa */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-11 text-[15px]"
                style={{ 
                  borderColor: '#D8E2DC',
                  backgroundColor: '#F9F9F9',
                  color: '#6D6875'
                }}
              />
            </div>
            
            {/* Botão Adicionar */}
            <Button 
              onClick={openAddModal}
              className="gap-2 h-11 px-6 text-[15px]"
              style={{ backgroundColor: '#F4ACB7', color: 'white' }}
            >
              <Plus className="size-5" />
              Adicionar Funcionário
            </Button>
          </div>

          {/* Filtros */}
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

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D8E2DC' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FFE5D9', borderBottom: '1px solid #D8E2DC' }}>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Nome
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Cargo
                </th>
                <th className="text-left px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Situação
                </th>
                <th className="text-right px-6 py-4 text-[16px]" style={{ color: '#6D6875' }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr 
                  key={employee.id}
                  className="border-b transition-colors hover:bg-opacity-50"
                  style={{ 
                    borderColor: '#D8E2DC',
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="size-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ backgroundColor: '#FFE5D9' }}
                      >
                        {employee.image ? (
                          <ImageWithFallback 
                            src={employee.image} 
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
                      {employee.position}
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

        {/* Informação de paginação e controles */}
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

      {/* Modal de adicionar/editar */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={editingEmployee ? handleEditEmployee : handleAddEmployee}
        employee={editingEmployee}
      />

      {/* Dialog de confirmação de exclusão */}
      <DeleteConfirmDialog
        isOpen={!!deleteEmployee}
        onClose={() => setDeleteEmployee(null)}
        onConfirm={handleDeleteEmployee}
        employeeName={deleteEmployee?.name || ''}
      />
    </div>
  );
}