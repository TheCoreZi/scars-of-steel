# Cicatrices de Acero

Juego de aventura textual sobre la carrera de un piloto de Zoids.

## Requisitos

- Node.js 20.19 o una versión compatible posterior.
- npm.

El proyecto usa el registro público de npm mediante su archivo `.npmrc`.

## Instalación

```sh
npm install --registry=https://registry.npmjs.org/
```

El parámetro `--registry` también evita que una variable de entorno sustituya el
registro del proyecto.

## Desarrollo

```sh
npm run dev
```

## Verificación

```sh
npm run typecheck
npm run lint
npm run format:check
npm run test:run
npm run build
```

Usa `npm test` para ejecutar las pruebas en modo interactivo. Usa `npm run
lint:fix` o `npm run format` para corregir archivos. Usa `npm run preview` para
servir el build local.
