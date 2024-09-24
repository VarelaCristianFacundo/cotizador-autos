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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Car,
  HelpCircle,
  MessageCircle,
  MousePointerClick,
  Scale,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
// Import Swiper React components and required modules
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export function App() {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Estados para los valores seleccionados de los selects
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedAno, setSelectedAno] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");

  const logos = [
    "allianz",
    "bbva",
    "experta",
    "galeno",
    "integrity",
    "lasegunda",
    "mapfre",
    "mercantil",
    "meridional",
    "provincia",
    "rus",
    "sancor",
    "sancristobal",
    "smg",
    "triunfo",
    "zurich",
  ];

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailDialogOpen(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setIsEmailDialogOpen(false);
  };

  // Verificar si todos los selects están completos
  const isFormComplete =
    selectedMarca && selectedAno && selectedModelo && selectedVersion;

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.img
            src={`/images/logo.png`}
            alt="Seguros Online Logo"
            className="h-10 md:h-20" // h-10 para móviles, h-20 para pantallas medianas en adelante
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-logo-blue1">
                  Auto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600">
                  Contacto
                </a>
              </li>
            </ul>
          </nav>
          <div className="text-right">
            <p className="text-sm text-gray-600">0810 xxx xxxx</p>
            <p className="text-sm text-gray-600">(011) xxxx-xxxx</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20">
        <section
          className="bg-cover bg-center py-16"
          style={{ backgroundImage: `url('/images/auto1.png')` }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-logo-blue1">
              Seguros para Autos
            </h1>
            <form
              onSubmit={handleQuoteSubmit}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <div className="grid grid-cols-1 gap-4">
                {/* Select Marca */}
                <div className="space-y-2">
                  <label htmlFor="marca" className="text-gray-700">
                    Marca
                  </label>
                  <select
                    id="marca"
                    className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-logo-blue2"
                    value={selectedMarca}
                    onChange={(e) => {
                      setSelectedMarca(e.target.value);
                      console.log("Marca seleccionada:", e.target.value);
                    }}
                  >
                    <option value="">Seleccionar Marca</option>
                    <option value="ford">Ford</option>
                    <option value="chevrolet">Chevrolet</option>
                    <option value="toyota">Toyota</option>
                    <option value="volkswagen">Volkswagen</option>
                    <option value="renault">Renault</option>
                  </select>
                </div>

                {/* Select Año */}
                <div className="space-y-2">
                  <label htmlFor="ano" className="text-gray-700">
                    Año
                  </label>
                  <select
                    id="ano"
                    className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-logo-blue2"
                    value={selectedAno}
                    onChange={(e) => {
                      setSelectedAno(e.target.value);
                      console.log("Año seleccionado:", e.target.value);
                    }}
                  >
                    <option value="">Seleccionar Año</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                  </select>
                </div>

                {/* Select Modelo */}
                <div className="space-y-2">
                  <label htmlFor="modelo" className="text-gray-700">
                    Modelo
                  </label>
                  <select
                    id="modelo"
                    className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-logo-blue2"
                    value={selectedModelo}
                    onChange={(e) => {
                      setSelectedModelo(e.target.value);
                      console.log("Modelo seleccionado:", e.target.value);
                    }}
                  >
                    <option value="">Seleccionar Modelo</option>
                    <option value="focus">Focus</option>
                    <option value="cruze">Cruze</option>
                    <option value="corolla">Corolla</option>
                    <option value="golf">Golf</option>
                    <option value="clio">Clio</option>
                  </select>
                </div>

                {/* Select Versión */}
                <div className="space-y-2">
                  <label htmlFor="version" className="text-gray-700">
                    Versión
                  </label>
                  <select
                    id="version"
                    className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-logo-blue2"
                    value={selectedVersion}
                    onChange={(e) => {
                      setSelectedVersion(e.target.value);
                      console.log("Versión seleccionada:", e.target.value);
                    }}
                  >
                    <option value="">Seleccionar Versión</option>
                    <option value="base">Base</option>
                    <option value="mid">Media</option>
                    <option value="top">Full</option>
                    <option value="sport">Sport</option>
                  </select>
                </div>
              </div>

              {/* Botón de Cotizar */}
              <Button
                type="submit"
                className={`w-full mt-6 ${
                  isFormComplete
                    ? "bg-logo-blue1 hover:bg-logo-blue2"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={!isFormComplete}
              >
                COTIZAR
              </Button>
            </form>
          </div>
        </section>

        {/* Section de Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop={true}
              breakpoints={{
                // Pantallas pequeñas (móviles)
                640: {
                  slidesPerView: 2, // Muestra 2 logos en pantallas pequeñas
                  spaceBetween: 20, // Espacio reducido entre logos
                },
                // Pantallas medianas (tablets)
                768: {
                  slidesPerView: 3, // Muestra 3 logos en pantallas medianas
                },
                // Pantallas grandes (desktops)
                1024: {
                  slidesPerView: 5, // Muestra 5 logos en pantallas grandes
                },
              }}
            >
              {logos.map((company, index) => (
                <SwiperSlide key={index}>
                  <div className="flex justify-center">
                    <Image
                      src={`/images/${company}.png`}
                      alt={`${company} logo`}
                      width={120}
                      height={50}
                      className="h-16 w-auto object-contain sm:h-12" // Ajuste para pantallas pequeñas
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Cards section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cardData.map((card, index) => (
                <Card key={index} className="flex flex-col shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      {card.icon}
                      <CardTitle>{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>
                      {expandedCard === index ? card.fullText : card.summary}
                    </p>
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
              <ul className="space-y-2">
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
              Seguros de la Nación (www.ssn.gov.ar #xxx-xxxx o 0800-xxx-xxxx).
              Mazzulla y Padin utiliza la marca segurarse.com.ar bajo licencia
              de su titular, Sr. Alberto Gabriel. Todos los productos y nombres
              de productos mencionados de aquí en adelante son los nombres de
              marcas o las marcas registradas de sus respectivos dueños.
            </p>
          </div>
        </div>
      </footer>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suscríbete para recibir tu cotización</DialogTitle>
            <DialogDescription>
              Ingresa tu correo electrónico para recibir la cotización de tu
              seguro.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-logo-blue1">
              Enviar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 flex items-center justify-center"
        onClick={() =>
          window.open("https://wa.me/yourwhatsappnumber", "_blank")
        }
      >
        <FaWhatsapp className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
}
