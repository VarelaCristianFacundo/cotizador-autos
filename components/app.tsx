"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ApiResponse,
  CotizacionItem
} from '@/utils/types';
import { motion } from "framer-motion";
import { AlertOctagon, Car, ChevronDown, ChevronUp, HelpCircle, Mail, Moon, MousePointerClick, Scale, Sun } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { FaWhatsapp } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";
import 'swiper/css/free-mode';
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AutocompleteComponent from "./ui/AutocompleteComponent";
import { DataModal } from "./ui/DataModal";
import SelectComponent from "./ui/SelectComponent";

export function App() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [cotizaciones, setCotizaciones] = useState<CotizacionItem[]>([]);
  const [apiError, setApiError] = useState(false); // Estado de error
  const [openCoverageTypes, setOpenCoverageTypes] = useState<{ [key: string]: boolean }>({});
  const [hasScrolled, setHasScrolled] = useState(false);

  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedAno, setSelectedAno] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const [selectedModeloId, setSelectedModeloId] = useState("");
  const [selectedCoverage, setSelectedCoverage] = useState<CotizacionItem | null>(null);
  const [isCoverageModalOpen, setIsCoverageModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showFullDetalleCoberturaRC, setShowFullDetalleCoberturaRC] = useState(false);
  const [showFullDetalleCoberturaCasco, setShowFullDetalleCoberturaCasco] = useState(false);

  const logos = [
    "allianz",
    "atm",
    "fedpat",
    "integrity",
    "mercantil",
    "rivadavia",
    "rus",
  ];

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailDialogOpen(true);
  };
  const handleSuccessData = (data: ApiResponse) => {
    const cotizacionesArray: CotizacionItem[] = [];
    Object.entries(data).forEach(([companyName, companyData]) => {
      if (companyData && Array.isArray(companyData.cotizaciones)) {
        companyData.cotizaciones.forEach((cotizacion) => {
          const sumaAsegurada = cotizacion.suma_asegurada || 0;
          if (Array.isArray(cotizacion.coberturas)) {
            cotizacion.coberturas.forEach((cobertura) => {
              const tipoCobertura = cobertura.tipo_cobertura || 'N/A';

              if (Array.isArray(cobertura.subtipos)) {
                cobertura.subtipos.forEach((subtipo) => {
                  const rawData = subtipo.raw_data;
                  cotizacionesArray.push({
                    aseguradora: companyName.toUpperCase(),
                    precio: parseFloat(subtipo.premio) || 0,
                    cobertura: subtipo.descripcion_cobertura || 'Descripción no disponible',
                    sumaAsegurada,
                    tipoCobertura,
                    descripcionComercial: rawData.descripcionComercial || '',
                    detalleCoberturaRC: rawData.detalleCoberturaRC || '',
                    detalleCoberturaCasco: rawData.detalleCoberturaCasco || '',
                    franquicia: rawData.franquicia?.toString() || '',
                    auxilioMecanico: rawData.auxilioMecanico || '',
                    paisesLimitrofes: rawData.paisesLimitrofes || '',
                    itemsCobertura: subtipo.items_cobertura || [],
                  });
                });
              }
            });
          }
        });
      }
    });

    setCotizaciones(cotizacionesArray);
    setIsEmailDialogOpen(false);
  };

  const openCoverageModal = (cotizacion: CotizacionItem) => {
    setSelectedCoverage(cotizacion);
    setIsCoverageModalOpen(true);
  };


  const isFormComplete =
    selectedMarca && selectedAno && selectedModelo;

  const cardData = [
    {
      title: "Ventajas de contratar un seguro para autos con REDPAS",
      icon: <Car className="w-12 h-12 text-logo-blue1" />,
      summary:
        "Gana tranquilidad, seguridad y confianza con nuestro servicio de seguros para autos.",
      fullText:
        "Contratando un seguro para autos con REDPAS estarás ganando tranquilidad, seguridad y confianza. Una de las principales ventajas de nuestra plataforma es la facilidad y rapidez para comparar las distintas coberturas y costos de seguros para autos que ofrecen las aseguradoras más prestigiosas del país. Cada propuesta contempla la mejor opción para cada uno de nuestros clientes. Podrás asegurar tu auto en el día con nuestras soluciones digitales.",
    },
    {
      title: "Estés donde estés, cotizá a un clic",
      icon: <MousePointerClick className="w-12 h-12 text-logo-blue1" />,
      summary:
        "Contrata en línea con asesoramiento personalizado y asistencia en todo el proceso.",
      fullText:
        "Contratar en línea no supone riesgos, te acompañamos en todo el proceso con asesoramiento personalizado. Luego de completado el formulario con los datos requeridos del vehículo y de contacto, obtendrás la propuesta con la cotización a medida, también podrás recibir nuestra asistencia personal para evacuar dudas y conocer más detalles de las pólizas de tu interés. Con nuestra solución obtendrás el seguro ideal, estés donde estés.",
    },
    {
      title: "El Mejor Comparador para el Seguro de tu Auto",
      icon: <Scale className="w-12 h-12 text-logo-blue1" />,
      summary:
        "Obtén hasta un 30% de ahorro y trabaja con las aseguradoras más prestigiosas.",
      fullText:
        "Obtené hasta un 30% de ahorro. Trabajamos con las aseguradoras más prestigiosas. Brindamos un servicio post venta de excelencia. La forma más eficiente de cotizar online una póliza de seguro automotor es mediante un comparador de seguros, esta herramienta te ayudará a encontrar la cobertura ideal. Ofrecemos esta solución digital con atención las 24 horas vía WhatsApp. De esta forma, economizarás tiempo y encontrarás el costo que más se ajusta a tus necesidades.",
    },
    {
      title: "¿Qué saber antes de contratar un seguro para autos?",
      icon: <HelpCircle className="w-12 h-12 text-logo-blue1" />,
      summary:
        "Conoce los factores que influyen en la cotización de tu seguro de auto.",
      fullText:
        "Al momento de planificar el presupuesto y conocer el costo del seguro para tu auto, es fundamental saber que cada vehículo tendrá una cotización diferente según la marca, el modelo, el año, la ubicación de riesgo, entre otras variables del auto. El cotizador de REDPAS te ayudará a elegir el tipo de cobertura más conveniente para vos.",
    },
  ];

  const groupedCotizaciones = cotizaciones.reduce<Record<string, CotizacionItem[]>>((acc, cotizacion) => {
    if (!acc[cotizacion.tipoCobertura]) {
      acc[cotizacion.tipoCobertura] = [];
    }
    acc[cotizacion.tipoCobertura].push(cotizacion);
    return acc;
  }, {});


  const toggleCoverageType = (tipoCobertura: string) => {
    setOpenCoverageTypes(prevState => ({
      ...prevState,
      [tipoCobertura]: !prevState[tipoCobertura],
    }));
  };

  useEffect(() => {
    if (!isEmailDialogOpen && cotizaciones.length > 0 && !hasScrolled) {
      const coverageKeys = Object.keys(groupedCotizaciones);
      if (coverageKeys.length > 0) {
        const firstKey = coverageKeys[0];
        setOpenCoverageTypes(prev => ({ ...prev, [firstKey]: true }));
        const element = document.getElementById('coverage-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setHasScrolled(true);
      }
    }
  }, [isEmailDialogOpen, cotizaciones, groupedCotizaciones, hasScrolled]);

  // Generar años dinámicos + 0KM
  const currentYear = new Date().getFullYear();
  const years = ["0KM"];
  for (let y = currentYear; y >= 2000; y--) {
    years.push(String(y));
  }

  // Función para formatear precio
  const formatPrecio = (num: number) => {
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Función para formatear suma asegurada sin decimales
  const formatSumaAsegurada = (num: number) => {
    return num.toLocaleString('es-AR', { maximumFractionDigits: 0 });
  };


  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center items-center">
          <motion.img
            src={`/images/logo.png`}
            alt="Seguros Online Logo"
            className="h-15 md:h-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <nav style={{ display: 'none' }}>
            <ul className="flex space-x-4 items-center">
              <li>
                <Button
                  variant="outline"
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center justify-center "
                >
                  {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-blue-800" />}
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20">
        <section
          className="bg-cover bg-center py-28"
          style={{ backgroundImage: `url('/images/auto.png')` }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-28 lg:px-32">
            <h1 className="text-3xl font-bold text-center mb-8 text-logo-blue1">
              Seguros para Autos
            </h1>

            {/* Si hay un error en la API, mostrar vista de error */}
            {apiError ? (
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
                <AlertOctagon className="w-24 h-24 mx-auto text-red-600 mb-4" />
                <h2 className="text-xl font-semibold text-red-600 mb-4">¡Ups! Algo salió mal</h2>
                <p className="text-gray-700 mb-6">
                  En este momento no podemos cargar la información de las aseguradoras
                  debido a un problema técnico. Puedes contactarnos directamente por
                  WhatsApp o correo electrónico para obtener asistencia.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded"
                    onClick={() => window.open("https://wa.me/+5491133598514", "_blank")}
                  >
                    <FaWhatsapp className="w-5 h-5" /> WhatsApp
                  </Button>
                  <Button
                    className="bg-logo-blue1 hover:bg-logo-blue2 text-white flex items-center gap-2 px-4 py-2 rounded"
                    onClick={() => window.location.href = "mailto:info@segurosyservicios.com.ar"}
                  >
                    <Mail className="w-5 h-5" /> Contacto por Email
                  </Button>
                </div>
              </div>
            ) : (
              // Formulario normal de cotización si no hay errores de API
              <form
                onSubmit={handleQuoteSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              >
                <div className="grid grid-cols-1 gap-4">
                  {/* Select Marca con manejo de error */}
                  <SelectComponent
                    label="Marca"
                    selectedValue={selectedMarca}
                    setSelectedValue={setSelectedMarca}
                    setError={setApiError} // Pasar el setError para manejar errores de API
                  />

                  {/* Select Año */}
                  <div className="space-y-2">
                    <label htmlFor="ano" className="text-gray-700">
                      Año
                    </label>
                    <select
                      id="ano"
                      className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-logo-blue2"
                      value={selectedAno}
                      onChange={(e) => setSelectedAno(e.target.value)}
                    >
                      <option value="">Seleccionar Año</option>
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Modelo */}
                  <AutocompleteComponent
                    anio={selectedAno}
                    marca={selectedMarca}
                    selectedModelo={selectedModelo}
                    setSelectedModelo={setSelectedModelo}
                    setSelectedModeloId={setSelectedModeloId}
                  />
                </div>

                {/* Botón de Cotizar */}
                <Button
                  type="submit"
                  id="coverage-section"
                  className={`w-full mt-6 ${isFormComplete ? "bg-logo-blue1" : "bg-gray-300"}`}
                  disabled={!isFormComplete}
                >
                  Cotizar
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* Modal de cotización */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Datos adicionales para cotización</DialogTitle>
            </DialogHeader>
            {/* Aquí, en DataModal, cuando envíes el quoteData, revisa es_0_km */}
            {/* es_0_km: selectedAno === "0KM" ? "1" : "0" */}
            <DataModal
              onSuccess={handleSuccessData}
              onClose={() => setIsEmailDialogOpen(false)}
              ano={selectedAno}
              modelId={selectedModeloId}
            />
          </DialogContent>
        </Dialog>

        <div className={`py-8`}>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {Object.entries(groupedCotizaciones).map(([tipoCobertura, cotizaciones]) => {
              const coberturaDescripcion = cotizaciones.length > 0 ? cotizaciones[0].cobertura : '';
              return (
                <div key={tipoCobertura} className="mb-6">
                  <button
                    onClick={() => toggleCoverageType(tipoCobertura)}
                    className="flex items-center justify-between w-full p-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-lg font-semibold">
                      {tipoCobertura} - {coberturaDescripcion} <span className="text-sm">({cotizaciones.length})</span>
                    </span>
                    {openCoverageTypes[tipoCobertura] ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>
                  <Collapse isOpened={openCoverageTypes[tipoCobertura]}>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4">
                      {cotizaciones.map((cotizacion, index) => {
                        const formattedSuma = formatSumaAsegurada(cotizacion.sumaAsegurada);
                        const formattedPrecio = formatPrecio(cotizacion.precio);

                        return (
                          <Card key={index} className={`shadow-md bg-${darkMode ? 'gray-800' : 'white'} text-${darkMode ? 'white' : 'black'}`}>
                            <CardHeader className="flex items-center p-2 flex-col justify-center m-0">
                              <Image
                                src={`/images/${cotizacion.aseguradora.toLowerCase()}.png`}
                                alt={`${cotizacion.aseguradora} logo`}
                                width={80}
                                height={40}
                                className="h-12 w-auto object-contain"
                              />
                              <div className="text-center">
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  Suma asegurada: ${formattedSuma}
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {cotizacion.aseguradora}
                                </p>
                              </div>
                            </CardHeader>
                            <CardContent className="flex p-4 flex-col justify-center m-0">
                              <div className="text-center mb-4">
                                <p className="text-md font-semibold">Precio: ${formattedPrecio}</p>
                              </div>
                            </CardContent>
                            <CardFooter className="flex flex-col items-center">
                              <Button
                                variant="outline"
                                onClick={() => openCoverageModal(cotizacion)}
                                className="mb-2 w-full"
                              >
                                Ver detalle
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  </Collapse>
                </div>
              );
            })}

          </div>

          {/* Modal para mostrar la cobertura completa */}
          <Dialog
            open={isCoverageModalOpen}
            onOpenChange={setIsCoverageModalOpen}
          >
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detalle de Cobertura</DialogTitle>
              </DialogHeader>
              {selectedCoverage && (() => {
                const formattedSuma = selectedCoverage.sumaAsegurada
                  ? formatSumaAsegurada(selectedCoverage.sumaAsegurada)
                  : null;
                const formattedPrecio = formatPrecio(selectedCoverage.precio);

                return (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                      {selectedCoverage.descripcionComercial || selectedCoverage.tipoCobertura}
                    </h2>
                    <p><strong>Aseguradora:</strong> {selectedCoverage.aseguradora}</p>
                    <p><strong>Precio:</strong> ${formattedPrecio}</p>

                    {formattedSuma && (
                      <p><strong>Suma asegurada:</strong> ${formattedSuma}</p>
                    )}
                    {selectedCoverage.franquicia && (
                      <p><strong>Franquicia:</strong> {selectedCoverage.franquicia}</p>
                    )}
                    {selectedCoverage.auxilioMecanico && (
                      <p><strong>Auxilio Mecánico:</strong> {selectedCoverage.auxilioMecanico}</p>
                    )}
                    {selectedCoverage.paisesLimitrofes && (
                      <p><strong>Cobertura en países limítrofes:</strong> {selectedCoverage.paisesLimitrofes}</p>
                    )}

                    {selectedCoverage.detalleCoberturaRC && (
                      <>
                        <p><strong>Detalle de Responsabilidad Civil:</strong></p>
                        <p>
                          {showFullDetalleCoberturaRC
                            ? selectedCoverage.detalleCoberturaRC
                            : `${selectedCoverage.detalleCoberturaRC.substring(0, 200)}...`}
                        </p>
                        {selectedCoverage.detalleCoberturaRC.length > 200 && (
                          <Button
                            variant="link"
                            onClick={() => setShowFullDetalleCoberturaRC(!showFullDetalleCoberturaRC)}
                          >
                            {showFullDetalleCoberturaRC ? "Ver menos" : "Ver más"}
                          </Button>
                        )}
                      </>
                    )}

                    {selectedCoverage.detalleCoberturaCasco && (
                      <>
                        <p><strong>Detalle de Cobertura:</strong></p>
                        <p>
                          {showFullDetalleCoberturaCasco
                            ? selectedCoverage.detalleCoberturaCasco
                            : `${selectedCoverage.detalleCoberturaCasco.substring(0, 200)}...`}
                        </p>
                        {selectedCoverage.detalleCoberturaCasco.length > 200 && (
                          <Button
                            variant="link"
                            onClick={() => setShowFullDetalleCoberturaCasco(!showFullDetalleCoberturaCasco)}
                          >
                            {showFullDetalleCoberturaCasco ? "Ver menos" : "Ver más"}
                          </Button>
                        )}
                      </>
                    )}

                    {selectedCoverage.itemsCobertura.length > 0 && (
                      <div>
                        <p><strong>Items de Cobertura:</strong></p>
                        <ul className="list-disc list-inside">
                          {selectedCoverage.itemsCobertura.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Button className="w-full bg-logo-blue1 text-white">
                      Contratar
                    </Button>
                  </div>
                );
              })()}
            </DialogContent>
          </Dialog>
        </div>

        {/* Carrusel de logos */}
        <section className="py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
            >
              {logos.map((company, index) => (
                <SwiperSlide key={`company-${company}-${index}`}>
                  <div className="flex justify-center">
                    <Image
                      src={`/images/${company}.png`}
                      alt={`${company} logo`}
                      width={120}
                      height={50}
                      className="h-16 w-auto object-contain sm:h-12"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Cards de información */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cardData.map((card, index) => (
                <Card key={`card-${index}`} className="flex flex-col shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      {card.icon}
                      <CardTitle>{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>{expandedCard === index ? card.fullText : card.summary}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setExpandedCard(expandedCard === index ? null : index)
                      }
                      className="transition-all bg-logo-blue1 hover:bg-logo-blue2 text-white hover:text-white"
                    >
                      {expandedCard === index ? "Mostrar menos" : "Ver más"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-logo-blue1 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Sección Nosotros */}
            <div>
              <h3 className="text-lg font-semibold mb-4 underline">Nosotros</h3>
              <ul className="space-y-4">
                <li>
                  <p className="text-sm leading-relaxed">
                    SegurosyServicios es una empresa de RedPas, Red de Productores y Organizadores de Seguros. Operamos en todo el país, lo que significa que siempre tendrás un productor matriculado cerca de ti. Trabajamos con compañías líderes, asegurando competitividad y excelencia en nuestros servicios.
                  </p>
                </li>
              </ul>
            </div>

            {/* Sección Contacto */}
            <div>
              <h3 className="text-lg font-semibold mb-4 underline">Contacto</h3>
              <p>CASA CENTRAL: Rodriguez Peña 375 5 A - CABA</p>
              <p>Miguel Garcia, Matricula SSN 56757 - Tel: 1141926851</p>
              <p>Matias Padin, Matricula SSN 66985 - Tel: 1133598514</p>
              <p>Email: <a href="mailto:info@segurosyservicios.com.ar" className="underline hover:text-gray-300">info@segurosyservicios.com.ar</a> - <a href="mailto:info@redpas.com.ar" className="underline hover:text-gray-300">info@redpas.com.ar</a></p>
            </div>
          </div>

          {/* Divider and Copyright */}
          <div className="border-t border-white mt-8 pt-8 text-center">
            <p className="text-xs text-white">© {new Date().getFullYear()} SegurosyServicios. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>


      <Button
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 bg-logo-blue2 hover:bg-logo-blue4 flex items-center justify-center"
        onClick={() => window.open("https://wa.me/+5491133598514", "_blank")}
      >
        <FaWhatsapp className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
}
