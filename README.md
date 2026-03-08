# SIFA

Proyecto web base con Vite + HTML/CSS/JS modular.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Estructura recomendada

```text
.
|-- index.html
|-- public/
|-- src/
|   |-- app/
|   |   `-- mountApp.js
|   |-- styles/
|   |   |-- main.css
|   |   |-- variables.css
|   |   |-- base.css
|   |   |-- layout.css
|   |   `-- components.css
|   |-- main.js
|   |-- counter.js          # opcional (plantilla original)
|   `-- javascript.svg      # opcional (plantilla original)
|-- package.json
`-- .gitignore
```

## Buenas practicas aplicadas

- Entrada unica (`src/main.js`) y render en modulo separado (`src/app/`).
- Estilos divididos por responsabilidad (`variables`, `base`, `layout`, `components`).
- `index.html` limpio, solo shell y metadatos.
- Estructura preparada para agregar features por carpetas (`src/features/...`).

## Siguiente paso recomendado

Para crecer la app:

1. Crear `src/features/<nombre>/` para cada modulo funcional.
2. Agregar `src/services/` para llamadas API.
3. Agregar linter/formatter (`eslint` + `prettier`).
