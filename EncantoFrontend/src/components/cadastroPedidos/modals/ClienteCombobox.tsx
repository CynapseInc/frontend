import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, ChevronDown, Loader2, X } from 'lucide-react';
import { clienteService } from '../../../services/ClienteService';

interface EnderecoCliente {
  id?: number;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
}

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  enderecos: EnderecoCliente[];
 
}

interface ClienteComboboxProps {
  value: string;
  onChange: (id: string, name: string, enderecos: EnderecoCliente[]) => void;
  isErr?: boolean;
}

export default function ClienteCombobox({ value, onChange, isErr }: ClienteComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchCounterparties = useCallback(async (query: string) => {
    setLoading(true);
    try {
        
      const response = await clienteService.listarTodos({
        search: query || undefined,
        page: 0
      });
      console.log(response)
      setOptions(response?.content || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchCounterparties(search);
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [search, fetchCounterparties]);

  useEffect(() => {
    if (open && options.length === 0 && !search) {
      fetchCounterparties('');
    }
  }, [open, options.length, search, fetchCounterparties]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (client: Cliente) => {
    onChange(String(client.id), client.nome, client.enderecos);
    setSelectedName(client.nome);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', '', []);
    setSelectedName('');
    setSearch('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 rounded-md border text-[15px] text-left flex items-center justify-between focus:outline-none focus:border-[#F4ACB7] transition-colors"
        style={{
          backgroundColor: '#F9F9F9',
          borderColor: isErr ? '#FF6B6B' : '#D8E2DC',
          color: selectedName ? '#6D6875' : '#9D8189'
        }}
      >
        <span>{selectedName || 'Selecione um cliente...'}</span>
        <div className="flex items-center gap-2">
          {selectedName && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0 hover:opacity-70"
            >
              <X className="size-4" />
            </button>
          )}
          <ChevronDown 
            className="size-4 transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-50"
          style={{ borderColor: '#D8E2DC' }}
        >
          <div className="p-2 border-b" style={{ borderColor: '#D8E2DC' }}>
            <input
              type="text"
              placeholder="Pesquisar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-[14px] focus:outline-none focus:border-[#F4ACB7]"
              style={{
                backgroundColor: '#F9F9F9',
                borderColor: '#D8E2DC',
                color: '#6D6875'
              }}
              autoFocus
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin" style={{ color: '#F4ACB7' }} />
              </div>
            ) : options.length === 0 ? (
              <div className="py-6 text-center text-[14px]" style={{ color: '#9D8189' }}>
                Nenhum cliente encontrado
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2.5 text-left text-[14px] flex items-center justify-between hover:bg-gray-100 transition-colors border-0"
                  style={{
                    color: '#6D6875',
                    backgroundColor: value === String(option.id) ? '#F0F0F0' : 'transparent'
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium">{option.nome}</div>
                    <div className="text-[12px]" style={{ color: '#9D8189' }}>
                      {option.telefone}
                    </div>
                  </div>
                  {value === String(option.id) && (
                    <Check className="size-4 ml-2" style={{ color: '#F4ACB7' }} />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}