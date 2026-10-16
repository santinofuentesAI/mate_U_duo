// Interactive Proof Builder - Drag premises to construct valid proofs

import { useState } from 'react';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import type { Question } from './types';

interface ProofStep {
  id: string;
  expression: string;
  justification: string;
}

interface ProofBuilderProps {
  question: Question;
  premises: string[];
  targetConclusion: string;
  validSteps: ProofStep[];
  onComplete: (proof: ProofStep[], correct: boolean) => void;
}

export function ProofBuilder({ question, premises, targetConclusion, validSteps, onComplete }: ProofBuilderProps) {
  const [selectedSteps, setSelectedSteps] = useState<ProofStep[]>([]);
  const [availableSteps, setAvailableSteps] = useState<ProofStep[]>(validSteps);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  function addStep(step: ProofStep) {
    setSelectedSteps([...selectedSteps, step]);
    setAvailableSteps(availableSteps.filter(s => s.id !== step.id));
    setFeedback(null);
  }

  function removeStep(stepId: string) {
    const step = selectedSteps.find(s => s.id === stepId);
    if (!step) return;
    
    setSelectedSteps(selectedSteps.filter(s => s.id !== stepId));
    setAvailableSteps([...availableSteps, step].sort((a, b) => a.id.localeCompare(b.id)));
    setFeedback(null);
  }

  function checkProof() {
    // Verify the proof reaches the target conclusion
    const lastStep = selectedSteps[selectedSteps.length - 1];
    
    if (!lastStep) {
      setFeedback('Agregá al menos un paso');
      setIsCorrect(false);
      return;
    }

    const reachesConclusion = lastStep.expression === targetConclusion;
    
    if (!reachesConclusion) {
      setFeedback('La conclusión no coincide con el objetivo');
      setIsCorrect(false);
      return;
    }

    // In a full implementation, would validate each step's logical validity
    // For now, assume steps in correct order = valid proof
    const correctOrder = validSteps
      .filter(step => selectedSteps.some(s => s.id === step.id))
      .every((step, idx) => selectedSteps[idx]?.id === step.id);

    setIsCorrect(correctOrder && reachesConclusion);
    setFeedback(correctOrder && reachesConclusion 
      ? '¡Demostración correcta!'
      : 'El orden de los pasos no es válido'
    );

    onComplete(selectedSteps, correctOrder && reachesConclusion);
  }

  return (
    <div className="proof-builder">
      <div className="proof-builder-prompt">
        <h3>{question.prompt}</h3>
        <div className="premises-box">
          <b>Premisas:</b>
          {premises.map((p, i) => (
            <div key={i} className="premise-item">
              <span className="premise-number">{i + 1}</span>
              <code>{p}</code>
            </div>
          ))}
        </div>
        <div className="target-conclusion">
          <b>Demostrar:</b> <code>{targetConclusion}</code>
        </div>
      </div>

      <div className="proof-workspace">
        <b>Tu demostración:</b>
        {selectedSteps.length === 0 ? (
          <p className="empty-proof">Arrastrá los pasos desde abajo para construir la demostración</p>
        ) : (
          <div className="proof-steps-list">
            {selectedSteps.map((step, idx) => (
              <div key={step.id} className="proof-step-card selected">
                <span className="step-number">{idx + 1}</span>
                <div className="step-content">
                  <code>{step.expression}</code>
                  <small>{step.justification}</small>
                </div>
                <button 
                  className="remove-step" 
                  onClick={() => removeStep(step.id)}
                  aria-label="Quitar paso"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="available-steps">
        <b>Pasos disponibles:</b>
        <div className="steps-grid">
          {availableSteps.map(step => (
            <button
              key={step.id}
              className="proof-step-card available"
              onClick={() => addStep(step)}
            >
              <div className="step-content">
                <code>{step.expression}</code>
                <small>{step.justification}</small>
              </div>
              <Sparkles size={14} />
            </button>
          ))}
          {availableSteps.length === 0 && (
            <p className="no-steps">Todos los pasos fueron usados</p>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`proof-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? <Check size={20} /> : <X size={20} />}
          <span>{feedback}</span>
        </div>
      )}

      <button 
        className="primary wide" 
        onClick={checkProof}
        disabled={selectedSteps.length === 0}
      >
        Comprobar demostración
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
