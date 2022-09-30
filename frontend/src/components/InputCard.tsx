import { createSignal } from 'solid-js';

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

        await fetch('/api/createHabit', {
            method: 'POST',
            body: JSON.stringify({ name: habitName() }),
        });
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
                        onInput={(e) => setHabitName(e.currentTarget.value)}
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
