import { useState } from 'react';
import { Check, X, GripVertical } from 'lucide-react';
import type { Question } from './types';

interface Props {
  question: Question;
  steps: string[];
  correctOrder: number[];
  onComplete: (correct: boolean) => void;
}

export function OrderStepsExercise({ question, steps, correctOrder, onComplete }: Props) {
  const [orderedSteps, setOrderedSteps] = useState<number[]>([...Array(steps.length).keys()]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newOrder = [...orderedSteps];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    setOrderedSteps(newOrder);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...orderedSteps];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrderedSteps(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === orderedSteps.length - 1) return;
    const newOrder = [...orderedSteps];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrderedSteps(newOrder);
  };

  const handleSubmit = () => {
    const correct = JSON.stringify(orderedSteps) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onComplete(correct), correct ? 800 : 2000);
  };

  return (
    <div className="order-steps-exercise">
      <div className="exercise-header">
        <h3>{question.prompt}</h3>
        <p className="exercise-instructions">
          Arrastra los pasos o usa los botones ↑↓ para ordenarlos correctamente.
        </p>
      </div>

      <div className="steps-to-order">
        {orderedSteps.map((stepIndex, position) => (
          <div
            key={`${stepIndex}-${position}`}
            className={`draggable-step ${draggedIndex === position ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(position)}
            onDragOver={(e) => handleDragOver(e, position)}
            onDragEnd={handleDragEnd}
          >
            <div className="step-drag-handle">
              <GripVertical size={20} />
            </div>
            <div className="step-position-number">{position + 1}</div>
            <div className="step-text">
              <code>{steps[stepIndex]}</code>
            </div>
            <div className="step-controls">
              <button
                className="step-move-btn"
                onClick={() => moveUp(position)}
                disabled={position === 0 || submitted}
                aria-label="Mover arriba"
              >
                ↑
              </button>
              <button
                className="step-move-btn"
                onClick={() => moveDown(position)}
                disabled={position === orderedSteps.length - 1 || submitted}
                aria-label="Mover abajo"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <button className="button primary" onClick={handleSubmit}>
          Verificar orden
          <Check size={18} />
        </button>
      )}

      {submitted && (
        <div className={`order-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <>
              <Check size={20} />
              ¡Orden correcto! Los pasos están en la secuencia lógica adecuada.
            </>
          ) : (
            <>
              <X size={20} />
              El orden no es correcto. Revisa la secuencia lógica de cada paso.
            </>
          )}
        </div>
      )}
    </div>
  );
}
