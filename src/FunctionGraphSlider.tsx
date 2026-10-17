import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Question } from './types';

interface Props {
  question: Question;
  functionType: 'quadratic' | 'linear' | 'cubic' | 'rational';
  targetParams: { a: number; b: number; c: number; d?: number };
  tolerance: number;
  onComplete: (correct: boolean) => void;
}

export function FunctionGraphSlider({ question, functionType, targetParams, tolerance, onComplete }: Props) {
  const [params, setParams] = useState({ a: 1, b: 0, c: 0, d: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const updateParam = (key: 'a' | 'b' | 'c' | 'd', value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const evaluateFunction = (x: number): number => {
    switch (functionType) {
      case 'linear':
        return params.a * x + params.b;
      case 'quadratic':
        return params.a * x * x + params.b * x + params.c;
      case 'cubic':
        return params.a * x * x * x + params.b * x * x + params.c * x + params.d;
      case 'rational':
        return (params.a * x + params.b) / (params.c * x + params.d || 1);
      default:
        return 0;
    }
  };

  const generatePath = (): string => {
    const points: [number, number][] = [];
    const xMin = -10, xMax = 10, step = 0.2;
    
    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateFunction(x);
      if (isFinite(y) && Math.abs(y) < 50) {
        const screenX = 200 + x * 20;
        const screenY = 200 - y * 20;
        points.push([screenX, screenY]);
      }
    }
    
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  };

  const handleSubmit = () => {
    const aMatch = Math.abs(params.a - targetParams.a) <= tolerance;
    const bMatch = Math.abs(params.b - targetParams.b) <= tolerance;
    const cMatch = Math.abs(params.c - targetParams.c) <= tolerance;
    const dMatch = targetParams.d === undefined || Math.abs(params.d - (targetParams.d || 0)) <= tolerance;
    
    const correct = aMatch && bMatch && cMatch && dMatch;
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onComplete(correct), correct ? 800 : 2000);
  };

  const getFunctionDisplay = () => {
    switch (functionType) {
      case 'linear':
        return `f(x) = ${params.a.toFixed(1)}x + ${params.b.toFixed(1)}`;
      case 'quadratic':
        return `f(x) = ${params.a.toFixed(1)}x² + ${params.b.toFixed(1)}x + ${params.c.toFixed(1)}`;
      case 'cubic':
        return `f(x) = ${params.a.toFixed(1)}x³ + ${params.b.toFixed(1)}x² + ${params.c.toFixed(1)}x + ${params.d.toFixed(1)}`;
      case 'rational':
        return `f(x) = (${params.a.toFixed(1)}x + ${params.b.toFixed(1)}) / (${params.c.toFixed(1)}x + ${params.d.toFixed(1)})`;
      default:
        return '';
    }
  };

  return (
    <div className="function-graph-slider">
      <div className="exercise-header">
        <h3>{question.prompt}</h3>
        <p className="exercise-instructions">
          Ajusta los parámetros hasta que la gráfica coincida con la función objetivo.
        </p>
      </div>

      <div className="function-display">
        <code>{getFunctionDisplay()}</code>
      </div>

      <div className="graph-container">
        <svg viewBox="0 0 400 400" className="coordinate-plane">
          <line x1="0" y1="200" x2="400" y2="200" stroke="#ccc" strokeWidth="1" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="#ccc" strokeWidth="1" />
          
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map(n => (
            <g key={n}>
              <line x1={200 + n * 40} y1="195" x2={200 + n * 40} y2="205" stroke="#999" strokeWidth="1" />
              <text x={200 + n * 40} y="220" fontSize="10" textAnchor="middle" fill="#666">{n}</text>
              <line x1="195" y1={200 - n * 40} x2="205" y2={200 - n * 40} stroke="#999" strokeWidth="1" />
              <text x="185" y={205 - n * 40} fontSize="10" textAnchor="end" fill="#666">{n}</text>
            </g>
          ))}
          
          <path d={generatePath()} fill="none" stroke="var(--purple)" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="parameter-sliders">
        <div className="slider-control">
          <label>
            <b>a</b>: {params.a.toFixed(2)}
          </label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={params.a}
            onChange={e => updateParam('a', parseFloat(e.target.value))}
            disabled={submitted}
          />
        </div>

        <div className="slider-control">
          <label>
            <b>b</b>: {params.b.toFixed(2)}
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={params.b}
            onChange={e => updateParam('b', parseFloat(e.target.value))}
            disabled={submitted}
          />
        </div>

        {(functionType === 'quadratic' || functionType === 'cubic' || functionType === 'rational') && (
          <div className="slider-control">
            <label>
              <b>c</b>: {params.c.toFixed(2)}
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={params.c}
              onChange={e => updateParam('c', parseFloat(e.target.value))}
              disabled={submitted}
            />
          </div>
        )}

        {(functionType === 'cubic' || functionType === 'rational') && (
          <div className="slider-control">
            <label>
              <b>d</b>: {params.d.toFixed(2)}
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={params.d}
              onChange={e => updateParam('d', parseFloat(e.target.value))}
              disabled={submitted}
            />
          </div>
        )}
      </div>

      {!submitted && (
        <button className="button primary" onClick={handleSubmit}>
          Verificar parámetros
          <Check size={18} />
        </button>
      )}

      {submitted && (
        <div className={`graph-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <>
              <Check size={20} />
              ¡Correcto! Los parámetros coinciden con la función objetivo.
            </>
          ) : (
            <>
              <X size={20} />
              Los parámetros no son correctos. Ajusta los valores y observa la gráfica.
            </>
          )}
        </div>
      )}
    </div>
  );
}
