// Interactive Truth Table - Fill cell by cell with immediate feedback

import { useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

interface TruthTableCell {
  row: number;
  col: number;
  value: 'V' | 'F' | null;
  isInput: boolean; // false for premise columns
}

interface InteractiveTruthTableProps {
  expression: string;
  variables: string[];
  correctTable: boolean[][];
  onComplete: (correct: boolean) => void;
}

export function InteractiveTruthTable({ 
  expression, 
  variables, 
  correctTable,
  onComplete 
}: InteractiveTruthTableProps) {
  const numRows = correctTable.length;
  const [cells, setCells] = useState<TruthTableCell[][]>(() => {
    return correctTable.map((row, rowIdx) => 
      row.map((_, colIdx) => ({
        row: rowIdx,
        col: colIdx,
        value: colIdx < variables.length ? (correctTable[rowIdx][colIdx] ? 'V' : 'F') : null,
        isInput: colIdx >= variables.length
      }))
    );
  });
  
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);

  function setCellValue(row: number, col: number, value: 'V' | 'F') {
    const newCells = cells.map(r => [...r]);
    newCells[row][col].value = value;
    
    // Check if correct immediately
    const expectedValue = correctTable[row][col];
    const isCorrect = (value === 'V') === expectedValue;
    
    const errorKey = `${row},${col}`;
    const newErrors = new Set(errors);
    
    if (isCorrect) {
      newErrors.delete(errorKey);
    } else {
      newErrors.add(errorKey);
    }
    
    setCells(newCells);
    setErrors(newErrors);
    
    // Check if all cells are filled
    const allFilled = newCells.every(row => 
      row.every(cell => !cell.isInput || cell.value !== null)
    );
    
    if (allFilled && newErrors.size === 0) {
      setCompleted(true);
      onComplete(true);
    }
  }

  function hasError(row: number, col: number): boolean {
    return errors.has(`${row},${col}`);
  }

  return (
    <div className="interactive-truth-table">
      <div className="table-header">
        <h3>Completá la tabla de verdad</h3>
        <p className="expression-display">
          <code>{expression}</code>
        </p>
        <small className="table-instructions">
          Tocá cada celda y elegí V (verdadero) o F (falso). 
          Las celdas incorrectas se marcan en rojo automáticamente.
        </small>
      </div>

      <div className="truth-table-container">
        <table className="interactive-table">
          <thead>
            <tr>
              {variables.map(v => (
                <th key={v}>{v}</th>
              ))}
              <th className="result-column">{expression}</th>
            </tr>
          </thead>
          <tbody>
            {cells.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => (
                  <td 
                    key={`${rowIdx}-${colIdx}`}
                    className={`
                      ${cell.isInput ? 'input-cell' : 'premise-cell'}
                      ${hasError(rowIdx, colIdx) ? 'error-cell' : ''}
                      ${cell.value && cell.isInput ? 'filled-cell' : ''}
                    `}
                  >
                    {cell.isInput ? (
                      <div className="cell-buttons">
                        <button
                          className={`cell-button ${cell.value === 'V' ? 'selected' : ''}`}
                          onClick={() => setCellValue(rowIdx, colIdx, 'V')}
                          aria-label={`Fila ${rowIdx + 1}, verdadero`}
                          disabled={completed}
                        >
                          V
                        </button>
                        <button
                          className={`cell-button ${cell.value === 'F' ? 'selected' : ''}`}
                          onClick={() => setCellValue(rowIdx, colIdx, 'F')}
                          aria-label={`Fila ${rowIdx + 1}, falso`}
                          disabled={completed}
                        >
                          F
                        </button>
                      </div>
                    ) : (
                      <span className="premise-value">{cell.value}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.size > 0 && !completed && (
        <div className="table-feedback error">
          <X size={18} />
          <span>
            {errors.size === 1 
              ? 'Hay 1 celda incorrecta'
              : `Hay ${errors.size} celdas incorrectas`
            }
          </span>
        </div>
      )}

      {completed && (
        <div className="table-feedback success">
          <Check size={18} />
          <span>¡Tabla completa y correcta!</span>
        </div>
      )}

      <button 
        className="primary wide" 
        disabled={!completed}
        onClick={() => onComplete(true)}
      >
        Continuar
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
