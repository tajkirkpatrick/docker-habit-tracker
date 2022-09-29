import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';

@Controller('api/habits')
export class HabitsController {
    constructor(
        @Inject(HabitsService) private readonly habitsService: HabitsService,
    ) {}

    @Get()
    findAll() {
        return this.habitsService.findAll();
    }

    @Post('create')
    create(@Body() createHabitDto: CreateHabitDto) {
        return this.habitsService.create(createHabitDto);
    }

    @Patch(':id')
    patch(@Param('id') id: string) {
        return this.habitsService.patchOne(Number(id));
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string) {
        return this.habitsService.deleteOne(Number(id));
    }
}
