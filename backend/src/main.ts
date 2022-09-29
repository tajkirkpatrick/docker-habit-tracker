import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';
import { join } from 'path';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter, createContext } from './trpc/router';

const PORT = 3001;

const adapter = new FastifyAdapter({ logger: true });

adapter.getInstance().removeAllContentTypeParsers();

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        adapter,
    );
    // app.register(helmet);
    app.register(import('@fastify/cors'));
    app.register(fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: { router: appRouter, createContext },
    });
    app.use(
        await (
            await import(join(__dirname, '../dist/server/entry.mjs'))
        ).handler,
    );

    await app.listen(PORT, '0.0.0.0');
    console.log('==>listening on port: ' + PORT);
}
bootstrap();
