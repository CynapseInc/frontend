import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

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

interface EnderecoComboboxProps {
  enderecos: EnderecoCliente[];
  value: string;
  onChange: (id: string) => void;
  isErr?: boolean;
}

export default function EnderecoCombobox({ enderecos, value, onChange, isErr }: EnderecoComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Atualizar selectedName quando o valor mudar
  useEffect(() => {
    if (value) {
      const endereco = enderecos.find(e => e.id?.toString() === value);
      if (endereco) {
        setSelectedName(`${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado}`);
      }
    } else {
      setSelectedName('');
    }
  }, [value, enderecos]);

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

  const handleSelect = (endereco: EnderecoCliente) => {
    onChange(endereco.id?.toString() || '');
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSelectedName('');
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
        <span className="truncate">{selectedName || 'Selecione um endereço...'}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
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
          <div className="max-h-[300px] overflow-y-auto">
            {enderecos.length === 0 ? (
              <div className="py-6 text-center text-[14px]" style={{ color: '#9D8189' }}>
                Nenhum endereço cadastrado para este cliente
              </div>
            ) : (
              enderecos.map((endereco) => (
                <button
                  key={endereco.id}
                  type="button"
                  onClick={() => handleSelect(endereco)}
                  className="w-full text-left px-3 py-2.5 hover:bg-gray-100 flex items-center justify-between border-b transition-colors last:border-b-0"
                  style={{ borderColor: '#D8E2DC' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] truncate" style={{ color: '#6D6875' }}>
                      <strong>{endereco.logradouro}, {endereco.numero}</strong>
                    </p>
                    <p className="text-[12px] truncate" style={{ color: '#9D8189' }}>
                      {endereco.bairro}, {endereco.cidade}/{endereco.estado}
                    </p>
                    {endereco.cep && (
                      <p className="text-[11px]" style={{ color: '#9D8189' }}>
                        CEP: {endereco.cep}
                      </p>
                    )}
                  </div>
                  {value === endereco.id?.toString() && (
                    <Check className="size-4 ml-2 flex-shrink-0" style={{ color: '#F4ACB7' }} />
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
