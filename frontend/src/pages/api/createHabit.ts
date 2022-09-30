import type { APIRoute } from 'astro';
import type { AppRouter } from '../../../../backend/src/trpc/router';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc',
        }),
    ],
});

export const post: APIRoute = async ({ request }) => {
    const habitDTO: { name: string } = await request.json();
    await client.createHabit.mutate(habitDTO.name);
    return new Response(JSON.stringify({ task: 'completed' }), { status: 200 });
};
