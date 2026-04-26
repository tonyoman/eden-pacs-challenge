# Eden PACS – QA Challenge

## Herramienta bajo prueba
Zoom — menú circular del visor MPR

## Tecnologías
- Playwright
- TypeScript

## Instalación

```bash
npm install
npx playwright install --with-deps chromium
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

MPR_URL=https://pacs.evacenter.com/v2/mpr?studyId=738cb683-8426-42a1-b27e-921f455b70c4&tab=images&ac=dXNlcj1ldmEtY2VudGVyQHZpc2l0YW50LmNvbSZwYXNzd29yZD0zOTc5NzRlNS1hOWExLTQyOWYtYWRmMS02YzJkOTQ4ODhhYmImZXh0cmFfdmFsaWRhdGlvbj02ODkxNjNiYS0wMzAzLTRlYTEtYTRlMC1mNGE5Y2RiYTQ0YWQ%3D%3D%3D&md=1&serieId=0d018bf7-c18f-4882-b8fb-440fb72299d8&fromViewer=mobile_viewer

## Correr los tests

```bash
npm test
```

## Ver el reporte

```bash
npx playwright show-report
```

## Qué cubre

- Apertura del menú circular con click derecho
- Selección de Zoom desde el menú circular
- Cierre del menú circular
- Dropdown de Predefined Levels y sus opciones clínicas
- Selección de preset y actualización del label
- Independencia entre Zoom y Predefined Levels

## Qué NO cubre

- Validación visual del canvas WebGL
- Opciones del submenú circular (sin selectores estables)
- Cambios de W/L en el overlay (renderizado en canvas)

## Documento de análisis

Ver `ANALYSIS.md`