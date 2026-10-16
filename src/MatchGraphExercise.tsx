import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Question } from './types';

interface GraphOption {
  id: string;
  equation: string;
  points: [number, number][];
}

interface Props {
  question: Question;
  graphs: GraphOption[];
  correctMatches: Record<string, string>;
  onComplete: (correct: boolean) => void;
}

export function MatchGraphExercise({ question, graphs, correctMatches, onComplete }: Props) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const equations = Object.values(correctMatches);
  const availableEquations = equations.filter(eq => !Object.values(matches).includes(eq));

  const selectEquation = (graphId: string, equation: string) => {
    setMatches(prev => ({ ...prev, [graphId]: equation }));
  };

  const clearMatch = (graphId: string) => {
    setMatches(prev => {
      const newMatches = { ...prev };
      delete newMatches[graphId];
      return newMatches;
    });
  };

  const handleSubmit = () => {
    const correct = Object.keys(correctMatches).every(
      graphId => matches[graphId] === correctMatches[graphId]
    );
    
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onComplete(correct), correct ? 800 : 2000);
  };

  const renderGraph = (graph: GraphOption) => {
    const xMin = -10, xMax = 10, yMin = -10, yMax = 10;
    const width = 180, height = 180;
    const scaleX = width / (xMax - xMin);
    const scaleY = height / (yMax - yMin);
    
    const toScreen = (x: number, y: number): [number, number] => [
      (x - xMin) * scaleX,
      height - (y - yMin) * scaleY
    ];

    const pathData = graph.points
      .map((pt, i) => {
        const [sx, sy] = toScreen(pt[0], pt[1]);
        return `${i === 0 ? 'M' : 'L'} ${sx} ${sy}`;
      })
      .join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="mini-graph">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#ddd" strokeWidth="1" />
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#ddd" strokeWidth="1" />
        {graph.points.length > 0 && (
          <path d={pathData} fill="none" stroke="var(--purple)" strokeWidth="2" />
        )}
      </svg>
    );
  };

  return (
    <div className="match-graph-exercise">
      <div className="exercise-header">
        <h3>{question.prompt}</h3>
        <p className="exercise-instructions">
          Relaciona cada gráfica con su ecuación correspondiente.
        </p>
      </div>

      <div className="available-equations">
        <b>Ecuaciones disponibles:</b>
        <div className="equation-chips">
          {availableEquations.map((eq, i) => (
            <div key={i} className="equation-chip">
              <code>{eq}</code>
            </div>
          ))}
          {availableEquations.length === 0 && (
            <p className="all-assigned">Todas asignadas</p>
          )}
        </div>
      </div>

      <div className="graphs-grid">
        {graphs.map(graph => (
          <div key={graph.id} className="graph-card">
            <div className="graph-visual">
              {renderGraph(graph)}
            </div>
            
            <div className="graph-match-controls">
              {matches[graph.id] ? (
                <div className="matched-equation">
                  <code>{matches[graph.id]}</code>
                  {!submitted && (
                    <button
                      className="clear-match-btn"
                      onClick={() => clearMatch(graph.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <select
                  className="equation-select"
                  value=""
                  onChange={e => selectEquation(graph.id, e.target.value)}
                  disabled={submitted || availableEquations.length === 0}
                >
                  <option value="">Selecciona ecuación</option>
                  {availableEquations.map((eq, i) => (
                    <option key={i} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {!submitted && Object.keys(matches).length === graphs.length && (
        <button className="button primary" onClick={handleSubmit}>
          Verificar emparejamiento
          <Check size={18} />
        </button>
      )}

      {submitted && (
        <div className={`match-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <>
              <Check size={20} />
              ¡Correcto! Todas las gráficas están emparejadas con su ecuación.
            </>
          ) : (
            <>
              <X size={20} />
              Algunos emparejamientos no son correctos. Revisa las características de cada gráfica.
            </>
          )}
        </div>
      )}
    </div>
  );
}
