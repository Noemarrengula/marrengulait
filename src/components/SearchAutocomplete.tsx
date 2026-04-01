import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight, Smartphone, Package, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchSuggestions, useRecentSearches } from '@/hooks/useSearchSuggestions';
import { useSettings } from '@/context/SettingsContext';

interface SearchAutocompleteProps {
  className?: string;
  placeholder?: string;
  onSelect?: () => void;
}

export default function SearchAutocomplete({
  className = '',
  placeholder = 'Pesquisar produtos...',
  onSelect,
}: SearchAutocompleteProps) {
  const navigate = useNavigate();
  const { currency } = useSettings();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { suggestions, isLoading } = useSearchSuggestions(query);
  const { getRecent, addRecent, clearRecent } = useRecentSearches();
  const recentSearches = query.length < 2 ? getRecent() : [];

  const handleSelect = (value: string, suggestion?: { id: string; name: string; type: string }) => {
    setQuery('');
    setOpen(false);
    onSelect?.();
    
    if (suggestion?.type === 'product') {
      navigate(`/produto/${suggestion.id}`);
    } else if (suggestion?.type === 'category') {
      navigate(`/produtos?search=${encodeURIComponent(value)}`);
      addRecent(value);
    } else {
      navigate(`/produtos?search=${encodeURIComponent(value)}`);
      addRecent(value);
    }
  };

  const handleClearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecent();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn('relative flex-1 max-w-2xl', className)}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 bg-secondary border border-border rounded-lg 
                       focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all
                       placeholder:text-muted-foreground text-sm"
            aria-label="Search"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground pointer-events-none">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[400px] p-0 shadow-xl border-2" 
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command className="rounded-lg">
          <CommandList className="max-h-[400px]">
            {isLoading && query.length >= 2 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              {query.length < 2 
                ? 'Digite pelo menos 2 caracteres para buscar...' 
                : 'Nenhum resultado encontrado'}
            </CommandEmpty>

            {recentSearches.length > 0 && query.length < 2 && (
              <CommandGroup heading="Pesquisas Recentes">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-muted-foreground">Clique para buscar novamente</span>
                  <button 
                    onClick={handleClearRecent}
                    className="text-xs text-primary hover:underline"
                  >
                    Limpar
                  </button>
                </div>
                {recentSearches.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={(val) => handleSelect(val, item)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{item.name}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {suggestions.filter(s => s.type === 'category').length > 0 && (
              <CommandGroup heading="Categorias">
                {suggestions
                  .filter(s => s.type === 'category')
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={(val) => handleSelect(val, item)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Package className="h-4 w-4 text-primary" />
                      <span className="flex-1">{item.name}</span>
                      <span className="text-xs text-muted-foreground">Categoria</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {suggestions.filter(s => s.type === 'product').length > 0 && (
              <CommandGroup heading="Produtos">
                {suggestions
                  .filter(s => s.type === 'product')
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={(val) => handleSelect(val, item)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt="" 
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col">
                        <span className="line-clamp-1">{item.name}</span>
                        {item.category && (
                          <span className="text-xs text-muted-foreground">{item.category}</span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-[#FF3131]">
                        {item.price.toLocaleString()} {currency}
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {suggestions.length > 0 && query.length >= 2 && (
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-sm"
                  onClick={() => handleSelect(query)}
                >
                  Ver todos resultados para "{query}"
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
