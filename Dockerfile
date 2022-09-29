FROM node:lts-alpine3.15 as frontendBuilder

WORKDIR /usr/src/app/

ADD ["./frontend/package.json", "./"]

RUN npm install -g pnpm

RUN pnpm install

ADD ["./frontend/", "./"]

RUN pnpm run build



FROM node:lts-alpine3.15 as backendBuilder

WORKDIR /usr/src/app/

COPY ["./backend/package.json", "./backend/.npmrc", "./backend/tsconfig.json", "./"]

RUN npm install -g @nestjs/cli

RUN npm install -g pnpm

RUN pnpm install

COPY --from=frontendBuilder /usr/src/app/dist/ ./dist

COPY ["./backend/", "./"]

COPY ["./backend/src/body-double.js", "./node_modules/.pnpm/fastify@4.6.0/node_modules/fastify/lib/contentTypeParser.js"]

RUN pnpm build



FROM node:lts-alpine3.15 as production

WORKDIR /usr/src/app

COPY --from=backendBuilder /usr/src/app/dist  ./dist
COPY --from=backendBuilder /usr/src/app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "dist/main.js"]



