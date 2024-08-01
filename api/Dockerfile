FROM node:lts-bullseye-slim as builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . ./
RUN yarn build

FROM node:lts-bullseye-slim

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY ormconfig.ts ./
COPY .env ./
RUN yarn
RUN yarn add sharp --ignore-engines

# assets klasörünü de kopyala
COPY --from=builder /app/dist ./dist
# Public klasörünü de kopyala
COPY --from=builder /app/dist/public ./dist/public

EXPOSE 3000

CMD yarn start:prod