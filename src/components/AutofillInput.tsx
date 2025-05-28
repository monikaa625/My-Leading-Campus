import React, { useState, useRef, useEffect } from 'react';
import { Item } from './../data/dummyData';

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return (
    <span>
      {text.split(regex).map((part, i) =>
        regex.test(part) ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
      )}
    </span>
  );
} 


type Props = {
  data: Item[];
  placeholder?: string;
  onSelect?: (item: Item) => void;
};

const AutofillInput: React.FC<Props> = ({ data, placeholder = 'Search...', onSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [filtered, setFiltered] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputValue.trim()) setFiltered([]);
    else setFiltered(data.filter(i => i.name.toLowerCase().includes(inputValue.toLowerCase())));
  }, [inputValue, data]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(inputRef.current && inputRef.current.contains(e.target as Node))) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        value={inputValue}
        onChange={e => { setInputValue(e.target.value); setOpen(true); setHighlight(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={e => {
          if (!open || !filtered.length) return;
          if (e.key === 'ArrowDown') setHighlight(h => h < filtered.length - 1 ? h + 1 : 0);
          if (e.key === 'ArrowUp') setHighlight(h => h > 0 ? h - 1 : filtered.length - 1);
          if (e.key === 'Enter' && highlight >= 0) {
            setInputValue(filtered[highlight].name);
            setOpen(false);
            setFiltered([]);
            onSelect?.(filtered[highlight]);
          }
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder={placeholder}
        className="w-full py-2 pl-3 pr-10 border rounded"
        autoComplete="off"
      />
      {inputValue && (
        <button onClick={() => { setInputValue(''); setFiltered([]); setOpen(false); inputRef.current?.focus(); }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          ×
        </button>
      )}
      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            <ul>
              {filtered.map((item, i) => (
                <li key={item.id}
                  onMouseDown={() => {
                    setInputValue(item.name);
                    setOpen(false);
                    setFiltered([]);
                    onSelect?.(item);
                  }}
                  className={`px-4 py-2 cursor-pointer ${i === highlight ? 'bg-blue-50' : ''}`}>
                  <HighlightMatch text={item.name} query={inputValue} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-red-500">No data matched</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutofillInput;