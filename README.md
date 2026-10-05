# Mate U Duo

Aprendizaje de Matemática Discreta desde el inicio hasta conjuntos (página impresa 150 / PDF 152) y Precálculo desde la página 1 hasta la 63, pensado para practicar desde el celular. Interfaz propia con ruta de aprendizaje, iconos, sesiones cortas y un compañero llamado Milo. Los bloques B1–B5 de Precálculo organizan el libro; no afirman una asignación semanal del docente.

## Lo que funciona

- 47 lecciones: definición, reglas, fórmulas, ejemplos por pasos y 141 ejercicios con corrección y explicación. Precálculo tiene 25 lecciones y Discreta 22.
- Biblioteca de lectura: buscador por tema, filtro por semana o bloque, 47 ejemplos resueltos, soluciones comentadas, diccionario de símbolos y enlaces a las páginas originales de teoría y ejemplos de ambos libros.
- Teclado táctil integrado: P/Q/R/S, negación, conjunción, disyunción, implicación, bicondicional, números y operadores algebraicos. Cursor, borrado y opción de teclado físico.
- Tablas de verdad, selección de conjuntos, regiones de Venn, orden de demostraciones y división sintética.
- Cuaderno de transformaciones: verifica una ley lógica por paso, incluso dentro de una subexpresión. Cuaderno de inferencias: verifica las diez reglas y las líneas citadas.
- Referencia de 14 leyes y 10 reglas de inferencia durante los ejercicios.
- Intentos ilimitados, consejo gratis y ayuda guiada por 5 monedas ficticias. Se empieza con 20 monedas; cada 5 XP aporta una. Sin compras ni pagos.
- Repasos a 1, 3, 7, 14 y 30 días. Los errores y las ayudas vuelven al repaso en 10 minutos. Una repetición inmediata no confirma dominio. El XP de una pregunta se otorga una sola vez.
- Práctica mixta, diagnóstico formativo y simulacro de 18 preguntas del banco; no son predicciones de nota del examen.
- Visor de PDF privado: importar el libro en el dispositivo, abrir páginas reales por semana, ampliar y guardar notas. Todos los incisos de una página se pueden consultar; los cuadernos permiten trabajar junto a ella.
- Progreso local, copia JSON, modo oscuro, tamaño de letra y movimiento reducido. Fechas de estudio en America/Costa_Rica.
- Build preparado para funcionar sin conexión tras completar la instalación del service worker. PDF.js y las fuentes se sirven desde la app, sin CDN. Instalar requiere HTTPS o localhost y depende del navegador.

## Ejecutar

Requiere Node 22.13+ (probado con Node 24).

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

Si el entorno no permite consultar interfaces de red, usar `npm run dev -- --host 127.0.0.1`. El build está en `dist/` y usa rutas relativas, aptas para alojarse en un subdirectorio.

Para la prueba de navegador, instalar Chromium de Playwright. El script levanta el servidor automáticamente, salvo que se especifique `TEST_URL`:

```sh
npx playwright install chromium
node tests/browser.mjs
node tests/offline.mjs
```

Variables opcionales: `TEST_URL`, `TEST_BOOK` (ruta a un PDF propio), `TEST_CHROMIUM_PATH`, `TEST_PRECALC_BOOK` (segundo PDF para verificar el límite 1–63). Las capturas de verificación quedan en `tmp/qa/`, fuera del repositorio.

Validado en esta versión: compilación TypeScript/Vite; ocho pruebas de lógica, álgebra, leyes, inferencias, contenido, repaso, fórmulas y cobertura de páginas; recorrido móvil de lección y teclado; consulta de leyes y Biblioteca; importación y recuperación de ambos libros; límite de página 63 y exploración fuera del temario; ajustes y escritorio; recarga sin conexión, carga del visor y renderizado del PDF local sin red. La prueba offline necesita ejecutar el build primero. La prueba visual usa un navegador automatizado; no sustituye la comprobación en el teléfono real del estudiante.

## Libros y prácticas

En **Mi libro**, cargar una vez el PDF del curso correspondiente. Se guarda en IndexedDB de ese navegador y nunca se envía a un servidor. Los accesos están preparados para las ediciones entregadas:

| Curso / semana | Secciones del libro | Páginas PDF |
| --- | --- | --- |
| Discreta, inicio | Introducción 1.1; formas normales 1.5; métodos de demostración 1.8 | 37–45; 82; 110 |
| Discreta S1 | Conectivas 1.2; leyes 1.3 | 55–58; 63 |
| Discreta S2 | Inferencias 1.4 | 73–78 |
| Discreta S3 | Cuantificadores 1.6; ampliación 1.7 | 93–97; 100 |
| Discreta S4 | Operaciones 2.1, numéricos 2.2, Venn 2.3, leyes 2.4, cardinalidad 2.5 | 123–128; 133–134; 137–138; 142; 148–152 |
| Precálculo B1 | Números reales, signos, fracciones, potencias y raíces; práctica 1.4 | Lectura 7–17; práctica 18–19 |
| Precálculo B2 | Expresiones, monomios, polinomios, productos notables y división; práctica 2.5 | Lectura 20–32; práctica 33 |
| Precálculo B3–B4 | Factorización, división sintética, fracciones y racionalización | 34–53 |
| Precálculo B5 | Ecuaciones lineales, cuadráticas, grado superior, racionales y radicales; práctica 4.6 | Lectura 54–62; práctica y método de aplicaciones 63 |

Los accesos relacionan los temas, no establecen que el docente haya asignado todos esos incisos. Se puede navegar por cualquier página del libro. Los originales y sus imágenes no se incluyen en este repositorio público.

El visor limita por defecto la navegación al temario actual: Precálculo 1–63 y Discreta PDF 1–152 (hasta el final de ejercicios 2.5, impresa 150). Se puede habilitar la exploración del libro completo con una opción explícita. La página 64 de Precálculo, con problemas de aplicaciones, queda fuera del alcance actual. Todas las páginas dentro del alcance tienen un acceso de lectura o práctica; eso incluye las portadas y los índices, que no contienen ejercicios.

## Límites que deben mantenerse visibles

El banco de 141 preguntas es curado y adaptado de los temas; **no contiene una clave automática para cada inciso de los dos libros**. El visor presenta la imagen real de la página del PDF cargado por el usuario. Los cuadernos verifican las transformaciones que el estudiante ingresa, no extraen ni resuelven automáticamente el ejercicio de la imagen. No hay OCR ni tutor externo de IA.

El motor proposicional no valida expresiones cuantificadas. El motor algebraico compara identidades racionales mediante expansión de polinomios, con coeficientes numéricos y límites de tamaño; no certifica que la forma esté factorizada ni comprueba radicales. Las restricciones se verifican por separado en preguntas que las exigen. El simulacro es una sesión de aprendizaje con reintentos, no un examen cerrado.

Los borradores del cuaderno y las notas de páginas se guardan automáticamente en este dispositivo. Cambiar de modo del cuaderno reinicia la zona de trabajo. El progreso se guarda al comprobar una respuesta. La copia JSON contiene progreso y monedas, pero no los PDF, notas ni borradores. Borrar datos del navegador puede borrar estos materiales locales.

## Materiales y correcciones

Base temática: los materiales de clase de Discreta S1–S4 y Precálculo S4 entregados por el usuario; los ejercicios originales recibidos; *Introducción a la Matemática Discreta*, Manuel Murillo Tsijli, 4.ª edición (Editorial Tecnológica de Costa Rica); y *Precálculo 2024*, Prof. Didier Alberto Castro Méndez, ULACIT.

Se señalan errores del material: equivalencia falsa en S1, inversión de abierto/cerrado en circuitos S2 y erratas en las leyes de complemento S4. No se inventaron premisas ni conjuntos faltantes. Los incisos del folio externo de Precálculo se pueden consultar ahora en el libro; aún no están todos transformados en actividades autocorregidas.

## Publicación

Este repositorio contiene el código. No implica que exista una app desplegada. Publicar `dist/` en un hosting estático con HTTPS. El service worker respeta el subdirectorio y precarga los archivos del build. Antes de afirmar soporte offline en un nuevo hosting, probar la instalación completa y la recarga sin red.

## Próxima ampliación del banco

Para cada inciso: registrar semana, sección, número y página; verificar visualmente la notación; preparar respuesta y restricciones; convertirlo al formato interactivo adecuado; revisar una solución por pasos y probar respuestas correctas e incorrectas. Mantener los ejercicios ambiguos pendientes de revisión. Priorizar lo que el docente confirme para el examen dentro de dos semanas.
