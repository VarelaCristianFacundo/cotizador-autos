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
import { Car, HelpCircle, Moon, MousePointerClick, Scale, Sun } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AutocompleteComponent from "./ui/AutocompleteComponent";
import { DataModal } from "./ui/DataModal";
import SelectComponent from "./ui/SelectComponent";

export function App() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [cotizaciones, setCotizaciones] = useState<CotizacionItem[]>([]);

  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedAno, setSelectedAno] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const [selectedModeloId, setSelectedModeloId] = useState("");
  const [selectedCoverage, setSelectedCoverage] = useState<string | null>(null);
  const [isCoverageModalOpen, setIsCoverageModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
              if (Array.isArray(cobertura.subtipos)) {
                cobertura.subtipos.forEach((subtipo) => {
                  cotizacionesArray.push({
                    aseguradora: companyName.toUpperCase(),
                    precio: parseFloat(subtipo.premio) || 0,
                    cobertura: subtipo.descripcion_cobertura || 'Descripción no disponible',
                    sumaAsegurada,
                  });
                });
              }
            });
          }
        });
      }
    });

    // Actualiza el estado con las cotizaciones procesadas
    setCotizaciones(cotizacionesArray);
    setIsEmailDialogOpen(false);
  };

  const openCoverageModal = (cobertura: string) => {
    setSelectedCoverage(cobertura);
    setIsCoverageModalOpen(true);
  };

  const isFormComplete =
    selectedMarca && selectedAno && selectedModelo;

  const cardData = [
    {
      title: "Ventajas de contratar un seguro para autos con ClickSeguros",
      icon: <Car className="w-12 h-12 text-logo-blue1" />,
      summary:
        "Gana tranquilidad, seguridad y confianza con nuestro servicio de seguros para autos.",
      fullText:
        "Contratando un seguro para autos con ClickSeguros estarás ganando tranquilidad, seguridad y confianza. Una de las principales ventajas de nuestra plataforma es la facilidad y rapidez para comparar las distintas coberturas y costos de seguros para autos que ofrecen las aseguradoras más prestigiosas del país. Cada propuesta contempla la mejor opción para cada uno de nuestros clientes. Podrás asegurar tu auto en el día con nuestras soluciones digitales.",
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
        "Al momento de planificar el presupuesto y conocer el costo del seguro para tu auto, es fundamental saber que cada vehículo tendrá una cotización diferente según la marca, el modelo, el año, la ubicación de riesgo, entre otras variables del auto. El cotizador de ClickSeguros te ayudará a elegir el tipo de cobertura más conveniente para vos.",
    },
  ];

  // Ajustamos la definición de groupedCotizaciones
  const groupedCotizaciones = cotizaciones.reduce<Record<string, CotizacionItem[]>>((acc, cotizacion) => {
    if (!acc[cotizacion.aseguradora]) {
      acc[cotizacion.aseguradora] = [];
    }
    acc[cotizacion.aseguradora].push(cotizacion);
    return acc;
  }, {});





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
          style={{ backgroundImage: `url('/images/auto1.png')` }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-28 lg:px-32">
            <h1 className="text-3xl font-bold text-center mb-8 text-logo-blue1">
              Seguros para Autos
            </h1>
            <form
              onSubmit={handleQuoteSubmit}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <div className="grid grid-cols-1 gap-4">
                {/* Select Marca */}
                <SelectComponent
                  label="Marca"
                  selectedValue={selectedMarca}
                  setSelectedValue={setSelectedMarca}
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
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                    <option value="2011">2011</option>
                    <option value="2010">2010</option>
                    <option value="2009">2009</option>
                    <option value="2008">2008</option>
                    <option value="2007">2007</option>
                    <option value="2006">2006</option>
                    <option value="2005">2005</option>
                    <option value="2004">2004</option>
                    <option value="2003">2003</option>
                    <option value="2002">2002</option>
                    <option value="2001">2001</option>
                    <option value="2000">2000</option>
                  </select>
                </div>

                {/* Select Modelo */}
                <AutocompleteComponent
                  anio={selectedAno}
                  marca={selectedMarca}
                  selectedModelo={selectedModelo}
                  setSelectedModelo={setSelectedModelo}
                  setSelectedModeloId={setSelectedModeloId} // Capturar el ID del modelo
                />

              </div>

              {/* Botón de Cotizar */}
              <Button
                type="submit"
                className={`w-full mt-6 ${isFormComplete ? "bg-logo-blue1" : "bg-gray-300"
                  }`}
                disabled={!isFormComplete}
              >
                Cotizar
              </Button>
            </form>
          </div>
        </section>

        {/* Modal de cotización */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Datos adicionales para cotización</DialogTitle>
            </DialogHeader>
            <DataModal
              onSuccess={handleSuccessData}
              onClose={() => setIsEmailDialogOpen(false)}
              ano={selectedAno}
              modelId={selectedModeloId}
            />
          </DialogContent>
        </Dialog>

        {/* Mostrar cotizaciones agrupadas por aseguradora */}
        <div className="py-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {Object.entries(groupedCotizaciones).map(([aseguradora, cotizaciones]) => (
              <div key={aseguradora} className="bg-${darkMode ? 'gray-700' : 'white'} shadow-lg mb-6 p-4 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={`/images/${aseguradora.toLowerCase()}.png`}
                    alt={`${aseguradora} logo`}
                    width={80}
                    height={40}
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-600'}`}>
                      {aseguradora === 'fedpat' ? 'Federación Patronal' : aseguradora === 'mercantil' ? 'Mercantil Andina' : aseguradora.charAt(0).toUpperCase() + aseguradora.slice(1)}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Suma asegurada: ${cotizaciones[0]?.sumaAsegurada || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8">
                  {cotizaciones.map((cotizacion, index) => (
                    <Card key={index} className={`shadow-md bg-${darkMode ? 'gray-800' : 'white'} text-${darkMode ? 'white' : 'black'}`}>
                      <CardHeader>
                        <CardTitle>Precio: ${cotizacion.precio}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          onClick={() => openCoverageModal(cotizacion.cobertura)}
                          className="mt-4"
                        >
                          Ver Cobertura
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Modal para mostrar la cobertura completa */}
          <Dialog
            open={isCoverageModalOpen}
            onOpenChange={setIsCoverageModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cobertura Detallada</DialogTitle>
              </DialogHeader>
              <div>
                <p>{selectedCoverage}</p>
              </div>
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
      <footer className="bg-logo-blue1 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 underline">Nosotros</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Política de Privacidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 underline">Clientes</h3>
              <ul className="space-y-2" id="contacto">
                <li>
                  <a href="#" className="hover:underline">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Preguntas Frecuentes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 underline">Contacto</h3>
              <p>Cotizá tu auto</p>
              <p>Av. Bartolomé Mitre 1249 P.B. (B1604AKE),</p>
              <p>Florida Oeste, Buenos Aires, Argentina.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 underline">
                Socio Fundador
              </h3>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>
              Mazzulla y Padin desempeña las funciones de una sociedad de
              productores asesores de seguros conforme surge de la Ley 22.400,
              no revistiendo el carácter de compañía de seguros y se encuentra
              registrada con Matrícula 1174, expedida por la Superintendencia de
              Seguros de la Nación.
            </p>
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
