# Multi-stage Dockerfile for Mall Customer Segmentation Application

FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/dist/server.cjs ./dist/server.cjs

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.cjs"]
