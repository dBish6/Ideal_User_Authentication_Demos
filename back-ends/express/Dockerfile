# Sets up the build with typescript.
FROM node:20-bullseye-slim as ts-compiler
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Only copies necessary files and installs prodiction dependencies which removes typescript, etc.
FROM node:20-bullseye-slim as ts-remover
WORKDIR /usr/src/app
COPY --from=ts-compiler /usr/src/app/package*.json ./
COPY --from=ts-compiler /usr/src/app/.env ./
COPY --from=ts-compiler /usr/src/app/build ./
RUN npm install --only=production

# Copies production files and creates the final production-ready image and runs the server.
FROM gcr.io/distroless/nodejs20
LABEL authors="David Bishop"
WORKDIR /usr/src/app
COPY --from=ts-remover /usr/src/app ./
USER 1000
CMD ["server.js"]