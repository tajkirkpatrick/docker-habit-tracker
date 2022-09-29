import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';

type Habit = {
    _id: number;
    name: string;
    completed: boolean;
};

type habitDTO = {
    name: string;
    completed: boolean;
};

@Injectable()
export class HabitsService {
    private habits: Habit[] = [
        { _id: 0, name: 'Study for pnp', completed: false },
    ];
    private count: number = 1;

    findAll(): Array<Habit> {
        console.log('=> returning all habits');
        return this.habits;
    }

    create(createHabitDto: CreateHabitDto): habitDTO | HttpException {
        console.log('=> adding new habit');

        try {
            this.habits.push({
                _id: this.count,
                name: createHabitDto.name,
                completed: false,
            });
            this.count += 1;

            const { _id, ...returnVal } = this.habits.at(-1);

            return returnVal as habitDTO;
        } catch (error) {
            console.log(error);
            return new InternalServerErrorException();
        }
    }

    deleteOne(id: number): Array<Habit> {
        console.log(`=> locating habit with ${id}`);
        const habitIndex = this.habits.findIndex((habit) => habit._id === id);

        console.log(`=> deleting habit with id ${id}`);
        return this.habits.splice(habitIndex, 1);
    }

    patchOne(id: number): Habit {
        console.log(`=> locating habit with id ${id}`);
        const habitIndex = this.habits.findIndex((habit) => habit._id === id);

        console.log(`=> changing status of habit with id ${id}`);
        this.habits[habitIndex].completed = !this.habits[habitIndex].completed;

        return this.habits[habitIndex];
    }
}
