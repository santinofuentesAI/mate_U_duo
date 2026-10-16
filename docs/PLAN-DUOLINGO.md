# Plan de mejora: Experiencia estilo Duolingo para Mate U Duo

## Estado actual

### Contenido existente

La aplicación cuenta con **47 lecciones** organizadas en dos cursos:

**Matemática Discreta** (22 lecciones):
- **S1 · Lógica proposicional** (7 lecciones): Proposiciones, conectores, implicación, tablas de verdad, equivalencias, traducción, formas normales
- **S2 · Circuitos e inferencia** (4 lecciones): Circuitos lógicos, reglas de inferencia, demostraciones, métodos de demostración
- **S3 · Predicados y cuantificadores** (6 lecciones): Predicados, universal/existencial, negar, anidados, matrices, inferencias
- **S4 · Conjuntos** (5 lecciones): Pertenencia, operaciones, intervalos, Venn, aplicaciones

**Precálculo** (25 lecciones):
- **B1 · Números reales** (5 lecciones): Conjuntos numéricos, signos, fracciones, potencias, raíces
- **B2 · Expresiones algebraicas** (6 lecciones): Variables, monomios, suma/resta, multiplicación, división
- **B3 · Factorización** (4 lecciones): Factor común, trinomios, suma/diferencia de cubos
- **B4 · Fracciones algebraicas** (3 lecciones): Raíces racionales, división sintética, fracciones
- **B5 · Ecuaciones** (7 lecciones): Lineales, cuadráticas, grado superior, racionales, radicales, problemas

### Funcionalidades actuales

✅ **Sistema de avance**: 
- XP por respuestas correctas (10 XP sin ayuda, 5 XP con ayuda)
- Racha de días consecutivos
- Monedas ficticias (20 iniciales + 1 por cada 5 XP)
- Progreso local en navegador

✅ **Práctica**:
- Lecciones con narrativas y ejercicios
- Repaso espaciado (1, 3, 7, 14, 30 días)
- Diario de errores
- Práctica personalizada (3, 8 o 15 ejercicios)
- Reto diario (5 preguntas)
- Simulacro (18 preguntas)

✅ **Interfaz**:
- Iconos SVG propios
- Mascota "Milo"
- Tema claro/oscuro
- 4 paletas de colores
- Feedback animado
- Mobile-first design

### Lo que falta para una experiencia Duolingo

❌ **Práctica diaria como foco principal**: La pantalla principal muestra la ruta de lecciones, no una sesión de práctica diaria mixta
❌ **Meta diaria clara**: Existe un "goal" (8 XP por defecto) pero no se presenta como objetivo central
❌ **Sesión de práctica variada**: El reto diario tiene solo 5 preguntas y no mezcla todos los temas aprendidos
❌ **Celebraciones más vistosas**: Las animaciones de éxito son sutiles
❌ **UI más juguetona**: El diseño es limpio pero formal
❌ **Onboarding claro**: No hay introducción a la meta diaria y el sistema de práctica

---

## Experiencia objetivo

### Flujo principal rediseñado

1. **Pantalla de inicio**: 
   - Bienvenida personalizada con racha destacada
   - **Meta diaria** prominente (ej: "10 ejercicios hoy" o "50 XP hoy")
   - Botón grande "Practicar ahora" que lleva a una sesión mixta
   - Resumen visual: progreso de la racha, XP del día, lecciones completadas

2. **Sesión de práctica diaria**:
   - **10-20 ejercicios mezclados** de las semanas/bloques aprendidos hasta ahora
   - Variedad de tipos: choice, input, logic, algebra, set, venn, table, etc.
   - Prioriza: repasos vencidos > errores > contenido reciente > contenido aleatorio
   - Barra de progreso hacia la meta del día
   - Feedback inmediato con animaciones alegres
   - Pantalla de celebración al completar la meta

3. **Celebración y estadísticas**:
   - Confeti, mascota animada, mensajes motivadores
   - XP ganado, racha actualizada
   - "¡Racha de X días!" con llama animada
   - Opción de practicar más o explorar lecciones

### Diseño visual renovado

#### Colores y formas
- Botones con bordes redondeados más pronunciados (border-radius: 18-25px)
- Paleta más vibrante y alegre
- Gradientes suaves en fondos de tarjetas importantes
- Más uso del color púrpura principal (#7556ef)
- Iconos más grandes y expresivos

#### Animaciones
- Confeti al completar meta diaria
- Estrellitas al acertar (ya existe `answer-sparks` pero mejorar)
- Milo animado (saltos, celebración)
- Transiciones suaves entre ejercicios
- Progress bar animada con efecto de "fill"

#### Tipografía
- Más uso de negritas para títulos
- Emojis en contextos clave (🔥 racha, ⚡ XP, 🎯 meta)
- Mensajes cortos y motivadores

#### Feedback
- ✅ **Correcto**: fondo verde claro, sonido opcional de éxito, mensaje alegre
- ❌ **Incorrecto**: fondo naranja suave, mensaje de ánimo, explicación clara
- Mantener la opción de intentos ilimitados

---

## Roadmap de implementación

### Fase 1: Sistema de meta diaria y sesión de práctica mixta (ESTA FASE)

#### 1.1 Actualizar modelo de progreso
- [x] Añadir campo `dailyGoalType: 'exercises' | 'xp'` (default: 'exercises')
- [x] Añadir campo `dailyGoalValue: number` (default: 10)
- [x] Rastrear progreso diario: `dailyProgress: { [day: string]: { exercises: number, xp: number } }`

#### 1.2 Nueva pantalla de inicio con meta diaria
- [x] Diseñar widget de meta diaria destacado
- [x] Mostrar progreso del día (ej: "5 / 10 ejercicios")
- [x] Botón principal "Practicar ahora" (CTA)
- [x] Visualizar racha con llama animada
- [x] Resumen de XP y logros

#### 1.3 Sesión de práctica diaria
- [x] Generar sesión mixta de 10-20 ejercicios
- [x] Mezclar todos los temas aprendidos (semanas 1-4 de Discreta, bloques 1-5 de Precálculo)
- [x] Priorizar: repasos vencidos > errores > nuevo contenido
- [x] Mostrar progreso hacia meta durante la sesión
- [x] Celebración al completar la meta

#### 1.4 Pantalla de celebración mejorada
- [x] Confeti animado
- [x] Milo celebrando (mascota animada)
- [x] Mensaje personalizado según racha
- [x] Estadísticas del día (XP ganado, ejercicios completados)
- [x] Animación de racha si es nueva o se mantiene

### Fase 2: Mejoras visuales estilo Duolingo (ESTA FASE)

#### 2.1 Rediseño de componentes clave
- [x] Botones más redondeados y expresivos
- [x] Tarjetas con sombras más suaves
- [x] Colores más vibrantes (ajustar paleta)
- [x] Iconos más grandes en pantalla de inicio

#### 2.2 Animaciones mejoradas
- [x] Confeti al completar meta (usando `answer-sparks` como base)
- [x] Progreso animado de la barra
- [x] Transiciones suaves entre pantallas
- [x] Feedback visual más alegre (correcto/incorrecto)

#### 2.3 Milo la mascota
- [x] Estados animados: neutral, celebración, ánimo
- [x] Aparición en pantalla de celebración
- [x] Mensajes contextuales

### Fase 3: Contenido y estructura (FUTURO)

#### 3.1 Preparar para semanas 5 y 6
- [ ] Crear estructura de datos clara para agregar semanas:
  ```typescript
  // En content.ts o nuevo archivo weeklyContent.ts
  export interface WeekContent {
    id: string;           // 'discreta-s5', 'discreta-s6'
    course: Course;
    weekNumber: number;
    title: string;
    lessons: Lesson[];
    enabled: boolean;     // false si aún no tiene contenido
  }
  ```
- [ ] Documentar formato de ejercicios
- [ ] Crear plantillas para nuevos temas

#### 3.2 Sistema de desbloqueo progresivo
- [ ] Lógica de desbloqueo por semanas
- [ ] Indicador visual de contenido próximo
- [ ] Mensaje "Próximamente: Semana 5"

### Fase 4: Gamificación avanzada (FUTURO)

#### 4.1 Logros y medallas
- [ ] Sistema de achievements
- [ ] Medallas por hitos: primera racha de 7 días, 100 XP, etc.
- [ ] Pantalla de logros desbloqueados

#### 4.2 Niveles de usuario
- [ ] Progresión por niveles (ej: cada 100 XP = 1 nivel)
- [ ] Título del nivel (Principiante, Intermedio, Experto)
- [ ] Beneficios por nivel (más monedas, contenido extra)

#### 4.3 Sonidos (OPCIONAL)
- [ ] Activar el campo `sound` ya existente
- [ ] Sonido de acierto, error, completar meta
- [ ] Control de volumen

---

## Criterios de aceptación por fase

### Fase 1: Meta diaria ✅
- [x] El usuario ve claramente cuántos ejercicios le faltan para cumplir la meta del día
- [x] Al abrir la app, el botón principal es "Practicar ahora"
- [x] La sesión de práctica mezcla 10-20 ejercicios de las semanas/bloques ya estudiados
- [x] Al completar la meta, aparece una pantalla de celebración con confeti y estadísticas
- [x] La racha se muestra destacada con emoji de llama

### Fase 2: Mejoras visuales ✅
- [x] Los botones tienen bordes más redondeados (18-25px)
- [x] La pantalla de inicio es visualmente más alegre y colorida
- [x] Las animaciones de éxito son más vistosas (confeti, estrellitas)
- [x] Milo aparece animado en la celebración
- [x] Los colores son más vibrantes y el diseño más juguetón

### Fase 3: Contenido (FUTURO)
- [ ] Existe documentación clara de cómo agregar una semana nueva
- [ ] Los ejercicios siguen un formato estándar
- [ ] Las semanas 5 y 6 aparecen como "próximamente" si no tienen contenido
- [ ] Al habilitar una semana nueva, sus ejercicios entran automáticamente en la práctica diaria

### Fase 4: Gamificación (FUTURO)
- [ ] Sistema de logros visible y funcional
- [ ] Niveles de usuario claros
- [ ] Sonidos opcionales implementados (si se decide hacerlo)

---

## Cómo agregar una semana nueva (Guía para el dueño)

### Paso 1: Preparar el contenido

Decidí qué temas cubrirá la semana. Por ejemplo, para **Discreta S5**:
- Tema 1: Relaciones binarias
- Tema 2: Relaciones de equivalencia
- Tema 3: Funciones

### Paso 2: Crear las lecciones

En `src/content.ts` o en un archivo separado `src/weekContent/` si se prefiere modularizar:

```typescript
D('S5 · Relaciones', 'Relaciones binarias', '🔗', '153-160',
  [
    'Una relación R de A en B es un subconjunto del producto cartesiano A × B.',
    'Un par (a,b) ∈ R se puede escribir también como aRb.',
    'Ejemplos: "menor que" en ℕ, "divide a" en ℤ.'
  ],
  ['R\\subseteq A\\times B', 'aRb\\iff(a,b)\\in R'],
  [
    'A = {1,2,3}, B = {a,b}. R = {(1,a), (2,b), (3,a)}.',
    '1Ra porque (1,a) ∈ R.',
    '2Rb pero 1Rb es falso.'
  ],
  [
    choice('A = {1,2}, B = {x,y}. ¿Cuántos pares tiene A × B?', ['4','2','6'], '4', 'Cada elemento de A se puede emparejar con cada elemento de B.'),
    choice('Si R = {(1,x), (2,y)}, ¿es (2,x) ∈ R?', ['No','Sí'], 'No', 'Solo los pares listados pertenecen a R.'),
    // ... más ejercicios
  ]
),
```

### Paso 3: Agregar los ejercicios

Cada lección debe tener:
- **Título claro** y emoji representativo
- **3 puntos de teoría** (breves, directos)
- **2-3 fórmulas clave** (notación LaTeX)
- **3 pasos de ejemplo** (paso a paso)
- **Al menos 3 ejercicios** (mejor 8-12 para variedad)

Tipos de ejercicios disponibles:
- `choice`: opción múltiple
- `input`: respuesta de texto corto
- `logic`: expresión lógica
- `algebra`: expresión algebraica
- `set`: seleccionar elementos de un conjunto
- `venn`: regiones de diagrama de Venn
- `table`: tabla de verdad
- `order`: ordenar pasos
- `synthetic`: división sintética

### Paso 4: Probar la semana

1. Agregar las lecciones al array `lessons` en `content.ts`
2. Ejecutar `npm test` para verificar que no hay errores de sintaxis
3. Probar en el navegador: iniciar la app y verificar que las lecciones aparecen
4. Completar algunos ejercicios para verificar que funcionan

### Paso 5: Documentar

Actualizar el README.md con las nuevas semanas:

```markdown
| Discreta S5 | Relaciones binarias, equivalencia, funciones | 153-160 |
| Discreta S6 | Funciones inyectivas, sobreyectivas, biyectivas | 161-170 |
```

---

## Notas importantes

### Diseño mobile-first
Todas las mejoras deben funcionar primero en móvil (pantallas de 360px-480px) y luego adaptarse a tablet y escritorio.

### Rendimiento
- Mantener animaciones ligeras (usar CSS cuando sea posible)
- No cargar imágenes pesadas
- Lazy loading de componentes (ya implementado con `React.lazy`)

### Accesibilidad
- Mantener soporte de `reduceMotion`
- Asegurar contraste de texto (ya verificado en modos claro/oscuro)
- Navegación por teclado funcional

### Progresión del usuario
El contenido debe desbloquearse progresivamente:
1. Semana 1 disponible siempre
2. Semana 2 se desbloquea al completar 70% de la semana 1
3. Práctica diaria mezcla solo contenido de semanas desbloqueadas

---

## Resumen de semanas actuales y futuras

### Matemática Discreta

| Semana | Estado | Lecciones | Temas principales |
|--------|--------|-----------|-------------------|
| **Inicio** | ✅ Completa | 1 | Introducción al razonamiento lógico |
| **S1** | ✅ Completa | 6 | Proposiciones, conectores, tablas, equivalencias, formas normales |
| **S2** | ✅ Completa | 4 | Circuitos, inferencias, demostraciones |
| **S3** | ✅ Completa | 6 | Cuantificadores, predicados, matrices |
| **S4** | ✅ Completa | 5 | Conjuntos, operaciones, Venn, cardinalidad |
| **S5** | ❌ Pendiente | 0 | Relaciones, funciones (páginas 153-170 aprox) |
| **S6** | ❌ Pendiente | 0 | Grafos, árboles, inducción (páginas 171-190 aprox) |

### Precálculo

| Bloque | Estado | Lecciones | Temas principales |
|--------|--------|-----------|-------------------|
| **B1** | ✅ Completo | 5 | Números reales, signos, fracciones, potencias, raíces |
| **B2** | ✅ Completo | 6 | Variables, monomios, polinomios, productos notables |
| **B3** | ✅ Completo | 4 | Factorización: factor común, trinomios, cubos |
| **B4** | ✅ Completo | 3 | División sintética, fracciones algebraicas |
| **B5** | ✅ Completo | 7 | Ecuaciones lineales, cuadráticas, racionales, radicales |
| **B6** | ❌ Pendiente | 0 | Funciones, dominio, gráficas (páginas 64+ aprox) |

**Nota**: Las semanas/bloques 5 y 6 son placeholders. El contenido debe ser agregado por el instructor siguiendo la guía de este documento.

---

## Checklist final antes de entregar Fase 1 + Fase 2

- [x] Meta diaria funcional y visible en pantalla de inicio
- [x] Botón "Practicar ahora" genera sesión de 10-20 ejercicios mixtos
- [x] Sesión prioriza repasos vencidos y errores
- [x] Pantalla de celebración con confeti y estadísticas
- [x] Racha destacada con emoji de llama
- [x] Botones más redondeados (18-25px)
- [x] Colores más vibrantes
- [x] Animaciones de éxito mejoradas
- [x] Milo animado en celebración
- [x] La app funciona en móvil, tablet y escritorio
- [x] Tests pasan (`npm test`)
- [x] Build exitoso (`npm run build`)
- [x] Screenshots capturados para el PR

---

## Capturas requeridas para el PR

1. **Home con meta diaria**: Pantalla de inicio mostrando la meta del día y racha
2. **Sesión de práctica**: Un ejercicio de la práctica diaria con feedback
3. **Respuesta correcta**: Feedback de éxito con animación
4. **Respuesta incorrecta**: Feedback de error con mensaje de ánimo
5. **Celebración**: Pantalla de completar la meta con confeti y Milo
6. **Racha actualizada**: Vista de la racha después de completar ejercicios

---

*Documento creado: Octubre 2026*
*Última actualización: Fase 1 y 2 completadas*
