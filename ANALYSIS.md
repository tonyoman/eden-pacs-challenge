# Eden PACS – QA Challenge: Documento de Análisis

**Herramienta seleccionada:** Zoom (menú circular y toolbar)

---

## Actividad 1 — Análisis Funcional

### ¿Qué hace el Zoom?

El Zoom es una herramienta del visor MPR que permite al usuario ampliar 
áreas específicas de la imagen para analizar órganos con más detalle

La implementación actual sincroniza el nivel de zoom entre los tres planos anatómicos

### Contexto clínico

Un radiólogo utilizaría el Zoom cuando necesita examinar de cerca una 
estructura u órgano específico que requiere más detalle del que se puede ver en el zoom por default. 
Por ejemplo, en este estudio un radiólogo haría zoom para analizar los márgenes y la textura de un órgano en detalle y determinar si hay anomalías que reportar

### Comportamiento esperado

1. El Zoom se activa en el plano seleccionado al elegirlo desde el menú circular o el toolbar
2. Al hacer click y arrastrar sobre el canvas, la imagen se amplía o reduce en todos los planos independientemente de donde se haga click
3. Cada plano debería hacer zoom de forma independiente






## Actividad 2 — Diseño de casos de prueba 


# TC-01 | Prioridad: Alta
```
Feature: Menú circular del visor MPR

  Scenario: El menú circular se abre al hacer click derecho
    Given el visor MPR está cargado con un estudio DICOM
    And los tres planos son visibles (Axial, Coronal, Sagital)
    When el usuario hace click derecho sobre el canvas
    Then el menú circular aparece visible
    And el elemento #circular-menu tiene la clase "opened-nav"
```

# TC-02 | Prioridad: Alta
```Feature: Menú circular del visor MPR

  Background:
    Given el visor MPR está cargado con un estudio DICOM
    And los tres planos son visibles (Axial, Coronal, Sagital)

  Scenario: Seleccionar Zoom desde el menú circular activa la herramienta
    Given el menú circular está abierto
    When el usuario hace hover sobre la opción Zoom
    And el menú confirma "Zoom" en su atributo data-content
    And el usuario hace click sobre la opción Zoom
    Then el menú circular se cierra automáticamente
    And el botón Zoom en el toolbar queda con data-state="active"
    And el cursor cambia a una imagen de lupa sobre el canvas
```

# TC-03 | Prioridad: Media
```Feature: Menú circular del visor MPR

  Background:
    Given el visor MPR está cargado con un estudio DICOM
    And los tres planos son visibles (Axial, Coronal, Sagital)

  Scenario: El menú circular se cierra al hacer click fuera
    Given el menú circular está abierto
    When el usuario hace click fuera del menú circular
    Then el menú circular se cierra
    And el elemento #circular-menu pierde la clase "opened-nav"
```

# TC-04 | Prioridad: Alta
```Feature: Dropdown de Predefined Levels

  Background:
    Given el visor MPR está cargado con un estudio DICOM
    And los tres planos son visibles (Axial, Coronal, Sagital)

  Scenario: El dropdown de Predefined Levels muestra todas las opciones clínicas
    Given el dropdown "Predefined levels" está visible en la barra de herramientas
    When el usuario hace click en el dropdown
    Then se despliegan las siguientes opciones clínicas:
      | Predefined Levels |
      | Mediastinum |
      | Lung        |
      | Bone        |
      | Brain       |
      | Head        |
      | Belly       |
      | Liver       |
```

# TC-05 | Prioridad: Alta
```Feature: Dropdown de Predefined Levels

  Background:
    Given el visor MPR está cargado con un estudio DICOM
    And los tres planos son visibles (Axial, Coronal, Sagital)

  Scenario: Seleccionar un preset actualiza el label del dropdown
    Given el dropdown "Predefined levels" está visible en la barra de herramientas
    When el usuario hace click en el dropdown
    And selecciona la opción "Mediastinum"
    Then el label del dropdown cambia de "Predefined levels" a "Mediastinum"
    And el dropdown se cierra automáticamente
```

# TC-06 | Prioridad: Alta
```Feature: Independencia entre herramientas del visor MPR

  Background:
    Given el visor MPR está cargado con un estudio DICOM
    And los tres planos son visibles (Axial, Coronal, Sagital)

  Scenario: Zoom y Predefined Levels operan de forma independiente
    Given el dropdown "Predefined levels" está visible en la barra de herramientas
    And el botón Zoom está visible en la barra de herramientas
    When el usuario hace click derecho en el canvas
    And el menú circular se abre
    And el usuario selecciona Zoom desde el menú circular
    And el usuario selecciona la opción "Bone" en el dropdown de la barra de herramientas
    Then el botón Zoom tiene el atributo data-state="active"
    And el label del dropdown muestra "Bone"
```

# TC-07 | Prioridad: Media
```Feature: Menú circular del visor MPR

  Background:
    Given el visor MPR está cargado con un estudio DICOM
    And los tres planos son visibles (Axial, Coronal, Sagital)

  Scenario: El menú circular se cierra automáticamente al seleccionar una herramienta
    Given el menú circular está abierto
    When el usuario hace click en la opción Zoom
    Then el menú circular se cierra automáticamente
    And el elemento #circular-menu pierde la clase "opened-nav"
```

# TC-08 | Prioridad: Alta

```Scenario: El visor carga sin errores en las llamadas GraphQL
    Given el visor MPR está cargado con un estudio DICOM
    And el backend GraphQL está disponible
    When el visor inicializa y ejecuta sus queries de carga
    Then ninguna respuesta GraphQL contiene el campo "errors"
    And todas las operaciones retornan datos válidos
```




## Actividad 4 — Bug Reports y Feedback

### Bug #1

**Título:** Restore resetea la imagen pero no desactiva el tool Zoom

**Severidad:** Media

**Pasos para reproducir:**
1. Abrir el visor MPR
2. Activar el tool Zoom desde el menú circular o el toolbar
3. Hacer zoom in en cualquier plano
4. Hacer click en el botón "Restore" en el toolbar

**Resultado esperado:** 
La imagen regresa a su zoom predeterminado Y la herramienta Zoom se desactiva, 
regresando al tool por defecto (Crosshairs)

**Resultado actual:** 
La imagen regresa a su zoom predeterminado pero el botón Zoom 
permanece con data-state="active" — el tool sigue activo

**Impacto clínico:** 
El radiólogo puede creer que está en modo Crosshairs para navegar 
entre planos, pero en realidad sigue en modo Zoom, puede hacer 
zoom accidental sin darse cuenta, especialmente en sesiones largas 


### Bug #2

**Título:** El layout del visor cambió de 4 planos a 3 de forma permanente e irreproducible

**Severidad:** Alta

**Pasos para reproducir:**
1. Abrir el link del visor MPR
2. Observar que actualmente muestra 3 planos (Axial, Coronal, Sagital)

**Resultado esperado:**
El visor debe mostrar 4 planos (Axial, Coronal, Sagital, 3D) 
de forma consistente al abrir el mismo link

**Resultado actual:**
El visor muestra únicamente 3 planos. Al inicio de la sesión 
de testing mostraba 4 planos. El cambio ocurrió 
de forma espontánea y no es reproducible. Sin acción explícita del usuario

**Impacto clínico:**
Alto. La pérdida de un plano elimina una herramienta diagnóstica 
crítica para poder realizar hallazgos entre planos


### Bug #3

**Título:** Múltiples tools no registrados en VIEWPORT_3D_TOOL_GROUP generan errores silenciosos en consola

**Severidad:** Baja

**Pasos para reproducir:**
1. Abrir el visor MPR
2. Abrir DevTools → pestaña Console
3. Observar los errores al cargar el visor

**Resultado esperado:**
El visor debe inicializar todos los tools correctamente 
sin errores en consola

**Resultado actual:**
Los siguientes errores aparecen repetidamente en consola:
- `'Crosshairs' is not registered with this toolGroup (VIEWPORT_3D_TOOL_GROUP_ID)`
- `WindowLevel3DTool not added to toolGroup, can't set tool mode`

**Impacto clínico:**
Bajo. La funcionalidad del visor no se ve afectada directamente


### Feedback #1

**Observación:**
El menú circular podría ser redundante. La mayoría de todas las herramientas 
disponibles en el menú circular ya están accesibles directamente desde el toolbar superior con un solo click

**Por qué es un problema de UX:**
El menú circular requiere dos interacciones para activar una 
herramienta, click derecho + seleccionar opción deseada. Mientras que 
el toolbar requiere solo un click. Para un radiólogo que lee 
decenas de estudios al día, se vuelve muy tedioso. 
Adicionalmente, no existe evidencia visual dentro del visor de que el 
menú circular exista. Le tendrían que explicar al usuario esa funcionalidad

**Propuesta de mejora:**
Realizar un estudio de usabilidad con radiólogos reales para 
determinar si el menú circular agrega valor en su flujo de trabajo 
o si genera confusión. Si la mayoría prefiere el toolbar, considerar 
deprecar el menú circular






## Actividad 5 — Estrategia de Testing

### ¿Qué automatizé y por qué?

El challenge solicitaba automatizar una opción del menú circular. 
Elegí Zoom porque tiene el DOM más estable para automatización:

- Su estado de activación se refleja en el toolbar mediante 
  atributos DOM verificables (data-state="active", aria-selected="true")
- El menú circular tiene un id estable (#circular-menu) y una 
  clase que indica su estado (opened-nav)
- El atributo data-content del menú se actualiza con el nombre 
  de la opción en hover, permite verificar la intención antes de hacer click

Adicionalmente automaticé el dropdown de Predefined Levels porque:
- Sus opciones tienen texto visible y role="menuitem" y selectores estables
- Permite demostrar interacción entre dos features independientes


### Limitaciones encontradas con el canvas/WebGL

El visor renderiza las imágenes médicas sobre un canvas WebGL 
usando Cornerstone3D. Esto tiene implicaciones directas en la 
automatización:

**Lo que no es accesible vía DOM:**
- El contenido visual de las imágenes DICOM, no se puede 
  verificar que la imagen cambió correctamente después de 
  aplicar un preset o hacer zoom
- Las líneas de crosshair están pintadas en el canvas, 
  no existen como elementos DOM
- Las mediciones y anotaciones igual, viven dentro del canvas
- Los valores de W/L (Window/Level) del overlay — intenté 
  seleccionarlos con DevTools pero al hacer click se seleccionaba 
  todo el viewport

**Solución propuesta:**
Para validar cambios visuales en el canvas existen unas herramientas para realizar
visual regression testing como Percy by BrowserStack, Applitools Eyes 
o el propio Playwright con screenshots y comparación de pixels. 
Esto capturaría el before/after de la imagen al aplicar 
un preset o hacer zoom

### ¿Qué agregaría con más tiempo?

**1. Cobertura del submenú circular:**
Durante la exploración descubrí que el atributo data-content 
del #circular-menu se actualiza con el nombre de cualquier opción incluyendo submenús como WWWC o Brain

**2. Visual regression testing:**
Para validar cambios visuales en el canvas existen herramientas 
como Percy by BrowserStack, Applitools Eyes o el propio Playwright 
con screenshots y comparación de pixels. Esto capturaría el 
before/after de la imagen al aplicar un preset o hacer zoom

**3. Validación de APIs internas:**
Agregar tests que intercepten las respuestas GraphQL para validar
que el backend entrega datos correctos al visor


### ¿Cómo integraría estos tests en un pipeline de CI?

El proyecto ya cuenta con un archivo `.github/workflows/playwright.yml` 
configurado. El pipeline funciona así:

1. Se ejecuta automáticamente en cada push o 
   pull request a la rama main
2. Instala las dependencias con `npm ci` 
   y los browsers de Playwright
3. Corre todos los tests con `npm test`
4. El pipeline se detiene y no permite 
   mergear el código hasta que los tests pasen
5. Si hay fallos, sube el reporte HTML de 
   Playwright como artifact para que el equipo pueda revisar qué falló