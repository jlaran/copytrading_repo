// README.md
/*
# CopyTrading Backend

Sistema de backend para un servicio de copy trading con EAs conectados a una base de datos centralizada y control de acceso por Google Sheets.

## Características
- Registro y distribución de señales
- Ejecución y monitoreo de operaciones
- Control de acceso para cada EA basado en Google Sheets
- Almacenamiento en PostgreSQL
- Despliegue compatible con Render

## Requisitos
- Node.js v18+
- PostgreSQL
- Cuenta en [Render](https://render.com)
- Hoja de Google Sheets con columnas: `account_number`, `api_key`, `enabled`

## Instalación
```bash
git clone https://github.com/tuusuario/copytrading-backend.git
cd copytrading-backend
npm install
```

Copia el archivo de entorno:
```bash
cp .env.example .env
```

Edita el `.env` con tus credenciales de Render y Google Sheets.

## Despliegue en Render
1. Crea una base de datos PostgreSQL en Render y copia la URL
2. Crea un nuevo Web Service conectado a este repositorio
3. Configura las variables de entorno en Render:
   - `DATABASE_URL`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_API_KEY`
4. Render ejecutará `npm install` y `node server.js` por defecto

## Endpoints
- `POST /signals`: registrar nueva señal
- `GET /signals`: obtener señales pendientes
- `POST /executions`: registrar ejecución por parte del EA
- `GET /check_access`: verificar si un EA tiene acceso

## Licencia
MIT
*/