import { initTRPC } from '@trpc/server';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
    return {};
}
export type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create();

let users = [{ _id: 0, name: 'Study for pnp', completed: false }];
let count = 0;

export const appRouter = t.router({
    getHabits: t.procedure.query(() => {
        console.log(users);
        return users;
    }),
    createHabit: t.procedure
        .input((val: unknown) => {
            if (typeof val === 'string') return val;
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .mutation((req) => {
            const input = req.input;

            users = [...users, { _id: ++count, name: input, completed: false }];

            console.log(users);
            return users.at(-1);
        }),
    patchHabit: t.procedure
        .input((val: unknown) => {
            if (typeof val === 'string') return val;
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .mutation((req) => {
            const input = Number(req.input);

            const user = users.find((user) => user._id === input);
            if (user === undefined) {
                return new Response(JSON.stringify({ error: true }), {
                    status: 500,
                    statusText: 'Habit Not Found',
                });
            }

            user.completed = !user.completed;
            return user;
        }),
    deleteHabit: t.procedure
        .input((val: unknown) => {
            if (typeof val === 'string') return val;
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .mutation((req) => {
            const input = Number(req.input);

            const deleteIndex = users.findIndex((habit) => habit._id === input);
            if (deleteIndex > -1) {
                const deletedUser = users.splice(deleteIndex, 1);
                return deletedUser;
            }
            return new Response(JSON.stringify({ error: true }), {
                status: 500,
                statusText: 'Habit Not Found',
            });
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
