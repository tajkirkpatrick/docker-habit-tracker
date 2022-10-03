import type { APIRoute } from 'astro';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../../backend/src/trpc/router';

let client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: `http://localhost:3001/trpc`,
        }),
    ],
});

export const get: APIRoute = async ({}) => {
    const res = await client.getHabits.query();
    return new Response(JSON.stringify(res), { status: 200 });
};

export const post: APIRoute = async ({ request }) => {
    const habitDTO: { name: string } = await request.json();
    await client.createHabit.mutate(habitDTO.name);
    return new Response(JSON.stringify({ task: 'completed' }), { status: 200 });
};

export const patch: APIRoute = async ({ request }) => {
    const habitDTO: { id: string } = await request.json();
    await client.patchHabit.mutate(habitDTO.id);
    return new Response(JSON.stringify({ task: 'completed' }), { status: 200 });
};

export const del: APIRoute = async ({ request }) => {
    const habitDTO: { id: string } = await request.json();
    await client.deleteHabit.mutate(habitDTO.id);
    return new Response(JSON.stringify({}), { status: 200 });
};
