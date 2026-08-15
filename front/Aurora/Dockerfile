FROM node:22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY certs/cert.pem /etc/nginx/certs/cert.pem
COPY certs/key.pem /etc/nginx/certs/key.pem
EXPOSE 1420
CMD ["nginx", "-g", "daemon off;"]
