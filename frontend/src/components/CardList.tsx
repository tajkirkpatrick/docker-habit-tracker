import { createMemo, For, Suspense, ErrorBoundary } from 'solid-js';

import Card from './Card';
import type { Habit } from '../scripts/types';

export interface CardListProps {
    filter: boolean;
    data: Habit[];
}

const CardList = (props: CardListProps) => {
    const filteredData = createMemo<Habit[]>(() =>
        props.data!.filter((habit) => habit.completed === props.filter),
    );

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
