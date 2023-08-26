# Usar una imagen oficial de Node.js como imagen base
FROM node:14

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos del paquete y el bloqueo del paquete
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar el código de la aplicación al contenedor
COPY . .

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3003

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]
