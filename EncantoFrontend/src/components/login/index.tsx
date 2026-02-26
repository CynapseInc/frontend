import React, { useState } from 'react';
import { Heart, Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import './index.css'

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email) {
      setError('Por favor, digite seu e-mail');
      return;
    }
    
    if (!password) {
      setError('Por favor, digite sua senha');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, digite um e-mail válido');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Here you would validate credentials
      console.log('Login attempt:', { email, password, rememberMe });
      // For demo: show error if not admin@encanto.com
      if (email !== 'admin@encanto.com' || password !== 'admin123') {
        setError('E-mail ou senha incorretos');
      } else {
        alert('Login realizado com sucesso!');
      }
    }, 1500);
  };

  return (
    <div  className="border min-h-screen w-full   bg-gradient-to-br from-[#FFE5D9] via-[#F9F9F9] to-[#D8E2DC] flex items-center justify-center p-4 relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFCAD4] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#F4ACB7] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#FFE5D9] rounded-full opacity-30 blur-2xl"></div>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#D8E2DC] p-8 md:p-12">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFCAD4] to-[#F4ACB7] rounded-3xl flex items-center justify-center shadow-xl mb-4 transform hover:scale-105 transition-transform">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <h1 className="text-[#F4ACB7] text-center mb-1">Encanto</h1>
            <p className="text-[#9D8189] text-center">Personalizados</p>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-[#6D6875] mb-2">Área do Administrador</h2>
            <p className="text-[#9D8189]">Entre com suas credenciais</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#6D6875] mb-2">
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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[#6D6875] mb-2">
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

            {/* Remember Me & Forgot Password */}
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
                className="text-[#F4ACB7] text-sm hover:underline transition-all"
                disabled={isLoading}
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#F4ACB7] to-[#FFCAD4] text-white py-4 rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg mt-8"
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
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-[#D8E2DC] text-center">
            <p className="text-[#9D8189] text-sm">
              Acesso exclusivo para administradores
            </p>
          </div>
        </div>

        {/* Info Card - Demo Credentials */}
        <div className="mt-6 bg-gradient-to-br from-[#FFCAD4]/10 to-[#FFE5D9]/30 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#FFCAD4]/30">
          <p className="text-[#6D6875] text-sm text-center mb-2">
            <strong>Demo:</strong> Use as credenciais para teste
          </p>
          <div className="text-[#9D8189] text-xs text-center space-y-1">
            <p>E-mail: <span className="text-[#F4ACB7]">admin@encanto.com</span></p>
            <p>Senha: <span className="text-[#F4ACB7]">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
    
  );
}
