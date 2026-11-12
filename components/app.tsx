"use client";

import { Logo } from "@/components/brand/Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiResponse, CotizacionItem, RawData } from "@/utils/types";
import {
  AlertOctagon,
  ArrowRight,
  BadgeCheck,
  Car,
  Check,
  ChevronDown,
  Clock,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  PiggyBank,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import AutocompleteComponent from "./ui/AutocompleteComponent";
import { DataModal } from "./ui/DataModal";
import SelectComponent from "./ui/SelectComponent";

const WHATSAPP = "5491133598514";
const EMAIL = "info@segurosyservicios.com.ar";

const ASEGURADORAS: Record<string, string> = {
  allianz: "Allianz",
  atm: "ATM Seguros",
  fedpat: "Federación Patronal",
  integrity: "Integrity",
  mercantil: "Mercantil Andina",
  rivadavia: "Rivadavia",
  rus: "Río Uruguay",
};

const COBERTURAS_INFO = [
  {
    nombre: "Responsabilidad Civil",
    desc: "La cobertura obligatoria por ley: daños que tu auto cause a terceros, personas o bienes.",
    tag: "Básica",
  },
  {
    nombre: "Terceros Completo",
    desc: "RC más robo, hurto e incendio total y parcial, y destrucción total por accidente.",
    tag: "La más elegida",
  },
  {
    nombre: "Terceros Premium",
    desc: "Todo lo anterior más granizo, rotura de cristales y cerraduras.",
    tag: "Recomendada",
  },
  {
    nombre: "Todo Riesgo",
    desc: "Cubre también los daños parciales de tu propio auto, con franquicia a tu cargo.",
    tag: "Máxima protección",
  },
];

const PASOS = [
  { icon: Car, titulo: "Contanos tu auto", texto: "Marca, año y versión. Tenemos más de 18.000 modelos." },
  { icon: Zap, titulo: "Compará al instante", texto: "Precios y coberturas de 7 aseguradoras lado a lado." },
  { icon: BadgeCheck, titulo: "Contratá en el día", texto: "Un productor matriculado te acompaña por WhatsApp." },
];

const BENEFICIOS = [
  { icon: PiggyBank, titulo: "Hasta 30% de ahorro", texto: "Comparar te asegura pagar lo justo por la cobertura que necesitás." },
  { icon: Headset, titulo: "Asesoramiento real", texto: "Productores matriculados en la SSN, no un call center." },
  { icon: MapPin, titulo: "Presencia nacional", texto: "Una red de productores en todo el país, siempre cerca tuyo." },
  { icon: ShieldCheck, titulo: "Post venta de excelencia", texto: "Te acompañamos en siniestros, endosos y renovaciones." },
];

const FAQ = [
  {
    q: "¿Cuánto cuesta usar el cotizador?",
    a: "Nada. Cotizar y comparar es gratis y sin compromiso. Solo pagás la póliza que decidas contratar, al mismo precio que en la aseguradora.",
  },
  {
    q: "¿Qué influye en el precio del seguro?",
    a: "Cada vehículo tiene una cotización distinta según marca, modelo, año, zona de radicación y uso. También pesan la cobertura elegida, la franquicia y los adicionales como granizo o cristales.",
  },
  {
    q: "¿Los precios que veo son finales?",
    a: "Son valores de referencia mensuales. El precio final lo confirma la aseguradora al emitir la póliza, según la inspección del vehículo y tus datos.",
  },
  {
    q: "¿Puedo contratar online?",
    a: "Sí. Elegís la oferta, nos escribís por WhatsApp y un productor te guía para dejar el auto asegurado en el día, estés donde estés.",
  },
  {
    q: "¿Quiénes son REDPAS?",
    a: "SegurosyServicios es una empresa de RedPas, Red de Productores y Organizadores de Seguros. Operamos en todo el país y trabajamos con compañías líderes.",
  },
];

const formatARS = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export function App() {
  const [cotizaciones, setCotizaciones] = useState<CotizacionItem[]>([]);
  const [apiError, setApiError] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedCoverage, setSelectedCoverage] = useState<CotizacionItem | null>(null);

  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedAno, setSelectedAno] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const [selectedModeloId, setSelectedModeloId] = useState("");

  const resetModelo = () => {
    setSelectedModelo("");
    setSelectedModeloId("");
  };
  const isFormComplete = Boolean(selectedMarca && selectedAno && selectedModelo && selectedModeloId);
  const vehiculo = `${selectedMarca} ${selectedModelo}`.trim();
  // "GOL TREND 1.6 (SEDAN 5 PUERTAS)" -> modelo + carrocería
  const [, modeloBase = selectedModelo, carroceria = ""] = selectedModelo.match(/^(.*?)\s*\(([^)]*)\)$/) ?? [];
  const anioLabel = selectedAno === "0KM" ? "0 km" : selectedAno;

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const list = ["0KM"];
    for (let y = current; y >= 2000; y--) list.push(String(y));
    return list;
  }, []);

  const handleSuccessData = (data: ApiResponse) => {
    const items: CotizacionItem[] = [];
    Object.entries(data).forEach(([companyName, companyData]) => {
      companyData?.cotizaciones?.forEach((cotizacion) => {
        const sumaAsegurada = cotizacion.suma_asegurada || 0;
        cotizacion.coberturas?.forEach((cobertura) => {
          const tipoCobertura = cobertura.tipo_cobertura || "Otras";
          cobertura.subtipos?.forEach((subtipo) => {
            const raw: Partial<RawData> = subtipo.raw_data ?? {};
            items.push({
              aseguradora: companyName.toUpperCase(),
              precio: parseFloat(subtipo.premio) || 0,
              cobertura: subtipo.descripcion_cobertura || "",
              sumaAsegurada,
              tipoCobertura,
              descripcionComercial: raw.descripcionComercial || "",
              detalleCoberturaRC: raw.detalleCoberturaRC || "",
              detalleCoberturaCasco: raw.detalleCoberturaCasco || "",
              franquicia: raw.franquicia?.toString() || "",
              auxilioMecanico: raw.auxilioMecanico || "",
              paisesLimitrofes: raw.paisesLimitrofes || "",
              itemsCobertura: subtipo.items_cobertura || [],
            });
          });
        });
      });
    });

    setCotizaciones(items);
    const tipos = Array.from(new Set(items.map((i) => i.tipoCobertura)));
    setActiveTab(tipos.find((t) => t === "Terceros Completo") ?? tipos[0] ?? "");
    setIsEmailDialogOpen(false);
    setTimeout(() => document.getElementById("cotizacion")?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const grupos = useMemo(() => {
    const map = new Map<string, CotizacionItem[]>();
    cotizaciones.forEach((c) => map.set(c.tipoCobertura, [...(map.get(c.tipoCobertura) ?? []), c]));
    map.forEach((list) => list.sort((a, b) => a.precio - b.precio));
    return map;
  }, [cotizaciones]);

  const ofertas = grupos.get(activeTab) ?? [];
  const sumaAsegurada = cotizaciones[0]?.sumaAsegurada ?? 0;

  const nombreCia = (key: string) => ASEGURADORAS[key.toLowerCase()] ?? key;
  const mensajeContratar = (c: CotizacionItem) =>
    `¡Hola! Quiero contratar ${c.tipoCobertura} de ${nombreCia(c.aseguradora)} para mi ${vehiculo} ${anioLabel}. Precio cotizado: $${formatARS(c.precio)}/mes.`;

  return (
    <div className="min-h-screen bg-background">
      {/* ───────────── Header ───────────── */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#" aria-label="REDPAS inicio">
            <Logo inverted />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <a href="#como-funciona" className="transition hover:text-white">Cómo funciona</a>
            <a href="#coberturas" className="transition hover:text-white">Coberturas</a>
            <a href="#beneficios" className="transition hover:text-white">Por qué REDPAS</a>
            <a href="#faq" className="transition hover:text-white">Preguntas</a>
          </nav>
          <a
            href={waLink("¡Hola! Quiero asesoramiento para asegurar mi auto.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
            <span className="hidden sm:inline">Hablar con un asesor</span>
            <span className="sm:hidden">Asesor</span>
          </a>
        </div>
      </header>

      <main>
        {/* ───────────── Hero ───────────── */}
        <section className="relative isolate overflow-hidden bg-ink pb-20 pt-28 sm:pb-28 sm:pt-36">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-b" />
          <div className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-brand-500/35 blur-[120px]" />
          <div className="pointer-events-none absolute -right-32 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-spark-500/20 blur-[120px]" />

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 ring-1 ring-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:hidden rounded-full bg-mint-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-500" />
                </span>
                7 aseguradoras · cotización al instante
              </span>
              <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[64px]">
                El seguro de tu auto,{" "}
                <span className="bg-gradient-to-r from-brand-300 via-brand-200 to-spark-400 bg-clip-text text-transparent">
                  al mejor precio.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
                Compará coberturas de las aseguradoras líderes del país en menos de un minuto. Gratis y con el
                respaldo de productores matriculados.
              </p>
              <ul className="mt-8 grid gap-3 text-[15px] text-white/80 sm:grid-cols-3 sm:gap-4">
                {["Sin costo ni compromiso", "Asesor por WhatsApp", "Contratás en el día"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-mint-500/15">
                      <Check className="h-3 w-3 text-mint-500" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <dl className="mt-10 hidden grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8 sm:grid">
                {[
                  ["7", "aseguradoras"],
                  ["+18.000", "modelos cotizables"],
                  ["24/7", "atención por WhatsApp"],
                ].map(([n, l]) => (
                  <div key={l} className="px-6 first:pl-0">
                    <dt className="text-3xl font-bold tracking-tight text-white">{n}</dt>
                    <dd className="mt-1 text-sm text-white/50">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Card de cotización */}
            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="absolute -inset-px -z-10 rounded-[28px] bg-gradient-to-b from-white/30 to-white/0 blur-sm" />
              <div className="rounded-[28px] bg-white p-6 shadow-lift sm:p-8">
                {apiError ? (
                  <div className="py-6 text-center">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50">
                      <AlertOctagon className="h-7 w-7 text-red-600" />
                    </span>
                    <h2 className="mt-4 text-xl font-semibold text-ink">¡Ups! Algo salió mal</h2>
                    <p className="mt-2 text-sm text-ink/60">
                      No pudimos cargar la información de las aseguradoras. Escribinos y te cotizamos al instante.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <a href={waLink("¡Hola! Quiero cotizar el seguro de mi auto.")} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        <FaWhatsapp className="h-5 w-5" /> WhatsApp
                      </a>
                      <a href={`mailto:${EMAIL}`} className="btn-secondary h-12">
                        <Mail className="h-4 w-4" /> Email
                      </a>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setIsEmailDialogOpen(true);
                    }}
                  >
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold tracking-tight text-ink">Cotizá tu auto</h2>
                        <p className="mt-1 text-sm text-ink/65">Completá 3 datos y mirá los precios.</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600">
                        Paso 1 de 2
                      </span>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
                        <SelectComponent
                          label="Marca"
                          selectedValue={selectedMarca}
                          setSelectedValue={(v) => {
                            setSelectedMarca(v);
                            resetModelo();
                          }}
                          setError={setApiError}
                        />
                        <div>
                          <label htmlFor="ano" className="field-label">Año</label>
                          <select
                            id="ano"
                            className="field"
                            value={selectedAno}
                            onChange={(e) => {
                              setSelectedAno(e.target.value);
                              resetModelo();
                            }}
                          >
                            <option value="">Elegí el año</option>
                            {years.map((y) => (
                              <option key={y} value={y}>{y === "0KM" ? "0 km" : y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <AutocompleteComponent
                        anio={selectedAno}
                        marca={selectedMarca}
                        selectedModelo={selectedModelo}
                        setSelectedModelo={setSelectedModelo}
                        setSelectedModeloId={setSelectedModeloId}
                      />
                    </div>

                    <button type="submit" disabled={!isFormComplete} aria-describedby="cotizar-hint" className="btn-primary mt-6 w-full">
                      Cotizar ahora <ArrowRight className="h-4 w-4" />
                    </button>
                    <p id="cotizar-hint" className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink/60">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {isFormComplete
                        ? "Tarda menos de 1 minuto · Sin llamadas molestas"
                        : "Elegí marca, año y un modelo de la lista para continuar"}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── Aseguradoras ───────────── */}
        <section id="aseguradoras" className="border-b border-ink/5 bg-white py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
            Trabajamos con las aseguradoras líderes del país
          </p>
          <div className="mask-fade-x mt-8 overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused] motion-reduce:animate-none">
              {[...Object.keys(ASEGURADORAS), ...Object.keys(ASEGURADORAS)].map((key, i) => (
                <div key={`${key}-${i}`} aria-hidden={i >= Object.keys(ASEGURADORAS).length} className="flex items-center gap-3 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
                  <Image src={`/images/${key}.png`} alt="" width={40} height={40} className="h-9 w-9 object-contain" />
                  <span className="whitespace-nowrap text-base font-semibold text-ink/80">{ASEGURADORAS[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── Resultados ───────────── */}
        {cotizaciones.length > 0 && (
          <section id="cotizacion" className="scroll-mt-16 bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-5">
              <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50">
                    <Car className="h-7 w-7 text-brand-600" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Tu cotización</p>
                    <h2 className="mt-1 text-lg font-bold tracking-tight text-ink sm:text-2xl">
                      {selectedMarca} {modeloBase}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink/65">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink/70">{anioLabel}</span>
                      {carroceria && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink/70">{carroceria}</span>
                      )}
                      <span>
                        Suma asegurada <span className="font-semibold text-ink">${formatARS(sumaAsegurada)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <a href="#" className="btn-secondary shrink-0">
                  <RefreshCcw className="h-4 w-4" /> Cambiar vehículo
                </a>
              </div>

              {/* Tabs de cobertura */}
              <div className="relative -mx-5 mt-8 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-gradient-to-l after:from-slate-50 sm:after:hidden">
              <div className="overflow-x-auto px-5 pb-1">
                <div role="tablist" aria-label="Tipo de cobertura" className="inline-flex min-w-full gap-2 pr-8 sm:min-w-0 sm:pr-1.5 sm:rounded-2xl sm:bg-white sm:p-1.5 sm:shadow-soft">
                  {Array.from(grupos.entries()).map(([tipo, list], i, all) => {
                    const active = tipo === activeTab;
                    return (
                      <button
                        key={tipo}
                        role="tab"
                        id={`tab-${i}`}
                        aria-selected={active}
                        aria-controls="ofertas-panel"
                        tabIndex={active ? 0 : -1}
                        onClick={() => setActiveTab(tipo)}
                        onKeyDown={(e) => {
                          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                          const next = (i + (e.key === "ArrowRight" ? 1 : -1) + all.length) % all.length;
                          setActiveTab(all[next][0]);
                          document.getElementById(`tab-${next}`)?.focus();
                        }}
                        className={`shrink-0 rounded-xl px-4 py-2.5 text-left transition ${
                          active ? "bg-ink text-white shadow-soft" : "bg-white text-ink/75 ring-1 ring-ink/10 hover:bg-slate-100 sm:bg-transparent sm:ring-0"
                        }`}
                      >
                        <span className="block text-sm font-semibold">{tipo}</span>
                        <span className={`block text-xs ${active ? "text-white/70" : "text-ink/60"}`}>
                          desde ${formatARS(list[0]?.precio ?? 0)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              </div>

              {ofertas[0] && (
                <p className="mt-6 text-sm text-ink/60">{ofertas[0].cobertura}</p>
              )}

              {/* Ofertas */}
              <ul id="ofertas-panel" role="tabpanel" aria-label={activeTab} className="mt-4 grid gap-3">
                {ofertas.map((c, i) => {
                  const best = i === 0;
                  return (
                    <li
                      key={`${c.aseguradora}-${c.tipoCobertura}`}
                      className={`group relative grid animate-fade-up grid-cols-[1fr_auto] items-center gap-x-4 gap-y-5 rounded-2xl bg-white p-5 shadow-soft ring-1 transition hover:shadow-lift sm:grid-cols-[auto_1fr_auto] sm:p-6 lg:grid-cols-[auto_1fr_auto_auto] ${
                        best ? "ring-2 ring-mint-500" : "ring-ink/5"
                      }`}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {best && (
                        <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-mint-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                          <Sparkles className="h-3 w-3" /> Mejor precio
                        </span>
                      )}
                      <div className="flex min-w-0 items-center gap-3 sm:w-56 sm:gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-50 ring-1 ring-ink/5 sm:h-14 sm:w-14">
                          <Image
                            src={`/images/${c.aseguradora.toLowerCase()}.png`}
                            alt={nombreCia(c.aseguradora)}
                            width={40}
                            height={40}
                            className="h-9 w-9 object-contain"
                          />
                        </span>
                        <div>
                          <p className="truncate font-semibold text-ink">{nombreCia(c.aseguradora)}</p>
                          <p className="text-xs text-ink/60">{c.tipoCobertura}</p>
                        </div>
                      </div>

                      <ul className="hidden flex-wrap gap-1.5 lg:flex">
                        {c.itemsCobertura.slice(0, 4).map((item) => (
                          <li key={item} className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs text-ink/65">
                            <Check className="h-3 w-3 text-mint-600" strokeWidth={3} /> {item}
                          </li>
                        ))}
                        {c.itemsCobertura.length > 4 && (
                          <li className="rounded-full px-2 py-1 text-xs text-ink/60">+{c.itemsCobertura.length - 4}</li>
                        )}
                      </ul>

                      <div className="text-right">
                        <p className="text-2xl sm:text-[28px] font-bold leading-none tracking-tight text-ink">
                          <span className="align-top text-base font-semibold text-ink/60">$</span>
                          {formatARS(c.precio)}
                        </p>
                        <p className="mt-1 text-xs text-ink/60">por mes · estimado</p>
                      </div>

                      <div className="col-span-2 flex gap-2 sm:col-span-3 lg:col-span-1">
                        <button onClick={() => setSelectedCoverage(c)} className="btn-secondary flex-1 lg:flex-none">
                          Detalle
                        </button>
                        <a
                          href={waLink(mensajeContratar(c))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-5 text-sm font-semibold transition lg:flex-none ${
                            best ? "bg-spark-500 text-white hover:bg-spark-600" : "bg-ink text-white hover:bg-ink-700"
                          }`}
                        >
                          Contratar <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 text-center text-xs text-ink/60">
                Precios de referencia mensuales. El valor final lo confirma cada aseguradora según la inspección del
                vehículo y los datos del asegurado.
              </p>
            </div>
          </section>
        )}

        {/* ───────────── Cómo funciona ───────────── */}
        <section id="como-funciona" className="scroll-mt-16 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Cómo funciona</span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Asegurá tu auto en 3 pasos
              </h2>
              <p className="mt-4 text-lg text-ink/60">Sin formularios eternos ni llamados. Vos elegís, nosotros te acompañamos.</p>
            </div>
            <ol className="mt-14 grid gap-6 md:grid-cols-3">
              {PASOS.map(({ icon: Icon, titulo, texto }, i) => (
                <li key={titulo} className="relative rounded-3xl bg-white p-8 shadow-soft ring-1 ring-ink/5">
                  <span className="absolute right-6 top-6 font-mono text-sm font-semibold text-ink/20">0{i + 1}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-glow">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{titulo}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────────── Coberturas ───────────── */}
        <section id="coberturas" className="scroll-mt-16 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-xl">
                <span className="eyebrow">Coberturas</span>
                <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Elegí cuánto querés proteger
                </h2>
              </div>
              <p className="max-w-md text-ink/60">
                Desde la responsabilidad civil obligatoria hasta todo riesgo. Te ayudamos a encontrar el equilibrio
                justo entre precio y tranquilidad.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COBERTURAS_INFO.map((c, i) => (
                <div
                  key={c.nombre}
                  className={`flex flex-col rounded-3xl p-7 ring-1 transition hover:-translate-y-1 ${
                    i === 1 ? "bg-ink text-white ring-ink" : "bg-slate-50 text-ink ring-ink/5"
                  }`}
                >
                  <span
                    className={`self-start rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      i === 1 ? "bg-spark-500 text-white" : "bg-white text-brand-600 ring-1 ring-ink/5"
                    }`}
                  >
                    {c.tag}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{c.nombre}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${i === 1 ? "text-white/65" : "text-ink/60"}`}>{c.desc}</p>
                  <div className="mt-6 flex gap-1">
                    {[0, 1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className={`h-1.5 flex-1 rounded-full ${
                          n <= i ? (i === 1 ? "bg-spark-500" : "bg-brand-500") : i === 1 ? "bg-white/15" : "bg-ink/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── Beneficios ───────────── */}
        <section id="beneficios" className="relative isolate scroll-mt-16 overflow-hidden bg-ink py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" />
          <div className="pointer-events-none absolute -right-40 -top-20 -z-10 h-[480px] w-[480px] rounded-full bg-brand-500/25 blur-[120px]" />
          <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200 ring-1 ring-white/10">
                Por qué REDPAS
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Una red de productores de tu lado
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/60">
                No somos una aseguradora: somos productores matriculados que comparamos por vos y te acompañamos
                antes, durante y después de contratar.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-spark-400 to-spark-600 text-white shadow-[0_8px_24px_-8px_rgba(255,122,26,.7)]">
                  <BadgeCheck className="h-6 w-6" />
                </span>
                <p className="text-sm text-white/60">
                  <span className="font-semibold text-white">Productores matriculados</span>
                  <br />
                  en la Superintendencia de Seguros
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {BENEFICIOS.map(({ icon: Icon, titulo, texto }) => (
                <div key={titulo} className="rounded-3xl bg-white/[0.04] p-7 ring-1 ring-white/10 transition hover:bg-white/[0.07]">
                  <Icon className="h-7 w-7 text-brand-300" />
                  <h3 className="mt-5 font-semibold text-white">{titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── FAQ ───────────── */}
        <section id="faq" className="scroll-mt-16 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <span className="eyebrow">Preguntas frecuentes</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Lo que tenés que saber</h2>
              <p className="mt-4 text-ink/60">
                ¿Te quedó alguna duda?{" "}
                <a href={waLink("¡Hola! Tengo una consulta sobre seguros de auto.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
                  Escribinos por WhatsApp
                </a>
                .
              </p>
            </div>
            <div className="divide-y divide-ink/10 rounded-3xl bg-white px-6 shadow-soft ring-1 ring-ink/5 sm:px-8">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 transition group-open:rotate-180 group-open:bg-brand-500 group-open:text-white">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="mt-3 pr-12 text-[15px] leading-relaxed text-ink/60">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── CTA ───────────── */}
        <section className="px-5 pb-20 sm:pb-28">
          <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-900 px-6 py-14 text-center sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-70" />
            <div className="pointer-events-none absolute -bottom-24 left-1/2 -z-10 h-64 w-[600px] -translate-x-1/2 rounded-full bg-spark-500/40 blur-[100px]" />
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Preferís que te asesore una persona?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
              Un productor matriculado te responde por WhatsApp y te arma la mejor propuesta para tu auto.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={waLink("¡Hola! Quiero asesoramiento para asegurar mi auto.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-ink shadow-lift transition hover:-translate-y-px"
              >
                <FaWhatsapp className="h-5 w-5 text-[#25D366]" /> Escribir por WhatsApp
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4" /> {EMAIL}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ───────────── Footer ───────────── */}
      <footer className="bg-ink text-white/60">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              SegurosyServicios es una empresa de RedPas, Red de Productores y Organizadores de Seguros. Operamos en
              todo el país con compañías líderes.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Rodríguez Peña 375 5° A, CABA</li>
              <li className="flex gap-2"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0" /> 11 3359-8514 · 11 4192-6851</li>
              <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <a href={`mailto:${EMAIL}`} className="hover:text-white">{EMAIL}</a>
                  <br />
                  <a href="mailto:info@redpas.com.ar" className="hover:text-white">info@redpas.com.ar</a>
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Productores</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0" /> Miguel García · Mat. SSN 56757</li>
              <li className="flex gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0" /> Matías Padín · Mat. SSN 66985</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 pb-24 pt-6 text-xs text-white/60 sm:pb-6 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} SegurosyServicios · REDPAS. Todos los derechos reservados.</p>
            <p>
              Superintendencia de Seguros de la Nación · 0800-666-8400 ·{" "}
              <a href="https://www.argentina.gob.ar/ssn" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                argentina.gob.ar/ssn
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      {!isEmailDialogOpen && !selectedCoverage && (
      <a
        href={waLink("¡Hola! Quiero cotizar el seguro de mi auto.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#128C4A] text-white shadow-[0_12px_32px_-8px_rgba(18,140,74,.7)] ring-2 ring-white transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>
      )}

      {/* Modal: datos de contacto */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader className="pr-10 text-left">
            <span className="mb-2 self-start rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600">
              Paso 2 de 2
            </span>
            <DialogTitle className="text-2xl font-bold tracking-tight text-ink">¿A quién le enviamos la cotización?</DialogTitle>
            <DialogDescription className="text-ink/65">
              {vehiculo} · {anioLabel}
            </DialogDescription>
          </DialogHeader>
          <DataModal
            onSuccess={handleSuccessData}
            onClose={() => setIsEmailDialogOpen(false)}
            ano={selectedAno}
            modelId={selectedModeloId}
          />
        </DialogContent>
      </Dialog>

      {/* Modal: detalle de cobertura */}
      <Dialog open={!!selectedCoverage} onOpenChange={(open) => !open && setSelectedCoverage(null)}>
        <DialogContent className="max-w-xl" onOpenAutoFocus={(e) => e.preventDefault()}>
          {selectedCoverage && (
            <>
              <DialogHeader className="pr-10 text-left">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-slate-50 ring-1 ring-ink/5">
                    <Image
                      src={`/images/${selectedCoverage.aseguradora.toLowerCase()}.png`}
                      alt=""
                      width={40}
                      height={40}
                      className="h-9 w-9 object-contain"
                    />
                  </span>
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-ink">
                      {selectedCoverage.tipoCobertura}
                    </DialogTitle>
                    <DialogDescription className="text-ink/65">{nombreCia(selectedCoverage.aseguradora)}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                <div className="rounded-2xl bg-ink p-4 text-white">
                  <p className="text-xs text-white/70">Precio mensual</p>
                  <p className="mt-1 text-xl font-bold tabular-nums tracking-tight sm:text-2xl">${formatARS(selectedCoverage.precio)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-ink/5">
                  <p className="text-xs text-ink/60">Suma asegurada</p>
                  <p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-ink sm:text-2xl">${formatARS(selectedCoverage.sumaAsegurada)}</p>
                </div>
              </div>

              <dl className="divide-y divide-ink/5 text-sm">
                {[
                  ["Franquicia", selectedCoverage.franquicia && selectedCoverage.franquicia !== "0" ? `$${formatARS(Number(selectedCoverage.franquicia))}` : ""],
                  ["Auxilio mecánico", selectedCoverage.auxilioMecanico],
                  ["Países limítrofes", selectedCoverage.paisesLimitrofes],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between py-3">
                      <dt className="text-ink/65">{k}</dt>
                      <dd className="font-medium text-ink">{v}</dd>
                    </div>
                  ))}
              </dl>

              {selectedCoverage.itemsCobertura.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-ink">Qué incluye</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {selectedCoverage.itemsCobertura.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-ink/70">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-mint-50">
                          <Check className="h-3 w-3 text-mint-600" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(selectedCoverage.detalleCoberturaRC || selectedCoverage.detalleCoberturaCasco) && (
                <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-ink/65">
                  {selectedCoverage.detalleCoberturaRC && (
                    <p><span className="font-semibold text-ink">Responsabilidad civil: </span>{selectedCoverage.detalleCoberturaRC}</p>
                  )}
                  {selectedCoverage.detalleCoberturaCasco && (
                    <p><span className="font-semibold text-ink">Daños al vehículo: </span>{selectedCoverage.detalleCoberturaCasco}</p>
                  )}
                </div>
              )}

              <a
                href={waLink(mensajeContratar(selectedCoverage))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <FaWhatsapp className="h-5 w-5" /> Contratar por WhatsApp
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
