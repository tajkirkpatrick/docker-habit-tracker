import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import fastifyRequestLogger from '@mgcrea/fastify-request-logger';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { AppModule } from './app.module';
import { appRouter, createContext } from './trpc/router';

const PORT = 3001;

const adapter = new FastifyAdapter({
    disableRequestLogging: true,
    logger: {
        transport: {
            target: '@mgcrea/pino-pretty-compact',
        },
    },
});

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        adapter,
    );

    await app.register(helmet);
    await app.register(import('@fastify/cors'));
    await app.register(fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: { router: appRouter, createContext },
    });
    await app.register(fastifyRequestLogger);
    app.use(
        await (
            await import(join(__dirname, '../dist/server/entry.mjs'))
        ).handler,
    );
    await app.listen(PORT, '0.0.0.0');
}
bootstrap();
