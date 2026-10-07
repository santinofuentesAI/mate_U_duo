# Verificación de la entrega

El recorrido conecta las lecciones con Book Exam, el catálogo revisado, los borradores locales y los PDF privados; Técnica permite buscar el texto auxiliar, consultar el original y continuar en la práctica. No hay API de calificación nueva ni transferencia de los PDF a un servidor.

| Límite del flujo | Evidencia |
|---|---|
| Identificación y orden del catálogo | Inventario visual de 52 páginas, 526 actividades; prueba independiente de cantidades por página, ñ, romanos y padres de 1.7. |
| Corrección existente | 59 prácticas alcanzables; las claves, pistas y explicaciones se conservan. Las pruebas del motor revisan resultados, equivalencias, exclusiones y formas requeridas. |
| Fórmulas → interfaz | Todas las fórmulas revisadas se comprueban con KaTeX sin ignorar errores. |
| Enunciado → desarrollo → almacenamiento | Prueba táctil de varias líneas, Enter, inserción en el cursor, borrado, deshacer/rehacer, guardar, salir y recargar. |
| Almacenamiento → reanudación | Mismo borrador y posición tras salir y tras recarga; siguiente/anterior conserva cada borrador individual. |
| PDF → visor | Ambas ediciones exactas importadas, hash verificado, fórmula/tabla/diagrama, ampliación y retorno dentro de la app. |
| Práctica revisada → resultado | Demostración 1.4:1a completada con inferencias comprobadas; explicación visible y estado validado en Book Exam. |
| Técnica → búsqueda → ejercicio | Búsqueda de predicados, página73, original, paso a1b y siguiente1c. |
| Uso móvil | Pantalla390×844 y tablet800×1280/1280×800; controles táctiles y ausencia de desbordamiento horizontal del documento. |
| Tema oscuro | Ambas tablets probadas con modo oscuro; fórmulas, editor y controles visibles. |
| Sin conexión | Recarga, catálogo, borrador, búsqueda/texto auxiliar, PDF importado y páginas originales comprobados con red desactivada. |
| Errores | Sin excepciones de página, alertas nativas ni solicitudes a `/books/*.pdf` en el recorrido. |

Se corrigió durante las pruebas una inserción de símbolos que podía usar la posición anterior del cursor: ahora lee la selección del área editable justo antes de insertar o borrar. También se corrigieron dos comandos LaTeX sin separador y se agregó el contexto faltante del sistema formal, axiomas, teoremas y paradojas referenciadas.

Comandos de verificación:

```bash
npm ci
npm test
npm run build
TEST_CHROMIUM_PATH=/ruta/chromium \
TEST_PRECALC_BOOK=/ruta/precalculo.pdf \
TEST_DISCRETA_BOOK=/ruta/discreta.pdf \
node tests/book-flow.mjs
```

Para repetir en producción, añadir `TEST_URL=https://mate-u-duo.vercel.app`. Los PDF permanecen locales y no se guardan como artefactos de las pruebas en git. Las capturas y registros se generan en `tmp/qa/` y en la carpeta de trabajo de auditoría, respectivamente.

La verificación del commit final en Vercel se realiza después de publicar los cambios: estado GitHub `Vercel:success`, consulta del ID del despliegue para confirmar `READY`, `githubCommitSha`, target production y alias, y ejecución del mismo recorrido en el alias de producción. La evidencia concreta del SHA y despliegue se comunica en la entrega final; no se infiere `READY` solo porque compile localmente.

Las faltas de transcripción gráfica, claves nuevas, teoría exacta y asignación semanal están en [COVERAGE.md](COVERAGE.md). Esta entrega no certifica que la app sustituya íntegramente ambos libros.
