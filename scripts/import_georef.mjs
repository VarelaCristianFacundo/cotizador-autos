// Descarga provincias y localidades de la API Georef (datos.gob.ar) a data/localidades.json
// Uso: node scripts/import_georef.mjs
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API = 'https://apis.datos.gob.ar/georef/api'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'localidades.json')

const get = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

const { provincias } = await get(`${API}/provincias?campos=id,nombre&max=30`)
provincias.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

const localidades = {}
for (const prov of provincias) {
  const data = await get(
    `${API}/localidades?provincia=${prov.id}&campos=id,nombre,departamento.nombre&max=5000&orden=nombre`
  )
  // Una entrada por nombre+departamento (Georef tiene duplicados de asentamientos)
  const seen = new Set()
  localidades[prov.id] = data.localidades
    .filter((l) => {
      const key = `${l.nombre}|${l.departamento?.nombre}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((l) => ({
      id: Number(l.id),
      nombre: l.departamento?.nombre && l.departamento.nombre !== l.nombre
        ? `${l.nombre} (${l.departamento.nombre})`
        : l.nombre,
      codigo_postal: '',
    }))
  console.log(`${prov.nombre}: ${localidades[prov.id].length} localidades`)
}

await mkdir(path.dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify({ fuente: 'Georef - datos.gob.ar', provincias, localidades }))
console.log(`-> ${OUT}`)
