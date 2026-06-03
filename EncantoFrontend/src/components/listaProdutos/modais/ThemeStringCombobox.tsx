import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import {temaService} from '../../../services/TemaService';

interface ProductTheme {
  id: string;
  description: string;
}

interface ThemeComboboxProps {
  value: string;
  onChange: (value: string) => void;
  themes: string[];
  isErr?: boolean;
}

export default function ThemeCombobox({ value, onChange, themes, isErr }: ThemeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const searchTimeoutRef = useRef<number | null>(null);
  const [filteredThemes, setFilteredThemes] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const selected = themes.find(theme => theme === value);
      if (selected) {
        setSelectedName(selected);
      }
    } else {
      setSelectedName('');
    }
  }, [value, themes]);

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

  useEffect(() => {
        
          
          if(searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
          }
    
          searchTimeoutRef.current = window.setTimeout(async () => {
    
          try {
            const data = await temaService.listarTodos({ search: search });
            
            
            // mapear os nomes da resposta para o formato esperado
            
            const mappedThemes = data.content.map((item: any) => item.descricao);
           
            setFilteredThemes(mappedThemes);
          } catch (error) {
            console.error('Erro ao buscar temas:', error);
          }
        },
        500)
       
        
      }, [search])

  const handleSelect = (theme: string) => {
    onChange(theme);
    setSelectedName(theme);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
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
        <span>{selectedName || 'Selecione um tema...'}</span>
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
              placeholder="Pesquisar tema..."
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
            {filteredThemes.length === 0 ? (
              <div className="py-6 text-center text-[14px]" style={{ color: '#9D8189' }}>
                Nenhum tema encontrado
              </div>
            ) : (
              filteredThemes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => handleSelect(theme)}
                  className="w-full px-4 py-2.5 text-left text-[14px] flex items-center justify-between hover:bg-gray-100 transition-colors border-0"
                  style={{
                    color: '#6D6875',
                    backgroundColor: value === theme ? '#F0F0F0' : 'transparent'
                  }}
                >
                  <div className="flex-1">
                    {theme}
                  </div>
                  {value === theme && (
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
