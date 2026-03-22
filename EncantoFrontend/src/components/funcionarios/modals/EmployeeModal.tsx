import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X, Upload } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import type { Funcionario } from '../../../interfaces/Funcionario'; // Importando a interface correta

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Funcionario) => void;
  employee?: Funcionario | null;
}

export default function EmployeeModal({ isOpen, onClose, onSave, employee }: EmployeeModalProps) {
  // Atualizando os campos para bater com a interface Funcionario
  const [formData, setFormData] = useState<Partial<Funcionario>>({
    name: '',
    cpf: '',
    dataNasc: '', 
    email: '',
    senha: '', 
    cargo: 'Social Media', 
    status: 'Ativo',
    foto: undefined, 
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      // Backend geralmente não devolve a senha, então deixamos vazio na edição até que ele digite uma nova
      setConfirmPassword(''); 
    } else {
      setFormData({
        name: '',
        cpf: '',
        dataNasc: '',
        email: '',
        senha: '',
        cargo: 'Social Media',
        status: 'Ativo',
        foto: undefined,
      });
      setConfirmPassword('');
    }
    setPasswordError('');
  }, [employee, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result as string }); // Atualizado para 'foto'
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senhas
    if (formData.senha !== confirmPassword) { // Atualizado para 'senha'
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    // Na edição, a senha pode ser opcional. Na criação, é obrigatória.
    const isEditing = !!employee?.id;
    const hasRequiredFields = formData.name && formData.cpf && formData.email;
    const hasPasswordIfNew = isEditing || formData.senha;
    
    if (hasRequiredFields && hasPasswordIfNew) {
      onSave(formData as Funcionario);
      setFormData({
        name: '',
        cpf: '',
        dataNasc: '',
        email: '',
        senha: '',
        cargo: 'Social Media',
        status: 'Ativo',
        foto: undefined,
      });
      setConfirmPassword('');
      setPasswordError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[800px] p-0 gap-0 [&>button]:hidden"
        style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}
      >
        <DialogTitle className="sr-only">
          {employee ? 'Editar funcionário' : 'Adicionar funcionário'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados do funcionário
        </DialogDescription>
        
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#6D6875' }}>
              {employee ? 'Editar Funcionário' : 'Adicionar Funcionário'}
            </h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: '#9D8189' }}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6">
            {/* Upload de imagem */}
            <div className="mb-6 flex justify-center">
              <label 
                htmlFor="image-upload"
                className="cursor-pointer group"
              >
                <div className="flex flex-col items-center">
                  <div 
                    className="size-28 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all group-hover:border-[#F4ACB7]"
                    style={{ 
                      backgroundColor: '#FFE5D9',
                      borderColor: formData.foto ? '#F4ACB7' : '#D8E2DC' // Atualizado para 'foto'
                    }}
                  >
                    {formData.foto ? ( // Atualizado para 'foto'
                      <ImageWithFallback 
                        src={formData.foto} 
                        alt="Preview" 
                        className="size-full object-cover"
                      />
                    ) : (
                      <Upload className="size-10" style={{ color: '#F4ACB7' }} />
                    )}
                  </div>
                  <span className="mt-2 text-[14px]" style={{ color: '#9D8189' }}>
                    {formData.foto ? 'Alterar foto' : 'Adicionar foto'} 
                  </span>
                </div>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {/* Nome completo */}
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Nome completo
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              {/* CPF */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  CPF
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              {/* Data de nascimento */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Data de nascimento
                </label>
                <input
                  type="date"
                  value={formData.dataNasc} // Atualizado para 'dataNasc'
                  onChange={(e) => setFormData({ ...formData, dataNasc: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>

              {/* Cargo */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Cargo
                </label>
                <select
                  value={formData.cargo} // Atualizado para 'cargo'
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Manufatura">Manufatura</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>

              {/* Senha */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  {employee ? 'Nova Senha (opcional)' : 'Senha'}
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.senha} // Atualizado para 'senha'
                  onChange={(e) => {
                    setFormData({ ...formData, senha: e.target.value });
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: passwordError ? '#F4ACB7' : '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required={!employee} // Obrigatório apenas se estiver criando um novo
                />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Confirmar senha
                </label>
                <input
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: passwordError ? '#F4ACB7' : '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required={!employee || !!formData.senha} // Obrigatório se for novo ou se tiver preenchido a nova senha
                />
              </div>

              {/* Situação */}
              <div className="col-span-2">
                <label className="block mb-2 text-[15px]" style={{ color: '#6D6875' }}>
                  Situação
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Inativo' })}
                  className="w-full px-4 py-2.5 rounded-md border text-[15px] focus:outline-none focus:border-[#F4ACB7] transition-colors"
                  style={{ 
                    backgroundColor: '#F9F9F9', 
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Mensagem de erro */}
              {passwordError && (
                <div className="col-span-2">
                  <p className="text-[14px]" style={{ color: '#F4ACB7' }}>
                    {passwordError}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer com botões */}
          <div className="px-8 py-5 border-t flex justify-end gap-3" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-md text-[15px] border transition-all hover:bg-white"
              style={{
                backgroundColor: 'white',
                borderColor: '#D8E2DC',
                color: '#9D8189'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-md text-[15px] text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#F4ACB7' }}
            >
              {employee ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}