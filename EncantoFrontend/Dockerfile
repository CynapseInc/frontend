# ESTÁGIO 1: Build
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ESTÁGIO 2: Produção
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# NÃO copie configuração aqui. Vamos jogar ela de fora para dentro.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]