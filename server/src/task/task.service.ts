import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Prisma } from '@prisma/client';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async findAll(status?: TaskStatus): Promise<Task[]> {
    if (status)
      return this.prisma.task.findMany({
        where: {
          status,
        },
      });
    return this.prisma.task.findMany();
  }

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  async update(id: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) throw new NotFoundException('Task not found');
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) throw new NotFoundException('Task not found');
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
