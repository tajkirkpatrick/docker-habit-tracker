FROM node:lts-alpine3.15 as frontendBuilder

WORKDIR /usr/src/app/build/frontend

ADD ["./frontend/package.json", "./frontend/pnpm-lock.yaml", "./"]

RUN npm install -g pnpm

RUN pnpm install

ADD ["./frontend/", "./"]

RUN pnpm run build



FROM node:lts-alpine3.15 as backendBuilder

WORKDIR /usr/src/app/build/backend

COPY ["./backend/package.json", "./backend/pnpm-lock.yaml", "./backend/.npmrc", "./backend/tsconfig.json", "./"]

RUN npm install -g pnpm

RUN pnpm install -g @nestjs/cli

RUN pnpm install

COPY --from=frontendBuilder /usr/src/app/build/frontend/dist/ ./dist

COPY ["./backend/", "./"]

COPY ["./backend/src/body-double.js", "./node_modules/.pnpm/fastify@4.6.0/node_modules/fastify/lib/contentTypeParser.js"]

RUN pnpm build



FROM node:lts-alpine3.15 as production

WORKDIR /usr/src/app

COPY --from=backendBuilder /usr/src/app/build/backend/dist  ./dist
COPY --from=backendBuilder /usr/src/app/build/backend/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "dist/main.js"]



