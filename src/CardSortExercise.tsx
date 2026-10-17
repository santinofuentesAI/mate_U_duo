import { useState } from 'react';
import { Check, X, MoveHorizontal } from 'lucide-react';
import type { Question } from './types';

interface Props {
  question: Question;
  cards: string[];
  buckets: { label: string; correctCards: number[] }[];
  onComplete: (correct: boolean) => void;
}

export function CardSortExercise({ question, cards, buckets, onComplete }: Props) {
  const [unassigned, setUnassigned] = useState<number[]>([...Array(cards.length).keys()]);
  const [bucketContents, setBucketContents] = useState<number[][]>(buckets.map(() => []));
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const assignCard = (cardIndex: number, bucketIndex: number) => {
    setUnassigned(prev => prev.filter(i => i !== cardIndex));
    setBucketContents(prev => {
      const newContents = [...prev];
      newContents[bucketIndex] = [...newContents[bucketIndex], cardIndex];
      return newContents;
    });
  };

  const removeFromBucket = (cardIndex: number, bucketIndex: number) => {
    setBucketContents(prev => {
      const newContents = [...prev];
      newContents[bucketIndex] = newContents[bucketIndex].filter(i => i !== cardIndex);
      return newContents;
    });
    setUnassigned(prev => [...prev, cardIndex]);
  };

  const handleSubmit = () => {
    let correct = true;
    
    for (let i = 0; i < buckets.length; i++) {
      const expected = new Set(buckets[i].correctCards);
      const actual = new Set(bucketContents[i]);
      
      if (expected.size !== actual.size) {
        correct = false;
        break;
      }
      
      for (const card of expected) {
        if (!actual.has(card)) {
          correct = false;
          break;
        }
      }
      
      if (!correct) break;
    }
    
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onComplete(correct), correct ? 800 : 2000);
  };

  return (
    <div className="card-sort-exercise">
      <div className="exercise-header">
        <h3>{question.prompt}</h3>
        <p className="exercise-instructions">
          Arrastra cada tarjeta al grupo correcto.
        </p>
      </div>

      <div className="unassigned-cards">
        <b>Tarjetas por clasificar</b>
        <div className="cards-pool">
          {unassigned.length === 0 && <p className="empty-pool">Todas las tarjetas asignadas</p>}
          {unassigned.map(cardIndex => (
            <div key={cardIndex} className="sort-card">
              <code>{cards[cardIndex]}</code>
              <div className="card-actions">
                {buckets.map((bucket, bucketIndex) => (
                  <button
                    key={bucketIndex}
                    className="assign-button"
                    onClick={() => assignCard(cardIndex, bucketIndex)}
                    disabled={submitted}
                  >
                    → {bucket.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sorting-buckets">
        {buckets.map((bucket, bucketIndex) => (
          <div key={bucketIndex} className="sort-bucket">
            <div className="bucket-header">
              <h4>{bucket.label}</h4>
              <span className="bucket-count">{bucketContents[bucketIndex].length}</span>
            </div>
            <div className="bucket-cards">
              {bucketContents[bucketIndex].length === 0 && (
                <p className="empty-bucket">Vacío</p>
              )}
              {bucketContents[bucketIndex].map(cardIndex => (
                <div key={cardIndex} className="bucket-card">
                  <code>{cards[cardIndex]}</code>
                  {!submitted && (
                    <button
                      className="remove-card-btn"
                      onClick={() => removeFromBucket(cardIndex, bucketIndex)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!submitted && unassigned.length === 0 && (
        <button className="button primary" onClick={handleSubmit}>
          Verificar clasificación
          <Check size={18} />
        </button>
      )}

      {submitted && (
        <div className={`sort-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <>
              <Check size={20} />
              ¡Clasificación correcta! Todas las tarjetas están en su grupo.
            </>
          ) : (
            <>
              <X size={20} />
              Algunas tarjetas no están en el grupo correcto. Revisa las equivalencias.
            </>
          )}
        </div>
      )}
    </div>
  );
}
