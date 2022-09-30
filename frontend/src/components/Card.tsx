import { createSignal, Match, Switch, createUniqueId } from 'solid-js';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { Habit } from '../scripts/types';
import type { AppRouter } from '../../../backend/src/trpc/router';

interface CardProps {
    habit: Habit;
}

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc',
        }),
    ],
});

const Card = (props: CardProps) => {
    async function deleteMe() {
        const mutation = await client.deleteHabit.query(
            props.habit._id.toString(),
        );
        if (mutation) {
            location.reload();
        }
    }

    async function submit() {
        const mutation = await client.patchHabit.mutate(
            props.habit._id.toString(),
        );
        if (mutation) {
            location.reload();
        }
    }

    const [completed] = createSignal(props.habit.completed);
    const id = createUniqueId();

    return (
        <>
            <div class="card max-w-sm bg-secondary shadow-xl relative">
                <div class="card-body">
                    <div class="card-actions">
                        <div class="flex justify-between mb-4">
                            <h2 class="card-title text-left">
                                {props.habit.name}
                            </h2>
                            <label
                                for={`modal-${id}`}
                                class="btn modal-button absolute right-8 scale-75 hover:scale-100"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"
                                    />
                                </svg>
                            </label>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <Switch>
                            <Match when={!completed()}>
                                <div class="flex">
                                    <button
                                        onClick={submit}
                                        class="btn btn-success w-fit"
                                    >
                                        Mark Done
                                    </button>
                                </div>
                            </Match>

                            <Match when={completed()}>
                                <button
                                    onClick={submit}
                                    class="btn btn-outline btn-warning w-fit"
                                >
                                    Undo?
                                </button>
                            </Match>
                        </Switch>
                    </div>
                </div>
            </div>
            <input type="checkbox" id={`modal-${id}`} class="modal-toggle" />
            <div class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">
                        Are you sure you want to delete {props.habit.name} ?
                    </h3>
                    <div class="modal-action">
                        <label
                            for={`modal-${id}`}
                            class="btn btn-info"
                            onclick={deleteMe}
                        >
                            Yes
                        </label>
                        <label for={`modal-${id}`} class="btn">
                            No
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Card;
