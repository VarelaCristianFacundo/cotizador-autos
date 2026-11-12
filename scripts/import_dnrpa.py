"""
Importa la Tabla de Valuación de Automotores de la DNRPA (pública) a data/vehiculos.json.

Fuente: https://www.dnrpa.gov.ar/valuacion/cons_valuacion.php
La DNRPA publica mensualmente la tabla vigente en PDF (valores en ARS por marca/modelo/tipo/año).

Uso:
    pip install -r scripts/requirements.txt
    python scripts/import_dnrpa.py                # descarga la tabla vigente
    python scripts/import_dnrpa.py ruta/tabla.pdf # usa un PDF ya descargado
"""
import json
import re
import sys
import tempfile
import urllib.request
from datetime import date
from pathlib import Path

import pdfplumber

BASE = "https://www.dnrpa.gov.ar/valuacion/"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "vehiculos.json"

# Rangos horizontales (en puntos PDF) de las columnas de texto
COL_MARCA = (94, 129)
COL_MODELO = (129, 179)
COL_TIPO = (179, 228)


def descargar_pdf_vigente() -> Path:
    req = urllib.request.Request(BASE + "cons_valuacion.php", headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req, timeout=60).read().decode("latin-1")
    m = re.search(r'href\s*=\s*"(informacion/\d{2}-\d{2}-\d{4}\.pdf)"', html)
    if not m:
        sys.exit("No se encontró el link al PDF vigente en la página de la DNRPA")
    url = BASE + m.group(1)
    print(f"Descargando {url}")
    dest = Path(tempfile.gettempdir()) / "dnrpa_tabla.pdf"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    dest.write_bytes(urllib.request.urlopen(req, timeout=300).read())
    return dest


def segmentos(chars):
    """Agrupa caracteres (en el orden en que se dibujan en el PDF) en segmentos de texto.

    Los modelos con nombre largo se superponen visualmente con la columna "Tipo", así que
    no se puede ordenar por x: se corta un segmento cuando la x retrocede o hay un hueco grande.
    """
    segs = []
    cur, start, prev_x0, prev_x1 = [], None, None, None
    for c in chars:
        cruza_columna = prev_x0 is not None and any(prev_x0 < b <= c["x0"] for b in (COL_MARCA[0], COL_MODELO[0]))
        if prev_x1 is not None and (c["x0"] < prev_x1 - 1 or c["x0"] - prev_x1 > 5 or cruza_columna):
            segs.append((start, "".join(cur).strip()))
            cur, start = [], None
        if start is None:
            start = c["x0"]
        cur.append(c["text"])
        prev_x0, prev_x1 = c["x0"], c["x1"]
    if cur:
        segs.append((start, "".join(cur).strip()))
    return segs


def texto_en(segs, rango):
    return " ".join(t for x, t in segs if rango[0] <= x < rango[1] and t).strip()


def parsear(pdf_path: Path):
    vehiculos = []
    vigencia = None
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            words = page.extract_words()
            lines: dict[int, list] = {}
            for w in words:
                lines.setdefault(round(w["top"]), []).append(w)
            chars_por_linea: dict[int, list] = {}
            for c in page.chars:  # orden de dibujo
                chars_por_linea.setdefault(round(c["top"]), []).append(c)

            # Columnas de años a partir del encabezado de la página
            year_cols = []
            for top in sorted(lines):
                ws = sorted(lines[top], key=lambda w: w["x0"])
                texts = [w["text"] for w in ws]
                if "Vigencia" in texts and vigencia is None:
                    vigencia = texts[texts.index("Vigencia") + 1]
                if "0Km" in texts:
                    year_cols = [(w["x0"], "0km" if w["text"] == "0Km" else w["text"])
                                 for w in ws if w["text"] == "0Km" or re.fullmatch(r"(19|20)\d{2}", w["text"])]
                    break
            if not year_cols:
                continue
            first_val_x = year_cols[0][0] - 15

            for top in sorted(lines):
                ws = sorted(lines[top], key=lambda w: w["x0"])
                if len(ws) < 4 or ws[0]["text"] not in ("I", "N"):
                    continue
                codigo = ws[1]["text"]
                if not re.fullmatch(r"[0-9A-Z]{7,8}", codigo):
                    continue
                texto = segmentos([c for c in chars_por_linea.get(top, []) if c["x0"] < first_val_x])
                # Valores: cada dígito va a la columna de año cuyo encabezado lo precede.
                # Los valores arrancan ~6-7pt antes que el encabezado (y los de 9 dígitos se pegan entre sí).
                digitos: dict[str, str] = {}
                for c in chars_por_linea.get(top, []):
                    if c["x0"] >= first_val_x and c["text"].isdigit():
                        cols = [yc for yc in year_cols if yc[0] - 8 <= c["x0"]]
                        if cols:
                            k = cols[-1][1]
                            digitos[k] = digitos.get(k, "") + c["text"]
                valores = {k: int(v) for k, v in digitos.items()}
                marca = texto_en(texto, COL_MARCA)
                modelo = texto_en(texto, COL_MODELO)
                tipo = texto_en(texto, COL_TIPO)
                if not marca or not modelo or not valores:
                    continue
                vehiculos.append({
                    "codigo": codigo,
                    "origen": "Nacional" if ws[0]["text"] == "N" else "Importado",
                    "marca": marca,
                    "modelo": modelo,
                    "tipo": tipo,
                    "valores": valores,
                })
    return vigencia, vehiculos


def main():
    pdf_path = Path(sys.argv[1]) if len(sys.argv) > 1 else descargar_pdf_vigente()
    vigencia, vehiculos = parsear(pdf_path)
    # Si el tipo quedó pegado al final del modelo ("... ATSEDAN 5 PUERTAS"), separarlo
    tipos = sorted({v["tipo"] for v in vehiculos if len(v["tipo"]) >= 5}, key=len, reverse=True)
    for v in vehiculos:
        if not v["tipo"]:
            t = next((t for t in tipos if v["modelo"].endswith(t) and len(v["modelo"]) > len(t)), None)
            if t:
                v["modelo"], v["tipo"] = v["modelo"][: -len(t)].strip(), t
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "fuente": "DNRPA - Tabla de Valuación de Automotores",
        "vigencia": vigencia,
        "importado": date.today().isoformat(),
        "vehiculos": vehiculos,
    }, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    marcas = {v["marca"] for v in vehiculos}
    print(f"Vigencia {vigencia}: {len(vehiculos)} vehículos, {len(marcas)} marcas -> {OUT}")


if __name__ == "__main__":
    main()
