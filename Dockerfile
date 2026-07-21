# ─── Stage 1: Building React app ──────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Coping package files first (caching optimization)
COPY package*.json ./

# Installing dependencies
RUN npm install

# Copying source code
COPY . .

# Building production version of React app
RUN npm run build

# ─── Stage 2: Serving with Nginx ─────────────────────────────
# Nginx is a lightweight web server perfect for React apps
FROM nginx:alpine

# Copy built React files to Nginx's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Coping custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposing port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]