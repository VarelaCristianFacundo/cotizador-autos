# Cotizador de seguros de autos (REDPAS)

Next.js 14. El front consume una API propia (`app/api/*`) alimentada con datos públicos:

| Endpoint | Fuente |
|---|---|
| `GET /api/brands`, `POST /api/cars` | `data/vehiculos.json` — Tabla de Valuación de Automotores de la **DNRPA** (~18.000 vehículos, valores 0km → 2002) |
| `GET /api/provinces`, `GET /api/locations/:id` | `data/localidades.json` — API **Georef** (datos.gob.ar) |
| `POST /api/quote` | `lib/tarifas.ts` — cotización **estimativa**: suma asegurada = valor DNRPA del año, premio = tasa por cobertura × zona × antigüedad × factor compañía |

> Los premios NO son tarifas oficiales de las aseguradoras. Ajustá tasas/fijos/factores en `lib/tarifas.ts`.

## Correr

```bash
npm install
npm run dev        # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` (en `.env`) apunta a `/api`. Para volver al backend anterior (multicotizador Adminse, requiere códigos InfoAuto) cambialo a `http://77.37.40.230:8000`.

## Actualizar datos

La DNRPA publica la tabla vigente todos los meses.

```bash
pip install -r scripts/requirements.txt
python scripts/import_dnrpa.py     # descarga el PDF vigente y regenera data/vehiculos.json (~3 min)
node scripts/import_georef.mjs     # regenera data/localidades.json
```
