import fastifyRequestLogger from '@mgcrea/fastify-request-logger';
import Fastify from 'fastify';
import * as path from 'path';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter, createContext } from './trpc/router';

// * Setup Pretty Logger
const fastify = Fastify({
    logger: {
        transport: {
            target: '@mgcrea/pino-pretty-compact',
        },
    },
    disableRequestLogging: true,
});

/**
 * Run the server and plugins!
 */
const start = async () => {
    try {
        // * Logger
        await fastify.register(fastifyRequestLogger);
        // * Static Files
        await fastify.register(import('@fastify/static'), {
            root: path.join(__dirname, '..', 'dist/client'),
        });
        await fastify.register(fastifyTRPCPlugin, {
            prefix: '/trpc',
            trpcOptions: { router: appRouter, createContext },
        });
        // * Middlware steroids
        await fastify.register(import('@fastify/middie'));
        // * Middleware itself
        await fastify.use(
            // ! [WARN] USING AN IGNORE AND IMPLICIT ANY @ts-ignore
            (await ((await import('../dist/server/entry.mjs')) as any)
                .handler) as any,
        );

        // * start listening
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
