FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
# issues? choose package.json only

COPY client/package*.json client/
RUN npm run install-client --omit=dev

COPY server/package.json server/
RUN npm run install-server --omit=dev

COPY client/ client/
RUN npm run build-docker --prefix client

COPY server/ server/

USER node

CMD [ "npm", "start", "--prefix", "server"]

EXPOSE 8000
