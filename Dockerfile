# Building stage
FROM node:18-alpine:latest AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install \
	&& npm audit --audit-level=high

COPY . .

# Production stage
FROM node:18-alpine:latest

RUN apk update && apk upgrade

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./

RUN npm install --omit=dev

COPY --from=builder /usr/src/app .

EXPOSE 5000

CMD [ "node", "server.js" ]