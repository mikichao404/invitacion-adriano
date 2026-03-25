# Usamos Nginx para que la web sea rápida
FROM nginx:alpine

# Copiamos tus archivos a la carpeta del servidor
COPY . /usr/share/nginx/html

# Exponemos el puerto estándar
EXPOSE 80
