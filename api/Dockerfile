FROM node:lts-bullseye-slim as builder

WORKDIR /wallet-app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . ./
RUN yarn build

FROM node:lts-bullseye-slim

WORKDIR /wallet-app

COPY package*.json ./
COPY yarn.lock ./
COPY ormconfig.ts ./
COPY .env ./
RUN yarn
RUN yarn add sharp --ignore-engines

# wait-for-it scriptini kopyala
COPY wait-for-it.sh /wallet-app/wait-for-it.sh

# assets klasörünü de kopyala
COPY --from=builder /wallet-app/dist ./dist
# Public klasörünü de kopyala
COPY --from=builder /wallet-app/dist/public ./dist/public

EXPOSE 5000

CMD ["./wait-for-it.sh", "db:5432", "--", "yarn", "start:prod"]
