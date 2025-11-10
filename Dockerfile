# Stage 1: Build Angular Application
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Stage 2: Serve the Angular App with Node.js
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --production --force

EXPOSE 4000
CMD ["npm", "run", "serve:ssr:assistant"]