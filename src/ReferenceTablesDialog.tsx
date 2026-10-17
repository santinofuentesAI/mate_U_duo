import { X, BookOpen } from 'lucide-react';
import { Dialog } from './Dialog';
import type { Course } from './types';

interface Props {
  course: Course;
  open: boolean;
  onClose: () => void;
}

export function ReferenceTablesDialog({ course, open, onClose }: Props) {
  if (!open) return null;

  return (
    <Dialog title="Tablas de referencia" onClose={onClose}>
      <div className="reference-content">
          {course === 'discreta' ? (
            <>
              <section className="reference-section">
                <h3>Conectores Lógicos</h3>
                <table className="reference-table">
                  <thead>
                    <tr>
                      <th>P</th>
                      <th>Q</th>
                      <th>¬P</th>
                      <th>P∧Q</th>
                      <th>P∨Q</th>
                      <th>P→Q</th>
                      <th>P↔Q</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>V</td><td>V</td><td>F</td><td>V</td><td>V</td><td>V</td><td>V</td>
                    </tr>
                    <tr>
                      <td>V</td><td>F</td><td>F</td><td>F</td><td>V</td><td>F</td><td>F</td>
                    </tr>
                    <tr>
                      <td>F</td><td>V</td><td>V</td><td>F</td><td>V</td><td>V</td><td>F</td>
                    </tr>
                    <tr>
                      <td>F</td><td>F</td><td>V</td><td>F</td><td>F</td><td>V</td><td>V</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="reference-section">
                <h3>Reglas de Inferencia</h3>
                <div className="inference-grid">
                  <div className="inference-rule">
                    <b>Modus Ponens</b>
                    <pre>P → Q{'\n'}P{'\n'}────{'\n'}∴ Q</pre>
                  </div>
                  <div className="inference-rule">
                    <b>Modus Tollens</b>
                    <pre>P → Q{'\n'}¬Q{'\n'}────{'\n'}∴ ¬P</pre>
                  </div>
                  <div className="inference-rule">
                    <b>Silogismo Hipotético</b>
                    <pre>P → Q{'\n'}Q → R{'\n'}────{'\n'}∴ P → R</pre>
                  </div>
                  <div className="inference-rule">
                    <b>Silogismo Disyuntivo</b>
                    <pre>P ∨ Q{'\n'}¬P{'\n'}────{'\n'}∴ Q</pre>
                  </div>
                  <div className="inference-rule">
                    <b>Adición</b>
                    <pre>P{'\n'}────{'\n'}∴ P ∨ Q</pre>
                  </div>
                  <div className="inference-rule">
                    <b>Simplificación</b>
                    <pre>P ∧ Q{'\n'}────{'\n'}∴ P</pre>
                  </div>
                  <div className="inference-rule">
                    <b>Conjunción</b>
                    <pre>P{'\n'}Q{'\n'}────{'\n'}∴ P ∧ Q</pre>
                  </div>
                  <div className="inference-rule">
                    <b>Resolución</b>
                    <pre>P ∨ Q{'\n'}¬P ∨ R{'\n'}────{'\n'}∴ Q ∨ R</pre>
                  </div>
                </div>
              </section>

              <section className="reference-section">
                <h3>Equivalencias Lógicas</h3>
                <div className="laws-list">
                  <div><b>Doble Negación:</b> ¬¬P ≡ P</div>
                  <div><b>Idempotencia:</b> P ∧ P ≡ P, P ∨ P ≡ P</div>
                  <div><b>Conmutativa:</b> P ∧ Q ≡ Q ∧ P, P ∨ Q ≡ Q ∨ P</div>
                  <div><b>Asociativa:</b> (P ∧ Q) ∧ R ≡ P ∧ (Q ∧ R)</div>
                  <div><b>Distributiva:</b> P ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R)</div>
                  <div><b>De Morgan:</b> ¬(P ∧ Q) ≡ ¬P ∨ ¬Q, ¬(P ∨ Q) ≡ ¬P ∧ ¬Q</div>
                  <div><b>Absorción:</b> P ∧ (P ∨ Q) ≡ P, P ∨ (P ∧ Q) ≡ P</div>
                  <div><b>Identidad:</b> P ∧ V ≡ P, P ∨ F ≡ P</div>
                  <div><b>Dominación:</b> P ∧ F ≡ F, P ∨ V ≡ V</div>
                  <div><b>Complemento:</b> P ∧ ¬P ≡ F, P ∨ ¬P ≡ V</div>
                </div>
              </section>

              <section className="reference-section">
                <h3>Reglas de Cuantificadores</h3>
                <div className="laws-list">
                  <div><b>Negación de ∀:</b> ¬∀x P(x) ≡ ∃x ¬P(x)</div>
                  <div><b>Negación de ∃:</b> ¬∃x P(x) ≡ ∀x ¬P(x)</div>
                  <div><b>Anidamiento:</b> ∀x ∀y P(x,y) ≡ ∀y ∀x P(x,y)</div>
                  <div><b>Distributiva:</b> ∀x (P(x) ∧ Q(x)) ≡ ∀x P(x) ∧ ∀x Q(x)</div>
                  <div><b>Existencial:</b> ∃x (P(x) ∨ Q(x)) ≡ ∃x P(x) ∨ ∃x Q(x)</div>
                </div>
              </section>

              <section className="reference-section">
                <h3>Operaciones de Conjuntos</h3>
                <div className="laws-list">
                  <div><b>Unión:</b> A ∪ B = {`{x | x ∈ A ∨ x ∈ B}`}</div>
                  <div><b>Intersección:</b> A ∩ B = {`{x | x ∈ A ∧ x ∈ B}`}</div>
                  <div><b>Diferencia:</b> A − B = {`{x | x ∈ A ∧ x ∉ B}`}</div>
                  <div><b>Complemento:</b> A' = {`{x ∈ U | x ∉ A}`}</div>
                  <div><b>De Morgan:</b> (A ∪ B)' = A' ∩ B', (A ∩ B)' = A' ∪ B'</div>
                  <div><b>Distributiva:</b> A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)</div>
                </div>
              </section>
            </>
          ) : (
            <>
              <section className="reference-section">
                <h3>Productos Notables</h3>
                <div className="laws-list">
                  <div><b>Cuadrado de suma:</b> (a + b)² = a² + 2ab + b²</div>
                  <div><b>Cuadrado de resta:</b> (a − b)² = a² − 2ab + b²</div>
                  <div><b>Diferencia de cuadrados:</b> (a + b)(a − b) = a² − b²</div>
                  <div><b>Cubo de suma:</b> (a + b)³ = a³ + 3a²b + 3ab² + b³</div>
                  <div><b>Cubo de resta:</b> (a − b)³ = a³ − 3a²b + 3ab² − b³</div>
                  <div><b>Suma de cubos:</b> a³ + b³ = (a + b)(a² − ab + b²)</div>
                  <div><b>Diferencia de cubos:</b> a³ − b³ = (a − b)(a² + ab + b²)</div>
                </div>
              </section>

              <section className="reference-section">
                <h3>Propiedades de Potencias</h3>
                <div className="laws-list">
                  <div><b>Producto:</b> aᵐ · aⁿ = aᵐ⁺ⁿ</div>
                  <div><b>Cociente:</b> aᵐ / aⁿ = aᵐ⁻ⁿ</div>
                  <div><b>Potencia de potencia:</b> (aᵐ)ⁿ = aᵐⁿ</div>
                  <div><b>Potencia de producto:</b> (ab)ⁿ = aⁿbⁿ</div>
                  <div><b>Potencia de cociente:</b> (a/b)ⁿ = aⁿ/bⁿ</div>
                  <div><b>Exponente cero:</b> a⁰ = 1 (a ≠ 0)</div>
                  <div><b>Exponente negativo:</b> a⁻ⁿ = 1/aⁿ</div>
                </div>
              </section>

              <section className="reference-section">
                <h3>Propiedades de Raíces</h3>
                <div className="laws-list">
                  <div><b>Raíz de producto:</b> ⁿ√(ab) = ⁿ√a · ⁿ√b</div>
                  <div><b>Raíz de cociente:</b> ⁿ√(a/b) = ⁿ√a / ⁿ√b</div>
                  <div><b>Raíz de potencia:</b> ⁿ√(aᵐ) = aᵐ/ⁿ</div>
                  <div><b>Raíz de raíz:</b> ᵐ√(ⁿ√a) = ᵐⁿ√a</div>
                </div>
              </section>

              <section className="reference-section">
                <h3>Fórmula Cuadrática</h3>
                <div className="formula-box">
                  <p><b>Para ax² + bx + c = 0:</b></p>
                  <p style={{fontSize: '1.2em'}}>x = (−b ± √(b² − 4ac)) / 2a</p>
                  <p><b>Discriminante:</b> Δ = b² − 4ac</p>
                  <ul style={{marginTop: '8px', paddingLeft: '24px'}}>
                    <li>Δ {'>'} 0: dos soluciones reales</li>
                    <li>Δ = 0: una solución (doble)</li>
                    <li>Δ {'<'} 0: no hay soluciones reales</li>
                  </ul>
                </div>
              </section>
            </>
          )}
      </div>
    </Dialog>
  );
}
