# Usa Node.js 18 para cumplir con los requisitos de Next.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración y de dependencias de Node.js
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente de la aplicación
COPY . .

# Compila la aplicación Next.js para producción
RUN npm run build

# Expone el puerto de Next.js
EXPOSE 3000

# Ejecuta Next.js en modo producción
CMD ["npm", "start"]