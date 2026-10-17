# Plan de mejora: Experiencia estilo Duolingo para Mate U Duo

## Estado actual - ACTUALIZADO (Octubre 2026)

### Funcionalidades completadas ✅

**Fase 1-4 completadas:**
- ✅ Meta diaria configurable y práctica mixta
- ✅ Mejoras visuales estilo Duolingo
- ✅ Sistema de logros y niveles
- ✅ Sonidos opcionales
- ✅ Mascota Mateo animada (SVG artesanal con 6 moods)
- ✅ Sistema de temas (5 themes: Duolingo, Glassmorphism, Minimal, Neon, Pastel)
- ✅ Tablas de referencia en ejercicios ("Consultar tablas")
- ✅ PDFs semanales

---

## FASE 5: Características avanzadas de aprendizaje (NUEVA)

### 5.1 "¿Por qué me equivoqué?" - Explicación de errores comunes

**Objetivo**: Después de una respuesta incorrecta, mostrar un botón que explica por qué está mal, con explicaciones específicas para errores comunes.

**Implementación**:
```typescript
// src/errorExplanations.ts
export interface ErrorPattern {
  id: string;
  pattern: (userAnswer: string, correctAnswer: string, question: Question) => boolean;
  explanation: string;
  example?: string;
}

const errorPatterns: ErrorPattern[] = [
  {
    id: 'modus-tollens-confusion',
    pattern: (user, correct, q) => 
      q.type === 'logic' && 
      user.includes('P') && !user.includes('¬') &&
      correct.includes('¬P'),
    explanation: 'Confundiste el Modus Tollens (¬Q → ¬P) con negar el antecedente (una falacia). Si Q es falso, solo podemos concluir ¬P cuando tenemos P → Q.',
    example: 'P → Q, ¬Q ⊢ ¬P es válido. Pero P → Q, ¬P no nos dice nada sobre Q.'
  },
  {
    id: 'de-morgan-incomplete',
    pattern: (user, correct, q) =>
      q.type === 'logic' &&
      user.includes('¬') && user.includes('∨') &&
      correct.includes('∧'),
    explanation: 'Olvidaste cambiar el conector al aplicar De Morgan. ¬(P ∨ Q) = ¬P ∧ ¬Q. El "o" se convierte en "y".',
  },
  // ... más patrones
];
```

**UI**:
- Botón "¿Por qué me equivoqué?" después del feedback de error
- Modal/panel desplegable con la explicación
- Ejemplos visuales cuando corresponda
- Link a sección relevante de "Consultar tablas"

---

### 5.2 Sistema de pistas progresivas (3 niveles)

**Objetivo**: Pistas que guían sin dar la respuesta, reducen XP, con 3 niveles de ayuda.

**Implementación**:
```typescript
// src/hints.ts
export interface HintLevel {
  level: 1 | 2 | 3;
  text: string;
  xpPenalty: number; // XP reducido por usar esta pista
}

export interface QuestionHints {
  questionId: string;
  hints: [HintLevel, HintLevel, HintLevel];
  relatedTableSection?: string; // Link a "Consultar tablas"
}

// Ejemplo:
{
  questionId: 'logic-inference-mt-1',
  hints: [
    {
      level: 1,
      text: 'Mirá la regla del Modus Tollens. ¿Qué necesitás tener para poder negar el antecedente?',
      xpPenalty: 2
    },
    {
      level: 2,
      text: 'Tenés P → Q y ¬Q. Modus Tollens dice: si el consecuente es falso, el antecedente también debe serlo.',
      xpPenalty: 5
    },
    {
      level: 3,
      text: 'La respuesta es ¬P. Aplicá: P → Q, ¬Q ⊢ ¬P',
      xpPenalty: 8
    }
  ],
  relatedTableSection: 'inference-rules'
}
```

**UI**:
- Botón "💡 Pista" (muestra "Pista 1/3", "Pista 2/3", etc.)
- Indica reducción de XP: "−2 XP por esta pista"
- Link "📋 Ver reglas" abre "Consultar tablas" en la sección correcta
- XP final ajustado: 10 XP base − penalidades de pistas usadas

---

### 5.3 Streak freeze + weekend protection

**Objetivo**: Congelar la racha con XP/monedas, protección automática de fin de semana, racha separada de meta diaria.

**Implementación**:
```typescript
// src/progress.ts
export interface StreakData {
  current: number;
  longest: number;
  lastDate: string;
  freezesAvailable: number; // Congeladores disponibles
  freezeUsedDates: string[]; // Días donde se usó freeze
  weekendProtection: boolean; // true = no perder racha sábado/domingo
}

// Costo: 100 XP o 50 monedas por freeze
function buyStreakFreeze(progress: Progress): Progress {
  if (progress.xp >= 100) {
    return {
      ...progress,
      xp: progress.xp - 100,
      streakFreezes: (progress.streakFreezes || 0) + 1
    };
  }
  if (progress.coins >= 50) {
    return {
      ...progress,
      coins: progress.coins - 50,
      streakFreezes: (progress.streakFreezes || 0) + 1
    };
  }
  return progress;
}

// Racha se mantiene con 1 lección/día (independiente de meta diaria 10-20)
function checkStreak(progress: Progress): StreakData {
  const today = dayKey();
  const yesterday = dayKey(new Date(Date.now() - 86400000));
  
  // Si completó al menos 1 lección hoy, racha continúa
  const completedToday = progress.completed.some(id => 
    progress.attempts.some(a => a.questionId.startsWith(id) && a.date.startsWith(today))
  );
  
  // Weekend protection
  const isWeekend = [0, 6].includes(new Date().getDay());
  if (isWeekend && progress.weekendProtection) {
    // No se pierde racha en fin de semana
  }
  
  // Usar freeze si disponible
  if (!completedToday && progress.streakFreezes > 0) {
    return useFreeze(progress);
  }
  
  // ...
}
```

**UI**:
- Botón "🛡️ Comprar congelador" en ajustes/tienda
- Badge "🛡️ × 2" mostrando freezes disponibles
- Indicador "Protección de fin de semana activa" cuando aplique
- Notificación "Congelador usado automáticamente" si se usa

---

### 5.4 Spaced Repetition (FSRS-like) por ejercicio

**Objetivo**: Repetición espaciada real que agenda cada ejercicio/regla individualmente para la sesión diaria.

**Implementación**:
```typescript
// src/fsrs.ts
export interface FSRSCard {
  questionId: string;
  state: 'new' | 'learning' | 'review' | 'relearning';
  difficulty: number; // 1-10
  stability: number; // días hasta próxima revisión
  lastReview: string;
  nextReview: string;
  retrievability: number; // 0-1, probabilidad de recordar
  lapses: number; // veces que falló
}

export function updateFSRS(
  card: FSRSCard,
  rating: 1 | 2 | 3 | 4 // Again, Hard, Good, Easy
): FSRSCard {
  // Algoritmo FSRS simplificado
  const newStability = calculateStability(card, rating);
  const newDifficulty = adjustDifficulty(card.difficulty, rating);
  
  return {
    ...card,
    state: rating === 1 ? 'relearning' : 'review',
    difficulty: newDifficulty,
    stability: newStability,
    lastReview: dayKey(),
    nextReview: dayKey(new Date(Date.now() + newStability * 86400000)),
    retrievability: 0.9,
    lapses: rating === 1 ? card.lapses + 1 : card.lapses
  };
}

// Rating automático basado en rendimiento:
// 1 (Again) = incorrecto, incluso con pistas
// 2 (Hard) = correcto después de 2-3 pistas
// 3 (Good) = correcto con 0-1 pistas
// 4 (Easy) = correcto sin pistas ni demora
```

**UI**:
- No se muestra directamente al usuario (algoritmo en background)
- Dashboard muestra "Repasos pendientes hoy: 12"
- Sección "Estadísticas" muestra progreso por tema
- Indicador sutil "Primer repaso" / "Revisión espaciada" en ejercicios

---

### 5.5 Niveles de maestría por tema (3 niveles)

**Objetivo**: Familiar → Competente → Dominado, con unit checks y visualización en Aprender.

**Implementación**:
```typescript
// src/mastery.ts
export type MasteryLevel = 'locked' | 'familiar' | 'competente' | 'dominado';

export interface TopicMastery {
  topicId: string; // e.g., 'proposiciones', 'implicacion', etc.
  level: MasteryLevel;
  progress: number; // 0-100%
  exercises: {
    total: number;
    correct: number;
    withHints: number;
    perfect: number; // sin pistas, primer intento
  };
  lastPracticed: string;
  unitCheckPassed: boolean;
}

export function calculateMastery(topic: TopicMastery): MasteryLevel {
  const { correct, total, perfect, withHints } = topic.exercises;
  const accuracy = correct / total;
  const perfectRate = perfect / total;
  
  if (accuracy < 0.5 || total < 3) return 'familiar';
  if (accuracy >= 0.7 && perfectRate >= 0.3 && total >= 8) return 'competente';
  if (accuracy >= 0.85 && perfectRate >= 0.5 && total >= 15 && topic.unitCheckPassed) return 'dominado';
  
  return 'competente';
}

// Unit check = mini-examen de 5 preguntas del tema
export function generateUnitCheck(topicId: string): Question[] {
  // Seleccionar 5 preguntas variadas del tema
  // 80% de aciertos = aprueba unit check
}
```

**UI**:
- Badge de nivel junto a cada lección en "Aprender"
  - 🌱 Familiar (verde claro)
  - ⭐ Competente (amarillo)
  - 👑 Dominado (dorado)
- Barra de progreso hacia siguiente nivel
- Botón "Unit Check" cuando esté listo
- Vista de maestría por curso en estadísticas

---

### 5.6 Dificultad adaptativa (target 70-85% success)

**Objetivo**: Ajustar dificultad del contenido para mantener ~75% de éxito, con review de prerequisitos si es necesario.

**Implementación**:
```typescript
// src/adaptive.ts
export interface AdaptiveSession {
  targetAccuracy: number; // 0.70 - 0.85
  currentAccuracy: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  prerequisiteReview: boolean;
}

export function adaptDifficulty(session: Session, progress: Progress): Question[] {
  const recentAccuracy = calculateRecentAccuracy(progress, session.lessonId);
  
  // Si accuracy < 60%, review prerequisitos
  if (recentAccuracy < 0.6) {
    const prerequisites = getPrerequisites(session.lessonId);
    return [
      ...generatePrerequisiteReview(prerequisites, 3), // 3 preguntas de repaso
      ...selectQuestions(session.items, 'easy', 7)
    ];
  }
  
  // Si accuracy > 85%, aumentar dificultad
  if (recentAccuracy > 0.85) {
    return selectQuestions(session.items, 'hard', 10);
  }
  
  // Range objetivo 70-85%
  return selectQuestions(session.items, 'medium', 10);
}

function selectQuestions(items: Item[], difficulty: string, count: number): Question[] {
  // Filtrar preguntas por dificultad estimada
  // Dificultad basada en: tipo de ejercicio, tasa de error histórica, complejidad
}
```

**UI**:
- Indicador sutil "Repaso rápido de [tema]" al iniciar prerequisite review
- No mostrar explícitamente el nivel de dificultad (mantener flow natural)
- En estadísticas: gráfico de accuracy por tema

---

### 5.7 Nuevos tipos de ejercicios interactivos

**Objetivo**: 7 nuevos tipos de ejercicio más engaging.

#### 7.1 Drag premises to build a proof
```typescript
type ProofBuilderQuestion = {
  type: 'proof-builder';
  premises: string[]; // Premisas disponibles
  conclusion: string;
  correctOrder: string[]; // IDs de premisas en orden correcto
  rules: string[]; // Reglas usadas entre pasos
};
```

**UI**: Drag & drop de premisas, validación paso a paso.

#### 7.2 Fill truth table cell by cell
```typescript
type TruthTableQuestion = {
  type: 'truth-table-interactive';
  expression: string;
  variables: string[];
  rows: number; // 2^n
  correctTable: boolean[][]; // [row][variable]
};
```

**UI**: Grid interactiva, click en celdas para toggle V/F.

#### 7.3 Order inference steps
```typescript
type OrderStepsQuestion = {
  type: 'order-steps';
  steps: { id: string; text: string }[];
  correctOrder: string[];
};
```

**UI**: Drag & drop para reordenar pasos numerados.

#### 7.4 Sort equivalence cards
```typescript
type SortEquivalenceQuestion = {
  type: 'sort-equivalence';
  expressions: string[];
  groups: string[][]; // Expresiones equivalentes agrupadas
};
```

**UI**: Drag cards para agrupar expresiones equivalentes.

#### 7.5 Interactive Venn diagrams
```typescript
type InteractiveVennQuestion = {
  type: 'venn-interactive';
  sets: { name: string; elements: string[] }[];
  operation: '∪' | '∩' | '\\' | 'complement';
  correctRegions: string[]; // IDs de regiones que deben estar sombreadas
};
```

**UI**: Tap en regiones del diagrama para seleccionar, visualizar operación.

#### 7.6 Function graphs with sliders (Precálculo)
```typescript
type GraphSliderQuestion = {
  type: 'graph-slider';
  function: string; // 'ax² + bx + c'
  parameters: { name: string; min: number; max: number; step: number }[];
  target: { description: string; check: (params: number[]) => boolean };
};
```

**UI**: Sliders para ajustar parámetros, gráfico actualizado en tiempo real.

#### 7.7 Match equations with graphs
```typescript
type MatchGraphQuestion = {
  type: 'match-graph';
  equations: string[];
  graphs: string[]; // SVG paths o canvas renders
  correctMatches: Record<string, string>;
};
```

**UI**: Drag & drop para emparejar ecuaciones con gráficas.

---

### 5.8 Liga semanal (vs. semana anterior)

**Objetivo**: Competencia local contra tu semana anterior (no necesita backend).

**Implementación**:
```typescript
// src/weeklyLeague.ts
export interface WeeklyStats {
  week: string; // ISO week 'YYYY-WW'
  xp: number;
  exercisesCompleted: number;
  accuracy: number;
  streak: number;
}

export interface LeagueComparison {
  thisWeek: WeeklyStats;
  lastWeek: WeeklyStats;
  change: {
    xp: number; // +/− vs última semana
    exercises: number;
    accuracy: number;
  };
  rank: 'ahead' | 'behind' | 'tied';
  message: string;
}

export function getWeeklyComparison(progress: Progress): LeagueComparison {
  const thisWeek = getCurrentWeekStats(progress);
  const lastWeek = getLastWeekStats(progress);
  
  return {
    thisWeek,
    lastWeek,
    change: {
      xp: thisWeek.xp - lastWeek.xp,
      exercises: thisWeek.exercisesCompleted - lastWeek.exercisesCompleted,
      accuracy: thisWeek.accuracy - lastWeek.accuracy,
    },
    rank: thisWeek.xp > lastWeek.xp ? 'ahead' : thisWeek.xp < lastWeek.xp ? 'behind' : 'tied',
    message: generateMessage(thisWeek, lastWeek)
  };
}
```

**UI**:
- Widget en Home: "Liga semanal"
  - "Esta semana: 450 XP"
  - "Semana pasada: 380 XP"
  - "⬆ +70 XP (+18%)"
- Badge animado si estás "ganando" a tu yo de la semana pasada
- Gráfico de barras comparativo (esta vs. última semana)

---

## Cronograma de implementación

### Semana 1: Core features
- [ ] 5.1: Error explanations system (errorExplanations.ts, UI integration)
- [ ] 5.2: Progressive hints (hints.ts, UI with XP penalties)
- [ ] 5.3: Streak freeze + weekend protection

### Semana 2: Spaced repetition & mastery
- [ ] 5.4: FSRS implementation (fsrs.ts, card scheduling)
- [ ] 5.5: Topic mastery levels (mastery.ts, UI badges)
- [ ] 5.6: Adaptive difficulty (adaptive.ts, prerequisite review)

### Semana 3: Interactive exercises (Parte 1)
- [ ] 5.7.1: Proof builder (drag premises)
- [ ] 5.7.2: Interactive truth table
- [ ] 5.7.3: Order inference steps
- [ ] 5.7.4: Sort equivalence cards

### Semana 4: Interactive exercises (Parte 2) + Liga
- [ ] 5.7.5: Interactive Venn diagrams
- [ ] 5.7.6: Graph sliders (Precálculo)
- [ ] 5.7.7: Match equations with graphs
- [ ] 5.8: Weekly league (vs. last week)

### Semana 5: Integration, testing & polish
- [ ] Fix browser test (tests/browser.mjs)
- [ ] Integrate all features with existing flows
- [ ] Create screenshots for each feature
- [ ] Update PR description
- [ ] Ensure all 37 tests pass + build green + verify check green

---

## Criterios de aceptación

### 5.1 Error explanations ✓
- [ ] Botón "¿Por qué me equivoqué?" visible después de error
- [ ] Al menos 10 patrones de error común implementados
- [ ] Explicaciones claras en español
- [ ] Link a sección relevante de "Consultar tablas"

### 5.2 Progressive hints ✓
- [ ] 3 niveles de pistas por ejercicio
- [ ] Botón "💡 Pista" muestra nivel actual (1/3, 2/3, 3/3)
- [ ] XP reducido según pistas usadas (−2, −5, −8)
- [ ] Link a "Consultar tablas" desde panel de pistas

### 5.3 Streak freeze ✓
- [ ] Comprar freeze con 100 XP o 50 monedas
- [ ] Freezes disponibles mostrados en UI
- [ ] Protección de fin de semana opcional
- [ ] Racha se mantiene con 1 lección/día (separado de meta diaria)
- [ ] Uso automático de freeze cuando falta completar día

### 5.4 FSRS ✓
- [ ] Cada ejercicio tiene su propio schedule
- [ ] Rating automático basado en rendimiento (1-4)
- [ ] "Repasos pendientes hoy" en dashboard
- [ ] Algoritmo FSRS funcional (stability, difficulty, retrievability)

### 5.5 Mastery levels ✓
- [ ] 3 niveles: Familiar, Competente, Dominado
- [ ] Badges visuales en lecciones de "Aprender"
- [ ] Barra de progreso hacia siguiente nivel
- [ ] Unit checks para pasar a "Dominado"
- [ ] Vista de maestría por tema en estadísticas

### 5.6 Adaptive difficulty ✓
- [ ] Target accuracy 70-85%
- [ ] Prerequisite review si accuracy < 60%
- [ ] Ajuste automático de dificultad de preguntas
- [ ] Indicador "Repaso rápido" cuando aplique

### 5.7 Interactive exercises ✓
- [ ] 7 nuevos tipos de ejercicio implementados
- [ ] Drag & drop funcional (proof, steps, cards)
- [ ] Interactive truth table (cell by cell)
- [ ] Interactive Venn con tap en regiones
- [ ] Graph sliders con preview en tiempo real
- [ ] Match graphs con drag & drop

### 5.8 Weekly league ✓
- [ ] Widget "Liga semanal" en Home
- [ ] Comparación con semana anterior (XP, ejercicios, accuracy)
- [ ] Badge animado si vas ganando
- [ ] Gráfico comparativo de barras
- [ ] Mensaje motivador según performance

---

## Tests requeridos

- [ ] Todos los 37 tests actuales siguen pasando
- [ ] Browser test (tests/browser.mjs) actualizado y pasando
- [ ] Build limpio (`npm run build`)
- [ ] Verify check ✅ en GitHub CI

---

## Screenshots requeridos para PR

1. **Error explanation**: Botón "¿Por qué me equivoqué?" + modal con explicación
2. **Progressive hints**: Panel de pistas con 3 niveles
3. **Streak freeze**: Tienda/compra de freezes + indicador de protección
4. **FSRS dashboard**: "Repasos pendientes hoy"
5. **Mastery badges**: Lecciones con badges Familiar/Competente/Dominado
6. **Adaptive difficulty**: Mensaje de "Repaso rápido de prerequisitos"
7. **Proof builder**: Drag & drop de premisas
8. **Interactive truth table**: Grid cell-by-cell
9. **Order steps**: Drag & drop para reordenar pasos
10. **Sort equivalence**: Agrupar expresiones equivalentes
11. **Interactive Venn**: Tap en regiones para operaciones
12. **Graph sliders**: Sliders + gráfico en tiempo real
13. **Match graphs**: Emparejar ecuaciones con gráficas
14. **Weekly league**: Widget comparativo con semana anterior

---

*Documento actualizado: Octubre 2026*
*Fase 5 en progreso: Características avanzadas de aprendizaje*
