import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Question } from './types';

interface Props {
  question: Question;
  sets: { label: string; color: string }[];
  operation: string;
  correctRegions: string[];
  onComplete: (correct: boolean) => void;
}

export function InteractiveVennExercise({ question, sets, operation, correctRegions, onComplete }: Props) {
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const regions = sets.length === 2 
    ? ['A-only', 'AB', 'B-only', 'neither']
    : ['A-only', 'AB', 'B-only', 'AC', 'ABC', 'BC', 'C-only', 'neither'];

  const regionLabels: Record<string, string> = {
    'A-only': 'Solo A',
    'B-only': 'Solo B',
    'C-only': 'Solo C',
    'AB': 'A ∩ B',
    'AC': 'A ∩ C',
    'BC': 'B ∩ C',
    'ABC': 'A ∩ B ∩ C',
    'neither': 'Fuera de todos'
  };

  const toggleRegion = (region: string) => {
    if (submitted) return;
    
    setSelectedRegions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(region)) {
        newSet.delete(region);
      } else {
        newSet.add(region);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    const correct = correctRegions.length === selectedRegions.size &&
      correctRegions.every(r => selectedRegions.has(r));
    
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onComplete(correct), correct ? 800 : 2000);
  };

  return (
    <div className="interactive-venn-exercise">
      <div className="exercise-header">
        <h3>{question.prompt}</h3>
        <p className="exercise-instructions">
          Selecciona las regiones que corresponden a: <code>{operation}</code>
        </p>
      </div>

      <div className="venn-diagram-container">
        <svg viewBox="0 0 400 300" className="venn-svg">
          <defs>
            {sets.map((set, i) => (
              <pattern
                key={i}
                id={`pattern-${i}`}
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
              >
                <path
                  d="M0,0 L8,8 M8,0 L0,8"
                  stroke={set.color}
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
            ))}
          </defs>

          {sets.length === 2 ? (
            <>
              <circle
                cx="140"
                cy="150"
                r="80"
                fill={sets[0].color}
                opacity="0.2"
                stroke={sets[0].color}
                strokeWidth="2"
              />
              <circle
                cx="260"
                cy="150"
                r="80"
                fill={sets[1].color}
                opacity="0.2"
                stroke={sets[1].color}
                strokeWidth="2"
              />
              <text x="110" y="100" fontSize="24" fontWeight="bold" fill={sets[0].color}>
                {sets[0].label}
              </text>
              <text x="270" y="100" fontSize="24" fontWeight="bold" fill={sets[1].color}>
                {sets[1].label}
              </text>
            </>
          ) : (
            <>
              <circle cx="150" cy="130" r="70" fill={sets[0].color} opacity="0.15" stroke={sets[0].color} strokeWidth="2"/>
              <circle cx="250" cy="130" r="70" fill={sets[1].color} opacity="0.15" stroke={sets[1].color} strokeWidth="2"/>
              <circle cx="200" cy="190" r="70" fill={sets[2].color} opacity="0.15" stroke={sets[2].color} strokeWidth="2"/>
              <text x="130" y="80" fontSize="20" fontWeight="bold" fill={sets[0].color}>{sets[0].label}</text>
              <text x="250" y="80" fontSize="20" fontWeight="bold" fill={sets[1].color}>{sets[1].label}</text>
              <text x="190" y="250" fontSize="20" fontWeight="bold" fill={sets[2].color}>{sets[2].label}</text>
            </>
          )}
        </svg>
      </div>

      <div className="region-selector">
        <b>Selecciona las regiones:</b>
        <div className="region-buttons">
          {regions.map(region => (
            <button
              key={region}
              className={`region-button ${selectedRegions.has(region) ? 'selected' : ''}`}
              onClick={() => toggleRegion(region)}
              disabled={submitted}
            >
              {regionLabels[region]}
              {selectedRegions.has(region) && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {!submitted && (
        <button className="button primary" onClick={handleSubmit} disabled={selectedRegions.size === 0}>
          Verificar selección
          <Check size={18} />
        </button>
      )}

      {submitted && (
        <div className={`venn-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <>
              <Check size={20} />
              ¡Correcto! Has identificado todas las regiones de {operation}.
            </>
          ) : (
            <>
              <X size={20} />
              Las regiones seleccionadas no corresponden a {operation}. Revisa la operación.
            </>
          )}
        </div>
      )}
    </div>
  );
}
