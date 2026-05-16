import React, { useState } from 'react';
import { Heart, Lock, Mail, Eye, EyeOff, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EncantoLogo from '../../assets/logoEncanto.png';
import api from '../../provider/api';
import './index.css';

export default function App() {
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // NOVA LÓGICA: Só verifica o token quando o usuário clica em "Conectar"
  const handleConnectClick = () => {
    const token = localStorage.getItem('encanto_token') || sessionStorage.getItem('encanto_token');
    
    if (token) {
      // Se já tem token, entra direto
      navigate('/home');
    } else {
      // Se não tem, revela o formulário de login
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor, digite seu e-mail');
      return;
    }
    if (!password) {
      setError('Por favor, digite sua senha');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/login', {
        email: email,
        password: password,
        rememberMe: rememberMe
      });

      const data = response.data;
      
      const userData = JSON.stringify({
         id: data.userId,
         nome: data.nome || 'Administrador', 
         email: data.email || email,
         cargo: data.cargo || 'Administrador',
         foto: data.foto
      });

      // LÓGICA DO STORAGE: Decide onde salvar com base no "Lembrar-me"
      if (rememberMe) {
        localStorage.setItem('encanto_token', data.token);
        localStorage.setItem('encanto_user', userData);
        sessionStorage.removeItem('encanto_token');
        sessionStorage.removeItem('encanto_user');
      } else {
        sessionStorage.setItem('encanto_token', data.token);
        sessionStorage.setItem('encanto_user', userData);
        localStorage.removeItem('encanto_token');
        localStorage.removeItem('encanto_user');
      }
      
      setTimeout(() => {
          navigate('/home');
      }, 1000); 

    } catch (err: any) {
      console.error('Erro interno:', err); 

      if (err.response) {
        if (err.response.status === 401 || err.response.status === 404) {
          setError('E-mail ou senha incorretos.');
        } else if (err.response.status === 403) {
          setError('Você não tem permissão para acessar esta área.');
        } else {
          setError('Ocorreu um problema no sistema. Tente novamente.');
        }
      } else if (err.request) {
        setError('Não foi possível conectar ao sistema. Verifique sua conexão ou tente novamente em instantes.');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#FFE5D9] via-[#F9F9F9] to-[#D8E2DC] flex items-center justify-center p-4 relative overflow-x-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFCAD4] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#F4ACB7] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#FFE5D9] rounded-full opacity-30 blur-2xl"></div>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#D8E2DC] p-8 md:p-12 transition-all duration-500 ease-in-out">
          
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img src={EncantoLogo} alt="Encanto Logo" className="w-50 h-24" />
          </div>

          {!showForm ? (
            // VISÃO 1: Botão Conectar (Escondendo o formulário)
            <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="text-center mb-4">
                <h2 className="text-[#6D6875] text-xl font-medium mb-2">Bem-vindo de volta!</h2>
                <p className="text-[#9D8189]">Acesse a área administrativa para gerenciar a Encanto.</p>
              </div>
              
              <button
                // Alterado para chamar a nova função que verifica o token
                onClick={handleConnectClick}
                className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 font-medium"
              >
                <LogIn className="w-5 h-5" />
                Conectar
              </button>
            </div>
          ) : (
            // VISÃO 2: O Formulário de Login (Revelado)
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-6">
                <h2 className="text-[#6D6875] mb-2 font-medium">Área do Administrador</h2>
                <p className="text-[#9D8189] text-sm">Entre com suas credenciais</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-[#6D6875] mb-2 font-medium">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9D8189]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none transition-colors bg-white text-[#6D6875] placeholder:text-[#9D8189]/50"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-[#6D6875] mb-2 font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9D8189]">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 border-2 border-[#D8E2DC] rounded-xl focus:border-[#F4ACB7] focus:outline-none transition-colors bg-white text-[#6D6875]"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9D8189] hover:text-[#F4ACB7] transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          rememberMe
                            ? 'bg-[#F4ACB7] border-[#F4ACB7]'
                            : 'bg-white border-[#D8E2DC] group-hover:border-[#F4ACB7]'
                        }`}
                      >
                        {rememberMe && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-[#6D6875] text-sm select-none">Lembrar-me</span>
                  </label>

                  <button
                    type="button"
                    className="text-[#F4ACB7] text-sm hover:underline transition-all font-medium"
                    disabled={isLoading}
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-4 rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg mt-8 font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Entrar
                    </>
                  )}
                </button>
                
                {/* Botão de voltar, caso o usuário desista de logar */}
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full text-[#9D8189] text-sm mt-4 hover:text-[#6D6875] transition-colors"
                  disabled={isLoading}
                >
                  Voltar
                </button>
              </form>
            </div>
          )}

          <div className="mt-8 pt-6 border-t-2 border-[#D8E2DC] text-center">
            <p className="text-[#9D8189] text-sm">
              Acesso exclusivo para administradores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}