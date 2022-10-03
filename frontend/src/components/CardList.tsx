import {
    createMemo,
    For,
    Suspense,
    ErrorBoundary,
    createResource,
} from 'solid-js';
import Card from './Card';
import type { Habit } from '../types/';

export interface CardListProps {
    filter: boolean;
}

const CardList = (props: CardListProps) => {
    const fetchHabits = async () => {
        const res = await fetch('/api/habits.json', { method: 'GET' });
        return (await res.json()) as unknown as Habit[];
    };
    const [data] = createResource(fetchHabits, {
        initialValue: [],
    });

    const filteredData = createMemo<Habit[]>(() => {
        return data()!.filter((habit) => habit.completed === props.filter);
    });

    return (
        <ErrorBoundary fallback={<p>Something went very wrong...</p>}>
            <Suspense fallback={<p>Loading...</p>}>
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <For each={filteredData()} fallback={<div>None?...</div>}>
                        {(item: Habit) => <Card habit={item} />}
                    </For>
                </div>
            </Suspense>
        </ErrorBoundary>
    );
};

export default CardList;
