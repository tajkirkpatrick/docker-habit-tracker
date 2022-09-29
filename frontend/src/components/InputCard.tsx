import { createSignal } from 'solid-js';
import type { AppRouter } from '../../../backend/src/trpc/router';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://192.168.1.178:5050/trpc',
        }),
    ],
});

function InputCard() {
    const [habitName, setHabitName] = createSignal<string>('');

    async function submit(e: Event): Promise<void> {
        e.preventDefault();
        if (
            habitName() === undefined ||
            habitName().replace(' ', '') == '' ||
            habitName() === null
        ) {
            alert('invalid habit name');
            return;
        }

        const mutation = await client.createHabit.mutate(habitName());
        if (mutation) {
            setHabitName('');
        }

        location.reload();
    }

    return (
        <div class="card max-w-xs bg-primary text-primary-content">
            <div class="card-body">
                <form onSubmit={submit}>
                    <input
                        type="text"
                        placeholder="Type here"
                        class="input input-bordered w-full max-w-xs text-white focus:text-white"
                        value={habitName()}
                        onInput={(e) =>
                            setHabitName<string>(e.currentTarget.value)
                        }
                    />
                    <div class="card-actions justify-end my-2">
                        <button class="btn">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InputCard;
