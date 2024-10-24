import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Prisma, Task as TaskModel } from '@prisma/client';
import { TaskStatus } from './task-status.enum';
import { Throttle } from '@nestjs/throttler';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskModel> {
    return this.taskService.findOne(id);
  }

  @Get()
  getAllTasks(@Query('status') status?: TaskStatus): Promise<TaskModel[]> {
    return this.taskService.findAll(status);
  }

  @Throttle({ default: { limit: 6, ttl: 10000 } })
  @Post()
  createTask(@Body() taskData: Prisma.TaskCreateInput): Promise<TaskModel> {
    return this.taskService.create(taskData);
  }

  @Throttle({ default: { limit: 6, ttl: 10000 } })
  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    taskData: Prisma.TaskUpdateInput,
  ): Promise<TaskModel> {
    return this.taskService.update(id, taskData);
  }

  @Throttle({ default: { limit: 10, ttl: 10000 } })
  @Delete(':id')
  @HttpCode(204)
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<TaskModel> {
    return this.taskService.delete(id);
  }
}
