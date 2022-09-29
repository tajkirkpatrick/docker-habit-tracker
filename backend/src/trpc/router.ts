import { initTRPC } from '@trpc/server';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
    return {};
}
export type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create();

let users = [{ _id: 0, name: 'Study for pnp', completed: false }];
let count = 1;

export const appRouter = t.router({
    getHabits: t.procedure.query(() => users),
    createHabit: t.procedure
        .input((val: unknown) => {
            if (typeof val === 'string') return val;
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .mutation((req) => {
            const input = req.input;

            users.push({ _id: count, name: input, completed: false });
            count++;

            return users[-1];
        }),
    patchHabit: t.procedure
        .input((val: unknown) => {
            if (typeof val === 'string') return val;
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .mutation((req) => {
            const input = Number(req.input);

            const user = users.find((user) => user._id === input);
            user.completed = !user.completed;

            return user;
        }),
    deleteHabit: t.procedure
        .input((val: unknown) => {
            if (typeof val === 'string') return val;
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .query((req) => {
            const input = Number(req.input);

            const deleteUserIndex = users.findIndex(
                (user) => user._id === input,
            );

            users = users.splice(deleteUserIndex, 1);

            return users;
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
