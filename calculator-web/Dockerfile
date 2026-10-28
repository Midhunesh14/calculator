# Use official lightweight NGINX Alpine image
FROM nginx:alpine

# Set working directory to NGINX web server root
WORKDIR /usr/share/nginx/html

# Copy static calculator files into the NGINX html directory
COPY index.html ./
COPY style.css ./
COPY script.js ./

# Expose HTTP port 80 for web traffic
EXPOSE 80

# NGINX starts automatically in foreground by default
