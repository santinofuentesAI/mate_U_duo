import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ChoiceOption {
  value: string;
  label: string;
}

export function ChoiceChips({ name, value, options, onChange }: { name: string; value: string; options: ChoiceOption[]; onChange: (value: string) => void }) {
  return (
    <div className="week-topic-chips" role="radiogroup" aria-label={name}>
      {options.map(option => (
        <button key={option.value} type="button" role="radio" aria-checked={option.value === value} className={option.value === value ? 'selected' : ''} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ChoiceList({ label, name, value, options, onChange, layout = 'chips' }: { label: string; name: string; value: string; options: ChoiceOption[]; onChange: (value: string) => void; layout?: 'chips' | 'list' }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const current = options.find(option => option.value === value);
  return (
    <div className={`in-app-choice${open ? ' open' : ''}`}>
      <span className="in-app-choice-label">{label}</span>
      <button type="button" className="in-app-choice-trigger" aria-label={name} aria-expanded={open} aria-controls={listId} onClick={() => setOpen(prev => !prev)}>
        <b>{current?.label ?? 'Elegir'}</b>
        <ChevronDown size={18} aria-hidden="true"/>
      </button>
      {open && (
        <div id={listId} className={layout === 'list' ? 'in-app-option-list' : 'week-topic-chips in-app-options'} role="listbox" aria-label={name}>
          {options.map(option => (
            <button key={option.value} type="button" role="option" data-value={option.value} aria-selected={option.value === value} className={option.value === value ? 'selected' : ''} onClick={() => { onChange(option.value); setOpen(false); }}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Fold({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className={`in-app-fold${open ? ' open' : ''} ${className}`.trim()}>
      <button type="button" className="in-app-fold-trigger" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(prev => !prev)}>
        <span>{title}</span>
        <ChevronDown size={18} aria-hidden="true"/>
      </button>
      {open && <div id={panelId} className="in-app-fold-panel">{children}</div>}
    </div>
  );
}
