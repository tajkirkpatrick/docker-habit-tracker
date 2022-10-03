import { createSignal, Match, Switch, createUniqueId } from 'solid-js';
import type { Habit } from '../types/';
interface CardProps {
    habit: Habit;
}

const Card = (props: CardProps) => {
    async function handleDelete() {
        await fetch('/api/habits.json', {
            method: 'DELETE',
            body: JSON.stringify({
                id: props.habit._id.toString(),
            }),
        });
        location.reload();
    }

    async function handleClick() {
        await fetch('/api/habits.json', {
            method: 'PATCH',
            body: JSON.stringify({
                id: props.habit._id.toString(),
            }),
        });
        location.reload();
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
                                        onClick={handleClick}
                                        class="btn btn-success w-fit"
                                    >
                                        Mark Done
                                    </button>
                                </div>
                            </Match>

                            <Match when={completed()}>
                                <button
                                    onClick={handleClick}
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
                            onclick={handleDelete}
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
